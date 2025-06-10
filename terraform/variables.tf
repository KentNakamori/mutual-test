variable "region" {
  description = "The AWS region to deploy resources in."
  type        = string
  default     = "ap-northeast-1"
}

variable "vpc_id" {
  description = "The ID of the existing VPC to use."
  type        = string
  default     = "vpc-0203ac079a39c4a9b" # 既存の mutual-app-vpc のID
}

variable "project_name" {
  description = "The name of the project."
  type        = string
  default     = "mutual-test"
} 