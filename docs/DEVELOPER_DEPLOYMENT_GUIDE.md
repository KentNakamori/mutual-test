# 👨‍💻 開発チーム向けデプロイガイド

## 📋 前提条件

クライアントから以下の情報を提供されていることを確認してください：

- AWS Account ID
- IAM User名
- Access Key ID
- Secret Access Key
- リージョン（通常は `ap-northeast-1`）

## 🚀 デプロイ手順

### 1. 環境の準備

#### 1.1 プロジェクトのクローン

```bash
git clone [リポジトリURL]
cd mutual-test
```

#### 1.2 必要なツールの確認

```bash
# AWS CLI
aws --version

# Terraform
terraform --version

# Docker
docker --version

# Make
make --version
```

### 2. AWS認証の設定

#### 2.1 AWS CLIの設定

```bash
aws configure
```

**入力項目:**
```
AWS Access Key ID: [クライアントから提供されたAccess Key ID]
AWS Secret Access Key: [クライアントから提供されたSecret Access Key]
Default region name: ap-northeast-1
Default output format: json
```

#### 2.2 認証の確認

```bash
aws sts get-caller-identity
```

正常に設定されていれば、以下のような出力が表示されます：
```json
{
    "UserId": "AID...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/mutual-developer"
}
```

### 3. 設定ファイルの準備

#### 3.1 設定ファイルのコピー

```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```

#### 3.2 自動設定の実行（推奨）

```bash
make setup-tfvars
```

このコマンドは以下を自動実行します：
- バックエンドのVPC IDを取得
- バックエンドのAPI URLを取得
- `terraform.tfvars`を自動設定

#### 3.3 手動設定（必要な場合）

`terraform/terraform.tfvars`を編集：

```hcl
# 必須設定
api_base_url = "https://your-backend-url"
vpc_id = "vpc-xxxxxxxxx"

# オプション設定
domain_name = ""  # 独自ドメインがある場合は設定
region = "ap-northeast-1"
project_name = "mutual-app"
```

### 4. インフラのデプロイ

#### 4.1 Terraformの初期化

```bash
make tf-init
```

#### 4.2 デプロイ計画の確認

```bash
make tf-plan
```

出力を確認し、作成されるリソースに問題がないかチェックしてください。

#### 4.3 インフラのデプロイ

```bash
make tf-apply
```

**重要**: このコマンドはAWSリソースを作成します。実行前に計画を確認してください。

### 5. 機密情報の設定

#### 5.1 Auth0情報の準備

以下の情報を準備してください：
- AUTH0_CLIENT_SECRET
- AUTH0_M2M_CLIENT_ID
- AUTH0_M2M_CLIENT_SECRET

#### 5.2 機密情報の設定

```bash
./scripts/update-secrets.sh
```

**入力項目:**
```
AUTH0_CLIENT_SECRET: [Auth0のClient Secret]
AUTH0_SECRET: [空白でEnter - 自動生成されます]
AUTH0_M2M_CLIENT_ID: [M2MアプリケーションのID]
AUTH0_M2M_CLIENT_SECRET: [M2MアプリケーションのSecret]
AUTH0_CONNECTION_NAME: [デフォルト: Corporate-DB]
DATABASE_URL: [空白でEnter]
```

### 6. アプリケーションのデプロイ

#### 6.1 Dockerイメージのビルド・プッシュ

```bash
make docker-push
```

#### 6.2 アプリケーションのデプロイ

```bash
make deploy
```

### 7. 動作確認

#### 7.1 アクセスURLの確認

```bash
make api-info
```

または

```bash
cd terraform && terraform output application_url
```

#### 7.2 アプリケーションの動作確認

表示されたURLにアクセスして以下を確認：
- ページが正常に表示される
- ログイン機能が動作する
- APIとの通信が正常

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. 権限エラー

```bash
# 権限を確認
aws sts get-caller-identity

# エラーの場合、クライアントに権限の確認を依頼
```

#### 2. VPCが見つからないエラー

```bash
# バックエンドのVPCを確認
cd ../mutual_backend/terraform && terraform output vpc_id

# 手動でVPC IDを設定
# terraform/terraform.tfvars で vpc_id を明示的に設定
```

#### 3. API URLエラー

```bash
# バックエンドのURLを確認
cd ../mutual_backend/terraform && terraform output api_endpoint_alb

# 手動でAPI URLを設定
# terraform/terraform.tfvars で api_base_url を明示的に設定
```

#### 4. ECRプッシュエラー

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $(terraform output -raw ecr_repository_url | cut -d'/' -f1)
```

#### 5. ECSタスクが起動しない

```bash
# ログを確認
aws logs tail /ecs/mutual-test --follow

# タスク定義を確認
aws ecs describe-task-definition --task-definition mutual-app-frontend
```

## 📊 デプロイ後の確認事項

### 1. リソースの確認

```bash
# 作成されたリソースを確認
make tf-outputs

# ECSサービスの状況確認
aws ecs describe-services --cluster $(terraform output -raw ecs_cluster_name) --services $(terraform output -raw ecs_service_name)
```

### 2. セキュリティの確認

- WAFの設定確認
- セキュリティグループの設定確認
- CloudWatchログの確認

### 3. パフォーマンスの確認

- CloudFrontのキャッシュヒット率
- ALBのターゲットヘルス
- ECSタスクのCPU/メモリ使用率

## 🛠️ 運用コマンド

### ログの確認

```bash
# アプリケーションログ
aws logs tail /ecs/mutual-test --follow

# ALBログ
aws logs tail /aws/applicationloadbalancer/mutual-app --follow
```

### サービスの再起動

```bash
# ECSサービスの強制再デプロイ
make deploy

# または直接実行
aws ecs update-service --cluster $(terraform output -raw ecs_cluster_name) --service $(terraform output -raw ecs_service_name) --force-new-deployment
```

### 設定の更新

```bash
# 機密情報の更新
./scripts/update-secrets.sh

# 設定変更後の再デプロイ
make deploy
```

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. **ログの確認**: CloudWatchログでエラーの詳細を確認
2. **権限の確認**: IAMユーザーの権限が適切か確認
3. **設定の確認**: `terraform.tfvars`の設定が正しいか確認
4. **リソースの確認**: AWSコンソールでリソースの状況を確認

解決できない場合は、クライアントのAWS管理者に連絡してください。

---

**注意**: このガイドは開発チーム向けです。クライアントには `CLIENT_AWS_SETUP.md` を提供してください。 