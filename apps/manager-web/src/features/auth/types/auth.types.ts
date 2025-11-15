/**
 * 인증 관련 타입 정의 (GraphQL 네이티브)
 *
 * GraphQL의 camelCase 네이밍을 직접 사용합니다.
 * REST API 호환성 레이어를 제거하여 불필요한 타입 변환을 줄입니다.
 */

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

/**
 * GraphQL Token Response (camelCase)
 * Apollo Client 뮤테이션의 응답을 직접 사용합니다.
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * GraphQL User Response (camelCase)
 * Apollo Client 쿼리의 응답을 직접 사용합니다.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  status: string;
  createdAt: string;
}
