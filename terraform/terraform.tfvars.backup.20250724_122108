# terraform.tfvars.example
# このファイルをコピーしてterraform.tfvarsとして使用してください
# terraform.tfvarsは.gitignoreに追加することを推奨します

# ドメイン設定（オプション）
# domain_name = "example.com"  # 独自ドメインがある場合は設定
domain_name = ""  # 空文字の場合はCloudFrontの自動ドメインを使用（無料）

# オプション設定（必要に応じて変更）
region = "ap-northeast-1"
project_name = "mutual-app"  # バックエンドと統一
environment = "production"

# Auth0設定（必要に応じて変更）
auth0_issuer_base_url = "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/"
auth0_domain = "dev-ldw81lf4gyh8azw6.jp.auth0.com"
auth0_client_id = "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP"
auth0_audience = "https://api.local.dev"

# API設定（バックエンドAPIのURL）
# バックエンドと同じVPCを使用する設定済み
# 
# 利用可能なエンドポイント:
# 1. CloudFront経由（推奨）:
api_base_url = "https://d28ns8mblnoihl.cloudfront.net"
# 
# 2. ALB直接接続（オプション）:
#    api_base_url = "https://mutual-app-alb-v2-684193640.ap-northeast-1.elb.amazonaws.com"

# Auth0機密情報はAWS Secrets Managerで管理されています
# 機密情報の更新は以下のコマンドで行ってください:
# ./scripts/update-secrets.sh 

# VPC設定（バックエンドと共有）
vpc_id = "vpc-0642b0e0d50fe6441"
