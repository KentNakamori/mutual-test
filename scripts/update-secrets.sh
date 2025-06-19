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
CURRENT_SECRET=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --query 'SecretString' --output text 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "$CURRENT_SECRET" | jq . 2>/dev/null || {
        echo -e "${RED}❌ シークレットの解析に失敗しました${NC}"
        CURRENT_SECRET="{}"
    }
else
    echo -e "${RED}❌ シークレットの取得に失敗しました。AWS CLIの設定を確認してください${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 新しい値を入力してください（空白の場合は現在の値を維持）${NC}"
echo ""

# 各項目の入力
read -s -p "AUTH0_CLIENT_SECRET (メインアプリケーションの機密): " AUTH0_CLIENT_SECRET
echo ""
read -p "AUTH0_SECRET (32文字以上のランダム文字列、生成する場合は空白): " AUTH0_SECRET
if [ -z "$AUTH0_SECRET" ]; then
    AUTH0_SECRET=$(openssl rand -hex 32)
    echo -e "${GREEN}✅ AUTH0_SECRETを生成しました${NC}"
fi
read -p "AUTH0_M2M_CLIENT_ID (M2MアプリケーションのID): " AUTH0_M2M_CLIENT_ID
read -s -p "AUTH0_M2M_CLIENT_SECRET (M2Mアプリケーションの機密): " AUTH0_M2M_CLIENT_SECRET
echo ""
read -p "AUTH0_CONNECTION_NAME (デフォルト: Corporate-DB): " AUTH0_CONNECTION_NAME
read -p "DATABASE_URL (オプション、通常は不要): " DATABASE_URL

# 現在の値を保持しつつ、新しい値で更新
UPDATED_SECRET=$(echo "$CURRENT_SECRET" | jq \
    --arg client_secret "${AUTH0_CLIENT_SECRET}" \
    --arg auth_secret "${AUTH0_SECRET}" \
    --arg m2m_client_id "${AUTH0_M2M_CLIENT_ID}" \
    --arg m2m_client_secret "${AUTH0_M2M_CLIENT_SECRET}" \
    --arg connection_name "${AUTH0_CONNECTION_NAME:-Corporate-DB}" \
    --arg db_url "${DATABASE_URL}" \
    'if $client_secret != "" then .AUTH0_CLIENT_SECRET = $client_secret else . end |
     if $auth_secret != "" then .AUTH0_SECRET = $auth_secret else . end |
     if $m2m_client_id != "" then .AUTH0_M2M_CLIENT_ID = $m2m_client_id else . end |
     if $m2m_client_secret != "" then .AUTH0_M2M_CLIENT_SECRET = $m2m_client_secret else . end |
     .AUTH0_CONNECTION_NAME = $connection_name |
     if $db_url != "" then .DATABASE_URL = $db_url else . end')

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