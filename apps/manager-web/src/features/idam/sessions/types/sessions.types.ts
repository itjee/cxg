/**
 * @file sessions.types.ts
 * @description 세션 관리 GraphQL 타입 정의 (camelCase - GraphQL 네이티브)
 *
 * 타입 명명 규칙:
 * - 단일 조회, 단일 모델 타입: 단수형 (Session)
 * - 목록 조회, 목록 파라미터: 복수형 (SessionsQueryVariables)
 * - Create/Update Input: 단수형 (CreateSessionInput, UpdateSessionInput)
 *
 * GraphQL 스키마와 직접 매칭되는 타입입니다.
 * 불필요한 타입 변환이 없어 성능이 우수합니다.
 */

/**
 * 세션 상태
 */
export type SessionStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

/**
 * 세션 타입
 */
export type SessionType = "WEB" | "API" | "MOBILE";

// ===== 단일 세션 타입 (단수) =====

/**
 * 세션 정보 (GraphQL 필드는 camelCase)
 *
 * @description
 * 데이터베이스 테이블: idam.sessions
 *
 * @singular 단일 조회, 단일 엔티티 타입
 */
export interface Session {
  // 기본 식별자 및 감사 필드
  id: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;

  // 세션 정보
  sessionId: string;
  userId: string;

  // 세션 컨텍스트
  tenantContext?: string;
  sessionType: SessionType;

  // 세션 메타데이터
  fingerprint?: string;
  userAgent?: string;
  ipAddress: string;
  countryCode?: string;
  city?: string;

  // 세션 상태
  status: SessionStatus;
  expiresAt: string;
  lastActivityAt: string;

  // MFA 정보
  mfaVerified: boolean;
  mfaVerifiedAt?: string;
}

// ===== Create/Update Input 타입 (단수) =====

/**
 * 세션 생성 입력 (GraphQL camelCase)
 */
export interface CreateSessionInput {
  userId: string;
  ipAddress: string;
  expiresAt: string;
  tenantContext?: string;
  sessionType?: SessionType;
  fingerprint?: string;
  userAgent?: string;
  countryCode?: string;
  city?: string;
}

/**
 * 세션 수정 입력 (GraphQL camelCase)
 */
export interface UpdateSessionInput {
  status?: SessionStatus;
  lastActivityAt?: string;
  mfaVerified?: boolean;
  mfaVerifiedAt?: string;
}

// ===== 목록 조회 파라미터 (복수) =====

/**
 * 세션 목록 조회 파라미터
 *
 * @plural 목록 조회 파라미터
 */
export interface SessionsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  status?: SessionStatus;
  userId?: string;
  sessionType?: SessionType;
  tenantContext?: string;
  fingerprint?: string;
  ipAddress?: string;
  mfaVerified?: boolean;
}

// ===== GraphQL 응답 타입 =====

/**
 * 세션 목록 조회 응답
 */
export interface GetSessionsResponse {
  sessions: Session[];
}

/**
 * 세션 상세 조회 응답
 */
export interface GetSessionResponse {
  session: Session;
}

/**
 * 세션 생성 응답
 */
export interface CreateSessionResponse {
  createSession: Session;
}

/**
 * 세션 수정 응답
 */
export interface UpdateSessionResponse {
  updateSession: Session;
}

/**
 * 세션 삭제 응답
 */
export interface DeleteSessionResponse {
  deleteSession: { message: string };
}

/**
 * 세션 폐기 응답
 */
export interface RevokeSessionResponse {
  revokeSession: { id: string; status: string };
}

/**
 * 사용자 세션 모두 폐기 응답
 */
export interface RevokeUserSessionsResponse {
  revokeUserSessions: { message: string };
}
