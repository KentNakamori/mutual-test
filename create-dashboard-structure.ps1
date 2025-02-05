# src配下のディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app",
    "components/common/layout",
    "components/common/navigation",
    "components/features/dashboard"
)

# ベースディレクトリを作成
New-Item -ItemType Directory -Force -Path $baseDir | Out-Null

# サブディレクトリを作成
foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path "$baseDir/$dir" | Out-Null
}

# ファイルの作成
$files = @{
    # App
    "app/page.tsx" = "export default function Home() { return <div>Home Page</div> }"

    # Layout Components
    "components/common/layout/Header.tsx" = ""
    "components/common/layout/Sidebar.tsx" = ""
    "components/common/layout/MainGrid.tsx" = ""

    # Navigation Components
    "components/common/navigation/SearchBar.tsx" = ""
    "components/common/navigation/NotificationCenter.tsx" = ""
    "components/common/navigation/UserMenu.tsx" = ""

    # Dashboard Feature Components
    "components/features/dashboard/DashboardGrid.tsx" = ""
    "components/features/dashboard/AppointmentWidget.tsx" = ""
    "components/features/dashboard/QAStatusWidget.tsx" = ""
    "components/features/dashboard/InvestorRegistrationWidget.tsx" = ""
    "components/features/dashboard/NotificationWidget.tsx" = ""
}

# ファイルを作成
foreach ($file in $files.GetEnumerator()) {
    $file.Value | Out-File -Force "$baseDir/$($file.Key)" -Encoding UTF8
}

Write-Host "Directory structure has been created successfully."