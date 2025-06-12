# ベースイメージ
FROM node:20-alpine AS base
WORKDIR /app

# 依存関係ステージ
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 依存関係のインストール（本番 + 開発）
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

# ビルドステージ
FROM base AS builder
WORKDIR /app

# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 環境変数設定
ENV NEXT_TELEMETRY_DISABLED=1

# 本番用ビルド
RUN npm run build

# 本番環境ステージ
FROM base AS runner
WORKDIR /app

# curlをインストール（ヘルスチェック用）
RUN apk add --no-cache curl

# セキュリティのため非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# public フォルダをコピー
COPY --from=builder /app/public ./public

# 自動的に出力トレースを利用してイメージサイズを削減
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 環境変数設定
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 非rootユーザーに切り替え
USER nextjs

# ポート公開
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# アプリケーション起動
CMD ["node", "server.js"]