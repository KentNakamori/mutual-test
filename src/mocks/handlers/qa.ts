// src/mocks/handlers/qa.ts
import { http, HttpResponse } from 'msw'
import type { APIResponse } from '../../types/api'
import type { QADTO } from '../../types/dto'
import type { QAResponse, QAAttachment } from '../../types/models'
import { mockDB } from '../db'
import { createSuccessResponse, createErrorResponse } from '../types'

export const qaHandlers = [
  // Q&A一覧取得
  http.get('/api/v1/qa', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page')) || 1
      const limit = Number(url.searchParams.get('limit')) || 10
      const status = url.searchParams.get('status')
      const priority = url.searchParams.get('priority')
      const investorId = url.searchParams.get('investor_id')
      const meetingId = url.searchParams.get('meeting_id')

      let qas = mockDB.qas.getAll()

      // フィルタリング
      if (status) {
        qas = qas.filter(q => q.status === status)
      }
      if (priority) {
        qas = qas.filter(q => q.priority === priority)
      }
      if (investorId) {
        qas = qas.filter(q => q.investor_id === investorId)
      }
      if (meetingId) {
        qas = qas.filter(q => q.meeting_id === meetingId)
      }

      // 更新日時でソート
      qas.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedQAs = qas.slice(start, end)

      const dtos: QADTO[] = paginatedQAs.map(qa => ({
        id: qa._id,
        status: qa.status,
        priority: qa.priority,
        responses: qa.responses.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString()
        })),
        attachments: qa.attachments,
        investor_id: qa.investor_id,
        meeting_id: qa.meeting_id
      }))

      return HttpResponse.json(
        createSuccessResponse(dtos, {
          total: qas.length,
          page,
          limit
        })
      )
    } catch (error) {
      console.error('Get QAs error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'Q&A情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // Q&A詳細取得
  http.get('/api/v1/qa/:id', async ({ params }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const qa = mockDB.qas.findById(id)

      if (!qa) {
        return HttpResponse.json(
          createErrorResponse(404, 'Q&Aが見つかりません'),
          { status: 404 }
        )
      }

      const dto: QADTO = {
        id: qa._id,
        status: qa.status,
        priority: qa.priority,
        responses: qa.responses.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString()
        })),
        attachments: qa.attachments,
        investor_id: qa.investor_id,
        meeting_id: qa.meeting_id
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Get QA error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'Q&A情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // Q&A作成
  http.post('/api/v1/qa', async ({ request }) => {
    try {
      const data = await request.json() as Omit<QADTO, 'id'>

      // 投資家とミーティングの存在確認
      const investor = mockDB.investors.findById(data.investor_id)
      const meeting = mockDB.meetings.findById(data.meeting_id)

      if (!investor) {
        return HttpResponse.json(
          createErrorResponse(404, '投資家が見つかりません'),
          { status: 404 }
        )
      }

      if (!meeting) {
        return HttpResponse.json(
          createErrorResponse(404, 'ミーティングが見つかりません'),
          { status: 404 }
        )
      }

      const newQA = mockDB.qas.create({
        status: data.status,
        priority: data.priority,
        responses: data.responses.map(r => ({
          ...r,
          timestamp: new Date(r.timestamp)
        })),
        attachments: data.attachments,
        investor_id: data.investor_id,
        meeting_id: data.meeting_id
      })

      const dto: QADTO = {
        id: newQA._id,
        status: newQA.status,
        priority: newQA.priority,
        responses: newQA.responses.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString()
        })),
        attachments: newQA.attachments,
        investor_id: newQA.investor_id,
        meeting_id: newQA.meeting_id
      }

      return HttpResponse.json(
        createSuccessResponse(dto),
        { status: 201 }
      )

    } catch (error) {
      console.error('Create QA error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'Q&Aの作成中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // Q&A更新
  http.put('/api/v1/qa/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const updateData = await request.json() as Partial<QADTO>
      const qa = mockDB.qas.findById(id)

      if (!qa) {
        return HttpResponse.json(
          createErrorResponse(404, 'Q&Aが見つかりません'),
          { status: 404 }
        )
      }

      const updatedQA = mockDB.qas.update(id, {
        ...qa,
        status: updateData.status || qa.status,
        priority: updateData.priority || qa.priority,
        responses: updateData.responses ? 
          updateData.responses.map(r => ({
            ...r,
            timestamp: new Date(r.timestamp)
          })) : 
          qa.responses,
        attachments: updateData.attachments || qa.attachments
      })

      if (!updatedQA) {
        return HttpResponse.json(
          createErrorResponse(500, 'Q&A情報の更新に失敗しました'),
          { status: 500 }
        )
      }

      const dto: QADTO = {
        id: updatedQA._id,
        status: updatedQA.status,
        priority: updatedQA.priority,
        responses: updatedQA.responses.map(r => ({
          ...r,
          timestamp: r.timestamp.toISOString()
        })),
        attachments: updatedQA.attachments,
        investor_id: updatedQA.investor_id,
        meeting_id: updatedQA.meeting_id
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Update QA error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'Q&A情報の更新中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 回答追加
  http.post('/api/v1/qa/:id/responses', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const responseData = await request.json() as Omit<QAResponse, 'timestamp'>
      const qa = mockDB.qas.findById(id)

      if (!qa) {
        return HttpResponse.json(
          createErrorResponse(404, 'Q&Aが見つかりません'),
          { status: 404 }
        )
      }

      // ユーザーの存在確認
      const user = mockDB.users.findById(responseData.user_id)
      if (!user) {
        return HttpResponse.json(
          createErrorResponse(404, 'ユーザーが見つかりません'),
          { status: 404 }
        )
      }

      const newResponse: QAResponse = {
        ...responseData,
        timestamp: new Date()
      }

      const updatedQA = mockDB.qas.update(id, {
        ...qa,
        responses: [...qa.responses, newResponse],
        status: qa.responses.length === 0 ? 'answered' : qa.status
      })

      if (!updatedQA) {
        return HttpResponse.json(
          createErrorResponse(500, '回答の追加に失敗しました'),
          { status: 500 }
        )
      }

      return HttpResponse.json(
        createSuccessResponse({
          ...newResponse,
          timestamp: newResponse.timestamp.toISOString()
        }),
        { status: 201 }
      )

    } catch (error) {
      console.error('Add response error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '回答の追加中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 添付ファイル追加
  http.post('/api/v1/qa/:id/attachments', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const qa = mockDB.qas.findById(id)
      if (!qa) {
        return HttpResponse.json(
          createErrorResponse(404, 'Q&Aが見つかりません'),
          { status: 404 }
        )
      }

      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
        return HttpResponse.json(
          createErrorResponse(400, 'ファイルが指定されていません'),
          { status: 400 }
        )
      }

      // ファイルサイズチェック (10MB制限)
      if (file.size > 10 * 1024 * 1024) {
        return HttpResponse.json(
          createErrorResponse(400, 'ファイルサイズが制限を超えています'),
          { status: 400 }
        )
      }

      const newAttachment: QAAttachment = {
        name: file.name,
        url: `https://example.com/files/${crypto.randomUUID()}-${file.name}`,
        type: file.type
      }

      const updatedQA = mockDB.qas.update(id, {
        ...qa,
        attachments: [...qa.attachments, newAttachment]
      })

      if (!updatedQA) {
        return HttpResponse.json(
          createErrorResponse(500, '添付ファイルの追加に失敗しました'),
          { status: 500 }
        )
      }

      return HttpResponse.json(
        createSuccessResponse(newAttachment),
        { status: 201 }
      )

    } catch (error) {
      console.error('Add attachment error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '添付ファイルの追加中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 添付ファイル削除
  http.delete('/api/v1/qa/:qaId/attachments/:attachmentId', async ({ params }) => {
    try {
      const { qaId, attachmentId } = params
      if (typeof qaId !== 'string' || typeof attachmentId !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const qa = mockDB.qas.findById(qaId)
      if (!qa) {
        return HttpResponse.json(
          createErrorResponse(404, 'Q&Aが見つかりません'),
          { status: 404 }
        )
      }

      const attachmentIndex = qa.attachments.findIndex(a => 
        a.url.includes(attachmentId)
      )

      if (attachmentIndex === -1) {
        return HttpResponse.json(
          createErrorResponse(404, '添付ファイルが見つかりません'),
          { status: 404 }
        )
      }

      const updatedAttachments = [...qa.attachments]
      updatedAttachments.splice(attachmentIndex, 1)

      const updatedQA = mockDB.qas.update(qaId, {
        ...qa,
        attachments: updatedAttachments
      })

      if (!updatedQA) {
        return HttpResponse.json(
          createErrorResponse(500, '添付ファイルの削除に失敗しました'),
          { status: 500 }
        )
      }

      return new HttpResponse(null, { status: 204 })

    } catch (error) {
      console.error('Delete attachment error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '添付ファイルの削除中にエラーが発生しました'),
        { status: 500 }
      )
    }
  })
]