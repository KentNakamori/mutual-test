// src/mocks/handlers/investors.ts
import { http, HttpResponse } from 'msw'
import type { APIResponse } from '../../types/api'
import type { Investor } from '../../types/models'
import type { InvestorDTO } from '../../types/dto'
import { mockDB } from '../db'
import { createSuccessResponse, createErrorResponse } from '../types'

export const investorHandlers = [
  // 投資家一覧取得
  http.get('/api/v1/investors', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page')) || 1
      const limit = Number(url.searchParams.get('limit')) || 10
      const status = url.searchParams.get('status')

      let investors = mockDB.investors.getAll()

      if (status) {
        investors = investors.filter(i => i.status === status)
      }

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedInvestors = investors.slice(start, end)

      const dtos: InvestorDTO[] = paginatedInvestors.map(investor => ({
        id: investor._id,
        basicInfo: investor.basicInfo,
        preferences: investor.preferences,
        documents: investor.documents,
        totalUsers: investor.totalUsers,
        status: investor.status,
        meetings: investor.meetings.map(String),
        qas: investor.qas.map(String)
      }))

      return HttpResponse.json(
        createSuccessResponse(dtos, {
          total: investors.length,
          page,
          limit
        })
      )
    } catch (error) {
      console.error('Get investors error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投資家情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投資家詳細取得
  http.get('/api/v1/investors/:id', async ({ params }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const investor = mockDB.investors.findById(id)

      if (!investor) {
        return HttpResponse.json(
          createErrorResponse(404, '投資家が見つかりません'),
          { status: 404 }
        )
      }

      const dto: InvestorDTO = {
        id: investor._id,
        basicInfo: investor.basicInfo,
        preferences: investor.preferences,
        documents: investor.documents,
        totalUsers: investor.totalUsers,
        status: investor.status,
        meetings: investor.meetings.map(String),
        qas: investor.qas.map(String)
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Get investor error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投資家情報の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投資家新規作成
  http.post('/api/v1/investors', async ({ request }) => {
    try {
      const data = await request.json() as Omit<InvestorDTO, 'id'>

      const existingInvestor = mockDB.investors.findByEmail(data.basicInfo.email)
      if (existingInvestor) {
        return HttpResponse.json(
          createErrorResponse(409, 'このメールアドレスは既に登録されています'),
          { status: 409 }
        )
      }

      const newInvestor = mockDB.investors.create({
        basicInfo: data.basicInfo,
        preferences: data.preferences,
        documents: data.documents,
        totalUsers: data.totalUsers,
        status: data.status,
        meetings: [],
        qas: []
      })

      const dto: InvestorDTO = {
        id: newInvestor._id,
        basicInfo: newInvestor.basicInfo,
        preferences: newInvestor.preferences,
        documents: newInvestor.documents,
        totalUsers: newInvestor.totalUsers,
        status: newInvestor.status,
        meetings: [],
        qas: []
      }

      return HttpResponse.json(
        createSuccessResponse(dto),
        { status: 201 }
      )

    } catch (error) {
      console.error('Create investor error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投資家の作成中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投資家情報更新
  http.put('/api/v1/investors/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const updateData = await request.json() as Partial<InvestorDTO>
      const investor = mockDB.investors.findById(id)

      if (!investor) {
        return HttpResponse.json(
          createErrorResponse(404, '投資家が見つかりません'),
          { status: 404 }
        )
      }

      if (updateData.basicInfo?.email && updateData.basicInfo.email !== investor.basicInfo.email) {
        const existingInvestor = mockDB.investors.findByEmail(updateData.basicInfo.email)
        if (existingInvestor) {
          return HttpResponse.json(
            createErrorResponse(409, 'このメールアドレスは既に使用されています'),
            { status: 409 }
          )
        }
      }

      const updatedInvestor = mockDB.investors.update(id, {
        ...investor,
        basicInfo: {
          ...investor.basicInfo,
          ...updateData.basicInfo
        },
        preferences: {
          ...investor.preferences,
          ...updateData.preferences
        },
        documents: updateData.documents || investor.documents,
        totalUsers: updateData.totalUsers ?? investor.totalUsers,
        status: updateData.status || investor.status
      })

      if (!updatedInvestor) {
        return HttpResponse.json(
          createErrorResponse(500, '投資家情報の更新に失敗しました'),
          { status: 500 }
        )
      }

      const dto: InvestorDTO = {
        id: updatedInvestor._id,
        basicInfo: updatedInvestor.basicInfo,
        preferences: updatedInvestor.preferences,
        documents: updatedInvestor.documents,
        totalUsers: updatedInvestor.totalUsers,
        status: updatedInvestor.status,
        meetings: updatedInvestor.meetings.map(String),
        qas: updatedInvestor.qas.map(String)
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Update investor error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投資家情報の更新中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投資家削除
  http.delete('/api/v1/investors/:id', async ({ params }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const investor = mockDB.investors.findById(id)

      if (!investor) {
        return HttpResponse.json(
          createErrorResponse(404, '投資家が見つかりません'),
          { status: 404 }
        )
      }

      if (investor.meetings.length > 0 || investor.qas.length > 0) {
        return HttpResponse.json(
          createErrorResponse(400, '関連するデータが存在するため削除できません'),
          { status: 400 }
        )
      }

      const deleted = mockDB.investors.delete(id)
      if (!deleted) {
        return HttpResponse.json(
          createErrorResponse(500, '投資家の削除に失敗しました'),
          { status: 500 }
        )
      }

      return new HttpResponse(null, { status: 204 })

    } catch (error) {
      console.error('Delete investor error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投資家の削除中にエラーが発生しました'),
        { status: 500 }
      )
    }
  })
]