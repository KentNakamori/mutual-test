/**
 * @file user.ts
 * @description ユーザー管理/マイページ系APIのリクエスト/レスポンス型定義
 */

import { NotificationSetting } from "../domain";

/**
 * ユーザープロファイル取得用 Response
 */
export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  introduction?: string;
}

/**
 * ユーザープロファイル更新用 Request
 */
export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
  introduction?: string;
}

/**
 * ユーザープロファイル更新用 Response
 */
export interface UpdateUserProfileResponse {
  /** 更新後のプロフィール情報 */
  profile: UserProfileResponse;
}

/**
 * パスワード変更用 Request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * パスワード変更用 Response
 */
export interface ChangePasswordResponse {
  message: string;
}

/**
 * 通知設定取得/更新用 Request/Response
 */
export interface NotificationSettingRequest
  extends Partial<NotificationSetting> {}

export interface NotificationSettingResponse
  extends NotificationSetting {
  // 取得後の最新設定を返す
}

/**
 * アカウント削除(退会) Request
 */
export interface DeleteAccountRequest {
  confirmPassword: string;
  reason?: string;
}

/**
 * アカウント削除(退会) Response
 */
export interface DeleteAccountResponse {
  message: string;
}
