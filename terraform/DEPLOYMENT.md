# デプロイ手順書

## 前提条件

1. AWSアカウントとIAMユーザーの設定
2. AWS CLIの設定
3. Terraformのインストール
4. 独自ドメインの取得（Route 53または外部レジストラ）

## 1. 初期設定

### 1.1 設定ファイルの準備

```bash
# terraform.tfvarsファイルを作成
cp terraform.tfvars.example terraform.tfvars

# 実際の値に編集
nano terraform.tfvars
```

### 1.2 .gitignoreの確認

```bash
# 機密情報がコミットされないよう確認
echo "terraform.tfvars" >> .gitignore
echo "*.tfstate" >> .gitignore
echo "*.tfstate.backup" >> .gitignore
echo ".terraform/" >> .gitignore
```

## 2. Terraformでのインフラストラクチャデプロイ

### 2.1 Terraformの初期化

```bash
cd terraform
terraform init
```

### 2.2 プランの確認

```bash
terraform plan
```

### 2.3 インフラストラクチャのデプロイ

```bash
terraform apply
```

## 3. SSL証明書の検証

### 3.1 DNS検証レコードの追加

Terraformのapply後、SSL証明書の検証のためにDNSレコードを追加する必要があります：

```bash
# 検証レコード情報を確認
terraform output ssl_certificate_domain_validation_options
```

Route 53を使用している場合：
- AWSコンソールのRoute 53でドメインのホストゾーンを確認
- 表示された検証レコード（CNAMEレコード）を追加

外部DNSプロバイダーを使用している場合：
- 各プロバイダーの管理画面で検証レコードを追加

### 3.2 証明書の検証確認

```bash
# 証明書の状態を確認（ISSUED になるまで待機）
aws acm describe-certificate --certificate-arn $(terraform output -raw ssl_certificate_arn) --region us-east-1
```

## 4. Secrets Managerでの機密情報設定

### 4.1 AWS CLIでの設定

```bash
# シークレットの名前を確認
SECRET_NAME=$(terraform output -raw app_secrets_name)

# 現在の設定を確認
aws secretsmanager get-secret-value --secret-id $SECRET_NAME

# 機密情報を更新
aws secretsmanager update-secret --secret-id $SECRET_NAME --secret-string '{
  "AUTH0_ISSUER_BASE_URL": "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/",
  "AUTH0_DOMAIN": "dev-ldw81lf4gyh8azw6.jp.auth0.com",
  "AUTH0_CLIENT_ID": "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP",
  "AUTH0_CLIENT_SECRET": "実際のシークレット値",
  "AUTH0_AUDIENCE": "https://api.local.dev",
  "AUTH0_SECRET": "実際の32文字以上のランダム文字列",
  "DATABASE_URL": "postgresql://user:password@host:port/database"
}'
```

### 4.2 AWSコンソールでの設定

1. AWSコンソールにログイン
2. Secrets Managerサービスに移動
3. `mutual-test-app-secrets`シークレットを選択
4. 「Retrieve secret value」をクリック
5. 「Edit」をクリック
6. 以下の値を更新：
   - `AUTH0_CLIENT_SECRET`: 実際のAuth0クライアントシークレット
   - `AUTH0_SECRET`: 32文字以上のランダムな文字列
   - `DATABASE_URL`: データベース接続文字列（必要な場合）

## 5. DNSの設定

### 5.1 Route 53を使用する場合

```bash
# CloudFrontのドメイン名を確認
CLOUDFRONT_DOMAIN=$(terraform output -raw cloudfront_domain_name)

# Route 53でAレコード（Alias）を作成
aws route53 change-resource-record-sets --hosted-zone-id YOUR_HOSTED_ZONE_ID --change-batch '{
  "Changes": [{
    "Action": "CREATE",
    "ResourceRecordSet": {
      "Name": "yourdomain.com",
      "Type": "A",
      "AliasTarget": {
        "DNSName": "'$CLOUDFRONT_DOMAIN'",
        "EvaluateTargetHealth": false,
        "HostedZoneId": "Z2FDTNDATAQYW2"
      }
    }
  }]
}'
```

### 5.2 外部DNSプロバイダーを使用する場合

CNAMEレコードを作成：
- Name: yourdomain.com
- Value: CloudFrontのドメイン名

## 6. アプリケーションのデプロイ

### 6.1 Dockerイメージのビルドとプッシュ

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $(terraform output -raw ecr_repository_url | cut -d'/' -f1)

# イメージをビルド
docker build -t mutual-test .

# タグ付け
docker tag mutual-test:latest $(terraform output -raw ecr_repository_url):latest

# プッシュ
docker push $(terraform output -raw ecr_repository_url):latest
```

### 6.2 ECSサービスの更新

```bash
# ECSサービスを強制的に新しいデプロイメントで更新
aws ecs update-service --cluster $(terraform output -raw ecs_cluster_name) --service $(terraform output -raw ecs_service_name) --force-new-deployment
```

## 7. 動作確認

### 7.1 エンドポイントの確認

```bash
# ALBのエンドポイント確認
curl -I http://$(terraform output -raw load_balancer_dns_name)

# CloudFrontのエンドポイント確認  
curl -I https://$(terraform output -raw cloudfront_domain_name)

# 独自ドメインの確認
curl -I https://yourdomain.com
```

### 7.2 ログの確認

```bash
# ECSタスクのログを確認
aws logs tail /ecs/mutual-test --follow
```

## 8. トラブルシューティング

### 8.1 プライベートサブネットの問題

ECSタスクがプライベートサブネットで起動しない場合：

1. NAT Gatewayが存在することを確認
2. プライベートサブネットのルートテーブルにNAT Gatewayへのルートがあることを確認
3. 一時的にパブリックサブネットを使用する場合は、main.tfの以下を変更：

```hcl
# 一時的な回避策
subnets          = local.public_subnet_ids
assign_public_ip = true
```

### 8.2 SSL証明書の問題

証明書が検証されない場合：
1. DNS検証レコードが正しく設定されているか確認
2. DNS伝播に時間がかかる場合があります（最大48時間）
3. dig コマンドでDNSレコードを確認

```bash
dig _acme-challenge.yourdomain.com
```

## 9. セキュリティのベストプラクティス

1. **Secrets Managerの値は定期的にローテーション**
2. **IAMロールは最小権限の原則に従う**
3. **WAFルールを環境に応じて調整**
4. **CloudTrailでAPI呼び出しを監視**
5. **GuardDutyで脅威検知を有効化**

## 10. バックアップと災害復旧

1. **Terraform状態ファイルのリモートバックエンド設定**
2. **データベースの定期バックアップ**
3. **ECRイメージのライフサイクルポリシー設定** 