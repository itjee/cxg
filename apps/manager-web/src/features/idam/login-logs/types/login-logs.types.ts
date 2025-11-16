/**
 * @file login-logs.types.ts
 * @description 로그인 이력 GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회, 단일 모델 타입: 단수형 (LoginLog)
 * - 목록 조회, 목록 파라미터: 복수형 (LoginLogsQueryVariables)
 * - Create Input: 단수형 (CreateLoginLogInput)
 *
 * GraphQL 스키마와 직접 매칭되는 타입입니다.
 * 불필요한 타입 변환이 없어 성능이 우수합니다.
 */

/**
 * 시도 타입
 */
export type AttemptType =
  | "LOGIN"
  | "LOGOUT"
  | "FAILED_LOGIN"
  | "LOCKED"
  | "PASSWORD_RESET";

/**
 * 사용자 타입
 */
export type UserType = "MASTER" | "TENANT" | "SYSTEM";

/**
 * MFA 방법
 */
export type MfaMethod = "TOTP" | "SMS" | "EMAIL";

// ===== 단일 로그인 로그 타입 (단수) =====

/**
 * 로그인 이력 정보 (GraphQL 필드는 camelCase)
 *
 * @description
 * 데이터베이스 테이블: idam.login_logs
 *
 * @singular 단일 조회, 단일 엔티티 타입
 */
export interface LoginLog {
  // 기본 식별자 및 감사 필드
  id: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;

  // 사용자 정보
  userId?: string;
  userType?: UserType;
  tenantContext?: string;
  username?: string;

  // 로그인 시도 정보
  attemptType: AttemptType;
  success: boolean;
  failureReason?: string;

  // 세션 정보
  sessionId?: string;
  ipAddress: string;
  userAgent?: string;
  countryCode?: string;
  city?: string;

  // MFA 정보
  mfaUsed: boolean;
  mfaMethod?: MfaMethod;
}

// ===== Create Input 타입 (단수) =====

/**
 * 로그인 이력 생성 입력 (GraphQL camelCase)
 */
export interface CreateLoginLogInput {
  attemptType: AttemptType;
  success: boolean;
  ipAddress: string;
  mfaUsed: boolean;
  userId?: string;
  userType?: UserType;
  tenantContext?: string;
  username?: string;
  failureReason?: string;
  sessionId?: string;
  userAgent?: string;
  countryCode?: string;
  city?: string;
  mfaMethod?: MfaMethod;
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * 로그인 이력 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface LoginLogsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  attemptType?: AttemptType;
  success?: boolean;
  userId?: string;
  userType?: UserType;
  tenantContext?: string;
  failureReason?: string;
  mfaUsed?: boolean;
  ipAddress?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 로그인 이력 상세 조회 파라미터
 *
 * @singular 단수 조회 파라미터
 */
export interface LoginLogQueryVariables {
  id: string;
}

// ===== 뮤테이션 변수 타입 (단수) =====

/**
 * 로그인 이력 생성 뮤테이션 변수 (단수)
 */
export interface CreateLoginLogVariables {
  input: CreateLoginLogInput;
}

/**
 * 로그인 이력 삭제 뮤테이션 변수 (단수)
 */
export interface DeleteLoginLogVariables {
  id: string;
}

// ===== GraphQL 응답 타입 =====

/**
 * 로그인 이력 목록 조회 응답
 */
export interface GetLoginLogsResponse {
  loginLogs: LoginLog[];
}

/**
 * 로그인 이력 상세 조회 응답
 */
export interface GetLoginLogResponse {
  loginLog: LoginLog;
}

/**
 * 로그인 이력 생성 응답
 */
export interface CreateLoginLogResponse {
  createLoginLog: LoginLog;
}

/**
 * 로그인 이력 삭제 응답
 */
export interface DeleteLoginLogResponse {
  deleteLoginLog: { message: string };
}
