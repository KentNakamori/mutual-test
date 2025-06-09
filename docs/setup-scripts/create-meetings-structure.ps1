# 投資家面談管理のディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app/investor-meetings/id",
    "components/features/investor-meetings/MeetingList",
    "components/features/investor-meetings/MeetingDetail",
    "components/features/investor-meetings/MeetingForm",
    "components/features/investor-meetings/shared",
    "components/common/layout"
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
    "app/investor-meetings/page.tsx" = "export default function MeetingsPage() { return <div>Meetings List Page</div> }"
    "app/investor-meetings/id/page.tsx" = "export default function MeetingDetailPage() { return <div>Meeting Detail Page</div> }"

    # MeetingList Components
    "components/features/investor-meetings/MeetingList/MeetingList.tsx" = ""
    "components/features/investor-meetings/MeetingList/MeetingCard.tsx" = ""
    "components/features/investor-meetings/MeetingList/MeetingFilter.tsx" = ""
    "components/features/investor-meetings/MeetingList/MeetingSort.tsx" = ""

    # MeetingDetail Components
    "components/features/investor-meetings/MeetingDetail/MeetingDetail.tsx" = ""
    "components/features/investor-meetings/MeetingDetail/MeetingInfo.tsx" = ""
    "components/features/investor-meetings/MeetingDetail/MeetingNotes.tsx" = ""
    "components/features/investor-meetings/MeetingDetail/MeetingActions.tsx" = ""

    # MeetingForm Components
    "components/features/investor-meetings/MeetingForm/MeetingForm.tsx" = ""
    "components/features/investor-meetings/MeetingForm/MeetingValidation.ts" = ""

    # Shared Components
    "components/features/investor-meetings/shared/InvestorSelect.tsx" = ""
    "components/features/investor-meetings/shared/StatusBadge.tsx" = ""

    # Common Layout Components
    "components/common/layout/PageHeader.tsx" = ""
}

# ファイルを作成
foreach ($file in $files.GetEnumerator()) {
    $file.Value | Out-File -Force "$baseDir/$($file.Key)" -Encoding UTF8
}

Write-Host "Investor meetings directory structure has been created successfully."

# idディレクトリを[id]にリネーム（必要な場合）
# Rename-Item -Path "$baseDir/app/investor-meetings/id" -NewName "[id]"