// src/mocks/handlers/websocket.ts
import { http, HttpResponse, WebSocket } from 'msw'
import { API_ENDPOINTS } from '../../types/utils'
import type { WSMessage } from '../../types/components'

// WebSocketコネクション管理クラス
class WebSocketConnectionManager {
  private connections = new Map<string, Set<WebSocket>>()
  private messageHistory = new Map<string, WSMessage[]>()

  addConnection(roomId: string, ws: WebSocket): void {
    if (!this.connections.has(roomId)) {
      this.connections.set(roomId, new Set())
    }
    this.connections.get(roomId)?.add(ws)

    // 接続時に過去のメッセージ履歴を送信
    const history = this.messageHistory.get(roomId) || []
    history.forEach(message => {
      ws.send(JSON.stringify(message))
    })
  }

  removeConnection(roomId: string, ws: WebSocket): void {
    this.connections.get(roomId)?.delete(ws)
    if (this.connections.get(roomId)?.size === 0) {
      this.connections.delete(roomId)
    }
  }

  broadcast(roomId: string, message: WSMessage, excludeWs?: WebSocket): void {
    // メッセージ履歴に追加
    if (!this.messageHistory.has(roomId)) {
      this.messageHistory.set(roomId, [])
    }
    this.messageHistory.get(roomId)?.push(message)

    // 最大100件までの履歴を保持
    const history = this.messageHistory.get(roomId)
    if (history && history.length > 100) {
      this.messageHistory.set(roomId, history.slice(-100))
    }

    // 接続中の全クライアントにブロードキャスト
    this.connections.get(roomId)?.forEach(ws => {
      if (ws !== excludeWs) {
        ws.send(JSON.stringify(message))
      }
    })
  }

  getRoomConnections(roomId: string): Set<WebSocket> | undefined {
    return this.connections.get(roomId)
  }

  getMessageHistory(roomId: string): WSMessage[] {
    return this.messageHistory.get(roomId) || []
  }
}

const wsManager = new WebSocketConnectionManager()

export const websocketHandlers = [
  // WebSocket接続ハンドラー
  http.get(`${API_ENDPOINTS.CHAT}/ws`, ({ request }) => {
    const url = new URL(request.url)
    const roomId = url.searchParams.get('roomId')
    const token = url.searchParams.get('token')

    // パラメーター検証
    if (!roomId) {
      return HttpResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    if (!token) {
      return HttpResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      )
    }

    // WebSocket接続を確立
    return new Response(null, {
      status: 101,
      headers: {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade'
      }
    })
  }),

  // WebSocket メッセージハンドラー
  http.post(`${API_ENDPOINTS.CHAT}/ws/messages`, async ({ request }) => {
    try {
      const { roomId, message } = await request.json()
      const wsMessage: WSMessage = {
        type: 'message',
        payload: message,
        timestamp: Date.now()
      }

      wsManager.broadcast(roomId, wsMessage)
      return HttpResponse.json({ data: wsMessage }, { status: 201 })
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to broadcast message' },
        { status: 500 }
      )
    }
  }),

  // メッセージ履歴取得
  http.get(`${API_ENDPOINTS.CHAT}/rooms/:roomId/messages`, ({ params }) => {
    const { roomId } = params
    const messages = wsManager.getMessageHistory(roomId as string)
    return HttpResponse.json({ data: messages })
  })
]

// WebSocketセットアップヘルパー
export function setupWebSocket(url: string, options: {
  onMessage: (data: WSMessage) => void
  onError?: (error: Error) => void
  onClose?: () => void
}) {
  const ws = new WebSocket(url)

  ws.addEventListener('open', () => {
    const connectMessage: WSMessage = {
      type: 'connect',
      payload: { message: 'Connected to chat room' },
      timestamp: Date.now()
    }
    ws.send(JSON.stringify(connectMessage))
  })

  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data) as WSMessage
      options.onMessage(data)
    } catch (error) {
      options.onError?.(new Error('Invalid message format'))
    }
  })

  ws.addEventListener('error', (error) => {
    options.onError?.(error)
  })

  ws.addEventListener('close', () => {
    options.onClose?.()
  })

  return ws
}

// WebSocketイベントタイプ定義
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  TYPING: 'typing',
  READ: 'read'
} as const

// メッセージユーティリティ
export const wsUtils = {
  createMessage(type: string, payload: unknown): WSMessage {
    return {
      type,
      payload,
      timestamp: Date.now()
    }
  },

  parseMessage(data: string): WSMessage | null {
    try {
      return JSON.parse(data) as WSMessage
    } catch {
      return null
    }
  },

  validateMessage(message: unknown): message is WSMessage {
    if (!message || typeof message !== 'object') return false
    
    const msg = message as WSMessage
    return (
      typeof msg.type === 'string' &&
      msg.payload !== undefined &&
      typeof msg.timestamp === 'number'
    )
  }
}