.PHONY: help setup dev build test clean lint docker-build docker-run tf-init tf-plan tf-apply tf-destroy deploy backup

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
	@echo "    make dev             - Next.js開発サーバーを起動する (ホットリロード)"
	@echo "    make dev-with-backend - バックエンドと連携した開発サーバーを起動する"
	@echo "    make build           - 本番用ビルドを実行する"
	@echo "    make lint            - ESLintを使ってコードの静的解析を実行する"
	@echo "    make test            - テストを実行する"
	@echo "    make clean           - ビルドキャッシュをクリーンアップする"
	@echo ""
	@echo "  Docker:"
	@echo "    make docker-build         - Next.jsアプリケーションのDockerイメージをビルドする"
	@echo "    make docker-run           - mutual-networkでDockerコンテナを起動する"
	@echo "    make docker-stop          - Dockerコンテナを停止・削除する"
	@echo "    make docker-restart       - Dockerコンテナを再起動する"
	@echo "    make docker-logs          - フロントエンドコンテナのログを表示する"
	@echo "    make docker-status        - 開発環境のコンテナ状況を確認する"
	@echo "    make docker-network-check - バックエンドとの接続をテストする"
	@echo ""
	@echo "  Terraform (インフラ管理):"
	@echo "    make tf-init         - Terraformを初期化する"
	@echo "    make tf-plan         - Terraformの実行計画を表示する"
	@echo "    make tf-apply        - Terraformでインフラを構築・変更する"
	@echo "    make tf-destroy      - Terraformで作成したインフラを全て削除する"
	@echo "    make tf-output       - Terraformの出力値を表示する"
	@echo ""
	@echo "  デプロイ & 運用:"
	@echo "    make deploy          - アプリケーションをデプロイする"
	@echo "    make set-secrets     - AWS Secrets Managerにアプリケーションシークレットを設定する"
	@echo "    make aws-status      - AWSリソースの状態を確認する"
	@echo "    make logs            - ECSタスクのログを表示する"
	@echo "    make backup          - 重要な設定ファイルをバックアップする"

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
		echo "AUTH0_ISSUER_BASE_URL=https://YOUR_AUTH0_DOMAIN" >> .env.local; \
		echo "AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID" >> .env.local; \
		echo "AUTH0_CLIENT_SECRET=YOUR_AUTH0_CLIENT_SECRET" >> .env.local; \
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
dev:
	@echo "🚀 開発サーバーを起動します (ホットリロード)..."
	npm run dev

dev-with-backend:
	@echo "🚀 バックエンドと連携した開発サーバーを起動します..."
	@echo "📡 API_BASE_URL を http://localhost:8000 に設定します"
	@if ! docker ps | grep -q mutual-backend; then \
		echo "❌ バックエンドが起動していません"; \
		echo "バックエンドリポジトリで 'make dev-start' を実行してください"; \
		echo "または、単独で開発する場合は 'make dev' を使用してください"; \
		exit 1; \
	fi
	@echo "✅ バックエンドとの連携を確認しました"
	API_BASE_URL=http://localhost:8000 npm run dev

build:
	@echo "📦 本番用ビルドを実行します..."
	npm run build

lint:
	@echo "🔍 ESLintでコードをチェックします..."
	npm run lint

test:
	@echo "🧪 テストを実行します..."
	npm test

clean:
	@echo "🧹 ビルドキャッシュをクリーンアップします..."
	rm -rf .next
	rm -rf out
	rm -rf node_modules/.cache
	rm -f tsconfig.tsbuildinfo

# ==============================================================================
# DOCKER
# ==============================================================================
docker-build:
	@echo "🐳 Dockerイメージをビルドします..."
	docker build -t mutual-frontend:latest .

docker-run:
	@echo "🚀 Dockerコンテナを起動します (ポート3000)..."
	@echo "📡 mutual-network ネットワークに接続します..."
	@echo "停止するには Ctrl+C を押してください。"
	docker run -d \
		--name mutual-frontend \
		--network mutual-network \
		-p 3000:3000 \
		--env-file .env.local \
		-e API_BASE_URL=http://mutual-backend:8000 \
		mutual-frontend:latest
	@echo "✅ フロントエンドコンテナが起動しました: http://localhost:3000"

docker-stop:
	@echo "🛑 Dockerコンテナを停止・削除します..."
	docker rm -f mutual-frontend 2>/dev/null || echo "コンテナ mutual-frontend は既に停止済みです"

docker-restart: docker-stop docker-run
	@echo "🔄 Dockerコンテナを再起動しました"

docker-logs:
	@echo "📋 フロントエンドコンテナのログを表示します..."
	docker logs mutual-frontend -f

docker-status:
	@echo "📊 開発環境の状況を確認します..."
	@echo "\n🐳 アクティブなコンテナ:"
	@docker ps --filter "name=mutual-frontend" --filter "name=mutual-backend" --filter "name=mongodb" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "コンテナが見つかりません"
	@echo "\n🌐 mutual-network の状況:"
	@docker network inspect mutual-network --format "{{range .Containers}}{{.Name}}: {{.IPv4Address}}\n{{end}}" 2>/dev/null || echo "⚠️  mutual-network が見つかりません。バックエンドで 'make dev-start' を実行してください"

docker-network-check:
	@echo "🔍 ネットワーク接続をテストします..."
	@if docker network ls | grep -q mutual-network; then \
		echo "✅ mutual-network が存在します"; \
		if docker ps | grep -q mutual-backend; then \
			echo "✅ mutual-backend コンテナが起動中です"; \
			if docker ps | grep -q mutual-frontend; then \
				echo "🧪 フロントエンド→バックエンド接続テスト:"; \
				docker exec mutual-frontend curl -s -o /dev/null -w "%{http_code}" http://mutual-backend:8000/ 2>/dev/null | grep -q 200 && echo "✅ 接続成功" || echo "❌ 接続失敗"; \
			else \
				echo "⚠️  mutual-frontend コンテナが起動していません"; \
			fi; \
		else \
			echo "❌ mutual-backend コンテナが起動していません"; \
		fi; \
	else \
		echo "❌ mutual-network が存在しません。バックエンドで 'make dev-start' を実行してください"; \
	fi

# ==============================================================================
# TERRAFORM
# ==============================================================================
tf-init:
	@echo "🏗️ Terraformを初期化します..."
	AWS_PROFILE=admin terraform -chdir=./terraform init

tf-plan:
	@echo "📋 Terraformの実行計画を作成します..."
	AWS_PROFILE=admin terraform -chdir=./terraform plan

tf-apply:
	@echo "🚀 Terraformでインフラを適用します..."
	AWS_PROFILE=admin terraform -chdir=./terraform apply --auto-approve

tf-destroy:
	@echo "🗑️ Terraformでインフラを破棄します..."
	@echo "⚠️  この操作は全てのAWSリソースを削除します。本当に実行しますか？"
	@read -p "続行するには 'yes' と入力してください: " confirm && [ "$$confirm" = "yes" ]
	AWS_PROFILE=admin terraform -chdir=./terraform destroy

tf-output:
	@echo "📊 Terraformの出力値を表示します..."
	AWS_PROFILE=admin terraform -chdir=./terraform output

# ==============================================================================
# DEPLOYMENT & OPERATIONS
# ==============================================================================
deploy: build
	@echo "🚀 アプリケーションをデプロイします..."
	git add .
	git commit -m "Deploy: $$(date '+%Y-%m-%d %H:%M:%S')" || echo "変更がありません"
	git push origin main

set-secrets:
	@echo "🔐 アプリケーションシークレットを設定します..."
	@echo "注意: terraform applyでシークレットリソースを作成済みである必要があります"
	@SECRET_NAME=$$(AWS_PROFILE=admin terraform -chdir=./terraform output -raw app_secrets_name 2>/dev/null) && \
	if [ -z "$$SECRET_NAME" ]; then \
		echo "❌ Terraformの出力からシークレット名を取得できません。先にterraform applyを実行してください"; \
		exit 1; \
	fi && \
	echo "シークレット名: $$SECRET_NAME" && \
	echo "以下のコマンドを実行してシークレット値を設定してください:" && \
	echo "AWS_PROFILE=admin aws secretsmanager put-secret-value --secret-id $$SECRET_NAME --secret-string '{\"AUTH0_SECRET\":\"your-secret\", \"AUTH0_DOMAIN\":\"your-domain\", \"AUTH0_CLIENT_ID\":\"your-client-id\", \"AUTH0_CLIENT_SECRET\":\"your-client-secret\"}'"

aws-status:
	@echo "☁️ AWS リソースの状態を確認します..."
	@echo "\n📦 ECR Repository:"
	@AWS_PROFILE=admin aws ecr describe-repositories \
		--repository-names mutual-test-repo \
		--query 'repositories[0].{Name:repositoryName,URI:repositoryUri,CreatedAt:createdAt}' \
		--output table 2>/dev/null || echo "リポジトリが見つかりません"
	@echo "\n🌐 CloudFront Distribution:"
	@AWS_PROFILE=admin aws cloudfront list-distributions \
		--query 'DistributionList.Items[?Comment==`mutual-test CloudFront Distribution`].{Id:Id,DomainName:DomainName,Status:Status}' \
		--output table 2>/dev/null || echo "ディストリビューションが見つかりません"
	@echo "\n🏗️ ECS Service:"
	@AWS_PROFILE=admin aws ecs describe-services \
		--cluster mutual-test-cluster \
		--services mutual-test-service \
		--query 'services[0].{Name:serviceName,Status:status,RunningCount:runningCount,DesiredCount:desiredCount}' \
		--output table 2>/dev/null || echo "ECSサービスが見つかりません"

logs:
	@echo "📋 ECSタスクのログを表示します..."
	@AWS_PROFILE=admin aws logs tail /ecs/mutual-test --follow --since 10m 2>/dev/null || echo "ログが見つかりません。先にデプロイを実行してください"

backup:
	@echo "💾 設定ファイルをバックアップします..."
	@mkdir -p backup/$$(date +%Y%m%d)
	@cp -r terraform backup/$$(date +%Y%m%d)/ 2>/dev/null || true
	@cp package.json backup/$$(date +%Y%m%d)/ 2>/dev/null || true
	@cp next.config.js backup/$$(date +%Y%m%d)/ 2>/dev/null || true
	@cp Dockerfile backup/$$(date +%Y%m%d)/ 2>/dev/null || true
	@cp .env.local backup/$$(date +%Y%m%d)/env.local.backup 2>/dev/null || true
	@echo "✅ バックアップが完了しました: backup/$$(date +%Y%m%d)/"

.DEFAULT_GOAL := help 