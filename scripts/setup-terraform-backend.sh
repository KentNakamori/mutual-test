#!/bin/bash

# =============================================================================
# Terraform Backend Setup Script
# 
# このスクリプトは、Terraform状態ファイルをS3で管理するために必要な
# S3バケットとDynamoDBテーブルを作成します。
# =============================================================================

set -e

# カラー出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 設定
BUCKET_NAME="mutual-app-terraform-state"
DYNAMODB_TABLE="terraform-state-lock"
REGION="ap-northeast-1"
AWS_PROFILE="${AWS_PROFILE:-admin}"

echo -e "${BLUE}🔧 Terraformバックエンドセットアップスクリプト${NC}"
echo "=================================================="
echo ""

# AWS CLIの確認
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLIがインストールされていません${NC}"
    exit 1
fi

# AWS認証の確認
echo -e "${YELLOW}📋 AWS認証情報の確認...${NC}"
if ! AWS_PROFILE=$AWS_PROFILE aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS認証に失敗しました。AWS_PROFILE=$AWS_PROFILE を確認してください${NC}"
    exit 1
fi

ACCOUNT_ID=$(AWS_PROFILE=$AWS_PROFILE aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ AWSアカウント: $ACCOUNT_ID${NC}"
echo ""

# S3バケットの作成
echo -e "${YELLOW}📦 S3バケットの作成...${NC}"
if AWS_PROFILE=$AWS_PROFILE aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo -e "${BLUE}ℹ️  S3バケット '$BUCKET_NAME' は既に存在します${NC}"
else
    echo -e "S3バケット '$BUCKET_NAME' を作成します..."
    AWS_PROFILE=$AWS_PROFILE aws s3api create-bucket \
        --bucket "$BUCKET_NAME" \
        --region "$REGION" \
        --create-bucket-configuration LocationConstraint="$REGION"
    
    # バージョニングの有効化
    echo -e "バージョニングを有効化します..."
    AWS_PROFILE=$AWS_PROFILE aws s3api put-bucket-versioning \
        --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Enabled
    
    # 暗号化の有効化
    echo -e "暗号化を有効化します..."
    AWS_PROFILE=$AWS_PROFILE aws s3api put-bucket-encryption \
        --bucket "$BUCKET_NAME" \
        --server-side-encryption-configuration '{
            "Rules": [{
                "ApplyServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                }
            }]
        }'
    
    # パブリックアクセスのブロック
    echo -e "パブリックアクセスをブロックします..."
    AWS_PROFILE=$AWS_PROFILE aws s3api put-public-access-block \
        --bucket "$BUCKET_NAME" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
    
    echo -e "${GREEN}✅ S3バケットが作成されました${NC}"
fi
echo ""

# DynamoDBテーブルの作成
echo -e "${YELLOW}🔒 DynamoDBテーブルの作成...${NC}"
if AWS_PROFILE=$AWS_PROFILE aws dynamodb describe-table --table-name "$DYNAMODB_TABLE" --region "$REGION" &>/dev/null; then
    echo -e "${BLUE}ℹ️  DynamoDBテーブル '$DYNAMODB_TABLE' は既に存在します${NC}"
else
    echo -e "DynamoDBテーブル '$DYNAMODB_TABLE' を作成します..."
    AWS_PROFILE=$AWS_PROFILE aws dynamodb create-table \
        --table-name "$DYNAMODB_TABLE" \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --region "$REGION"
    
    # テーブルの作成完了を待機
    echo -e "テーブルの作成完了を待機しています..."
    AWS_PROFILE=$AWS_PROFILE aws dynamodb wait table-exists \
        --table-name "$DYNAMODB_TABLE" \
        --region "$REGION"
    
    echo -e "${GREEN}✅ DynamoDBテーブルが作成されました${NC}"
fi
echo ""

# バケットポリシーの設定
echo -e "${YELLOW}📝 S3バケットポリシーの設定...${NC}"
BUCKET_POLICY=$(cat <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${ACCOUNT_ID}:root"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::${ACCOUNT_ID}:root"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF
)

echo "$BUCKET_POLICY" | AWS_PROFILE=$AWS_PROFILE aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///dev/stdin

echo -e "${GREEN}✅ バケットポリシーが設定されました${NC}"
echo ""

# 設定情報の表示
echo -e "${BLUE}📋 Terraformバックエンド設定情報:${NC}"
echo "=================================================="
echo -e "S3バケット名: ${GREEN}$BUCKET_NAME${NC}"
echo -e "DynamoDBテーブル名: ${GREEN}$DYNAMODB_TABLE${NC}"
echo -e "リージョン: ${GREEN}$REGION${NC}"
echo ""

# 次のステップ
echo -e "${BLUE}📝 次のステップ:${NC}"
echo "1. terraform/backend.tf ファイルが作成されていることを確認"
echo "2. 既存の状態ファイルがある場合は、以下のコマンドで移行:"
echo "   cd terraform"
echo "   AWS_PROFILE=$AWS_PROFILE terraform init -migrate-state"
echo "3. 新規の場合は:"
echo "   cd terraform"
echo "   AWS_PROFILE=$AWS_PROFILE terraform init"
echo ""
echo -e "${GREEN}✅ セットアップが完了しました！${NC}" 