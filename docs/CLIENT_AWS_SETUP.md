# 🏢 クライアント向けAWS設定ガイド

## 📋 概要

このドキュメントは、クライアントのAWSアカウントにMutual QA Stationをデプロイするために必要な設定を説明します。

## 🔐 必要なAWS設定

### 1. AWSアカウントの準備

#### 1.1 AWSアカウントの作成（未所持の場合）
- [AWS公式サイト](https://aws.amazon.com/jp/)でアカウントを作成
- クレジットカード情報の登録が必要
- 無料枠（12ヶ月間）で小規模な使用が可能

#### 1.2 リージョンの選択
- **推奨リージョン**: `ap-northeast-1` (東京)
- 他のリージョンでも動作可能ですが、レイテンシーが増加する可能性があります

### 2. IAMユーザーの作成

#### 2.1 管理者権限を持つIAMユーザーを作成

**AWSコンソールでの手順:**

1. **IAMコンソール**にアクセス: https://console.aws.amazon.com/iam/
2. **ユーザー** → **ユーザーを作成**
3. **ユーザー名**: `mutual-admin` または任意の名前
4. **アクセスキー**を選択（プログラムによるアクセス）
5. **次へ**

#### 2.2 必要な権限ポリシーをアタッチ

以下のポリシーをアタッチしてください：

**必須ポリシー:**
- `AdministratorAccess` (フルアクセス権限)

**または、最小権限ポリシー（推奨）:**

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:*",
                "ecs:*",
                "ecr:*",
                "elasticloadbalancing:*",
                "cloudfront:*",
                "s3:*",
                "iam:*",
                "secretsmanager:*",
                "cloudwatch:*",
                "logs:*",
                "wafv2:*",
                "route53:*",
                "acm:*",
                "lambda:*",
                "events:*"
            ],
            "Resource": "*"
        }
    ]
}
```

#### 2.3 アクセスキーとシークレットキーの取得

1. **ユーザー作成完了後**、**アクセスキーID**と**シークレットアクセスキー**をダウンロード
2. **重要**: シークレットキーは一度しか表示されません。安全な場所に保存してください

### 3. AWS CLIの設定

#### 3.1 AWS CLIのインストール

**macOS:**
```bash
brew install awscli
```

**Windows:**
- [AWS CLI公式インストーラー](https://aws.amazon.com/jp/cli/)をダウンロード

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

#### 3.2 AWS CLIの設定

```bash
aws configure
```

**入力項目:**
```
AWS Access Key ID: [取得したアクセスキーID]
AWS Secret Access Key: [取得したシークレットアクセスキー]
Default region name: ap-northeast-1
Default output format: json
```

#### 3.3 設定の確認

```bash
aws sts get-caller-identity
```

正常に設定されていれば、以下のような出力が表示されます：
```json
{
    "UserId": "AID...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/mutual-admin"
}
```

### 4. 必要なツールのインストール

#### 4.1 Terraformのインストール

**macOS:**
```bash
brew install terraform
```

**Windows:**
- [Terraform公式サイト](https://www.terraform.io/downloads)からダウンロード

**Linux:**
```bash
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```

#### 4.2 Dockerのインストール

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
- [Docker Desktop](https://www.docker.com/products/docker-desktop)をダウンロード

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 5. 開発チームへのアカウント提供

#### 5.1 開発用IAMユーザーの作成

**推奨設定:**
- **ユーザー名**: `mutual-developer`
- **権限**: 上記と同じ権限ポリシー
- **アクセスキー**: プログラムによるアクセスを有効化

#### 5.2 提供する情報

開発チームに以下の情報を提供してください：

```
AWS Account ID: [AWSアカウントID]
Region: ap-northeast-1
IAM User: mutual-developer
Access Key ID: [アクセスキーID]
Secret Access Key: [シークレットアクセスキー]
```

## 🚀 デプロイ準備

### 1. プロジェクトのクローン

開発チームが以下のコマンドを実行します：

```bash
git clone [リポジトリURL]
cd mutual-test
```

### 2. 設定ファイルの準備

```bash
# 設定ファイルをコピー
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

# 自動設定を実行（推奨）
make setup-tfvars
```

### 3. インフラのデプロイ

```bash
# Terraformの初期化
make tf-init

# インフラをデプロイ
make tf-apply
```

### 4. アプリケーションのデプロイ

```bash
# アプリケーションをデプロイ
make deploy
```

## 💰 費用について

### 月額概算（小規模使用の場合）

- **EC2 (ECS)**: ¥1,000-3,000
- **ALB**: ¥1,000-2,000
- **CloudFront**: ¥500-1,000
- **S3**: ¥100-500
- **その他**: ¥500-1,000

**合計**: ¥3,000-7,000/月程度

### 費用削減のポイント

1. **無料枠の活用**: 新規アカウントは12ヶ月間の無料枠あり
2. **リソースの最適化**: 使用量に応じてインスタンスサイズを調整
3. **CloudFrontの活用**: キャッシュにより転送量を削減

## 🔒 セキュリティ設定

### 1. 推奨セキュリティ設定

- **WAFの有効化**: 地理的制限やIP制限の設定
- **CloudTrailの有効化**: 操作ログの記録
- **CloudWatchアラーム**: 異常検知の設定

### 2. アクセス制御

```bash
# IP制限を設定する場合
# terraform.tfvarsに以下を追加
allowed_ip_addresses = ["203.0.113.0/24", "198.51.100.0/24"]
```

## 📞 サポート

### トラブルシューティング

**よくある問題:**

1. **権限エラー**
   ```bash
   # 権限を確認
   aws sts get-caller-identity
   ```

2. **リソース制限エラー**
   - AWSコンソールでリソース制限を確認
   - 必要に応じて制限緩和を申請

3. **ネットワークエラー**
   - VPC設定の確認
   - セキュリティグループの設定確認

### 連絡先

技術的な問題が発生した場合は、開発チームまでご連絡ください。

## 📋 チェックリスト

### デプロイ前の確認事項

- [ ] AWSアカウントの作成
- [ ] IAMユーザーの作成
- [ ] アクセスキーの取得
- [ ] AWS CLIの設定
- [ ] Terraformのインストール
- [ ] Dockerのインストール
- [ ] 開発チームへのアカウント情報提供
- [ ] プロジェクトのクローン
- [ ] 設定ファイルの準備
- [ ] インフラのデプロイ
- [ ] アプリケーションのデプロイ
- [ ] 動作確認

### デプロイ後の確認事項

- [ ] アプリケーションの動作確認
- [ ] セキュリティ設定の確認
- [ ] 監視設定の確認
- [ ] バックアップ設定の確認
- [ ] ドキュメントの更新

---

**注意**: このドキュメントは技術的な設定を説明しています。実際のデプロイ作業は開発チームが行います。不明な点がございましたら、お気軽にお問い合わせください。 