/**
 * 비밀번호 재설정 관련 타입 정의
 */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_token?: string; // 개발 환경에서만
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
  username?: string; // 테스트용: admin 계정은 토큰 검증 생략
}

export interface ResetPasswordResponse {
  message: string;
}
