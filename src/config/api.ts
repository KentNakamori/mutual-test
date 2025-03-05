// config/api.ts

// API のベース URL は環境変数などで管理
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// エンドポイントの定義（動的パラメータが必要な場合は、関数内で組み立てます）
export const ENDPOINTS = {
  // 共通認証・ユーザー管理
  login: "/auth/login",
  refresh: "/auth/refresh",
  passwordReset: "/auth/password/reset",
  register: "/auth/register",
  getMe: "/users/me",
  updateMe: "/users/me",
  search: "/search",
  logout: "/auth/logout",

  // 企業向け API
  corporateLogin: "/corporate/auth/login",
  corporateLogout: "/corporate/auth/logout",
  corporateDashboard: "/corporate/dashboard",
  corporateQaSearch: "/corporate/qa/search",
  // 以下、動的パラメータを付与するためのベース URL
  corporateQa: "/corporate/qa", // PUT /:id, DELETE /:id
  corporateQaUpload: "/corporate/qa/upload",
  corporateQaBatchCreate: "/corporate/qa/batchCreate",
  corporateDrafts: "/corporate/irchat/drafts", // GET 一覧, GET /:draftId 詳細
  corporateIrChat: "/corporate/irchat",
  corporateMailDraft: "/corporate/maildraft",
  corporateCompanySettings: "/corporate/settings/company",
  corporateAccountSettings: "/corporate/settings/account",

  // 投資家向け API
  investorLogin: "/investor/auth/login",
  investorLogout: "/investor/auth/logout",
  investorGuest: "/investor/auth/guest",
  investorCompanies: "/investor/companies", // GET 一覧, GET /:companyId 詳細
  investorCompanyQa: "/investor/companies", // GET /:companyId/qa
  investorQaSearch: "/investor/qa/search",
  investorQa: "/investor/qa", // POST /:qaId/like, POST /:qaId/bookmark
  investorChatLogs: "/investor/chat/logs", // GET 一覧, DELETE /:chatId, PATCH /:chatId/archive
  investorUser: "/investor/users/me", // GET, PATCH, PATCH /password, PATCH /notification, DELETE
};
