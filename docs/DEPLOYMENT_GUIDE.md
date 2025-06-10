# 🚀 最適化AWS デプロイ&運用ガイド

このドキュメントは、TerraformとGitHub Actionsを使用してNext.jsアプリケーションを**コスト効率とパフォーマンスを最適化したAWS環境**にデプロイするための手順を解説します。

## 🏗️ 全体構成の概要

このプロジェクトは、以下の**ハイブリッドアーキテクチャ**でAWS上にデプロイされます：

- **アプリケーション**: Next.js (API Routes + SSR) on ECS Fargate
- **静的アセット**: Amazon S3 + CloudFront CDN
- **セキュリティ**: AWS WAF (Web Application Firewall)
- **認証**: Auth0統合
- **インフラ管理**: Terraform (IaC)
- **CI/CDパイプライン**: GitHub Actions
- **モニタリング**: CloudWatch Logs

### 🏛️ アーキテクチャ図

```
[ユーザー] 
    ↓
[CloudFront CDN] ← [AWS WAF (セキュリティ)]
    ↓ (パスベースルーティング)
    ├── /_next/static/* → [S3 Bucket (静的アセット)]
    ├── /api/* → [ALB] → [ECS Fargate (Next.js SSR + API Routes)]
    └── その他 → [ALB] → [ECS Fargate]

[GitHub] --push--> [GitHub Actions] 
    ├── Next.js Build → [S3 Static Assets]
    └── Docker Build → [ECR] → [ECS Service Update]
```

## 🎯 なぜこのアーキテクチャなのか？

### ✅ **コスト最適化**
- **静的アセット**: S3配信により、ECSリソース使用量を削減
- **CloudFront**: グローバルキャッシュでオリジンサーバーへの負荷軽減
- **効率的なキャッシュ**: 静的ファイルを1年間キャッシュ

### ⚡ **パフォーマンス向上**
- **CDN配信**: 全世界のエッジロケーションから高速配信
- **キャッシュ最適化**: APIは毎回、静的ファイルは長期キャッシュ
- **圧縮**: Gzip/Brotli圧縮による転送量削減

### 🔒 **セキュリティ強化**
- **WAF保護**: SQLインジェクション、XSS攻撃をブロック
- **レート制限**: DDoS攻撃からの保護
- **VPC隔離**: アプリケーションサーバーはプライベートサブネット

### 🛠️ **開発・運用の簡素化**
- **API Routes維持**: Next.jsのAPI機能をフル活用
- **Auth0統合**: 複雑な認証フローをそのまま利用
- **ワンコマンドデプロイ**: `make deploy`で全て自動化

---

## 📋 お客様に行っていただく設定作業

### ステップ1: 事前準備

**必要ツールのインストール**:
- [Docker](https://docs.docker.com/get-docker/)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli) 
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- Node.js 20以上

**AWS IAMユーザーの作成**:
1. AWSマネジメントコンソールでIAMユーザーを作成
2. `AdministratorAccess` 権限をアタッチ
3. **アクセスキーID**と**シークレットアクセスキー**を安全に保存

### ステップ2: ローカル環境のセットアップ

```bash
# プロジェクトのルートディレクトリに移動
cd /path/to/your/mutual-test

# 開発環境の自動セットアップ
make setup
```

**AWS認証情報の設定**:
```bash
# 管理者プロファイルの設定
aws configure --profile admin
# アクセスキーID、シークレットアクセスキー、リージョン(ap-northeast-1)を入力
```

### ステップ3: 環境変数の設定

#### **重要**: アプリケーションシークレットの設定

1. **Terraformでシークレットリソースを作成**:
   ```bash
   make tf-init
   make tf-apply
   ```

2. **シークレット値の設定**:
   ```bash
   make set-secrets
   # 画面の指示に従ってAWS Secrets Managerに値を設定
   ```

3. **設定が必要な値**:

| 変数名 | 説明 | 取得場所 |
|--------|------|----------|
| `AUTH0_SECRET` | Auth0セッション暗号化キー | `openssl rand -hex 32` |
| `AUTH0_DOMAIN` | Auth0テナントドメイン | Auth0ダッシュボード |
| `AUTH0_CLIENT_ID` | アプリケーションClient ID | Auth0ダッシュボード |
| `AUTH0_CLIENT_SECRET` | アプリケーションClient Secret | Auth0ダッシュボード |
| `API_BASE_URL` | バックエンドAPIのURL | 本番環境の場合はELBのDNS名 |

### ステップ4: GitHubリポジトリの設定

1. **環境の作成**:
   - `Settings` > `Environments` > `New environment`
   - `production` という名前の環境を作成

2. **シークレットの登録**:
   - `Settings` > `Secrets and variables` > `Actions`で以下を作成:
     - `AWS_ACCESS_KEY_ID`: AWSアクセスキーID
     - `AWS_SECRET_ACCESS_KEY`: AWSシークレットアクセスキー  
     - `AWS_REGION`: `ap-northeast-1`

### ステップ5: インフラの構築とデプロイ

```bash
# インフラの構築状況を確認
make tf-plan

# インフラを構築
make tf-apply

# 構築されたリソースの確認
make aws-status

# アプリケーションのデプロイ
make deploy
```

### ステップ6: 動作確認

1. **CloudFrontのURL確認**:
   ```bash
   make tf-output
   # cloudfront_domain_name の値をメモ
   ```

2. **アクセステスト**:
   - `https://<cloudfront-domain>/` でアプリケーション確認
   - `https://<cloudfront-domain>/api/health` でAPI確認

---

## 🔧 運用コマンド

```bash
# 利用可能なコマンド一覧
make help

# 開発サーバー起動
make dev

# ローカルでビルドテスト
make build

# AWSリソースの状態確認
make aws-status

# アプリケーションログの確認  
make logs

# デプロイ実行
make deploy

# 設定ファイルのバックアップ
make backup
```

---

## 💰 コスト見積もり（月額）

| サービス | 設定 | 想定費用 |
|----------|------|----------|
| **ECS Fargate** | 0.5 vCPU, 1GB RAM | ~$30 |
| **Application Load Balancer** | 基本料金 | ~$20 |
| **CloudFront** | 1TB転送/月 | ~$85 |
| **S3** | 10GB保存、転送費用 | ~$3 |
| **WAF** | Basic rules | ~$6 |
| **CloudWatch** | ログ保存 | ~$5 |
| **ECR** | Dockerイメージ保存 | ~$1 |
| **合計** |  | **~$150/月** |

> 💡 **コスト削減のヒント**: 
> - 開発環境は使わない時に`make tf-destroy`で削除
> - CloudFrontのキャッシュ率向上でオリジン負荷を軽減

---

## 🚨 トラブルシューティング

### よくある問題と解決方法

**1. GitHub Actions でデプロイが失敗する**
```bash
# Terraformの状態確認
make tf-output

# AWSリソースの状態確認  
make aws-status
```

**2. アプリケーションにアクセスできない**
```bash
# CloudFrontの設定確認
aws cloudfront get-distribution --id <DISTRIBUTION_ID>

# ECSサービスの状態確認
aws ecs describe-services --cluster mutual-test-cluster --services mutual-test-service
```

**3. 静的ファイルが表示されない**
```bash
# S3バケットの内容確認
aws s3 ls s3://mutual-test-static-assets/_next/static/ --recursive
```

---

## 🔐 セキュリティのベストプラクティス

1. **定期的な更新**: 依存関係とAWSサービスの定期更新
2. **アクセス制御**: IAMロールの最小権限の原則
3. **監視**: CloudWatch アラームの設定
4. **バックアップ**: 重要なデータの定期バックアップ

---

この最適化されたアーキテクチャにより、**高いパフォーマンス**、**強固なセキュリティ**、**コスト効率**を実現できます。

ご不明な点があれば、お気軽にご質問ください！ 🙋‍♂️ 