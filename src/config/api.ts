// src/config/api.ts

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
    // ダッシュボード (プレフィックスなし)
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
      history: '/corporate/irchat/history',
      detail: (id: string) => `/corporate/irchat/${id}`,
      newChat: '/corporate/irchat/new',
      sendMessage: (id: string) => `/corporate/irchat/${id}/message`,
      drafts: '/corporate/irchat/drafts',
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
      upload: '/corporate/documents/upload',
      analysis: '/corporate/documents/analysis',
    },
    // ファイル管理
    files: {
      list: '/corporate/files',
      upload: '/corporate/files/upload',
      delete: (id: string) => `/corporate/files/${id}`,
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
      qa: (id: string) => `/investor/companies/${id}/faq`,
      names: '/investor/companies/names',
      follow: (id: string) => `/investor/companies/${id}/follow`,
    },
    // Q&A関連
    qa: {
      search: '/investor/qa/search',
      searchByCompany: (companyId: string) => `/investor/qa/search/company/${companyId}`,
      companies: '/investor/qa/companies',
      like: (id: string) => `/investor/qa/${id}/like`,
      comment: '/investor/qa/comment',
    },
    // チャット関連
    chat: {
      history: '/investor/chat/logs',
      message: (chatId: string) => `/investor/chat/${chatId}/message`,
      new: (companyId: string) => `/investor/chat/${companyId}`,
      newWithMessage: (companyId: string) => `/investor/chat/${companyId}/with-message`,
      detail: (chatId: string) => `/investor/chat/${chatId}`,
      delete: (chatId: string) => `/investor/chat/${chatId}`,
    },
    // プロファイル関連
    profile: {
      get: '/investor/users/me',
      update: '/investor/users/me',
    },
    // 設定関連
    settings: {
      account: '/investor/settings/account',
    },
    // トラッキング
    track: '/investor/track',
  },
  
  // 管理者向けAPI
  admin: {
    company: {
      register: '/admin/company/register',
      list: '/admin/companies',
      detail: (id: string) => `/admin/companies/${id}`,
      approve: (id: string) => `/admin/companies/${id}/approve`,
    },
    corporate: {
      registerUser: '/admin/corporate/register',
      list: '/admin/corporate/users',
      detail: (userId: string) => `/admin/corporate/users/${userId}`,
      updateStatus: (userId: string) => `/admin/corporate/users/${userId}/status`,
    },
  },
  // 共通
  common: {
      tokenInfo: '/auth/token',
      listShows: '/api/shows',
      authTest: '/auth/test',
      showsTest: '/shows/test'
  }
};