# 🔐 AWS Secrets Manager 設定ガイド

このガイドでは、アプリケーションで使用する機密情報をAWS Secrets Managerに安全に設定する方法を説明します。

## 📋 設定が必要な機密情報

| 項目 | 説明 | 必須 | 例 |
|------|------|------|-----|
| `AUTH0_CLIENT_SECRET` | Auth0のクライアントシークレット | ✅ | `xxxxxxxxxxxxxxxxxxx` |
| `AUTH0_SECRET` | セッション暗号化用の秘密鍵 | ✅ | `a-32-character-long-random-string` |
| `DATABASE_URL` | データベース接続文字列 | ❌ | `postgresql://user:pass@host:5432/db` |

## 🔧 設定方法

### 方法1: スクリプトを使用（推奨）

```bash
# スクリプトに実行権限を付与
chmod +x scripts/update-secrets.sh

# スクリプトを実行
./scripts/update-secrets.sh
```

### 方法2: AWS CLIで直接更新

```bash
# シークレット名を取得
SECRET_NAME=$(cd terraform && terraform output -raw app_secrets_name)

# 一括更新
aws secretsmanager update-secret --secret-id $SECRET_NAME --secret-string '{
  "AUTH0_ISSUER_BASE_URL": "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/",
  "AUTH0_DOMAIN": "dev-ldw81lf4gyh8azw6.jp.auth0.com",
  "AUTH0_CLIENT_ID": "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP",
  "AUTH0_CLIENT_SECRET": "実際のAuth0シークレット",
  "AUTH0_AUDIENCE": "https://api.local.dev",
  "AUTH0_SECRET": "実際の32文字以上のランダム文字列",
  "DATABASE_URL": "postgresql://user:password@host:port/database"
}'
```

### 方法3: AWSマネジメントコンソール

1. **AWSマネジメントコンソールにログイン**
2. **Secrets Manager**サービスに移動
3. **`mutual-test-app-secrets`**を検索・選択
4. **「Retrieve secret value」**をクリック
5. **「Edit」**ボタンをクリック
6. **JSON形式で以下の値を更新**：

```json
{
  "AUTH0_ISSUER_BASE_URL": "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/",
  "AUTH0_DOMAIN": "dev-ldw81lf4gyh8azw6.jp.auth0.com",
  "AUTH0_CLIENT_ID": "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP",
  "AUTH0_CLIENT_SECRET": "実際のAuth0シークレット",
  "AUTH0_AUDIENCE": "https://api.local.dev",
  "AUTH0_SECRET": "実際の32文字以上のランダム文字列",
  "DATABASE_URL": "postgresql://user:password@host:port/database"
}
```

7. **「Save」**をクリック

## 🔑 Auth0シークレットの取得方法

### Auth0 Client Secretの取得：

1. **Auth0ダッシュボード**にログイン
2. **Applications** → **Applications**
3. **アプリケーション**を選択
4. **Settings**タブ
5. **Client Secret**をコピー

### Auth0 Secretの生成：

32文字以上のランダム文字列を生成します：

```bash
# macOS/Linux
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# オンラインツール
# https://www.random.org/strings/ で32文字のランダム文字列を生成
```

## 📝 設定後の確認

### 1. シークレットの確認

```bash
# 設定された値を確認（機密情報は表示されません）
SECRET_NAME=$(cd terraform && terraform output -raw app_secrets_name)
aws secretsmanager describe-secret --secret-id $SECRET_NAME
```

### 2. ECSタスクでの環境変数確認

```bash
# ECSタスクで実際に環境変数が設定されているか確認
CLUSTER_NAME=$(cd terraform && terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(cd terraform && terraform output -raw ecs_service_name)

# 実行中のタスクを取得
TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns[0]' --output text)

# タスクの詳細を確認（環境変数は表示されませんが、設定の有無は確認可能）
aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN
```

## 🔄 設定変更後の反映

シークレットを更新した後は、ECSサービスを再起動して新しい設定を反映させる必要があります：

```bash
# ECSサービスの強制再デプロイ
CLUSTER_NAME=$(cd terraform && terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(cd terraform && terraform output -raw ecs_service_name)

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment
```

または：

```bash
# makeコマンドでアプリケーション全体を再デプロイ
make deploy
```

## 🚨 セキュリティのベストプラクティス

### ✅ やるべきこと：
- **定期的なシークレットローテーション**（3-6ヶ月ごと）
- **最小権限の原則**（必要なリソースにのみアクセス権限を付与）
- **監査ログの確認**（CloudTrailでシークレットアクセスを監視）

### ❌ やってはいけないこと：
- **Gitにシークレットをコミット**
- **プレーンテキストでのシークレット保存**
- **不要な権限の付与**

## 🔍 トラブルシューティング

### よくある問題と解決方法：

#### 1. **ECSタスクがシークレットを取得できない**
```bash
# IAMロールの権限確認
aws iam get-role-policy --role-name mutual-test-ecs-exec-role --policy-name mutual-test-secrets-access
```

#### 2. **シークレットが見つからない**
```bash
# シークレットの存在確認
aws secretsmanager list-secrets --query 'SecretList[?contains(Name, `mutual-test`)]'
```

#### 3. **権限エラー**
```bash
# 現在のユーザーの権限確認
aws sts get-caller-identity
```

## 💡 追加の環境変数が必要な場合

新しい機密情報を追加する場合：

1. **Terraformの`main.tf`を更新**：
```hcl
# terraform/main.tf の secrets セクション
secrets = [
  # 既存の設定...
  { name = "NEW_SECRET", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:NEW_SECRET::" }
]
```

2. **Secrets Managerに新しいキーを追加**
3. **ECSタスク定義を更新**：
```bash
terraform apply
```

4. **アプリケーションを再デプロイ**：
```bash
make deploy
``` 