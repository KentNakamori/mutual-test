// src/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw'
import type { User } from '../../types/models'
import type { APIResponse } from '../../types/api'
import { mockDB } from '../db'
import { createSuccessResponse, createErrorResponse } from '../types'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

interface RefreshTokenRequest {
  refreshToken: string
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export const authHandlers = [
  // ログインハンドラー
  http.post<never, LoginRequest>('/api/v1/auth/login', async ({ request }) => {
    try {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(400, 'メールアドレスとパスワードは必須です')),
          { status: 400 }
        )
      }

      const user = mockDB.users.findByEmail(email)

      if (!user || user.password !== password) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(401, 'メールアドレスまたはパスワードが不正です')),
          { status: 401 }
        )
      }

      const response: APIResponse<LoginResponse> = createSuccessResponse({
        accessToken: `mock-access-token-${user._id}`,
        refreshToken: `mock-refresh-token-${user._id}`,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })

      return HttpResponse.json(response)

    } catch (error) {
      console.error('Login error:', error)
      return new HttpResponse(
        JSON.stringify(createErrorResponse(500, 'ログイン処理中にエラーが発生しました')),
        { status: 500 }
      )
    }
  }),

  // トークンリフレッシュハンドラー
  http.post<never, RefreshTokenRequest>('/api/v1/auth/refresh', async ({ request }) => {
    try {
      const { refreshToken } = await request.json()

      if (!refreshToken) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(400, 'リフレッシュトークンは必須です')),
          { status: 400 }
        )
      }

      // リフレッシュトークンの検証（実際のアプリケーションではより堅牢な検証が必要）
      const userId = refreshToken.replace('mock-refresh-token-', '')
      const user = mockDB.users.findById(userId)

      if (!user) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(401, '無効なリフレッシュトークンです')),
          { status: 401 }
        )
      }

      const response: APIResponse<RefreshTokenResponse> = createSuccessResponse({
        accessToken: `mock-access-token-${user._id}-new`,
        refreshToken: `mock-refresh-token-${user._id}-new`
      })

      return HttpResponse.json(response)

    } catch (error) {
      console.error('Token refresh error:', error)
      return new HttpResponse(
        JSON.stringify(createErrorResponse(500, 'トークンの更新中にエラーが発生しました')),
        { status: 500 }
      )
    }
  }),

  // ログアウトハンドラー
  http.post('/api/v1/auth/logout', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // 現在のユーザー情報取得ハンドラー
  http.get('/api/v1/auth/me', async ({ request }) => {
    try {
      const authHeader = request.headers.get('Authorization')
      
      if (!authHeader?.startsWith('Bearer ')) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(401, '認証が必要です')),
          { status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      const userId = token.replace('mock-access-token-', '').split('-')[0]
      const user = mockDB.users.findById(userId)

      if (!user) {
        return new HttpResponse(
          JSON.stringify(createErrorResponse(401, '無効なトークンです')),
          { status: 401 }
        )
      }

      const response: APIResponse<Omit<User, 'password'>> = createSuccessResponse({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        settings: user.settings,
        created_at: user.created_at,
        updated_at: user.updated_at
      })

      return HttpResponse.json(response)

    } catch (error) {
      console.error('Get user error:', error)
      return new HttpResponse(
        JSON.stringify(createErrorResponse(500, 'ユーザー情報の取得中にエラーが発生しました')),
        { status: 500 }
      )
    }
  })
]