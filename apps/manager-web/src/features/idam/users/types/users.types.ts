/**
 * Users GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * GraphQL 스키마와 직접 매칭되는 타입입니다.
 * 불필요한 타입 변환이 없어 성능이 우수합니다.
 */

// ===== 사용자 데이터 타입 =====

/**
 * Manager User (ID&Access Management)
 * GraphQL 필드는 camelCase입니다 (Strawberry 자동 변환)
 */
export interface User {
  id: string;
  userType: string; // MASTER, TENANT, SYSTEM
  fullName: string;
  email: string;
  phone?: string;
  username: string;
  ssoProvider?: string;
  ssoSubject?: string;
  mfaEnabled: boolean;
  status: "ACTIVE" | "INACTIVE" | "LOCKED";
  lastLoginAt?: string;
  lastLoginIp?: string;
  failedLoginAttempts: number;
  forcePasswordChange: boolean;
  timezone: string;
  locale: string;
  department?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== Request/Response 타입 =====

/**
 * 사용자 생성 요청
 */
export interface CreateUserRequest {
  userType: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  phone?: string;
  department?: string;
  position?: string;
}

/**
 * 사용자 수정 요청
 */
export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: string;
  mfaEnabled?: boolean;
}

/**
 * 사용자 목록 응답
 */
export interface UsersListResponse {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== 쿼리 파라미터 타입 =====

/**
 * 사용자 목록 조회 파라미터
 */
export interface UsersQueryParams {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}

// ===== 호환성 타입 (기존 코드 지원) =====

/**
 * @deprecated User 사용 권장
 */
export type Users = User;

/**
 * @deprecated CreateUserRequest 사용 권장
 */
export type CreateUsersRequest = CreateUserRequest;

/**
 * @deprecated UpdateUserRequest 사용 권장
 */
export type UpdateUsersRequest = UpdateUserRequest;

/**
 * @deprecated UsersListResponse 사용 권장
 */
export type UsersListResponse = UsersListResponse;

/**
 * @deprecated UsersQueryParams 사용 권장
 */
export type UsersQueryParams = UsersQueryParams;
