/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  
  // 本番環境では静的アセットをS3/CloudFrontから配信
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.CDN_URL ? process.env.CDN_URL : '',
  
  // 圧縮を有効化
  compress: true,
  
  // 画像最適化の設定
  images: {
    // CloudFrontのドメインを設定（運用時に追加）
    domains: [],
    unoptimized: process.env.NODE_ENV === 'production', // 本番では外部で最適化
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // 静的アセットのキャッシュ設定
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Docker環境でのホットリロードを有効化（開発時のみ）
  webpack: (config, { isServer, dev }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    // クライアントサイドでのnodeモジュール問題を回避
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config
  },
  
  // 実験的な機能の有効化 (Next.js 15対応)
  experimental: {
    // crittersエラーを回避するため、optimizeCssは使用しない
  },
  
  // サーバー外部パッケージ（Next.js 15で変更）
  serverExternalPackages: ['@prisma/client'],
  
  // Dockerビルドでのcritters問題を回避するため、CSS最適化を無効化
  compiler: {
    // 開発時のみRemoveConsoleを有効にする
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  
  // ビルド時のメモリ使用量を制限
  // 注意: envセクションは使用しない - 実行時の環境変数を使用するため
}

module.exports = nextConfig