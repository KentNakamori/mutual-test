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
data "aws_vpc" "existing" {
  id = var.vpc_id
}

data "aws_subnets" "all" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.existing.id]
  }
}

data "aws_route_tables" "all" {
  vpc_id = data.aws_vpc.existing.id
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
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7

  tags = {
    Name = "${var.project_name}-ecs-logs"
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
  name               = "${var.project_name}-frontend-ecs-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.project_name}-frontend-ecs-task-role"
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
  name        = "${var.project_name}/frontend/app-secrets"
  description = "Application secrets for ${var.project_name} frontend"
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    AUTH0_ISSUER_BASE_URL = "https://dev-ldw81lf4gyh8azw6.jp.auth0.com/"
    AUTH0_DOMAIN         = "dev-ldw81lf4gyh8azw6.jp.auth0.com"
    AUTH0_CLIENT_ID      = "Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP"
    AUTH0_CLIENT_SECRET  = "RWAG_gPJ-1ZPoXfkefvFMPSlhRL7e86iM_hHRDsJNb_FLkMwfyWdGccFCMOopoA5"
    AUTH0_AUDIENCE       = "https://api.local.dev"
    AUTH0_SECRET         = "this-is-a-secret-value-at-least-32-characters-long-for-production-use"
  })
}

# ------------------------------------------------------------------------------
# Security Groups
# ------------------------------------------------------------------------------
resource "aws_security_group" "lb" {
  name        = "${var.project_name}-lb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = data.aws_vpc.existing.id

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
  vpc_id      = data.aws_vpc.existing.id

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
  name               = "${var.project_name}-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb.id]
  subnets            = local.public_subnet_ids
}

resource "aws_lb_target_group" "main" {
  name        = "${var.project_name}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.existing.id
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
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
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
        { name = "AUTH0_SECRET", valueFrom = "${aws_secretsmanager_secret.app_secrets.arn}:AUTH0_SECRET::" }
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
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
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
  bucket = "${var.project_name}-static-assets"
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket                  = aws_s3_bucket.static_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
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
  name                              = "${var.project_name}-oac"
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
      headers      = ["Authorization", "Host"]
      cookies {
        forward = "all"
      }
    }
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
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  web_acl_id = aws_wafv2_web_acl.main.arn
}

# ------------------------------------------------------------------------------
# WAF (Web Application Firewall)
# ------------------------------------------------------------------------------
resource "aws_wafv2_web_acl" "main" {
  provider    = aws.virginia
  name        = "${var.project_name}-waf"
  scope       = "CLOUDFRONT"
  description = "WAF for ${var.project_name}"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-WebACL"
    sampled_requests_enabled   = true
  }

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
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-CommonRuleSet"
      sampled_requests_enabled   = true
    }
  }
} 