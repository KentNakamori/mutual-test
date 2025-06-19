# ------------------------------------------------------------------------------
# Provider Configuration
# ------------------------------------------------------------------------------
provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

# ------------------------------------------------------------------------------
# Data Sources for Existing VPC
# ------------------------------------------------------------------------------
# VPCの動的検出 - vpc_idが指定されていない場合はタグで検索
data "aws_vpc" "existing" {
  count = var.vpc_id != "" ? 1 : 0
  id    = var.vpc_id
}

data "aws_vpc" "by_tag" {
  count = var.vpc_id == "" ? 1 : 0
  
  tags = {
    Name = var.vpc_name_tag
  }
}

locals {
  vpc_id = var.vpc_id != "" ? data.aws_vpc.existing[0].id : data.aws_vpc.by_tag[0].id
}

data "aws_subnets" "all" {
  filter {
    name   = "vpc-id"
    values = [local.vpc_id]
  }
}

data "aws_route_tables" "all" {
  vpc_id = local.vpc_id
}

locals {
  # より簡単な方法：Internet Gatewayを持つルートテーブルを探す
  route_tables_with_routes = {
    for rt_id in data.aws_route_tables.all.ids :
    rt_id => data.aws_route_table.all_tables[rt_id]
  }

  # Internet Gatewayを持つルートテーブル（パブリック）
  public_route_table_ids = [
    for rt_id, rt in local.route_tables_with_routes :
    rt_id if length([
      for route in rt.routes :
      route if route.gateway_id != null && startswith(route.gateway_id, "igw-")
    ]) > 0
  ]

  # NAT Gatewayを持つルートテーブル（プライベート）
  private_route_table_ids = [
    for rt_id, rt in local.route_tables_with_routes :
    rt_id if length([
      for route in rt.routes :
      route if route.nat_gateway_id != null
    ]) > 0
  ]

  # パブリックサブネット（最低限2つのAZに分散させる）
  public_subnet_ids = slice(
    flatten([
      for rt_id in local.public_route_table_ids : [
        for assoc in data.aws_route_table.all_tables[rt_id].associations :
        assoc.subnet_id if assoc.subnet_id != ""
      ]
    ]),
    0,
    min(2, length(flatten([
      for rt_id in local.public_route_table_ids : [
        for assoc in data.aws_route_table.all_tables[rt_id].associations :
        assoc.subnet_id if assoc.subnet_id != ""
      ]
    ])))
  )

  # プライベートサブネット（最低限2つのAZに分散させる）
  # プライベートサブネットがない場合はパブリックサブネットを使用
  private_subnet_candidates = flatten([
    for rt_id in local.private_route_table_ids : [
      for assoc in data.aws_route_table.all_tables[rt_id].associations :
      assoc.subnet_id if assoc.subnet_id != ""
    ]
  ])
  
  private_subnet_ids = length(local.private_subnet_candidates) > 0 ? slice(
    local.private_subnet_candidates,
    0,
    min(2, length(local.private_subnet_candidates))
  ) : local.public_subnet_ids
}

data "aws_route_table" "all_tables" {
  for_each = toset(data.aws_route_tables.all.ids)
  route_table_id = each.key
}

# ------------------------------------------------------------------------------
# ECR (Elastic Container Registry)
# ------------------------------------------------------------------------------
resource "aws_ecr_repository" "frontend" {
  name                 = "${var.project_name}-frontend-repo"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-frontend-repo"
  }
}

# ------------------------------------------------------------------------------
# CloudWatch Log Group
# ------------------------------------------------------------------------------
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}-frontend-${random_id.deployment_suffix.hex}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-frontend-ecs-logs"
  }
}

# ------------------------------------------------------------------------------
# IAM Roles & Policies
# ------------------------------------------------------------------------------
data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
  }
}
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.project_name}-frontend-ecs-exec-role-${random_id.deployment_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.project_name}-frontend-ecs-task-role-${random_id.deployment_suffix.hex}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy" "secrets_manager_access" {
  name = "${var.project_name}-secrets-access"
  role = aws_iam_role.ecs_task_execution_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "secretsmanager:GetSecretValue",
        Resource = aws_secretsmanager_secret.app_secrets.arn
      }
    ]
  })
}

# ------------------------------------------------------------------------------
# Secrets Manager
# ------------------------------------------------------------------------------
resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${var.project_name}/frontend/app-secrets-${random_id.deployment_suffix.hex}"
  description = "Application secrets for ${var.project_name} frontend"
}

# Secrets Managerの値は ./scripts/update-secrets.sh で管理
# Terraformでは機密情報を管理しない
resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    # 公開情報のみTerraformで管理
    AUTH0_ISSUER_BASE_URL = var.auth0_issuer_base_url
    AUTH0_DOMAIN         = var.auth0_domain
    AUTH0_CLIENT_ID      = var.auth0_client_id
    AUTH0_AUDIENCE       = var.auth0_audience
    # 機密情報は ./scripts/update-secrets.sh で管理
    AUTH0_CLIENT_SECRET  = "MANAGED_BY_SCRIPT"
    AUTH0_SECRET         = "MANAGED_BY_SCRIPT"
    AUTH0_M2M_CLIENT_ID  = "MANAGED_BY_SCRIPT"
    AUTH0_M2M_CLIENT_SECRET = "MANAGED_BY_SCRIPT"
    AUTH0_CONNECTION_NAME = "MANAGED_BY_SCRIPT"
  })
  
  # 既存のSecrets Managerの機密情報を保護
  lifecycle {
    ignore_changes = [secret_string]
  }
}

# ------------------------------------------------------------------------------
# Security Groups
# ------------------------------------------------------------------------------
resource "aws_security_group" "lb" {
  name        = "${var.project_name}-frontend-lb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = local.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-frontend-ecs-tasks-sg"
  description = "Allow traffic from ALB to ECS tasks"
  vpc_id      = local.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = [aws_security_group.lb.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ------------------------------------------------------------------------------
# ALB (Application Load Balancer)
# ------------------------------------------------------------------------------
resource "aws_lb" "main" {
  name               = "${var.project_name}-frontend-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = local.public_subnet_ids
  
  tags = merge(var.tags, {
    Name = "${var.project_name}-frontend-lb"
  })
}

resource "aws_lb_target_group" "main" {
  name        = "${var.project_name}-frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = local.vpc_id
  target_type = "ip"
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200,307"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}

# ------------------------------------------------------------------------------
# ECS (Elastic Container Service)
# ------------------------------------------------------------------------------
# 既存ECSクラスターの検索または新規作成
data "aws_ecs_cluster" "existing" {
  count        = var.use_existing_ecs_cluster ? 1 : 0
  cluster_name = var.existing_ecs_cluster_name
}

resource "aws_ecs_cluster" "main" {
  count = var.use_existing_ecs_cluster ? 0 : 1
  name  = "${var.project_name}-${var.environment}-cluster"
  
  tags = merge(var.tags, {
    Name = "${var.project_name}-${var.environment}-cluster"
  })
}

locals {
  ecs_cluster_id   = var.use_existing_ecs_cluster ? data.aws_ecs_cluster.existing[0].id : aws_ecs_cluster.main[0].id
  ecs_cluster_name = var.use_existing_ecs_cluster ? var.existing_ecs_cluster_name : aws_ecs_cluster.main[0].name
}

resource "aws_ecs_task_definition" "main" {
  family                   = "${var.project_name}-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-container"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      secrets = [
        { name = "AUTH0_ISSUER_BASE_URL", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_ISSUER_BASE_URL::" },
        { name = "AUTH0_DOMAIN", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_DOMAIN::" },
        { name = "AUTH0_CLIENT_ID", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_CLIENT_ID::" },
        { name = "AUTH0_CLIENT_SECRET", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_CLIENT_SECRET::" },
        { name = "AUTH0_AUDIENCE", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_AUDIENCE::" },
        { name = "AUTH0_SECRET", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_SECRET::" },
        { name = "AUTH0_M2M_CLIENT_ID", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_M2M_CLIENT_ID::" },
        { name = "AUTH0_M2M_CLIENT_SECRET", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_M2M_CLIENT_SECRET::" },
        { name = "AUTH0_CONNECTION_NAME", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_CONNECTION_NAME::" }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "API_BASE_URL", value = var.api_base_url },
        { name = "AUTH0_BASE_URL", value = "https://${aws_cloudfront_distribution.main.domain_name}" },
        { name = "APP_BASE_URL", value = "https://${aws_cloudfront_distribution.main.domain_name}" }
      ]
    }
  ])
}

resource "aws_ecs_service" "main" {
  name            = "${var.project_name}-frontend-service"
  cluster         = local.ecs_cluster_id
  task_definition = aws_ecs_task_definition.main.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = local.public_subnet_ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "${var.project_name}-container"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}

# ------------------------------------------------------------------------------
# S3 for Static Assets
# ------------------------------------------------------------------------------
resource "aws_s3_bucket" "static_assets" {
  bucket = "${var.project_name}-static-assets-${random_id.deployment_suffix.hex}"
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket                  = aws_s3_bucket.static_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3バケットの暗号化
resource "aws_s3_bucket_server_side_encryption_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3バケットのバージョニング
resource "aws_s3_bucket_versioning" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3バケットのライフサイクルポリシー
resource "aws_s3_bucket_lifecycle_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    id     = "delete-old-versions"
    status = "Enabled"
    
    filter {
      prefix = ""
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_policy" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action    = "s3:GetObject",
        Effect    = "Allow",
        Resource  = "${aws_s3_bucket.static_assets.arn}/*",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })
}

# ------------------------------------------------------------------------------
# CloudFront
# ------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "${var.project_name}-oac-${random_id.deployment_suffix.hex}"
  description                       = "OAC for ${var.project_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "main" {
  comment = "${var.project_name} Distribution"
  enabled = true
  
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "alb-${var.project_name}"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_read_timeout    = 60
      origin_keepalive_timeout = 5
    }
  }

  origin {
    domain_name              = aws_s3_bucket.static_assets.bucket_regional_domain_name
    origin_id                = "s3-${var.project_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  default_cache_behavior {
    target_origin_id       = "alb-${var.project_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    
    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Host", "CloudFront-Viewer-Country", "CloudFront-Is-Mobile-Viewer"]
      cookies {
        forward = "all"
      }
    }
    
    # Lambda@Edge関数の関連付け（セキュリティヘッダー追加）
    # lambda_function_association {
    #   event_type   = "origin-response"
    #   lambda_arn   = aws_lambda_function.security_headers.qualified_arn
    #   include_body = false
    # }
    
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 31536000
  }

  ordered_cache_behavior {
    path_pattern           = "/_next/static/*"
    target_origin_id       = "alb-${var.project_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    
    forwarded_values {
      query_string = false
      headers      = ["Host"]
      cookies {
        forward = "none"
      }
    }
    
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
  }
  
  ordered_cache_behavior {
    path_pattern           = "/images/*"
    target_origin_id       = "s3-${var.project_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    min_ttl                = 0
    default_ttl            = 604800
    max_ttl                = 31536000
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
      # 必要に応じて地域制限を追加
      # restriction_type = "whitelist"
      # locations        = ["JP", "US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }
  
  # カスタムエラーページ
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/403.html"
  }
  
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/404.html"
  }
  
  # ログ設定（オプション）
  # logging_config {
  #   include_cookies = false
  #   bucket          = aws_s3_bucket.logs.bucket_domain_name
  #   prefix          = "cloudfront/"
  # }
  
  web_acl_id = aws_wafv2_web_acl.main.arn
}

# ------------------------------------------------------------------------------
# WAF (Web Application Firewall)
# ------------------------------------------------------------------------------

# リソース名重複防止用のランダムID
resource "random_id" "deployment_suffix" {
  byte_length = 4
}

# WAF名前重複防止用のランダムID（継続性のため別途定義）
resource "random_id" "waf_suffix" {
  byte_length = 4
}

resource "aws_wafv2_web_acl" "main" {
  provider    = aws.virginia
  name        = "${var.project_name}-frontend-waf-${random_id.waf_suffix.hex}"
  scope       = "CLOUDFRONT"
  description = "WAF for ${var.project_name} frontend"

  default_action {
    allow {}
  }

            visibility_config {
            cloudwatch_metrics_enabled = true
            metric_name                = "${var.project_name}-Frontend-WebACL"
            sampled_requests_enabled   = true
          }

  # ルール1: AWS管理ルール - 一般的な脆弱性対策
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
        
        rule_action_override {
          name = "SizeRestrictions_BODY"
          action_to_use {
            allow {}
          }
        }
        
        rule_action_override {
          name = "GenericRFI_BODY"
          action_to_use {
            allow {}
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }
  
  # ルール2: AWS管理ルール - 既知の不正な入力
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-KnownBadInputs"
      sampled_requests_enabled   = true
    }
  }
  
  # ルール3: レート制限
  rule {
    name     = "RateLimitRule"
    priority = 3
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-RateLimit"
      sampled_requests_enabled   = true
    }
  }
  
  # ルール4: 地理的制限（オプション）
  # rule {
  #   name     = "GeoRestriction"
  #   priority = 4
  #   action {
  #     block {}
  #   }
  #   statement {
  #     geo_match_statement {
  #       country_codes = ["CN", "RU", "KP"]  # ブロックする国のコード
  #     }
  #   }
  #   visibility_config {
  #     cloudwatch_metrics_enabled = true
  #     metric_name                = "${var.project_name}-GeoBlock"
  #     sampled_requests_enabled   = true
  #   }
  # }
  
  # ルール5: SQLインジェクション対策
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 5
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesSQLiRuleSet"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-SQLi"
      sampled_requests_enabled   = true
    }
  }
} 