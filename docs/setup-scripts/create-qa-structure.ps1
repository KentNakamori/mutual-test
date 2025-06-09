# QA管理システムのディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app/qa/id",
    "components/features/qa/QAList",
    "components/features/qa/QADetail",
    "components/features/qa/QASearch",
    "components/common/qa"
)

# ベースディレクトリを作成
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

# サブディレクトリを作成
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path "$baseDir/$dir" | Out-Null
}

# ファイルの作成
$files = @{
    # App Pages
    "app/qa/page.tsx" = "export default function QAListPage() { return <div>QA List Page</div> }"
    "app/qa/id/page.tsx" = "export default function QADetailPage() { return <div>QA Detail Page</div> }"

    # QAList Components
    "components/features/qa/QAList/QAList.tsx" = ""
    "components/features/qa/QAList/QAListHeader.tsx" = ""
    "components/features/qa/QAList/QAListFilters.tsx" = ""
    "components/features/qa/QAList/QAListItem.tsx" = ""

    # QADetail Components
    "components/features/qa/QADetail/QADetail.tsx" = ""
    "components/features/qa/QADetail/QAMetadata.tsx" = ""
    "components/features/qa/QADetail/QAResponseForm.tsx" = ""

    # QASearch Components
    "components/features/qa/QASearch/QASearchBar.tsx" = ""
    "components/features/qa/QASearch/QASearchResults.tsx" = ""

    # Common QA Components
    "components/common/qa/QAStatusBadge.tsx" = ""
    "components/common/qa/QAPriorityTag.tsx" = ""
    "components/common/qa/QATimelineEvent.tsx" = ""
}

# ファイルを作成
foreach ($file in $files.GetEnumerator()) {
    $file.Value | Out-File -Force "$baseDir/$($file.Key)" -Encoding UTF8
}

Write-Host "QA management system directory structure has been created successfully."