# typesディレクトリ構造を作成するスクリプト
$baseDir = "src/types"

# ディレクトリ構造の作成
$directories = @(
    "domain",
    "api",
    "components"
)

# typesディレクトリとサブディレクトリを作成
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path "$baseDir/$dir" | Out-Null
}

# domain配下のファイル作成
$domainFiles = @(
    "user.ts",
    "company.ts",
    "qa.ts",
    "chat.ts",
    "index.ts"
)

foreach ($file in $domainFiles) {
    New-Item -ItemType File -Force -Path "$baseDir/domain/$file" | Out-Null
}

# api配下のファイル作成
$apiFiles = @(
    "auth.ts",
    "user.ts",
    "company.ts",
    "qa.ts",
    "chat.ts",
    "index.ts"
)

foreach ($file in $apiFiles) {
    New-Item -ItemType File -Force -Path "$baseDir/api/$file" | Out-Null
}

# components配下のファイル作成
$componentFiles = @(
    "common.ts",
    "features.ts",
    "index.ts"
)

foreach ($file in $componentFiles) {
    New-Item -ItemType File -Force -Path "$baseDir/components/$file" | Out-Null
}

# utilities.ts作成
New-Item -ItemType File -Force -Path "$baseDir/utilities.ts" | Out-Null

Write-Host "Types directory structure has been created successfully."