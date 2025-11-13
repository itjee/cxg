/**
 * @file login-logs.types.ts
 * @description 로그인 이력 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * - LoginLog: 로그인 이력 엔티티 (DB 스키마 기반)
 * - CreateLoginLogRequest: 생성 요청 DTO
 * - LoginLogListResponse: 목록 응답 DTO
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마: /packages/database/schemas/manager/02_idam/08_login_logs.sql
 */

/**
 * 시도 타입
 */
export type AttemptType = 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'LOCKED' | 'PASSWORD_RESET';

/**
 * 사용자 타입
 */
export type UserType = 'MASTER' | 'TENANT' | 'SYSTEM';

/**
 * MFA 방법
 */
export type MfaMethod = 'TOTP' | 'SMS' | 'EMAIL';

/**
 * 로그인 이력 정보 (DB 스키마 기반)
 * 
 * @description
 * 데이터베이스 테이블: idam.login_logs
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, 로그인 이력 고유 식별자
 * - created_at: TIMESTAMP, 생성일시
 * - created_by: UUID, 생성자 ID
 * - updated_at: TIMESTAMP, 수정일시
 * - updated_by: UUID, 수정자 ID
 * 
 * @fields 사용자 정보
 * - user_id: UUID, 사용자 ID (존재하지 않는 사용자의 경우 NULL)
 * - user_type: VARCHAR(20), 사용자 타입 (MASTER, TENANT, SYSTEM)
 * - tenant_context: UUID, 로그인 시 테넌트 컨텍스트
 * - username: VARCHAR(100), 사용자명 (삭제된 사용자 이력 보존용)
 * 
 * @fields 로그인 시도 정보
 * - attempt_type: VARCHAR(20), 시도 타입 (LOGIN, LOGOUT, FAILED_LOGIN, LOCKED, PASSWORD_RESET)
 * - success: BOOLEAN, 성공 여부
 * - failure_reason: VARCHAR(100), 실패 사유
 * 
 * @fields 세션 정보
 * - session_id: VARCHAR(255), 세션 ID
 * - ip_address: INET, IP 주소
 * - user_agent: TEXT, 사용자 에이전트
 * - country_code: CHAR(2), 국가 코드
 * - city: VARCHAR(100), 도시명
 * 
 * @fields MFA 정보
 * - mfa_used: BOOLEAN, MFA 사용 여부
 * - mfa_method: VARCHAR(50), MFA 방법 (TOTP, SMS, EMAIL)
 */
export interface LoginLog {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 사용자 정보
  user_id?: string;
  user_type?: UserType;
  tenant_context?: string;
  username?: string;

  // 로그인 시도 정보
  attempt_type: AttemptType;
  success: boolean;
  failure_reason?: string;

  // 세션 정보
  session_id?: string;
  ip_address: string;
  user_agent?: string;
  country_code?: string;
  city?: string;

  // MFA 정보
  mfa_used: boolean;
  mfa_method?: MfaMethod;
}

/**
 * 로그인 이력 생성 요청 DTO
 * 
 * @required
 * - attempt_type: 시도 타입
 * - success: 성공 여부
 * - ip_address: IP 주소
 * - mfa_used: MFA 사용 여부
 * 
 * @optional
 * - user_id: 사용자 ID
 * - user_type: 사용자 타입
 * - tenant_context: 테넌트 컨텍스트
 * - username: 사용자명
 * - failure_reason: 실패 사유
 * - session_id: 세션 ID
 * - user_agent: 사용자 에이전트
 * - country_code: 국가 코드
 * - city: 도시명
 * - mfa_method: MFA 방법
 */
export interface CreateLoginLogRequest {
  attempt_type: AttemptType;
  success: boolean;
  ip_address: string;
  mfa_used: boolean;
  user_id?: string;
  user_type?: UserType;
  tenant_context?: string;
  username?: string;
  failure_reason?: string;
  session_id?: string;
  user_agent?: string;
  country_code?: string;
  city?: string;
  mfa_method?: MfaMethod;
}

/**
 * 로그인 이력 목록 응답 DTO
 * 
 * @description
 * 페이지네이션을 포함한 목록 응답
 * 
 * @fields
 * - data: 로그인 이력 배열
 * - total: 전체 개수
 * - page: 현재 페이지 (1-based)
 * - pageSize: 페이지당 항목 수
 */
export interface LoginLogListResponse {
  data: LoginLog[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 로그인 이력 상세 응답 DTO
 */
export interface LoginLogDetailResponse {
  data: LoginLog;
}

/**
 * 로그인 이력 쿼리 파라미터
 * 
 * @description
 * 목록 조회 시 사용하는 쿼리 파라미터
 * 
 * @params
 * - page: 페이지 번호 (1-based for API)
 * - pageSize: 페이지당 항목 수
 * - search: 검색어 (username, ip_address 검색)
 * - attempt_type: 시도 타입 필터
 * - success: 성공 여부 필터
 * - user_id: 사용자 ID 필터
 * - user_type: 사용자 타입 필터
 * - tenant_context: 테넌트 컨텍스트 필터
 * - failure_reason: 실패 사유 필터
 * - mfa_used: MFA 사용 여부 필터
 * - ip_address: IP 주소 필터
 * - start_date: 시작일
 * - end_date: 종료일
 */
export type LoginLogQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  attempt_type?: AttemptType;
  success?: boolean;
  user_id?: string;
  user_type?: UserType;
  tenant_context?: string;
  failure_reason?: string;
  mfa_used?: boolean;
  ip_address?: string;
  start_date?: string;
  end_date?: string;
};
