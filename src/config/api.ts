// config/api.ts

// API のベース URL は環境変数などで管理
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// エンドポイントの定義（動的パラメータが必要な場合は、関数内で組み立てます）
export const ENDPOINTS = {
  // 共通認証・ユーザー管理
  login: "/api/corporate/corporate/auth/login",
  refresh: "/api/investor/investor/auth/refresh",
  passwordReset: "/auth/password/reset",
  register: "/api/investor/investor/auth/register",
  getMe: "/api/investor/investor/users/me",
  updateMe: "/api/investor/investor/users/me",
  search: "/search",
  logout: "/api/corporate/corporate/auth/logout",

  // 企業向け API
  corporateLogin: "/api/corporate/corporate/auth/login",
  corporateLogout: "/api/corporate/corporate/auth/logout",
  corporateDashboard: "/api/corporate/corporate/dashboard",
  corporateQaSearch: "/api/corporate/corporate/qa/search",
  corporateQa: "/api/corporate/corporate/qa",
  corporateQaUpload: "/api/corporate/corporate/documents/upload",
  corporateQaBatchCreate: "/api/corporate/corporate/qa/batchCreate",
  corporateDrafts: "/api/corporate/corporate/irchat/history",
  corporateIrChat: "/api/corporate/corporate/irchat",
  corporateIrChatHistory: "/api/corporate/corporate/irchat/history",
  corporateIrChatNew: "/api/corporate/corporate/irchat/new",
  corporateMailDraft: "/api/corporate/corporate/maildraft",
  corporateCompanySettings: "/api/corporate/corporate/settings/company",
  corporateAccountSettings: "/api/corporate/corporate/settings/account",

  // 投資家向け API
  investorLogin: "/api/investor/investor/auth/login",
  investorLogout: "/api/investor/investor/auth/logout",
  investorGuest: "/api/investor/investor/auth/guest",
  investorCompanies: "/api/investor/investor/companies",
  investorCompanyQa: "/api/investor/investor/companies",
  investorQaSearch: "/api/investor/investor/qa/search",
  investorQa: "/api/investor/investor/qa",
  investorChatLogs: "/api/investor/investor/chat/logs",
  investorUser: "/api/investor/investor/users/me",

  // 管理者用 API
  adminCompanyRegister: "/api/admin/company/admin/company/register",
  adminCorporateRegister: "/api/admin/corporate/admin/corporate/register",
};
