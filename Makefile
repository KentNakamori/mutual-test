.PHONY: help setup lint lint-fix test docker-init docker-build docker-push deploy tf-init tf-plan tf-apply tf-destroy tf-outputs dev-start dev-stop dev-logs dev-status dev-logs-follow api-info

# ==============================================================================
# VARIABLES
# ==============================================================================
ECR_REPOSITORY_URL ?= $(shell cd terraform && terraform output -raw ecr_repository_url 2>/dev/null || echo "")
ECS_CLUSTER_NAME ?= $(shell cd terraform && terraform output -raw ecs_cluster_name 2>/dev/null || echo "")
ECS_SERVICE_NAME ?= $(shell cd terraform && terraform output -raw ecs_service_name 2>/dev/null || echo "")
AWS_REGION ?= ap-northeast-1
IMAGE_NAME = mutual-frontend
IMAGE_TAG ?= latest
DEV_IMAGE_NAME = mutual-frontend-dev

# ==============================================================================
# HELP
# ==============================================================================
help:
	@echo "利用可能なコマンド:"
	@echo ""
	@echo "  セットアップ:"
	@echo "    make setup           - 依存関係のインストールと.env.localファイルの初期設定を行う"
	@echo ""
	@echo "  開発 & テスト:"
	@echo "    make lint            - ESLintを使ってコードの静的解析を実行する"
	@echo "    make lint-fix        - ESLintの自動修正を実行する"
	@echo "    make test            - テストを実行する"
	@echo ""
	@echo "  🚀 統合開発環境:"
	@echo "    make dev-start       - フロントエンド開発環境を起動（バックエンドと連携）"
	@echo "    make dev-stop        - フロントエンド開発環境を停止・削除"
	@echo "    make dev-logs        - フロントエンドコンテナのログを表示"
	@echo "    make dev-logs-follow - フロントエンドコンテナのログを常に監視（Ctrl+Cで終了）"
	@echo "    make dev-status      - フロントエンドコンテナの状況を確認"
	@echo ""

	@echo "  📝 開発環境の起動手順:"
	@echo "    1. バックエンドリポジトリで 'make dev-start' を実行"
	@echo "    2. このリポジトリで 'make dev-start' を実行"
	@echo ""
	@echo "  AWS & デプロイ:"
	@echo "    make docker-init     - Docker buildxビルダーを初期化する"
	@echo "    make docker-build    - AWS用Dockerイメージをビルドする"
	@echo "    make docker-push     - DockerイメージをECRにプッシュする"
	@echo "    make deploy          - ECRプッシュ + ECS強制デプロイを実行する"
	@echo "    make deploy-full     - インフラ構築 + 機密情報設定 + アプリデプロイの全自動実行"
	@echo "    make deploy-check    - デプロイ設定の確認"
	@echo ""
	@echo "  Terraform (インフラ管理):"
	@echo "    make tf-init         - Terraformを初期化する"
	@echo "    make tf-plan         - Terraformの実行計画を表示する"
	@echo "    make tf-apply        - Terraformでインフラを構築・変更する"
	@echo "    make tf-destroy      - Terraformで作成したインフラを全て削除する"
	@echo "    make tf-outputs      - Terraformの出力値を表示する"
	@echo "    make api-info        - API接続情報を表示する"

# ==============================================================================
# SETUP
# ==============================================================================
setup:
	@echo "📦 依存関係をインストールします..."
	npm install
	@echo "📄 .env.localファイルを作成します..."
	@if [ ! -f .env.local ]; then \
		echo "# Next.js Environment Variables" > .env.local; \
		echo "NODE_ENV=development" >> .env.local; \
		echo "NEXT_TELEMETRY_DISABLED=1" >> .env.local; \
		echo "" >> .env.local; \
		echo "# Auth0 Configuration" >> .env.local; \
		echo "AUTH0_SECRET=$$(openssl rand -hex 32)" >> .env.local; \
		echo "AUTH0_BASE_URL=http://localhost:3000" >> .env.local; \
		echo "AUTH0_ISSUER_BASE_URL=https://dev-ldw81lf4gyh8azw6.jp.auth0.com/" >> .env.local; \
		echo "AUTH0_CLIENT_ID=Y5p4Fn2rllKLs4M2zoIShqIhn4JdKZzP" >> .env.local; \
		echo "AUTH0_CLIENT_SECRET=RWAG_gPJ-1ZPoXfkefvFMPSlhRL7e86iM_hHRDsJNb_FLkMwfyWdGccFCMOopoA5" >> .env.local; \
		echo "AUTH0_AUDIENCE=https://api.local.dev" >> .env.local; \
		echo "" >> .env.local; \
		echo "# Auth0 Machine to Machine Configuration" >> .env.local; \
		echo "AUTH0_M2M_CLIENT_ID=dPWR7NFNU0eOYqfV4gbGUb1HfZbaToSc" >> .env.local; \
		echo "AUTH0_M2M_CLIENT_SECRET=PqbseOB7BENdjNgRT2tAYtb7M9tSCeMj4qUv2PhDXg65BJ45_Ke7LsiqIXz2EKOa" >> .env.local; \
		echo "AUTH0_CONNECTION_NAME=Corporate-DB" >> .env.local; \
		echo "" >> .env.local; \
		echo "# API Configuration" >> .env.local; \
		echo "API_BASE_URL=http://localhost:8000" >> .env.local; \
		echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3000" >> .env.local; \
		echo ".env.localファイルを作成しました。Auth0とAPI設定を編集してください。"; \
	else \
		echo ".env.localファイルは既に存在します。"; \
	fi
	@echo "✅ セットアップが完了しました！"

# ==============================================================================
# DEVELOPMENT & TESTING
# ==============================================================================
lint:
	@echo "🔍 ESLintでコードをチェックします..."
	npm run lint

lint-fix:
	@echo "🔧 ESLintの自動修正を実行します..."
	@echo "1. 未使用のimportを削除します..."
	npx eslint --fix "src/**/*.{ts,tsx}" --rule "unused-imports/no-unused-imports: error" || true
	@echo "2. 未使用の変数を修正します..."
	npx eslint --fix "src/**/*.{ts,tsx}" --rule "unused-imports/no-unused-vars: warn" || true
	@echo "3. その他の自動修正可能な問題を修正します..."
	npx eslint --fix "src/**/*.{ts,tsx}" || true
	@echo "✅ 自動修正が完了しました。残りの警告は手動で修正が必要です。"

test:
	@echo "🧪 テストを実行します..."
	npm test

# ==============================================================================
# 統合開発環境
# ==============================================================================
dev-start:
	@echo "完全な開発環境を起動します（Frontend + Backend連携）..."
	@echo "開発用Dockerネットワーク 'mutual-network' を作成します..."
	@docker network inspect mutual-network >/dev/null 2>&1 || docker network create mutual-network
	@echo "開発用Dockerイメージをビルドします..."
	@docker build -t $(DEV_IMAGE_NAME):$(IMAGE_TAG) -f Dockerfile.dev .
	@echo "フロントエンド開発環境を起動します..."
	@docker rm -f mutual-frontend >/dev/null 2>&1 || true
	@docker run -d \
		--name mutual-frontend \
		--network mutual-network \
		-p 3000:3000 \
		--env-file .env.local \
		-e DOCKER_ENV=true \
		-e API_BASE_URL=http://mutual-backend:8000 \
		-v $(PWD)/src:/app/src \
		-v $(PWD)/public:/app/public \
		$(DEV_IMAGE_NAME):$(IMAGE_TAG)
	@echo "✅ フロントエンド開発環境が起動しました！"
	@echo ""
	@echo "📋 サービス情報:"
	@echo "  🔗 Frontend:          http://localhost:3000"
	@echo "  🔗 Backend API:       http://mutual-backend:8000"
	@echo ""
	@echo "📝 バックエンド起動コマンド（バックエンドリポジトリで実行）:"
	@echo "  make dev-start"
	@echo ""
	@echo "📝 ログを常に監視するには:"
	@echo "  make dev-logs-follow"

dev-stop:
	@echo "開発環境のコンテナを停止・削除します..."
	@docker rm -f mutual-frontend >/dev/null 2>&1 || true
	@echo "✅ 開発環境のコンテナを停止しました。"

dev-logs:
	@echo "=== Frontend Logs ==="
	@docker logs mutual-frontend --tail 20 2>/dev/null || echo "Frontend コンテナが見つかりません"

dev-logs-follow:
	@echo "🔍 フロントエンドのログを常に監視します（Ctrl+Cで終了）..."
	@echo "=================================================="
	@docker logs -f mutual-frontend 2>/dev/null || echo "❌ Frontend コンテナが見つかりません。'make dev-start' でコンテナを起動してください。"

dev-status:
	@echo "🔍 開発環境の状況:"
	@echo ""
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" --filter "name=mutual-frontend" || echo "コンテナが見つかりません"
	@echo ""
	@echo "🌐 ネットワーク情報:"
	@docker network inspect mutual-network --format "{{range .Containers}}{{.Name}}: {{.IPv4Address}}\n{{end}}" 2>/dev/null || echo "mutual-network が見つかりません"

# ==============================================================================
# AWS & DEPLOYMENT
# ==============================================================================
docker-init:
	@echo "Docker buildxビルダーを初期化します..."
	@docker buildx inspect multiplatform-builder >/dev/null 2>&1 || \
	docker buildx create --name multiplatform-builder --platform linux/amd64,linux/arm64
	@docker buildx use multiplatform-builder
	@docker buildx inspect --bootstrap

docker-build:
	@echo "AWS用Dockerイメージをビルドします..."
	@if [ -z "$(ECR_REPOSITORY_URL)" ]; then \
		echo "❌ ECR_REPOSITORY_URLが設定されていません。"; \
		echo "   terraform outputから取得するか、手動で設定してください:"; \
		echo "   make ECR_REPOSITORY_URL=your-ecr-url docker-build"; \
		exit 1; \
	fi
	docker buildx build --platform linux/amd64 -t $(ECR_REPOSITORY_URL):$(IMAGE_TAG) -f Dockerfile . --push

docker-push: docker-init docker-build
	@echo "✅ DockerイメージをECRにプッシュしました: $(ECR_REPOSITORY_URL):$(IMAGE_TAG)"

deploy: docker-push
	@echo "ECSサービスを強制再デプロイします..."
	@if [ -z "$(ECS_CLUSTER_NAME)" ] || [ -z "$(ECS_SERVICE_NAME)" ]; then \
		echo "❌ ECSクラスター名またはサービス名が取得できません。"; \
		echo "   terraform apply を先に実行してください"; \
		exit 1; \
	fi
	AWS_PROFILE=admin aws ecs update-service \
		--cluster $(ECS_CLUSTER_NAME) \
		--service $(ECS_SERVICE_NAME) \
		--force-new-deployment
	@echo "✅ デプロイが開始されました。AWSコンソールで進行状況を確認してください。"

deploy-check:
	@echo "🔍 デプロイ設定の確認..."
	@echo ""
	@echo "📋 環境変数:"
	@echo "  AWS_REGION: $(AWS_REGION)"
	@echo "  ECR_REPOSITORY_URL: $(ECR_REPOSITORY_URL)"
	@echo "  ECS_CLUSTER_NAME: $(ECS_CLUSTER_NAME)"
	@echo "  ECS_SERVICE_NAME: $(ECS_SERVICE_NAME)"
	@echo ""
	@echo "🔧 必要なツール:"
	@command -v terraform >/dev/null 2>&1 && echo "  ✅ Terraform: インストール済み" || echo "  ❌ Terraform: 未インストール"
	@command -v docker >/dev/null 2>&1 && echo "  ✅ Docker: インストール済み" || echo "  ❌ Docker: 未インストール"
	@command -v aws >/dev/null 2>&1 && echo "  ✅ AWS CLI: インストール済み" || echo "  ❌ AWS CLI: 未インストール"
	@echo ""
	@echo "🔐 AWS認証:"
	@AWS_PROFILE=admin aws sts get-caller-identity >/dev/null 2>&1 && echo "  ✅ AWS認証: 正常" || echo "  ❌ AWS認証: 失敗"
	@echo ""
	@echo "📁 ファイル確認:"
	@[ -f terraform/terraform.tfvars ] && echo "  ✅ terraform.tfvars: 存在" || echo "  ⚠️  terraform.tfvars: 未作成"
	@[ -f .env.local ] && echo "  ✅ .env.local: 存在" || echo "  ⚠️  .env.local: 未作成"

deploy-full:
	@echo "🚀 フル自動デプロイを開始します..."
	@echo ""
	@echo "⚠️  この操作では以下が実行されます:"
	@echo "   1. Terraformでインフラを構築"
	@echo "   2. 機密情報設定スクリプトを実行"
	@echo "   3. Dockerイメージをビルド・プッシュ"
	@echo "   4. ECSサービスを更新"
	@echo ""
	@read -p "続行しますか？ (y/N): " confirm && [ "$$confirm" = "y" ]
	@echo ""
	@echo "ステップ1: インフラ構築..."
	@$(MAKE) tf-apply
	@echo ""
	@echo "ステップ2: 機密情報設定..."
	@echo "（次の画面でAuth0の情報を入力してください）"
	@./scripts/update-secrets.sh
	@echo ""
	@echo "ステップ3: アプリケーションデプロイ..."
	@$(MAKE) deploy
	@echo ""
	@echo "ステップ4: アクセスURL確認..."
	@cd terraform && AWS_PROFILE=admin terraform output application_url
	@echo ""
	@echo "🎉 デプロイが完了しました！"

# ==============================================================================
# TERRAFORM
# ==============================================================================
tf-init:
	@echo "Terraformを初期化します..."
	cd terraform && AWS_PROFILE=admin terraform init

tf-plan:
	@echo "Terraformの実行計画を作成します..."
	cd terraform && AWS_PROFILE=admin terraform plan

tf-apply:
	@echo "Terraformでインフラを適用します..."
	cd terraform && AWS_PROFILE=admin terraform apply -auto-approve

tf-destroy:
	@echo "Terraformでインフラを破棄します..."
	@echo "⚠️  この操作は全てのAWSリソースを削除します。本当に実行しますか？"
	@read -p "続行するには 'yes' と入力してください: " confirm && [ "$$confirm" = "yes" ]
	cd terraform && AWS_PROFILE=admin terraform destroy

tf-outputs:
	@echo "📊 Terraform出力情報:"
	@echo "========================="
	cd terraform && terraform output

# API接続情報の表示
api-info:
	@echo "🌐 API接続情報:"
	@echo "========================="
	@echo "ALB DNS名:"
	@cd terraform && terraform output -raw alb_dns_name
	@echo ""
	@echo "CloudFront DNS名:"
	@cd terraform && terraform output -raw cloudfront_domain_name
	@echo ""
	@echo "推奨API_BASE_URL (CloudFront経由):"
	@cd terraform && terraform output -raw api_endpoint_cloudfront
	@echo ""
	@echo "代替API_BASE_URL (ALB直接):"
	@cd terraform && terraform output -raw api_endpoint_alb



.DEFAULT_GOAL := help 