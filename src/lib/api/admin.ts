import { apiFetch } from "./client";
import { ENDPOINTS } from "../../config/api";

/**
 * 管理者向けAPI
 */

/**
 * 企業登録API
 * 
 * 入力:
 * - formData: FormData containing company information and logo file
 * 
 * 出力:
 * - companyId: 登録された企業のID
 * - message: 登録完了メッセージ
 */
export async function registerCompany(formData: FormData): Promise<{
  companyId: string;
  message: string;
}> {
  return apiFetch<{
    companyId: string;
    message: string;
  }>(ENDPOINTS.admin.company.register, "POST", formData, undefined, false, true);
}

/**
 * 企業一覧取得API
 * 
 * 出力:
 * - companies: 企業一覧
 */
export async function getCompanies(): Promise<{
  companies: Array<{
    companyId: string;
    companyName: string;
  }>;
}> {
  return apiFetch<{
    companies: Array<{
      companyId: string;
      companyName: string;
    }>;
  }>(ENDPOINTS.admin.company.list, "GET", undefined, undefined, false, true);
} 