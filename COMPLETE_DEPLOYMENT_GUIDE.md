# 完全デプロイメントガイド - Mutual Test Frontend

このドキュメントでは、フロントエンドアプリケーションをAWSにデプロイするための完全な手順を説明します。

## 目次
1. [前提条件](#前提条件)
2. [環境変数と設定ファイル](#環境変数と設定ファイル)
3. [初回デプロイ手順](#初回デプロイ手順)
4. [更新デプロイ手順](#更新デプロイ手順)
5. [セキュリティ設定](#セキュリティ設定)
6. [トラブルシューティング](#トラブルシューティング)
7. [本番環境チェックリスト](#本番環境チェックリスト)

## 前提条件

### 1. 必要なツールのインストール

```bash
# AWS CLI v2のインストール確認
aws --version
# インストールされていない場合：https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

# Terraformのインストール確認（v1.0以上推奨）
terraform --version
# インストールされていない場合：https://www.terraform.io/downloads

# Dockerのインストール確認
docker --version
# インストールされていない場合：https://docs.docker.com/get-docker/

# Node.jsのインストール確認（v18以上）
node --version
# インストールされていない場合：https://nodejs.org/

# jqのインストール確認（JSONパーサー）
jq --version
# インストールされていない場合：
# Mac: brew install jq
# Linux: sudo apt-get install jq
```

### 2. AWSアカウントの設定

```bash
# AWS CLIプロファイルの設定
aws configure --profile admin
# 以下の情報を入力：
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: ap-northeast-1
# - Default output format: json

# 設定の確認
aws sts get-caller-identity --profile admin
```

### 3. Auth0の準備

Auth0ダッシュボードから以下の情報を取得：
- **Domain**: `dev-ldw81lf4gyh8azw6.jp.auth0.com`
- **Client ID**: `Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP`
- **Client Secret**: （Auth0ダッシュボードから取得）
- **M2M Client ID/Secret**: Machine-to-Machine認証用（Auth0ダッシュボードから取得）

## 環境変数と設定ファイル

### 1. ローカル開発環境（.env.local）

```bash
# .env.localファイルの作成
cat > .env.local << 'EOF'
# Next.js Environment Variables
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Auth0 Configuration
AUTH0_SECRET=$(openssl rand -hex 32)
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://dev-ldw81lf4gyh8azw6.jp.auth0.com/
AUTH0_CLIENT_ID=Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP
AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET_HERE
AUTH0_AUDIENCE=https://api.local.dev

# Auth0 Machine to Machine Configuration
AUTH0_M2M_CLIENT_ID=YOUR_M2M_CLIENT_ID_HERE
AUTH0_M2M_CLIENT_SECRET=YOUR_M2M_CLIENT_SECRET_HERE
AUTH0_CONNECTION_NAME=Corporate-DB

# API Configuration
API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
EOF

# ファイルを編集して実際の値を設定
nano .env.local
```

### 2. Terraform設定（terraform/terraform.tfvars）

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars

# terraform.tfvarsを編集
cat > terraform.tfvars << 'EOF'
# ドメイン設定
domain_name = ""  # 独自ドメインがある場合は設定（例："app.example.com"）

# プロジェクト設定
region = "ap-northeast-1"
project_name = "mutual-app"
environment = "production"

# VPC設定（バックエンドと同じVPCを使用）
vpc_id = "vpc-0a57f6a9ed2bbbb3f"

# Auth0設定（公開情報のみ）
auth0_issuer_base_url = "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/"
auth0_domain = "dev-ldw81lf4gyh8azw6.jp.auth0.com"
auth0_client_id = "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP"
auth0_audience = "https://api.local.dev"

# API設定（バックエンドのCloudFront URL）
api_base_url = "https://d20rzkwelg7jzp.cloudfront.net"
EOF
```

### 3. 機密情報の管理

```bash
# .gitignoreの確認と更新
cat >> .gitignore << 'EOF'
# Environment files
.env.local
.env.production

# Terraform
terraform.tfvars
*.tfstate
*.tfstate.backup
.terraform/
.terraform.lock.hcl

# AWS
.aws/
EOF
```

## 初回デプロイ手順

### ステップ0: Terraformバックエンドのセットアップ（重要）

```bash
# Terraform状態ファイルをS3で管理するための初期設定
chmod +x scripts/setup-terraform-backend.sh
./scripts/setup-terraform-backend.sh
```

### ステップ1: インフラストラクチャの構築

```bash
# 1. Terraformディレクトリに移動
cd terraform

# 2. Terraformの初期化（バックエンドを使用）
# 既存の状態ファイルがある場合は -migrate-state オプションを追加
AWS_PROFILE=admin terraform init

# 3. 実行計画の確認
AWS_PROFILE=admin terraform plan

# 4. インフラストラクチャの構築（約10-15分かかります）
AWS_PROFILE=admin terraform apply -auto-approve

# 5. 出力値の確認と保存
AWS_PROFILE=admin terraform output > ../deployment-outputs.txt
```

### ステップ2: 機密情報の設定

```bash
# 1. スクリプトの実行権限を付与
chmod +x scripts/update-secrets.sh

# 2. 機密情報設定スクリプトの実行
./scripts/update-secrets.sh

# 以下の情報を入力：
# - AUTH0_CLIENT_SECRET: Auth0ダッシュボードから取得
# - AUTH0_SECRET: openssl rand -hex 32 で生成
# - AUTH0_M2M_CLIENT_SECRET: Auth0ダッシュボードから取得
# - DATABASE_URL: （必要な場合のみ）
```

### ステップ3: ECRへのログイン

```bash
# ECRリポジトリURLを取得
ECR_URL=$(cd terraform && AWS_PROFILE=admin terraform output -raw ecr_repository_url)

# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 --profile admin | \
docker login --username AWS --password-stdin ${ECR_URL%/*}
```

### ステップ4: Dockerイメージのビルドとデプロイ

```bash
# プロジェクトルートに戻る
cd ..

# フル自動デプロイ（推奨）
make deploy-full

# または手動でステップごとに実行
make docker-init
make docker-build
make deploy
```

### ステップ5: デプロイの確認

```bash
# 1. アプリケーションURLの取得
APP_URL=$(cd terraform && AWS_PROFILE=admin terraform output -raw application_url)
echo "アプリケーションURL: $APP_URL"

# 2. ヘルスチェック
curl -I $APP_URL

# 3. ログの確認
AWS_PROFILE=admin aws logs tail /ecs/mutual-app --follow
```

## 更新デプロイ手順

### コードの更新をデプロイ

```bash
# 1. コードの変更をコミット
git add .
git commit -m "Update: 機能の説明"

# 2. Dockerイメージの再ビルドとデプロイ
make deploy

# 3. デプロイ状況の確認
AWS_PROFILE=admin aws ecs describe-services \
  --cluster mutual-app-cluster \
  --services mutual-app-service \
  --query 'services[0].deployments'
```

### 環境変数の更新

```bash
# Secrets Managerの値を更新
./scripts/update-secrets.sh

# ECSサービスを再起動
AWS_PROFILE=admin aws ecs update-service \
  --cluster mutual-app-cluster \
  --service mutual-app-service \
  --force-new-deployment
```

## セキュリティ設定

### 1. 現在のセキュリティ機能

✅ **実装済み**:
- AWS WAF（Web Application Firewall）によるDDoS保護
- Secrets Managerによる機密情報の暗号化管理
- CloudFront経由のHTTPS強制
- セキュリティグループによるネットワーク分離
- ECRイメージの脆弱性スキャン
- IAMロールによる最小権限の原則

### 2. 本番環境での追加推奨事項

```bash
# 1. AWS GuardDutyの有効化
AWS_PROFILE=admin aws guardduty create-detector --enable

# 2. AWS Security Hubの有効化
AWS_PROFILE=admin aws securityhub enable-security-hub

# 3. CloudTrailの有効化
AWS_PROFILE=admin aws cloudtrail create-trail \
  --name mutual-app-trail \
  --s3-bucket-name mutual-app-cloudtrail-logs
```

### 3. 定期的なセキュリティタスク

```bash
# 月次タスク
# 1. Secrets Managerの機密情報ローテーション
./scripts/update-secrets.sh

# 2. ECRイメージの脆弱性確認
AWS_PROFILE=admin aws ecr describe-image-scan-findings \
  --repository-name mutual-app-frontend-repo \
  --image-id imageTag=latest

# 3. WAFログの確認
AWS_PROFILE=admin aws logs tail /aws/wafv2/mutual-app
```

## トラブルシューティング

### 1. ECSタスクが起動しない

```bash
# タスクの状態確認
AWS_PROFILE=admin aws ecs describe-tasks \
  --cluster mutual-app-cluster \
  --tasks $(aws ecs list-tasks --cluster mutual-app-cluster --query 'taskArns[0]' --output text)

# 停止理由の確認
AWS_PROFILE=admin aws ecs describe-tasks \
  --cluster mutual-app-cluster \
  --tasks $(aws ecs list-tasks --cluster mutual-app-cluster --desired-status STOPPED --query 'taskArns[0]' --output text) \
  --query 'tasks[0].stoppedReason'
```

### 2. 503エラーが発生する

```bash
# ALBターゲットグループのヘルスチェック
AWS_PROFILE=admin aws elbv2 describe-target-health \
  --target-group-arn $(cd terraform && terraform output -raw target_group_arn)

# セキュリティグループの確認
AWS_PROFILE=admin aws ec2 describe-security-groups \
  --group-ids $(cd terraform && terraform output -raw ecs_security_group_id)
```

### 3. Auth0認証エラー

```bash
# Secrets Managerの値を確認
AWS_PROFILE=admin aws secretsmanager get-secret-value \
  --secret-id mutual-app/frontend/app-secrets \
  --query 'SecretString' | jq -r '.' | jq .

# Auth0の設定確認項目：
# - Allowed Callback URLs に CloudFront URLが含まれているか
# - Allowed Logout URLs に CloudFront URLが含まれているか
# - Allowed Web Origins に CloudFront URLが含まれているか
```

## 本番環境チェックリスト

### デプロイ前チェック
- [ ] すべての環境変数が本番用に設定されている
- [ ] Auth0の本番環境設定が完了している
- [ ] データベースのバックアップが取得されている
- [ ] ロールバック計画が準備されている

### セキュリティチェック
- [ ] Secrets Managerの機密情報が設定されている
- [ ] WAFルールが有効になっている
- [ ] セキュリティグループが適切に設定されている
- [ ] 最新のセキュリティパッチが適用されている

### 監視設定チェック
- [ ] CloudWatchアラームが設定されている
- [ ] ログの保存期間が適切に設定されている
- [ ] メトリクスダッシュボードが作成されている

### パフォーマンスチェック
- [ ] CloudFrontのキャッシュ設定が最適化されている
- [ ] ECSタスクのCPU/メモリが適切に設定されている
- [ ] Auto Scalingが設定されている（必要に応じて）

### ドキュメントチェック
- [ ] 運用手順書が更新されている
- [ ] 障害対応手順が文書化されている
- [ ] ロールバック手順が文書化されている

## 次のステップ

1. **監視の強化**
   - CloudWatchダッシュボードの作成
   - アラートの設定
   - APMツールの導入検討

2. **CI/CDパイプラインの構築**
   - GitHub Actionsの設定
   - 自動テストの追加
   - ステージング環境の構築

3. **災害復旧計画**
   - バックアップ戦略の策定
   - マルチリージョン対応の検討
   - RTO/RPOの定義

## サポート情報

問題が発生した場合は、以下の情報と共に報告してください：

```bash
# システム情報の収集
echo "=== System Info ===" > debug-info.txt
aws --version >> debug-info.txt
terraform --version >> debug-info.txt
docker --version >> debug-info.txt
echo "=== Terraform Outputs ===" >> debug-info.txt
cd terraform && terraform output >> ../debug-info.txt
echo "=== Recent Logs ===" >> ../debug-info.txt
AWS_PROFILE=admin aws logs tail /ecs/mutual-app --since 1h >> ../debug-info.txt
``` 