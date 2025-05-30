# ビルドステージ
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番環境ステージ
FROM node:20-alpine AS runner

WORKDIR /app

# 必要なファイルのみをコピー
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 環境変数の設定
ENV NODE_ENV=production
ENV PORT=3000

# アプリケーションの起動
EXPOSE 3000
CMD ["node", "server.js"] 