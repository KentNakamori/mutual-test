#!/bin/bash

# Secrets Manager更新スクリプト
# 使用方法: ./scripts/update-secrets.sh

set -e

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 AWS Secrets Manager 設定スクリプト${NC}"
echo "=================================================="

# Terraformからシークレット名を取得
echo -e "${YELLOW}📋 Terraformからシークレット名を取得中...${NC}"
cd terraform

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraformがインストールされていません${NC}"
    exit 1
fi

SECRET_NAME=$(terraform output -raw app_secrets_name 2>/dev/null)
if [ $? -ne 0 ] || [ -z "$SECRET_NAME" ]; then
    echo -e "${RED}❌ Terraformの出力からシークレット名を取得できませんでした${NC}"
    echo "terraform apply を先に実行してください"
    exit 1
fi

echo -e "${GREEN}✅ シークレット名: $SECRET_NAME${NC}"

# 現在の設定を表示
echo -e "${YELLOW}📖 現在の設定を確認中...${NC}"
aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --query 'SecretString' --output text | jq . 2>/dev/null || {
    echo -e "${RED}❌ シークレットの取得に失敗しました。AWS CLIの設定を確認してください${NC}"
    exit 1
}

echo ""
echo -e "${YELLOW}🔧 新しい値を入力してください（空白の場合は現在の値を維持）${NC}"
echo ""

# 各項目の入力
read -p "AUTH0_CLIENT_SECRET (機密): " AUTH0_CLIENT_SECRET
read -p "AUTH0_SECRET (32文字以上のランダム文字列): " AUTH0_SECRET
read -p "DATABASE_URL (必要な場合): " DATABASE_URL

# 現在の設定を取得して更新
CURRENT_SECRET=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --query 'SecretString' --output text)

# jqを使用してJSONを更新
UPDATED_SECRET=$(echo "$CURRENT_SECRET" | jq \
    --arg client_secret "${AUTH0_CLIENT_SECRET:-CHANGE_ME_IN_AWS_CONSOLE}" \
    --arg auth_secret "${AUTH0_SECRET:-CHANGE_ME_IN_AWS_CONSOLE}" \
    --arg db_url "${DATABASE_URL:-CHANGE_ME_IF_NEEDED}" \
    '.AUTH0_CLIENT_SECRET = $client_secret | .AUTH0_SECRET = $auth_secret | .DATABASE_URL = $db_url')

echo ""
echo -e "${YELLOW}📝 更新される設定:${NC}"
echo "$UPDATED_SECRET" | jq .

echo ""
read -p "この設定で更新しますか？ (y/N): " CONFIRM

if [[ $CONFIRM != [yY] ]]; then
    echo -e "${YELLOW}⏹️  更新をキャンセルしました${NC}"
    exit 0
fi

# シークレットを更新
echo -e "${YELLOW}🔄 シークレットを更新中...${NC}"
aws secretsmanager update-secret \
    --secret-id "$SECRET_NAME" \
    --secret-string "$UPDATED_SECRET"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ シークレットが正常に更新されました！${NC}"
    echo ""
    echo -e "${BLUE}📝 次のステップ:${NC}"
    echo "1. ECSサービスを再起動して新しい設定を反映させてください"
    echo "   aws ecs update-service --cluster \$(terraform output -raw ecs_cluster_name) --service \$(terraform output -raw ecs_service_name) --force-new-deployment"
    echo ""
    echo "2. または make deploy でアプリケーション全体を再デプロイしてください"
else
    echo -e "${RED}❌ シークレットの更新に失敗しました${NC}"
    exit 1
fi 