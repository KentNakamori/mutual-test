# 🚀 クイックスタートガイド

## 📋 必要な情報を準備

### 1. Auth0情報を取得

1. **Auth0ダッシュボード**にログイン: https://manage.auth0.com/
2. **Applications** → **Applications**
3. **あなたのアプリケーション**を選択
4. **Settings**タブ
5. **Client Secret**をコピーして保存

### 2. 暗号化キーを生成

```bash
# 32文字のランダム文字列を生成
openssl rand -base64 32
```
この結果をコピーして保存

## 🛠️ デプロイ手順

### ステップ1: 設定ファイルの準備

```bash
# 設定ファイルをコピー
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

# 編集（domain_name = "" のままでOK）
nano terraform/terraform.tfvars
```

### ステップ2: インフラのデプロイ

```bash
# Terraformの初期化
cd terraform
terraform init

# インフラをデプロイ
terraform apply
```

**「yes」**と入力してデプロイを実行

### ステップ3: 機密情報の設定

```bash
# プロジェクトルートに戻る
cd ..

# 機密情報設定スクリプトを実行
./scripts/update-secrets.sh
```

**入力項目**:
- `AUTH0_CLIENT_SECRET`: 先ほど取得したAuth0のClient Secret
- `AUTH0_SECRET`: 先ほど生成した32文字のランダム文字列
- `DATABASE_URL`: 空白でEnter（データベースがない場合）

### ステップ4: アプリケーションのデプロイ

```bash
# Dockerイメージをビルド＆プッシュ
make docker-push

# アプリケーションをデプロイ
make deploy
```

## 🌐 アクセス確認

デプロイ完了後、以下のコマンドでアプリケーションのURLを確認：

```bash
cd terraform
terraform output application_url
```

表示されたURLにアクセスしてアプリケーションが動作することを確認してください。

## 🔍 トラブルシューティング

### よくある問題

#### 1. `terraform apply`でエラーが出る場合
```bash
# AWS CLIの設定を確認
aws configure list

# 必要に応じて再設定
aws configure
```

#### 2. `make docker-push`でエラーが出る場合
```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin $(terraform output -raw ecr_repository_url | cut -d'/' -f1)
```

#### 3. ECSタスクが起動しない場合
```bash
# ログを確認
aws logs tail /ecs/mutual-test --follow
```

## 📝 重要なメモ

- **ドメインなし**: CloudFrontの自動ドメイン（例: `d123abc.cloudfront.net`）を使用
- **HTTPSアクセス**: CloudFrontが自動でHTTPS化
- **費用**: 無料枠内で利用可能（小規模な使用の場合）

## 🎯 次のステップ

1. **独自ドメインを追加したい場合**:
   - ドメインを取得
   - `terraform.tfvars`で`domain_name`を設定
   - `terraform apply`で再デプロイ

2. **スケールアップしたい場合**:
   - ECSのdesired_countを増加
   - ALBのターゲットグループを調整

3. **監視を追加したい場合**:
   - CloudWatch Dashboardの作成
   - アラームの設定 