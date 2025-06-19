# セキュリティ推奨事項と改善点

## 現在のセキュリティ状態の評価

### ✅ 実装済みのセキュリティ機能

1. **ネットワークセキュリティ**
   - CloudFront経由でのHTTPS強制
   - WAF（Web Application Firewall）の実装
   - セキュリティグループによる適切なポート制限
   - VPC内でのプライベート通信

2. **認証・認可**
   - Auth0による認証基盤
   - Machine-to-Machine認証の実装
   - JWTトークンベースの認証

3. **機密情報管理**
   - AWS Secrets Managerによる暗号化管理
   - 環境変数からの機密情報分離
   - Terraformでの機密情報管理回避

4. **コンテナセキュリティ**
   - ECRでの脆弱性スキャン有効化
   - 最小権限のIAMロール設定
   - Fargateによるホスト管理の抽象化

## 🔴 緊急で対応すべきセキュリティ改善点

### 1. Terraform状態ファイルのリモート管理

現在、Terraformの状態ファイルがローカルに保存されています。これは重大なセキュリティリスクです。

```hcl
# terraform/backend.tf（新規作成）
terraform {
  backend "s3" {
    bucket         = "mutual-app-terraform-state"
    key            = "frontend/terraform.tfstate"
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

対応手順：
```bash
# S3バケットとDynamoDBテーブルの作成
aws s3api create-bucket \
  --bucket mutual-app-terraform-state \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

aws s3api put-bucket-versioning \
  --bucket mutual-app-terraform-state \
  --versioning-configuration Status=Enabled

aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Terraform backendの移行
cd terraform
terraform init -migrate-state
```

### 2. CloudFront のセキュリティヘッダー追加

```javascript
// terraform/cloudfront-security-headers.js
'use strict';

exports.handler = (event, context, callback) => {
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    headers['strict-transport-security'] = [{
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubdomains; preload'
    }];
    
    headers['content-security-policy'] = [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.auth0.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.auth0.com https://api.local.dev;"
    }];
    
    headers['x-content-type-options'] = [{
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    }];
    
    headers['x-frame-options'] = [{
        key: 'X-Frame-Options',
        value: 'DENY'
    }];
    
    headers['x-xss-protection'] = [{
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    }];
    
    headers['referrer-policy'] = [{
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    }];
    
    callback(null, response);
};
```

## 🟡 中期的に実装すべきセキュリティ改善

### 1. 監視とアラート設定

```bash
# CloudWatch アラームの設定スクリプト
cat > setup-monitoring.sh << 'EOF'
#!/bin/bash

# 1. 異常なAPI呼び出し数のアラート
aws cloudwatch put-metric-alarm \
  --alarm-name "mutual-app-high-api-calls" \
  --alarm-description "Alert when API calls exceed threshold" \
  --metric-name 4XXError \
  --namespace AWS/CloudFront \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# 2. WAFブロック数のアラート
aws cloudwatch put-metric-alarm \
  --alarm-name "mutual-app-waf-blocks" \
  --alarm-description "Alert on high WAF block rate" \
  --metric-name BlockedRequests \
  --namespace AWS/WAFV2 \
  --statistic Sum \
  --period 300 \
  --threshold 50 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1

# 3. ECSタスクの異常終了アラート
aws cloudwatch put-metric-alarm \
  --alarm-name "mutual-app-ecs-task-failures" \
  --alarm-description "Alert on ECS task failures" \
  --metric-name TaskCount \
  --namespace AWS/ECS \
  --statistic Average \
  --period 60 \
  --threshold 0.5 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 2
EOF

chmod +x setup-monitoring.sh
```

### 2. ネットワークアクセス制御の強化

```hcl
# terraform/waf-enhanced.tf
resource "aws_wafv2_ip_set" "allowed_ips" {
  name               = "${var.project_name}-allowed-ips"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"
  addresses          = var.allowed_ip_addresses  # 許可するIPアドレスのリスト
}

resource "aws_wafv2_rule_group" "custom_rules" {
  name     = "${var.project_name}-custom-rules"
  scope    = "CLOUDFRONT"
  capacity = 100

  rule {
    name     = "RateLimitRule"
    priority = 1
    
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
}
```

### 3. データ暗号化の強化

```hcl
# terraform/encryption.tf
# S3バケットの暗号化設定
resource "aws_s3_bucket_server_side_encryption_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3_key.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# KMSキーの作成
resource "aws_kms_key" "s3_key" {
  description             = "KMS key for S3 bucket encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true
}
```

## 🟢 長期的なセキュリティ戦略

### 1. ゼロトラストアーキテクチャへの移行

- すべての通信の暗号化
- マイクロセグメンテーション
- 継続的な認証と認可

### 2. DevSecOpsパイプライン

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
      
      - name: Run SAST with Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          generateSarif: true
      
      - name: Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'mutual-app'
          path: '.'
          format: 'HTML'
```

### 3. インシデント対応計画

```markdown
# incident-response-plan.md

## インシデント対応フロー

1. **検知** (15分以内)
   - CloudWatchアラートの確認
   - GuardDutyアラートの確認
   - WAFログの確認

2. **評価** (30分以内)
   - 影響範囲の特定
   - 重要度の判定
   - エスカレーション判断

3. **封じ込め** (1時間以内)
   - 影響を受けたリソースの隔離
   - 一時的なアクセス制限
   - 証拠の保全

4. **根絶** (4時間以内)
   - 脆弱性の修正
   - マルウェアの除去
   - 設定の修正

5. **回復** (8時間以内)
   - サービスの復旧
   - 監視の強化
   - 正常性の確認

6. **事後分析** (48時間以内)
   - インシデントレポート作成
   - 再発防止策の策定
   - プロセスの改善
```

## セキュリティチェックリスト

### 日次チェック
- [ ] CloudWatchログの異常確認
- [ ] WAFブロックログの確認
- [ ] ECRスキャン結果の確認

### 週次チェック
- [ ] IAMポリシーのレビュー
- [ ] セキュリティグループの監査
- [ ] 未使用リソースの確認

### 月次チェック
- [ ] Secrets Managerのローテーション
- [ ] パッチ適用状況の確認
- [ ] ペネトレーションテスト（四半期ごと）

### 年次チェック
- [ ] セキュリティポリシーの見直し
- [ ] 災害復旧訓練
- [ ] 外部セキュリティ監査

## コンプライアンス対応

### GDPR対応
- 個人情報の暗号化
- データ削除機能の実装
- プライバシーポリシーの整備

### SOC 2対応
- アクセスログの保存（90日以上）
- 変更管理プロセスの文書化
- 定期的な脆弱性評価

## 推奨ツール

1. **脆弱性スキャン**
   - Trivy
   - Grype
   - Snyk

2. **SAST/DAST**
   - Semgrep
   - OWASP ZAP
   - SonarQube

3. **モニタリング**
   - Datadog
   - New Relic
   - Elastic Security

## まとめ

セキュリティは継続的なプロセスです。このドキュメントは定期的に見直し、最新の脅威や技術に対応して更新してください。 