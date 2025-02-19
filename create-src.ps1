# src直下のディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app/users",
    "app/posts/[id]",
    "components/ui",
    "components/common",
    "components/features/users",
    "components/features/posts",
    "hooks",
    "libs",
    "types",
    "config",
    "mocks"
)

# ベースディレクトリを作成
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

# サブディレクトリを作成
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path "$baseDir/$dir" | Out-Null
}

Write-Host "Directory structure has been created successfully."