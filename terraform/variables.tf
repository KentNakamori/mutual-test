variable "region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "ap-northeast-1"
}

# VPC設定 - 動的検出または指定
variable "vpc_id" {
  description = "The ID of the existing VPC to use. If empty, will search for VPC with tag 'Name=mutual-app-vpc'. For production deployment, specify the VPC ID explicitly."
  type        = string
  default     = ""  # 空の場合は自動検出
  
  validation {
    condition     = var.vpc_id == "" || can(regex("^vpc-[a-f0-9]{8,17}$", var.vpc_id))
    error_message = <<-EOT
      vpc_id must be a valid VPC ID format (vpc-xxxxxxxxx) or empty for auto-detection.
      
      To get the correct VPC ID, run:
        aws ec2 describe-vpcs --filters "Name=tag:Name,Values=mutual-app-vpc" --query 'Vpcs[0].VpcId' --output text
      
      Or use auto-setup:
        make setup-tfvars
      
      For multiple VPCs environment, specify the exact VPC ID in terraform.tfvars:
        vpc_id = "vpc-xxxxxxxxx"
    EOT
  }
}

variable "vpc_name_tag" {
  description = "The name tag of the VPC to search for when vpc_id is not specified"
  type        = string
  default     = "mutual-app-vpc"
}

# ECS設定 - バックエンドと共有するかどうか
variable "use_existing_ecs_cluster" {
  description = "Whether to use an existing ECS cluster or create a new one"
  type        = bool
  default     = true  # バックエンドと共有する場合はtrue
}

variable "existing_ecs_cluster_name" {
  description = "Name of existing ECS cluster to use (when use_existing_ecs_cluster=true)"
  type        = string
  default     = "mutual-app-cluster"
}

variable "project_name" {
  description = "The name of the project."
  type        = string
  default     = "mutual-app"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "The domain name for the application (e.g., example.com). 空文字の場合はCloudFrontの自動ドメインを使用"
  type        = string
  default     = ""  # 空文字の場合はCloudFrontの自動ドメインを使用
}

# Auth0 設定（環境固有）
variable "auth0_issuer_base_url" {
  description = "Auth0 issuer base URL"
  type        = string
  default     = "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/"
}

variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
  default     = "dev-ldw81lf4gyh8azw6.jp.auth0.com"
}

variable "auth0_client_id" {
  description = "Auth0 client ID (public information)"
  type        = string
  default     = "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP"
}

variable "auth0_audience" {
  description = "Auth0 API audience"
  type        = string
  default     = "https://api.local.dev"
}

# バックエンドAPI設定 - 動的検出または指定
variable "backend_api_url" {
  description = "Backend API base URL. If empty, will use backend CloudFront distribution or ALB"
  type        = string
  default     = ""  # 空の場合は自動検出
}

variable "api_base_url" {
  description = "API base URL for frontend to backend communication"
  type        = string
  default     = ""
  
  validation {
    condition     = var.api_base_url != "" && can(regex("^https?://", var.api_base_url))
    error_message = <<-EOT
      api_base_url must be a valid HTTP/HTTPS URL.
      
      To get the correct value automatically, run:
        make setup-tfvars
      
      Or manually get it from backend deployment:
        cd ../mutual_backend/terraform && terraform output -raw api_endpoint_alb
      
      Then set it in terraform.tfvars:
        api_base_url = "https://your-backend-url"
    EOT
  }
}

variable "backend_cloudfront_domain_name" {
  description = "Backend CloudFront domain name (if exists)"
  type        = string
  default     = ""
}

variable "backend_alb_dns_name" {
  description = "Backend ALB DNS name (fallback if CloudFront not available)"
  type        = string
  default     = ""
}

# クライアント環境用の追加設定
variable "client_name" {
  description = "Client name for resource naming (used when deploying to client environment)"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project     = "mutual-app"
    Component   = "frontend"
  }
}

# セキュリティ設定
variable "allowed_ip_addresses" {
  description = "List of IP addresses allowed to access the application (CIDR format)"
  type        = list(string)
  default     = []  # 空の場合は全IPを許可
}

variable "enable_waf_geo_restriction" {
  description = "Enable geographic restriction in WAF"
  type        = bool
  default     = false
}

variable "waf_blocked_countries" {
  description = "List of country codes to block (when enable_waf_geo_restriction=true)"
  type        = list(string)
  default     = ["CN", "RU", "KP"]  # 例: 中国、ロシア、北朝鮮
}

# Auth0 機密情報はAWS Secrets Managerで管理
# 機密情報の更新は ./scripts/update-secrets.sh を使用 