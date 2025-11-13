/**
 * @file sessions.types.ts
 * @description 세션 관리 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * - Session: 세션 엔티티 (DB 스키마 기반)
 * - CreateSessionRequest: 생성 요청 DTO
 * - UpdateSessionRequest: 수정 요청 DTO
 * - SessionListResponse: 목록 응답 DTO
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마: /packages/database/schemas/manager/02_idam/07_sessions.sql
 */

/**
 * 세션 상태
 */
export type SessionStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

/**
 * 세션 타입
 */
export type SessionType = "WEB" | "API" | "MOBILE";

/**
 * 세션 정보 (DB 스키마 기반)
 * 
 * @description
 * 데이터베이스 테이블: idam.sessions
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, 세션 고유 식별자
 * - created_at: TIMESTAMP, 생성일시
 * - created_by: UUID, 생성자 ID
 * - updated_at: TIMESTAMP, 수정일시
 * - updated_by: UUID, 수정자 ID
 * 
 * @fields 세션 정보
 * - session_id: VARCHAR(255), 세션 토큰 해시
 * - user_id: UUID, 사용자 ID
 * 
 * @fields 세션 컨텍스트
 * - tenant_context: UUID, 현재 세션의 테넌트 컨텍스트
 * - session_type: VARCHAR(20), 세션 타입 (WEB, API, MOBILE)
 * 
 * @fields 세션 메타데이터
 * - fingerprint: VARCHAR(255), 디바이스 핑거프린트
 * - user_agent: TEXT, 사용자 에이전트
 * - ip_address: INET, IP 주소
 * - country_code: CHAR(2), 국가 코드
 * - city: VARCHAR(100), 도시명
 * 
 * @fields 세션 상태
 * - status: VARCHAR(20), 세션 상태 (ACTIVE, EXPIRED, REVOKED)
 * - expires_at: TIMESTAMP, 만료일시
 * - last_activity_at: TIMESTAMP, 마지막 활동일시
 * 
 * @fields MFA 정보
 * - mfa_verified: BOOLEAN, MFA 인증 여부
 * - mfa_verified_at: TIMESTAMP, MFA 인증일시
 */
export interface Session {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 세션 정보
  session_id: string;
  user_id: string;

  // 세션 컨텍스트
  tenant_context?: string;
  session_type: SessionType;

  // 세션 메타데이터
  fingerprint?: string;
  user_agent?: string;
  ip_address: string;
  country_code?: string;
  city?: string;

  // 세션 상태
  status: SessionStatus;
  expires_at: string;
  last_activity_at: string;

  // MFA 정보
  mfa_verified: boolean;
  mfa_verified_at?: string;
}

/**
 * 세션 생성 요청 DTO
 * 
 * @required
 * - user_id: 사용자 ID
 * - ip_address: IP 주소
 * - expires_at: 만료일시
 * 
 * @optional
 * - tenant_context: 테넌트 컨텍스트
 * - session_type: 세션 타입 (기본값: WEB)
 * - fingerprint: 디바이스 핑거프린트
 * - user_agent: 사용자 에이전트
 * - country_code: 국가 코드
 * - city: 도시명
 */
export interface CreateSessionRequest {
  user_id: string;
  ip_address: string;
  expires_at: string;
  tenant_context?: string;
  session_type?: SessionType;
  fingerprint?: string;
  user_agent?: string;
  country_code?: string;
  city?: string;
}

/**
 * 세션 수정 요청 DTO
 * 
 * @optional 모든 필드 선택적 (PATCH 방식)
 * - status: 세션 상태
 * - last_activity_at: 마지막 활동일시
 * - mfa_verified: MFA 인증 여부
 * - mfa_verified_at: MFA 인증일시
 */
export interface UpdateSessionRequest {
  status?: SessionStatus;
  last_activity_at?: string;
  mfa_verified?: boolean;
  mfa_verified_at?: string;
}

/**
 * 세션 목록 응답 DTO
 * 
 * @description
 * 페이지네이션을 포함한 목록 응답
 * 
 * @fields
 * - data: 세션 배열
 * - total: 전체 개수
 * - page: 현재 페이지 (0-based)
 * - pageSize: 페이지당 항목 수
 */
export interface SessionListResponse {
  data: Session[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 세션 상세 응답 DTO
 */
export interface SessionDetailResponse {
  data: Session;
}

/**
 * 세션 쿼리 파라미터
 * 
 * @description
 * 목록 조회 시 사용하는 쿼리 파라미터
 * 
 * @params
 * - page: 페이지 번호 (1-based for API)
 * - pageSize: 페이지당 항목 수
 * - search: 검색어 (session_id, ip_address 검색)
 * - status: 상태 필터 (ACTIVE, EXPIRED, REVOKED)
 * - user_id: 사용자 ID 필터
 * - session_type: 세션 타입 필터 (WEB, API, MOBILE)
 * - tenant_context: 테넌트 컨텍스트 필터
 * - fingerprint: 디바이스 핑거프린트 필터
 * - ip_address: IP 주소 필터
 * - mfa_verified: MFA 인증 여부 필터
 */
export type SessionQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SessionStatus;
  user_id?: string;
  session_type?: SessionType;
  tenant_context?: string;
  fingerprint?: string;
  ip_address?: string;
  mfa_verified?: boolean;
};
