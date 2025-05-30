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
    console.log('🚀 ストリーミング開始:', { endpoint, url });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(data),
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

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const totalTime = lastChunkTime && firstChunkTime ? lastChunkTime - firstChunkTime : 0;
        console.log('✅ ストリーミング完了:', {
          totalChunks: chunkCount,
          totalTimeMs: totalTime
        });
        break;
      }

      chunkCount++;
      const currentTime = Date.now();
      if (!firstChunkTime) firstChunkTime = currentTime;
      lastChunkTime = currentTime;
      
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
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
        
        if (currentData) {
          try {
            const jsonData = JSON.parse(currentData);
            
            switch (jsonData.type) {
              case 'start':
                onStart?.();
                break;
                
              case 'content':
                if (jsonData.content) {
                  fullResponse += jsonData.content;
                  onChunk(jsonData.content);
                }
                break;
                
              case 'end':
                onEnd?.(jsonData.content || fullResponse);
                break;
                
              case 'error':
                console.error('💥 エラー:', jsonData.message);
                onError?.(jsonData.message);
                break;
            }
          } catch (parseError) {
            console.error('🔥 JSONパースエラー:', parseError);
          }
        }
      }
    }
  } catch (error) {
    console.error('💀 ストリーミングエラー:', error);
    onError?.(error instanceof Error ? error.message : String(error));
    throw error;
  }
} 