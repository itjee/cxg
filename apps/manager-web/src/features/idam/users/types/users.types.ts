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
  lockedUntil?: string; // 계정 잠금 해제 예정 시간
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
  search?: string;
  mfaEnabled?: boolean;
  forcePasswordChange?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

/**
 * 사용자 상세 조회 파라미터
 *
 * @singular 단수 조회 파라미터
 */
export interface UserQueryVariables {
  id: string;
}

/**
 * 사용자 생성 뮤테이션 변수 (단수)
 */
export interface CreateUserVariables {
  input: CreateUserInput;
}

/**
 * 사용자 수정 뮤테이션 변수 (단수)
 */
export interface UpdateUserVariables {
  id: string;
  input: UpdateUserInput;
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

// ===== UI 필터 상태 타입 =====

/**
 * 사용자 필터 상태 (UI 필터 팝업에서 사용)
 *
 * FilterPopup 컴포넌트에서 사용하는 필터 상태 타입 (멀티 선택)
 * - 각 필터는 여러 값을 배열로 저장
 * - null이면 필터가 선택되지 않은 상태
 * - 날짜 범위 필터는 { type, value } 객체 형식
 */
export interface UsersFilterState {
  status: string[] | null;      // ["ACTIVE", "LOCKED"] 등 여러 상태 선택 가능
  userType: string[] | null;    // ["MASTER", "ADMIN"] 등 여러 타입 선택 가능
  mfaEnabled: string[] | null;  // ["true", "false"] 등 MFA 상태 선택 가능
  forcePasswordChange: string[] | null; // ["true", "false"] 등 비밀번호 상태 선택 가능
  createdAt: { type: string; value: { from?: string; to?: string } } | null; // 생성일시 범위 필터
}
