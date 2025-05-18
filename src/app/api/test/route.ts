import { NextResponse } from 'next/server';

// テスト用APIエンドポイント
export async function GET(req: Request) {
  // フロントエンドの環境変数を取得
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
  
  // 現在の設定情報を返す
  const config = {
    apiBaseUrl,
    useMock,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  // バックエンドへの疎通テスト
  let backendStatus = "未テスト";
  
  if (!useMock) {
    try {
      // 任意のバックエンドAPIエンドポイントにリクエスト
      const testUrl = `${apiBaseUrl}/health-check`;
      console.log(`バックエンド疎通確認: ${testUrl}`);
      
      const res = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // タイムアウト設定（AbortController使用）
        signal: AbortSignal.timeout(5000),
      });
      
      if (res.ok) {
        const data = await res.text();
        backendStatus = `OK: ${data}`;
      } else {
        backendStatus = `エラー: ${res.status} ${res.statusText}`;
      }
    } catch (error) {
      backendStatus = `接続エラー: ${error instanceof Error ? error.message : '不明なエラー'}`;
    }
  } else {
    backendStatus = "モックモード有効: バックエンドテストをスキップ";
  }
  
  return NextResponse.json({
    message: "テストAPIエンドポイント",
    config,
    backendStatus,
    // リクエスト情報
    request: {
      url: req.url,
      headers: Object.fromEntries([...new Headers(req.headers).entries()]),
    }
  });
} 