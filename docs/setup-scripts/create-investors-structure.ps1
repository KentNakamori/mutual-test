# 投資家関連のディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app/investors/id",  # [id]を単にidに変更
    "components/features/investors/InvestorList",
    "components/features/investors/InvestorDetail",
    "components/features/investors/InvestorForm",
    "components/common/widgets"
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
    "app/investors/page.tsx" = "export default function InvestorsPage() { return <div>Investors List Page</div> }"
    "app/investors/id/page.tsx" = "export default function InvestorDetailPage() { return <div>Investor Detail Page</div> }"  # [id]をidに変更

    # InvestorList Components
    "components/features/investors/InvestorList/InvestorList.tsx" = ""
    "components/features/investors/InvestorList/InvestorCard.tsx" = ""
    "components/features/investors/InvestorList/InvestorFilter.tsx" = ""
    "components/features/investors/InvestorList/InvestorSearch.tsx" = ""

    # InvestorDetail Components
    "components/features/investors/InvestorDetail/InvestorProfile.tsx" = ""
    "components/features/investors/InvestorDetail/InvestorHistory.tsx" = ""
    "components/features/investors/InvestorDetail/InvestorContact.tsx" = ""

    # InvestorForm Components
    "components/features/investors/InvestorForm/InvestorBasicInfo.tsx" = ""
    "components/features/investors/InvestorForm/InvestorPreference.tsx" = ""
    "components/features/investors/InvestorForm/InvestorDocument.tsx" = ""

    # Common Widgets
    "components/common/widgets/InvestorAnalytics.tsx" = ""
}

# ファイルを作成
foreach ($file in $files.GetEnumerator()) {
    $file.Value | Out-File -Force "$baseDir/$($file.Key)" -Encoding UTF8
}

Write-Host "Investors directory structure has been created successfully."

# 作成後に[id]ディレクトリにリネーム
Rename-Item -Path "$baseDir/app/investors/id" -NewName "[id]"