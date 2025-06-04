import { API_BASE_URL } from "../../config/auth";

/**
 * 共通の HTTP クライアント関数
 * data が FormData の場合は JSON 化せずそのまま送信
 */
export async function apiFetch<T>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  token?: string,
  useProxy: boolean = false,
  noCache: boolean = false
): Promise<T> {
  const normalizedEndpoint = endpoint.replace(/\/+$/, '');
  const baseUrl = useProxy ? '/api/proxy' : API_BASE_URL;
  const url = baseUrl + normalizedEndpoint;

  const headers: HeadersInit = {
    ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    method,
    headers,
    ...(data ? { body: data instanceof FormData ? data : JSON.stringify(data) } : {}),
    ...(noCache ? { cache: 'no-store' } : {}),
  };

  console.log(`API ${method} Request to ${url}:`, {
    headers,
    body: data instanceof FormData ? "FormData" : data
  });

  try {
    const response = await fetch(url, config);
    let result;

    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
      if (!response.ok) {
        console.error("API Error Response (no JSON):", {
          url,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      console.log(`API ${method} Response from ${url} (status ${response.status}): No JSON content`);
      // @ts-ignore
      return { message: `Operation successful with status ${response.status}` } as T;
    }

    try {
      result = await response.json();
    } catch (e) {
      console.error("Failed to parse response JSON:", e, { url, status: response.status });
      throw new Error("Response is not JSON parsable");
    }
    
    if (!response.ok) {
      console.error("API Error Response (with JSON):", {
        url,
        status: response.status,
        statusText: response.statusText,
        data: result
      });
      
      // より詳細なエラーメッセージを生成
      let errorMessage = result?.message || result?.detail || `API Error: ${response.status} ${response.statusText}`;
      if (result?.detail && typeof result.detail !== 'string') {
        errorMessage = `API Error: ${response.status} - ${JSON.stringify(result.detail)}`;
      }
      
      throw new Error(errorMessage);
    }
    
    console.log(`API ${method} Response from ${url}:`, result);
    return result;
  } catch (error) {
    console.error(`API Fetch Error (${method} ${url}):`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
}

/**
 * ストリーミングレスポンス用のfetch関数
 * Server-Sent Events (SSE) 形式のレスポンスを処理
 */
export async function streamingFetch(
  endpoint: string,
  data: any,
  onChunk: (chunk: string) => void,
  onStart?: () => void,
  onEnd?: (fullResponse: string) => void,
  onError?: (error: string) => void,
  useProxy: boolean = true
): Promise<void> {
  const baseUrl = useProxy ? '/api/proxy' : API_BASE_URL;
  const url = baseUrl + endpoint;
  
  try {
    console.log('🚀 ストリーミング開始:', { endpoint, url, data });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(data),
    });
    
    console.log('📡 ストリーミングレスポンス受信:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "API Error" }));
      console.error('❌ ストリーミングエラー:', {
        status: response.status,
        error: error.message || error.detail
      });
      throw new Error(error.message || error.detail || `API Error: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';
    let chunkCount = 0;
    let currentEvent = '';
    let currentData = '';
    let firstChunkTime: number | null = null;
    let lastChunkTime: number | null = null;
    let isStreamStarted = false;

    console.log('🔄 ストリーミング読み取り開始');

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const totalTime = lastChunkTime && firstChunkTime ? lastChunkTime - firstChunkTime : 0;
        console.log('✅ ストリーミング完了:', {
          totalChunks: chunkCount,
          totalTimeMs: totalTime,
          finalResponseLength: fullResponse.length,
          wasStreamStarted: isStreamStarted
        });
        break;
      }

      chunkCount++;
      const currentTime = Date.now();
      if (!firstChunkTime) firstChunkTime = currentTime;
      lastChunkTime = currentTime;
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      console.log('📨 生チャンク受信:', {
        chunkNumber: chunkCount,
        chunkLength: chunk.length,
        bufferLength: buffer.length,
        rawChunk: chunk.substring(0, 100) + (chunk.length > 100 ? '...' : '')
      });
      
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';
      
      for (const event of events) {
        if (event.trim() === '') continue;
        
        const lines = event.split('\n');
        currentEvent = '';
        currentData = '';
        
        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.substring(6).trim();
          } else if (line.startsWith('data:')) {
            currentData = line.substring(5).trim();
          }
        }
        
        console.log('🎯 イベント処理:', {
          event: currentEvent,
          dataLength: currentData.length,
          dataPreview: currentData.substring(0, 50) + (currentData.length > 50 ? '...' : '')
        });
        
        if (currentData) {
          try {
            const jsonData = JSON.parse(currentData);
            
            console.log('📊 JSONデータ解析:', {
              type: jsonData.type,
              hasContent: !!jsonData.content,
              contentLength: jsonData.content ? jsonData.content.length : 0
            });
            
            switch (jsonData.type) {
              case 'start':
                console.log('🟢 ストリーミング開始イベント受信');
                isStreamStarted = true;
                onStart?.();
                break;
                
              case 'content':
                if (jsonData.content) {
                  console.log('📝 コンテンツチャンク:', {
                    contentLength: jsonData.content.length,
                    content: jsonData.content.substring(0, 20) + (jsonData.content.length > 20 ? '...' : ''),
                    totalResponse: fullResponse.length
                  });
                  fullResponse += jsonData.content;
                  onChunk(jsonData.content);
                }
                break;
                
              case 'end':
                console.log('🔚 ストリーミング終了イベント受信:', {
                  finalContentLength: jsonData.content ? jsonData.content.length : 0,
                  totalResponseLength: fullResponse.length
                });
                onEnd?.(jsonData.content || fullResponse);
                break;
                
              case 'error':
                console.error('💥 エラーイベント受信:', jsonData.message);
                onError?.(jsonData.message);
                break;
            }
          } catch (parseError) {
            console.error('🔥 JSONパースエラー:', {
              error: parseError,
              rawData: currentData.substring(0, 100) + (currentData.length > 100 ? '...' : '')
            });
          }
        }
      }
    }
    
    // ストリーミングが開始されなかった場合の警告
    if (!isStreamStarted) {
      console.warn('⚠️ ストリーミングが開始されませんでした - startイベントが受信されていません');
    }
    
  } catch (error) {
    console.error('💀 ストリーミングエラー:', {
      error: error instanceof Error ? error.message : String(error),
      endpoint,
      url,
      data
    });
    onError?.(error instanceof Error ? error.message : String(error));
    throw error;
  }
} 