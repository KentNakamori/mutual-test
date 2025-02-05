// src/mocks/handlers/meetings.ts
import { http, HttpResponse } from 'msw'
import type { APIResponse } from '../../types/api'
import type { MeetingDTO } from '../../types/dto'
import { mockDB } from '../db'
import { createSuccessResponse, createErrorResponse } from '../types'

export const meetingHandlers = [
  // ミーティング一覧取得
  http.get('/api/v1/meetings', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page')) || 1
      const limit = Number(url.searchParams.get('limit')) || 10
      const status = url.searchParams.get('status')
      const investorId = url.searchParams.get('investor_id')

      let meetings = mockDB.meetings.getAll()

      // フィルタリング
      if (status) {
        meetings = meetings.filter(m => m.status === status)
      }
      if (investorId) {
        meetings = meetings.filter(m => m.investor_id === investorId)
      }

      // 日付でソート
      meetings.sort((a, b) => b.date.getTime() - a.date.getTime())

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedMeetings = meetings.slice(start, end)

      const dtos: MeetingDTO[] = paginatedMeetings.map(meeting => ({
        id: meeting._id,
        date: meeting.date.toISOString(),
        status: meeting.status,
        notes: meeting.notes,
        investor_id: meeting.investor_id,
        qas: meeting.qas.map(String)
      }))

      return HttpResponse.json(
        createSuccessResponse(dtos, {
          total: meetings.length,
          page,
          limit
        })
      )
    } catch (error) {
      console.error('Get meetings error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'ミーティング情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // ミーティング詳細取得
  http.get('/api/v1/meetings/:id', async ({ params }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const meeting = mockDB.meetings.findById(id)

      if (!meeting) {
        return HttpResponse.json(
          createErrorResponse(404, 'ミーティングが見つかりません'),
          { status: 404 }
        )
      }

      const dto: MeetingDTO = {
        id: meeting._id,
        date: meeting.date.toISOString(),
        status: meeting.status,
        notes: meeting.notes,
        investor_id: meeting.investor_id,
        qas: meeting.qas.map(String)
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Get meeting error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'ミーティング情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // ミーティング作成
  http.post('/api/v1/meetings', async ({ request }) => {
    try {
      const data = await request.json() as Omit<MeetingDTO, 'id'>
      
      // 投資家の存在確認
      const investor = mockDB.investors.findById(data.investor_id)
      if (!investor) {
        return HttpResponse.json(
          createErrorResponse(404, '投資家が見つかりません'),
          { status: 404 }
        )
      }

      // 日付のバリデーション
      const meetingDate = new Date(data.date)
      if (isNaN(meetingDate.getTime())) {
        return HttpResponse.json(
          createErrorResponse(400, '無効な日付形式です'),
          { status: 400 }
        )
      }

      // 時間の重複チェック
      const existingMeetings = mockDB.meetings.findByInvestorId(data.investor_id)
      const hasConflict = existingMeetings.some(m => {
        const diff = Math.abs(m.date.getTime() - meetingDate.getTime())
        return diff < 3600000 // 1時間以内の重複をチェック
      })

      if (hasConflict) {
        return HttpResponse.json(
          createErrorResponse(409, '指定された時間には既に別のミーティングが予定されています'),
          { status: 409 }
        )
      }

      const newMeeting = mockDB.meetings.create({
        date: meetingDate,
        status: data.status,
        notes: data.notes,
        investor_id: data.investor_id,
        qas: []
      })

      const dto: MeetingDTO = {
        id: newMeeting._id,
        date: newMeeting.date.toISOString(),
        status: newMeeting.status,
        notes: newMeeting.notes,
        investor_id: newMeeting.investor_id,
        qas: []
      }

      return HttpResponse.json(
        createSuccessResponse(dto),
        { status: 201 }
      )

    } catch (error) {
      console.error('Create meeting error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'ミーティングの作成中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // ミーティング更新
  http.put('/api/v1/meetings/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const updateData = await request.json() as Partial<MeetingDTO>
      const meeting = mockDB.meetings.findById(id)

      if (!meeting) {
        return HttpResponse.json(
          createErrorResponse(404, 'ミーティングが見つかりません'),
          { status: 404 }
        )
      }

      // 日付更新時の重複チェック
      if (updateData.date) {
        const newDate = new Date(updateData.date)
        if (isNaN(newDate.getTime())) {
          return HttpResponse.json(
            createErrorResponse(400, '無効な日付形式です'),
            { status: 400 }
          )
        }

        const existingMeetings = mockDB.meetings.findByInvestorId(meeting.investor_id)
        const hasConflict = existingMeetings.some(m => {
          if (m._id === id) return false // 自分自身は除外
          const diff = Math.abs(m.date.getTime() - newDate.getTime())
          return diff < 3600000 // 1時間以内の重複をチェック
        })

        if (hasConflict) {
          return HttpResponse.json(
            createErrorResponse(409, '指定された時間には既に別のミーティングが予定されています'),
            { status: 409 }
          )
        }
      }

      const updatedMeeting = mockDB.meetings.update(id, {
        ...meeting,
        date: updateData.date ? new Date(updateData.date) : meeting.date,
        status: updateData.status || meeting.status,
        notes: updateData.notes || meeting.notes
      })

      if (!updatedMeeting) {
        return HttpResponse.json(
          createErrorResponse(500, 'ミーティング情報の更新に失敗しました'),
          { status: 500 }
        )
      }

      const dto: MeetingDTO = {
        id: updatedMeeting._id,
        date: updatedMeeting.date.toISOString(),
        status: updatedMeeting.status,
        notes: updatedMeeting.notes,
        investor_id: updatedMeeting.investor_id,
        qas: updatedMeeting.qas.map(String)
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Update meeting error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'ミーティング情報の更新中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // ミーティング削除
  http.delete('/api/v1/meetings/:id', async ({ params }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const meeting = mockDB.meetings.findById(id)

      if (!meeting) {
        return HttpResponse.json(
          createErrorResponse(404, 'ミーティングが見つかりません'),
          { status: 404 }
        )
      }

      if (meeting.qas.length > 0) {
        return HttpResponse.json(
          createErrorResponse(400, '関連するQ&Aが存在するため削除できません'),
          { status: 400 }
        )
      }

      const deleted = mockDB.meetings.delete(id)
      if (!deleted) {
        return HttpResponse.json(
          createErrorResponse(500, 'ミーティングの削除に失敗しました'),
          { status: 500 }
        )
      }

      return new HttpResponse(null, { status: 204 })

    } catch (error) {
      console.error('Delete meeting error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'ミーティングの削除中にエラーが発生しました'),
        { status: 500 }
      )
    }
  })
]