// src/components/features/chat-board/ChatSection/index.tsx
import { useEffect, useState } from 'react'
import type { WSMessage } from '@/types/components'
import { setupWebSocket } from '@/mocks/handlers/websocket'

export const ChatSection = () => {
  const [messages, setMessages] = useState<WSMessage[]>([])
  const roomId = 'chat-room-1' // 実際のアプリケーションでは動的に設定

  useEffect(() => {
    const ws = setupWebSocket(roomId, {
      onMessage: (data) => {
        setMessages(prev => [...prev, data])
      },
      onError: (error) => {
        console.error('Chat error:', error)
        // エラー処理の実装（UIへの通知など）
      },
      onClose: () => {
        console.log('Chat connection closed')
        // 切断処理の実装（再接続ロジックなど）
      }
    })

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = (content: string) => {
    const message: WSMessage = {
      type: 'message',
      payload: {
        content,
        senderId: 'current-user-id', // 実際のアプリケーションでは動的に設定
        senderName: 'Current User'
      },
      timestamp: Date.now()
    }

    // モックWebSocketを通じてメッセージを送信
    fetch('/api/v1/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId,
        message
      })
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-4">
            <div className="font-bold">
              {message.payload.senderName}
            </div>
            <div className="mt-1">
              {message.payload.content}
            </div>
            <div className="text-sm text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const input = form.elements.namedItem('message') as HTMLInputElement
            if (input.value.trim()) {
              sendMessage(input.value)
              input.value = ''
            }
          }}
        >
          <input
            type="text"
            name="message"
            className="w-full px-4 py-2 border rounded"
            placeholder="メッセージを入力..."
          />
        </form>
      </div>
    </div>
  )
}

export default ChatSection