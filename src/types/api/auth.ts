/**
 types/auth.ts
 * @description 認証系APIのリクエスト/レスポンス型定義
 */

/**
 * ログインAPI Request
 */
export interface AuthLoginRequest {
    email: string;
    password: string;
  }
  
  /**
   * ログインAPI Response
   */
  export interface AuthLoginResponse {
    token: string;       // JWTやセッショントークン
    userId: string;
    expiresIn: number;   // トークン有効期限(秒など)
  }
  
  /**
   * ゲスト用API Request
   */
  export interface AuthGuestRequest {
    /** ゲスト利用規約への同意フラグ */
    agreeTerms: boolean;
  }
  
  /**
   * ゲスト用API Response
   */
  export interface AuthGuestResponse {
    guestToken: string;
    expiresIn: number;
  }
  
  /**
   * 新規ユーザー登録API Request
   */
  export interface AuthSignupRequest {
    email: string;
    password: string;
    displayName: string;
  }
  
  /**
   * 新規ユーザー登録API Response
   */
  export interface AuthSignupResponse {
    userId: string;
    token: string;
    message: string;
  }
  
  /**
   * パスワードリセットAPI Request
   */
  export interface AuthPasswordResetRequest {
    email: string;
  }
  
  /**
   * パスワードリセットAPI Response
   */
  export interface AuthPasswordResetResponse {
    message: string;
  }
  