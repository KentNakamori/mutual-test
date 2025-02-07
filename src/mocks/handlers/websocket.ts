// src/mocks/handlers/websocket.ts
import { http, HttpResponse } from 'msw'
import type { WSMessage } from '../../types/components'
import { createErrorResponse } from '../types'

// WebSocketコネクション管理クラス
class WebSocketConnectionManager {
  private messageHistory = new Map<string, WSMessage[]>()

  addMessage(roomId: string, message: WSMessage): void {
    if (!this.messageHistory.has(roomId)) {
      this.messageHistory.set(roomId, [])
    }
    const history = this.messageHistory.get(roomId)!
    history.push(message)
    
    // 最大100件までの履歴を保持
    if (history.length > 100) {
      this.messageHistory.set(roomId, history.slice(-100))
    }
  }

  getMessageHistory(roomId: string): WSMessage[] {
    return this.messageHistory.get(roomId) || []
  }
}

const wsManager = new WebSocketConnectionManager()

export const websocketHandlers = [
  // メッセージ送信エンドポイント
  http.post('/api/v1/chat/messages', async ({ request }) => {
    try {
      const { roomId, message } = await request.json()
      const wsMessage: WSMessage = {
        type: 'message',
        payload: message,
        timestamp: Date.now()
      }

      wsManager.addMessage(roomId, wsMessage)
      
      return HttpResponse.json({ 
        success: true,
        message: wsMessage 
      })
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(500, 'Failed to send message'),
        { status: 500 }
      )
    }
  }),

  // メッセージ履歴取得
  http.get('/api/v1/chat/rooms/:roomId/messages', ({ params }) => {
    const { roomId } = params
    if (typeof roomId !== 'string') {
      return HttpResponse.json(
        createErrorResponse(400, '無効なRoom IDです'),
        { status: 400 }
      )
    }

    const messages = wsManager.getMessageHistory(roomId)
    return HttpResponse.json({ data: messages })
  })
]

// クライアント側でのWebSocket接続をシミュレートするクラス
export class MockWebSocket extends EventTarget {
  private roomId: string
  private intervalId?: NodeJS.Timeout

  constructor(roomId: string) {
    super()
    this.roomId = roomId
    
    // 接続成功をシミュレート
    setTimeout(() => {
      this.dispatchEvent(new Event('open'))
      this.startPolling()
    }, 100)
  }

  send(data: string): void {
    try {
      const message = JSON.parse(data)
      fetch('/api/v1/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: this.roomId,
          message
        })
      })
    } catch (error) {
      this.dispatchEvent(new ErrorEvent('error', { error }))
    }
  }

  close(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    this.dispatchEvent(new Event('close'))
  }

  // ポーリングでメッセージを取得
  private startPolling(): void {
    let lastMessageTimestamp = 0

    this.intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/chat/rooms/${this.roomId}/messages`)
        const { data } = await response.json()
        
        if (data && Array.isArray(data)) {
          // 新しいメッセージのみを取得
          const newMessages = data.filter(msg => msg.timestamp > lastMessageTimestamp)
          
          if (newMessages.length > 0) {
            lastMessageTimestamp = Math.max(...newMessages.map(msg => msg.timestamp))
            
            // 新しいメッセージごとにイベントを発火
            newMessages.forEach(message => {
              this.dispatchEvent(new MessageEvent('message', {
                data: JSON.stringify(message)
              }))
            })
          }
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 1000) // 1秒ごとにポーリング
  }
}

// セットアップヘルパー
export function setupWebSocket(roomId: string, options: {
  onMessage: (data: WSMessage) => void
  onError?: (error: Error) => void
  onClose?: () => void
}) {
  const ws = new MockWebSocket(roomId)

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse((event as MessageEvent).data) as WSMessage
      options.onMessage(data)
    } catch (error) {
      options.onError?.(new Error('Invalid message format'))
    }
  })

  ws.addEventListener('error', (event) => {
    options.onError?.(event instanceof ErrorEvent ? event.error : new Error('WebSocket error'))
  })

  ws.addEventListener('close', () => {
    options.onClose?.()
  })

  return ws
}

export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  TYPING: 'typing',
  READ: 'read'
} as const