// src/mocks/handlers/board.ts
import { http, HttpResponse } from 'msw'
import type { APIResponse } from '../../types/api'
import { mockDB } from '../db'
import { createSuccessResponse, createErrorResponse } from '../types'

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
  }
  category: string
  tags: string[]
  likes: number
  liked: boolean
  comments: Comment[]
  created_at: string
  updated_at: string
}

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
  }
  created_at: string
}

export const boardHandlers = [
  // 投稿一覧取得
  http.get('/api/v1/board/posts', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page')) || 1
      const limit = Number(url.searchParams.get('limit')) || 10
      const category = url.searchParams.get('category')
      const tag = url.searchParams.get('tag')

      let posts = mockDB.posts.getAll()

      // フィルタリング
      if (category) {
        posts = posts.filter(p => p.category === category)
      }
      if (tag) {
        posts = posts.filter(p => p.tags.includes(tag))
      }

      // 日付でソート
      posts.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedPosts = posts.slice(start, end)

      const dtos: Post[] = paginatedPosts.map(post => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: {
          id: post.author_id,
          name: mockDB.users.findById(post.author_id)?.name || 'Unknown User'
        },
        category: post.category,
        tags: post.tags,
        likes: post.likes,
        liked: post.liked_by.includes(request.headers.get('user-id') || ''),
        comments: post.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: mockDB.users.findById(comment.author_id)?.name || 'Unknown User'
          },
          created_at: comment.created_at.toISOString()
        })),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString()
      }))

      return HttpResponse.json(
        createSuccessResponse(dtos, {
          total: posts.length,
          page,
          limit
        })
      )
    } catch (error) {
      console.error('Get posts error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿一覧の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投稿詳細取得
  http.get('/api/v1/board/posts/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const post = mockDB.posts.findById(id)
      if (!post) {
        return HttpResponse.json(
          createErrorResponse(404, '投稿が見つかりません'),
          { status: 404 }
        )
      }

      const dto: Post = {
        id: post._id,
        title: post.title,
        content: post.content,
        author: {
          id: post.author_id,
          name: mockDB.users.findById(post.author_id)?.name || 'Unknown User'
        },
        category: post.category,
        tags: post.tags,
        likes: post.likes,
        liked: post.liked_by.includes(request.headers.get('user-id') || ''),
        comments: post.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: mockDB.users.findById(comment.author_id)?.name || 'Unknown User'
          },
          created_at: comment.created_at.toISOString()
        })),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString()
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Get post error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿の取得中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投稿作成
  http.post('/api/v1/board/posts', async ({ request }) => {
    try {
      const userId = request.headers.get('user-id')
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(401, '認証が必要です'),
          { status: 401 }
        )
      }

      const data = await request.json()
      const { title, content, category, tags } = data

      if (!title || !content) {
        return HttpResponse.json(
          createErrorResponse(400, 'タイトルと内容は必須です'),
          { status: 400 }
        )
      }

      const newPost = mockDB.posts.create({
        title,
        content,
        author_id: userId,
        category: category || 'general',
        tags: tags || [],
        likes: 0,
        liked_by: [],
        comments: []
      })

      const dto: Post = {
        id: newPost._id,
        title: newPost.title,
        content: newPost.content,
        author: {
          id: newPost.author_id,
          name: mockDB.users.findById(newPost.author_id)?.name || 'Unknown User'
        },
        category: newPost.category,
        tags: newPost.tags,
        likes: newPost.likes,
        liked: false,
        comments: [],
        created_at: newPost.created_at.toISOString(),
        updated_at: newPost.updated_at.toISOString()
      }

      return HttpResponse.json(
        createSuccessResponse(dto),
        { status: 201 }
      )

    } catch (error) {
      console.error('Create post error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿の作成中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投稿更新
  http.put('/api/v1/board/posts/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const userId = request.headers.get('user-id')
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(401, '認証が必要です'),
          { status: 401 }
        )
      }

      const post = mockDB.posts.findById(id)
      if (!post) {
        return HttpResponse.json(
          createErrorResponse(404, '投稿が見つかりません'),
          { status: 404 }
        )
      }

      if (post.author_id !== userId) {
        return HttpResponse.json(
          createErrorResponse(403, '投稿の更新権限がありません'),
          { status: 403 }
        )
      }

      const updateData = await request.json()
      const updatedPost = mockDB.posts.update(id, {
        ...post,
        ...updateData,
        updated_at: new Date()
      })

      if (!updatedPost) {
        return HttpResponse.json(
          createErrorResponse(500, '投稿の更新に失敗しました'),
          { status: 500 }
        )
      }

      const dto: Post = {
        id: updatedPost._id,
        title: updatedPost.title,
        content: updatedPost.content,
        author: {
          id: updatedPost.author_id,
          name: mockDB.users.findById(updatedPost.author_id)?.name || 'Unknown User'
        },
        category: updatedPost.category,
        tags: updatedPost.tags,
        likes: updatedPost.likes,
        liked: updatedPost.liked_by.includes(userId),
        comments: updatedPost.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: mockDB.users.findById(comment.author_id)?.name || 'Unknown User'
          },
          created_at: comment.created_at.toISOString()
        })),
        created_at: updatedPost.created_at.toISOString(),
        updated_at: updatedPost.updated_at.toISOString()
      }

      return HttpResponse.json(createSuccessResponse(dto))

    } catch (error) {
      console.error('Update post error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿の更新中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投稿削除
  http.delete('/api/v1/board/posts/:id', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const userId = request.headers.get('user-id')
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(401, '認証が必要です'),
          { status: 401 }
        )
      }

      const post = mockDB.posts.findById(id)
      if (!post) {
        return HttpResponse.json(
          createErrorResponse(404, '投稿が見つかりません'),
          { status: 404 }
        )
      }

      if (post.author_id !== userId) {
        return HttpResponse.json(
          createErrorResponse(403, '投稿の削除権限がありません'),
          { status: 403 }
        )
      }

      const deleted = mockDB.posts.delete(id)
      if (!deleted) {
        return HttpResponse.json(
          createErrorResponse(500, '投稿の削除に失敗しました'),
          { status: 500 }
        )
      }

      return new HttpResponse(null, { status: 204 })

    } catch (error) {
      console.error('Delete post error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿の削除中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // コメント追加
  http.post('/api/v1/board/posts/:id/comments', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const userId = request.headers.get('user-id')
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(401, '認証が必要です'),
          { status: 401 }
        )
      }

      const post = mockDB.posts.findById(id)
      if (!post) {
        return HttpResponse.json(
          createErrorResponse(404, '投稿が見つかりません'),
          { status: 404 }
        )
      }

      const { content } = await request.json()
      if (!content) {
        return HttpResponse.json(
          createErrorResponse(400, 'コメント内容は必須です'),
          { status: 400 }
        )
      }

      const newComment = {
        id: crypto.randomUUID(),
        content,
        author_id: userId,
        created_at: new Date()
      }

      const updatedPost = mockDB.posts.update(id, {
        ...post,
        comments: [...post.comments, newComment]
      })

      if (!updatedPost) {
        return HttpResponse.json(
          createErrorResponse(500, 'コメントの追加に失敗しました'),
          { status: 500 }
        )
      }

      const commentDto: Comment = {
        id: newComment.id,
        content: newComment.content,
        author: {
          id: newComment.author_id,
          name: mockDB.users.findById(newComment.author_id)?.name || 'Unknown User'
        },
        created_at: newComment.created_at.toISOString()
      }

      return HttpResponse.json(
        createSuccessResponse(commentDto),
        { status: 201 }
      )

    } catch (error) {
      console.error('Add comment error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'コメントの追加中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // いいね更新
  http.post('/api/v1/board/posts/:id/like', async ({ params, request }) => {
    try {
      const id = params.id
      if (typeof id !== 'string') {
        return HttpResponse.json(
          createErrorResponse(400, '無効なIDです'),
          { status: 400 }
        )
      }

      const userId = request.headers.get('user-id')
      if (!userId) {
        return HttpResponse.json(
          createErrorResponse(401, '認証が必要です'),
          { status: 401 }
        )
      }

      const post = mockDB.posts.findById(id)
      if (!post) {
        return HttpResponse.json(
          createErrorResponse(404, '投稿が見つかりません'),
          { status: 404 }
        )
      }

      const hasLiked = post.liked_by.includes(userId)
      const newLikedBy = hasLiked
        ? post.liked_by.filter(id => id !== userId)
        : [...post.liked_by, userId]

      const updatedPost = mockDB.posts.update(id, {
        ...post,
        liked_by: newLikedBy,
        likes: newLikedBy.length
      })

      if (!updatedPost) {
        return HttpResponse.json(
          createErrorResponse(500, 'いいねの更新に失敗しました'),
          { status: 500 }
        )
      }

      return HttpResponse.json(createSuccessResponse({
        liked: !hasLiked,
        likes: newLikedBy.length
      }))

    } catch (error) {
      console.error('Update like error:', error)
      return HttpResponse.json(
        createErrorResponse(500, 'いいねの更新中にエラーが発生しました'),
        { status: 500 }
      )
    }
  }),

  // 投稿検索
  http.post('/api/v1/board/posts/search', async ({ request }) => {
    try {
      const { query, page = 1, limit = 10, filters = {} } = await request.json()
      
      if (!query) {
        return HttpResponse.json(
          createErrorResponse(400, '検索クエリは必須です'),
          { status: 400 }
        )
      }

      let posts = mockDB.posts.getAll()

      // 検索条件によるフィルタリング
      posts = posts.filter(post => {
        const matchesQuery = (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )

        const matchesCategory = !filters.category || post.category === filters.category
        const matchesDateRange = (!filters.startDate || new Date(post.created_at) >= new Date(filters.startDate)) &&
                                (!filters.endDate || new Date(post.created_at) <= new Date(filters.endDate))

        return matchesQuery && matchesCategory && matchesDateRange
      })

      // 関連度スコアの計算
      const scoredPosts = posts.map(post => {
        const titleMatches = (post.title.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length
        const contentMatches = (post.content.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length
        const tagMatches = post.tags.filter(tag => tag.toLowerCase().includes(query.toLowerCase())).length

        const score = (titleMatches * 3) + (contentMatches * 1) + (tagMatches * 2)
        return { post, score }
      })

      // スコアでソート
      scoredPosts.sort((a, b) => b.score - a.score)

      const start = (page - 1) * limit
      const end = start + limit
      const paginatedPosts = scoredPosts.slice(start, end)

      const userId = request.headers.get('user-id')
      const dtos: Post[] = paginatedPosts.map(({ post }) => ({
        id: post._id,
        title: post.title,
        content: post.content,
        author: {
          id: post.author_id,
          name: mockDB.users.findById(post.author_id)?.name || 'Unknown User'
        },
        category: post.category,
        tags: post.tags,
        likes: post.likes,
        liked: userId ? post.liked_by.includes(userId) : false,
        comments: post.comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: mockDB.users.findById(comment.author_id)?.name || 'Unknown User'
          },
          created_at: comment.created_at.toISOString()
        })),
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString()
      }))

      return HttpResponse.json(
        createSuccessResponse(dtos, {
          total: posts.length,
          page,
          limit
        })
      )

    } catch (error) {
      console.error('Search posts error:', error)
      return HttpResponse.json(
        createErrorResponse(500, '投稿の検索中にエラーが発生しました'),
        { status: 500 }
      )
    }
  })
]