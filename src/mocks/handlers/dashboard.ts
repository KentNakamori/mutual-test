// src/mocks/handlers/dashboard.ts
import { http, HttpResponse } from 'msw'
import { API_ENDPOINTS } from '../../types/utils'
import { mockDB } from '../db'
import { createErrorResponse } from '../utils'
import type { Widget, WidgetLayout } from '../../types/models'

export const dashboardHandlers = [
  // ウィジェット一覧取得
  http.get(`${API_ENDPOINTS.DASHBOARD}/widgets`, async () => {
    try {
      const widgets = mockDB.widgets.getAll()
      return HttpResponse.json({ data: widgets })
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(500, '予期せぬエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // ウィジェット追加
  http.post(`${API_ENDPOINTS.DASHBOARD}/widgets`, async ({ request }) => {
    try {
      const widgetData: Omit<Widget, '_id'> = await request.json()
      const newWidget = {
        _id: 'new-widget-id',
        ...widgetData,
        created_at: new Date(),
        updated_at: new Date()
      }

      return HttpResponse.json({ data: newWidget }, { status: 201 })
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(500, 'ウィジェットの作成に失敗しました'),
        { status: 500 }
      )
    }
  }),

  // レイアウト更新
  http.put(`${API_ENDPOINTS.DASHBOARD}/layout`, async ({ request }) => {
    try {
      const { layout } = await request.json() as { layout: WidgetLayout[] }
      
      // レイアウトのバリデーション
      const isValid = layout.every(item => 
        typeof item.x === 'number' && 
        typeof item.y === 'number' && 
        typeof item.w === 'number' && 
        typeof item.h === 'number'
      )

      if (!isValid) {
        return HttpResponse.json(
          createErrorResponse(400, '不正なレイアウトデータです'),
          { status: 400 }
        )
      }

      return HttpResponse.json({ 
        data: { 
          success: true,
          layout
        } 
      })
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(500, 'レイアウトの更新に失敗しました'),
        { status: 500 }
      )
    }
  }),

  // ウィジェット削除
  http.delete(`${API_ENDPOINTS.DASHBOARD}/widgets/:id`, async ({ params }) => {
    try {
      const { id } = params
      const widget = mockDB.widgets.findById(id as string)

      if (!widget) {
        return HttpResponse.json(
          createErrorResponse(404, 'ウィジェットが見つかりません'),
          { status: 404 }
        )
      }

      return HttpResponse.json({ 
        data: { 
          success: true,
          id 
        } 
      })
    } catch (error) {
      return HttpResponse.json(
        createErrorResponse(500, 'ウィジェットの削除に失敗しました'),
        { status: 500 }
      )
    }
  })
]