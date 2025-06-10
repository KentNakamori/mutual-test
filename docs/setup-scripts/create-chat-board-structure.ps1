# チャットボードのディレクトリ構造を作成するスクリプト
$baseDir = "src"

# ディレクトリ構造の作成
$directories = @(
    "app/chat-board",
    "components/features/chat-board/ChatSection",
    "components/features/chat-board/BoardSection",
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
    # App Page
    "app/chat-board/page.tsx" = "export default function ChatBoardPage() { return <div>Chat Board Page</div> }"

    # Chat Section Components
    "components/features/chat-board/ChatSection/ChatHeader.tsx" = ""
    "components/features/chat-board/ChatSection/ChatList.tsx" = ""
    "components/features/chat-board/ChatSection/ChatInput.tsx" = ""
    "components/features/chat-board/ChatSection/ChatMessage.tsx" = ""

    # Board Section Components
    "components/features/chat-board/BoardSection/BoardHeader.tsx" = ""
    "components/features/chat-board/BoardSection/BoardList.tsx" = ""
    "components/features/chat-board/BoardSection/BoardFilter.tsx" = ""
    "components/features/chat-board/BoardSection/BoardItem.tsx" = ""

    # Common Layout Components
    "components/common/layout/SplitPane.tsx" = ""
    "components/common/layout/ResizeHandle.tsx" = ""
}

# ファイルを作成
foreach ($file in $files.GetEnumerator()) {
    $file.Value | Out-File -Force "$baseDir/$($file.Key)" -Encoding UTF8
}

Write-Host "Chat board directory structure has been created successfully."