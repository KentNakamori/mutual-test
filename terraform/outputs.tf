output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = local.ecs_cluster_name
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.main.name
}

output "load_balancer_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}

# ALB DNS名のエイリアス（バックエンド接続設定用）
output "alb_dns_name" {
  description = "The DNS name of the ALB (alias for load_balancer_dns_name)"
  value       = aws_lb.main.dns_name
}

# バックエンドAPI接続用URL
output "api_endpoint_alb" {
  description = "ALB endpoint for backend API connection"
  value       = "https://${aws_lb.main.dns_name}"
}

output "api_endpoint_cloudfront" {
  description = "CloudFront endpoint for backend API connection (推奨)"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "app_secrets_name" {
  description = "The name of the secret in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.app_secrets.name
}

output "app_secrets_arn" {
  description = "The ARN of the secret in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.app_secrets.arn
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.main.id
}

output "s3_static_bucket_name" {
  description = "The name of the S3 bucket for static assets."
  value       = aws_s3_bucket.static_assets.bucket
}

output "waf_web_acl_arn" {
  description = "The ARN of the WAF Web ACL."
  value       = aws_wafv2_web_acl.main.arn
}

# output "ssl_certificate_arn" {
#   description = "The ARN of the SSL certificate."
#   value       = var.domain_name != "" ? aws_acm_certificate.main[0].arn : null
# }

# output "ssl_certificate_domain_validation_options" {
#   description = "Domain validation options for the SSL certificate."
#   value       = var.domain_name != "" ? aws_acm_certificate.main[0].domain_validation_options : null
# }

output "application_url" {
  description = "The URL to access the application"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.main.domain_name}"
}

# セキュリティ関連の出力
output "security_group_alb_id" {
  description = "The ID of the ALB security group"
  value       = aws_security_group.lb.id
}

output "security_group_ecs_id" {
  description = "The ID of the ECS tasks security group" 
  value       = aws_security_group.ecs_tasks.id
}

output "iam_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "iam_task_role_arn" {
  description = "The ARN of the ECS task role"
  value       = aws_iam_role.ecs_task_role.arn
}

# デプロイ情報
output "deployment_info" {
  description = "Summary of deployment information"
  value = {
    application_url    = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.main.domain_name}"
    cloudfront_id      = aws_cloudfront_distribution.main.id
    ecr_repository     = aws_ecr_repository.frontend.repository_url
    ecs_cluster        = local.ecs_cluster_name
    ecs_service        = aws_ecs_service.main.name
    secrets_manager    = aws_secretsmanager_secret.app_secrets.name
    waf_web_acl        = aws_wafv2_web_acl.main.arn
  }
} 