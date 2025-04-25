// src/config/api.ts
import { API_BASE_URL } from './auth';

export const ENDPOINTS = {
  // 企業向けAPI
  corporate: {
    // 認証関連
    auth: {
      login: '/corporate/auth/login',
      logout: '/corporate/auth/logout',
      passwordReset: '/corporate/auth/password/reset',
      passwordResetConfirm: '/corporate/auth/password/reset/confirm',
      me: '/corporate/auth/me',
    },
    // ダッシュボード
    dashboard: '/corporate/dashboard',
    // Q&A関連
    qa: {
      search: '/corporate/qa/search',
      create: '/corporate/qa',
      update: (id: string) => `/corporate/qa/${id}`,
      delete: (id: string) => `/corporate/qa/${id}`,
      upload: '/corporate/qa/upload',
      batchCreate: '/corporate/qa/batchCreate',
    },
    // IR関連
    ir: {
      drafts: '/corporate/irchat/drafts',
      draft: (id: string) => `/corporate/irchat/drafts/${id}`,
      chat: '/corporate/irchat',
      mailDraft: '/corporate/maildraft',
    },
    // 設定
    settings: {
      company: '/corporate/settings/company',
      account: '/corporate/settings/account',
    },
    // 文書解析
    documents: {
      analysis: '/corporate/documents/analysis',
    },
  },
  
  // 投資家向けAPI
  investor: {
    // 認証関連
    auth: {
      login: '/investor/auth/login',
      logout: '/investor/auth/logout',
      register: '/investor/auth/register',
      refresh: '/investor/auth/refresh',
      me: '/investor/auth/me',
      guest: '/investor/auth/guest',
    },
    // 企業関連
    companies: {
      list: '/investor/companies',
      detail: (id: string) => `/investor/companies/${id}`,
      qa: (id: string) => `/investor/companies/${id}/qa`,
      names: '/investor/companies/names',
      follow: (id: string) => `/investor/companies/${id}/follow`,
    },
    // Q&A関連
    qa: {
      search: '/investor/qa/search',
      companies: '/investor/qa/companies',
      like: (id: string) => `/investor/qa/like/${id}`,
      comment: '/investor/qa/comment',
    },
    // チャット関連
    chat: {
      history: '/investor/chat/history',
      message: '/investor/chat/message',
      new: (companyId: string) => `/investor/chat/${companyId}`,
      detail: (chatId: string) => `/investor/chat/${chatId}`,
    },
    // プロファイル関連
    profile: {
      get: '/investor/profile',
      update: '/investor/profile',
    },
    // トラッキング
    track: '/investor/track',
  },
  
  // 管理者向けAPI
  admin: {
    company: {
      register: '/admin/company/register',
    },
    corporate: '/admin/corporate',
  },
};