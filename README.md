# 🚀 Mutual Test - Frontend Application

Next.js 15とAuth0を使用したエンタープライズ向けWebアプリケーションのフロントエンドです。

## 📋 プロジェクト概要

- **フレームワーク**: Next.js 15 (App Router)
- **認証**: Auth0
- **スタイリング**: Tailwind CSS + shadcn/ui
- **言語**: TypeScript
- **デプロイ**: AWS (ECS Fargate + CloudFront + S3)
- **CI/CD**: GitHub Actions

## 🏗️ プロジェクト構成

```
mutual-test/
├── src/                    # ソースコード
│   ├── app/               # Next.js App Router
│   ├── components/        # Reactコンポーネント
│   ├── lib/               # ユーティリティ関数
│   └── types/             # TypeScript型定義
├── terraform/             # AWSインフラ定義
├── .github/workflows/     # GitHub Actions
├── docs/                  # ドキュメント
│   ├── api/              # API仕様書
│   └── setup-scripts/    # セットアップスクリプト
├── Dockerfile            # 本番用Dockerイメージ
├── docker-compose.yml    # 開発環境用
└── Makefile             # プロジェクト管理コマンド
```

## 🚀 クイックスタート

### 1. 環境セットアップ

```bash
# プロジェクトのクローン
git clone <repository-url>
cd mutual-test

# 依存関係のインストールと初期設定
make setup
```

### 2. 環境変数の設定

`.env.local`ファイルが自動生成されるので、Auth0の設定値を入力してください：

```bash
# Auth0の設定値を編集
vim .env.local
```

### 3. 開発サーバーの起動

```bash
# 開発サーバーを起動
make dev

# または Docker Composeを使用
docker-compose up frontend
```

## 🛠️ 利用可能なコマンド

すべてのコマンドは`make`を使用して実行できます：

```bash
make help  # 利用可能なコマンド一覧を表示
```

### 開発関連

- `make dev` - 開発サーバーを起動
- `make build` - 本番用ビルド
- `make lint` - コードの静的解析
- `make test` - テスト実行
- `make clean` - ビルドキャッシュをクリア

### Docker関連

- `make docker-build` - Dockerイメージをビルド
- `make docker-run` - Dockerコンテナを起動

### AWS デプロイ関連

- `make tf-init` - Terraformを初期化
- `make tf-plan` - インフラ変更の確認
- `make tf-apply` - インフラをデプロイ
- `make tf-destroy` - インフラを削除
- `make deploy` - アプリケーションをデプロイ
- `make aws-status` - AWSリソースの状態確認

## 📖 詳細ドキュメント

- [AWS デプロイガイド](docs/DEPLOYMENT_GUIDE.md)
- [API仕様書](docs/api/BACKEND_API_REQUIREMENTS.md)

## 🔧 開発環境

### 推奨ツール

- **Node.js**: 20以上
- **npm**: 10以上
- **Docker**: 最新版
- **AWS CLI**: v2
- **Terraform**: v1.0以上

### VS Code 拡張機能（推奨）

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## 🚀 本番デプロイ

### 前提条件

1. AWS アカウントの準備
2. AWS CLI の設定（`admin`プロファイル）
3. GitHub リポジトリの設定

### デプロイ手順

```bash
# 1. インフラの構築
make tf-apply

# 2. 環境変数の設定
make set-secrets

# 3. アプリケーションのデプロイ
make deploy
```

詳細な手順は[デプロイガイド](docs/DEPLOYMENT_GUIDE.md)を参照してください。

## 📊 パフォーマンス

### アーキテクチャの特徴

- **ハイブリッド配信**: 静的アセットはS3+CloudFront、動的コンテンツはECS
- **効率的キャッシュ**: 静的ファイルは1年間、APIレスポンスはリアルタイム
- **グローバルCDN**: 世界中のエッジロケーションから高速配信

### 月額コスト見積もり

- **合計**: 約$150/月（中規模トラフィック）
- **内訳**: ECS $30, ALB $20, CloudFront $85, その他 $15

## 🤝 開発ワークフロー

### ブランチ戦略

- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発ブランチ

### コミット規約

```
feat: 新機能の追加
fix: バグ修正
docs: ドキュメントの更新
refactor: コードのリファクタリング
```

## 📞 サポート

質問や問題がある場合は、以下の方法でお気軽にお問い合わせください：

- GitHub Issues
- 開発チームへの直接連絡

---

© 2024 Mutual Test Project. All rights reserved.