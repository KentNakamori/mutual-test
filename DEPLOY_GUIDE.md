# 🚀 完全デプロイガイド

## 📋 事前準備

### 1. 必要なツール
- [Docker](https://docs.docker.com/get-docker/)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- Node.js 20以上

### 2. AWS認証設定
```bash
# AWS CLIプロファイルを設定
aws configure --profile admin
# アクセスキーID、シークレットアクセスキー、リージョン(ap-northeast-1)を入力
```

### 3. Auth0情報の準備
1. **Auth0ダッシュボード**（https://manage.auth0.com/）にログイン
2. **Applications** → **あなたのアプリ** → **Settings**
3. **Client Secret**をコピーして保存
4. 暗号化キーを生成：
   ```bash
   openssl rand -base64 32
   ```

### 4. プロジェクト設定の確認

**重要**: フロントエンドとバックエンドのプロジェクト名を統一してください。

- **フロントエンド**: `project_name = "mutual-app"`
- **バックエンド**: `project_name = "mutual-app"`

### 5. バックエンドAPI接続設定

デプロイ前に、バックエンドのAPIエンドポイント情報を取得してください：

```bash
# バックエンドプロジェクトで実行
cd /path/to/backend-project
make api-info

# 出力例:
# ALB DNS名: mutual-app-alb-XXXXXXXXX.ap-northeast-1.elb.amazonaws.com
# CloudFront DNS名: XXXXXXXXXXXXX.cloudfront.net
# 推奨API_BASE_URL: https://XXXXXXXXXXXXX.cloudfront.net
```

### 6. terraform.tfvarsの編集

# terraform.tfvarsを編集（api_base_urlを実際のバックエンドURLに変更）
nano terraform/terraform.tfvars

# 必須設定項目:
# 1. api_base_url = "実際のバックエンドURL"
#    例: api_base_url = "https://d1234567890.cloudfront.net"
# 2. domain_name = "" (独自ドメインがない場合は空文字のまま)

## 🛠️ デプロイ方法

### 方法1: フル自動デプロイ（推奨）

```bash
# 1. 設定確認
make deploy-check

# 2. 設定ファイル準備
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# terraform.tfvarsを編集（api_base_urlを実際のバックエンドURLに変更）

# 3. フル自動デプロイ実行
make deploy-full
```

**フル自動デプロイの実行内容：**
1. Terraformでインフラ構築
2. 機密情報設定（Auth0情報を対話的に入力）
3. Dockerイメージビルド・プッシュ
4. ECSサービス更新
5. アクセスURL表示

### 方法2: ステップバイステップ

```bash
# 1. 事前確認
make deploy-check

# 2. 設定ファイル準備
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
nano terraform/terraform.tfvars  # api_base_urlを編集

# 3. インフラ構築
make tf-init
make tf-apply

# 4. 機密情報設定
./scripts/update-secrets.sh
# Auth0のClient Secretと生成した暗号化キーを入力

# 5. アプリケーションデプロイ
make deploy

# 6. アクセスURL確認
make tf-outputs
```

## 📐 各コマンドの詳細

### `make deploy-check`
**実行内容：**
- 環境変数の確認（ECR URL、ECS名等）
- 必要ツールの存在確認
- AWS認証状態の確認
- 設定ファイルの存在確認

### `make tf-apply`
**作成されるAWSリソース：**
- **VPC関連**: 既存VPCを利用、サブネット自動検出
- **ECR**: Dockerイメージレジストリ
- **ECS Fargate**: コンテナ実行環境
  - クラスター: `mutual-test-cluster`
  - サービス: `mutual-test-service`
  - タスク定義: CPU 512, Memory 1024
- **ALB**: Application Load Balancer
  - HTTP→HTTPSリダイレクト（ドメインありの場合）
  - ターゲットグループでヘルスチェック
- **CloudFront**: CDN配信
  - 静的アセット最適化
  - WAF保護付き
- **Secrets Manager**: 機密情報管理
- **IAM Role**: 必要最小権限

### `./scripts/update-secrets.sh`
**設定される機密情報：**
- `AUTH0_CLIENT_SECRET`: Auth0のクライアントシークレット
- `AUTH0_SECRET`: セッション暗号化キー
- `DATABASE_URL`: データベース接続文字列（オプション）

### `make deploy`
**実行内容：**
1. **Docker buildx初期化**: マルチプラットフォーム対応
2. **Dockerイメージビルド**: `linux/amd64`プラットフォーム
3. **ECRプッシュ**: AWSレジストリに登録
4. **ECS強制デプロイ**: 新しいタスクで既存サービス更新

## 🔗 バックエンド連携の設定

### 1. API_BASE_URLの設定

**設定箇所：**
- `terraform/terraform.tfvars`: `api_base_url`
- ECSタスク定義の環境変数として注入

**値の例：**
```bash
# バックエンドがCloudFrontを使用している場合
api_base_url = "https://dxxxxx.cloudfront.net"

# バックエンドがALBを直接使用している場合  
api_base_url = "https://your-backend-alb-domain.ap-northeast-1.elb.amazonaws.com"
```

### 2. フロントエンドからバックエンドへのAPI呼び出し

**アーキテクチャ：**
```text
フロントエンド (ECS) → バックエンド API
├── 直接呼び出し: src/lib/api/client.ts
├── プロキシ経由: src/app/api/proxy/[...path]/route.ts
└── 個別API: src/app/api/admin/*, src/app/api/investor/*
```

**認証フロー：**
1. Auth0でJWTトークン取得
2. APIリクエストにBearer トークン付与
3. バックエンドでJWT検証

### 3. 環境変数の注入確認

ECSタスクで設定される環境変数：
```bash
NODE_ENV=production
API_BASE_URL=${terraform.api_base_url}
AUTH0_BASE_URL=https://${cloudfront_domain}
AUTH0_ISSUER_BASE_URL=${secrets_manager.AUTH0_ISSUER_BASE_URL}
AUTH0_CLIENT_ID=${secrets_manager.AUTH0_CLIENT_ID}
AUTH0_CLIENT_SECRET=${secrets_manager.AUTH0_CLIENT_SECRET}
AUTH0_SECRET=${secrets_manager.AUTH0_SECRET}
```

## ✅ 動作確認手順

### 1. 基本アクセス確認
```bash
# アプリケーションURLを取得
cd terraform
terraform output application_url

# アクセステスト
curl -I https://your-app-domain.cloudfront.net
```

### 2. API接続確認
```bash
# ECSタスクのログを確認
aws logs tail /ecs/mutual-test --follow

# ヘルスチェック確認
aws elbv2 describe-target-health \
  --target-group-arn $(terraform output -raw load_balancer_target_group_arn)
```

### 3. バックエンド連携テスト
ブラウザで以下をテスト：
1. **ログイン**: Auth0認証フロー
2. **API呼び出し**: 企業一覧、Q&A検索等
3. **ファイルアップロード**: 画像・文書アップロード

## 🚨 トラブルシューティング

### よくある問題と解決方法

#### 1. ECR URLが取得できない
```bash
# Terraformが正常に実行されているか確認
make tf-outputs

# 手動でECR URLを設定
make ECR_REPOSITORY_URL=123456789012.dkr.ecr.ap-northeast-1.amazonaws.com/mutual-test-repo deploy
```

#### 2. ECSタスクが起動しない
```bash
# プライベートサブネットの問題の場合
# main.tfで一時的にパブリックサブネットを使用
subnets = local.public_subnet_ids
assign_public_ip = true
```

#### 3. バックエンドAPI接続エラー
- `terraform.tfvars`の`api_base_url`が正しいか確認
- バックエンドのCORS設定を確認
- ネットワーク疎通性を確認

#### 4. Auth0認証エラー
- Secrets Managerの値が正しく設定されているか確認
- Auth0のCallback URLsに追加：
  - `https://your-domain.cloudfront.net/api/auth/callback`

## 🔒 セキュリティのベストプラクティス

### 本番運用時の推奨設定

1. **独自ドメインの使用**:
   ```bash
   # terraform.tfvarsで設定
   domain_name = "your-domain.com"
   ```

2. **WAFルールの強化**:
   - Rate limiting
   - Geographic restrictions
   - IP whitelist

3. **監視の設定**:
   - CloudWatch Dashboards
   - Application Insights
   - Error tracking

4. **定期的なメンテナンス**:
   - シークレットローテーション
   - セキュリティパッチ適用
   - ログ分析

## 📊 コスト最適化

### 無料枠での運用

**予想月額費用（無料枠使用時）:**
- ECS Fargate: ~$20-30
- CloudFront: ~$1-5  
- ALB: ~$16
- その他: ~$5

**コスト削減のヒント:**
- 開発時はdesired_count=0でECSを停止
- 不要なログは早期削除
- CloudFrontキャッシュを最適化 