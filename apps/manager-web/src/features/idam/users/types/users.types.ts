/**
 * @file users.types.ts
 * @description 사용자 GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회/단일 모델: 단수형 (User, Session, Permission)
 * - 목록 조회/목록 파라미터: 복수형 (Users, Sessions, Permissions)
 * - Create/Update Input: 단수형 (CreateUserInput, UpdateUserInput)
 */

// ===== 단일 사용자 타입 =====

/**
 * Manager User (ID&Access Management)
 * GraphQL 필드는 camelCase입니다
 *
 * @singular 단일 조회, 단일 엔티티 타입
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
  status: "ACTIVE" | "INACTIVE" | "LOCKED" | "SUSPENDED";
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

// ===== Create/Update Input 타입 (단수) =====

/**
 * 사용자 생성 입력
 */
export interface CreateUserInput {
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
 * 사용자 수정 입력
 */
export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: string;
  mfaEnabled?: boolean;
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * 사용자 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface UsersQueryVariables {
  limit?: number;
  offset?: number;
  userType?: string;
  status?: string;
}

// ===== GraphQL 응답 타입 =====

/**
 * 사용자 목록 조회 응답
 */
export interface GetUsersResponse {
  users: User[];
}

/**
 * 사용자 상세 조회 응답
 */
export interface GetUserResponse {
  user: User;
}

/**
 * 사용자 생성 응답
 */
export interface CreateUserResponse {
  createUser: User;
}

/**
 * 사용자 수정 응답
 */
export interface UpdateUserResponse {
  updateUser: User;
}
