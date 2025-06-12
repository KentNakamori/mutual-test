variable "region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "ap-northeast-1"
}

variable "vpc_id" {
  description = "The ID of the existing VPC to use."
  type        = string
  default     = "vpc-0a57f6a9ed2bbbb3f" # バックエンドと同じ mutual-app-vpc のID
}

variable "project_name" {
  description = "The name of the project."
  type        = string
  default     = "mutual-app"
}

variable "domain_name" {
  description = "The domain name for the application (e.g., example.com). 空文字の場合はCloudFrontの自動ドメインを使用"
  type        = string
  default     = ""  # 空文字の場合はCloudFrontの自動ドメインを使用
}

# Auth0 設定（機密ではない情報のみ）
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

variable "api_base_url" {
  description = "Base URL for API endpoints"
  type        = string
  default     = "https://d20rzkwelg7jzp.cloudfront.net"
}

# 環境設定
variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
} 