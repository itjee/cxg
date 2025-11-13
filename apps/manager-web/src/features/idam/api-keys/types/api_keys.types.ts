/**
 * @file api_keys.types.ts
 * @description API 키 관리 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * - ApiKey: API 키 엔티티 (DB 스키마 기반)
 * - CreateApiKeyRequest: 생성 요청 DTO
 * - UpdateApiKeyRequest: 수정 요청 DTO
 * - ApiKeyListResponse: 목록 응답 DTO
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마: /packages/database/schemas/manager/02_idam/06_api_keys.sql
 */

/**
 * API 키 상태
 */
export type ApiKeyStatus = "ACTIVE" | "INACTIVE" | "REVOKED";

/**
 * API 키 정보 (DB 스키마 기반)
 * 
 * @description
 * 데이터베이스 테이블: idam.api_keys
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, API 키 고유 식별자
 * - created_at: TIMESTAMP, 생성일시
 * - created_by: UUID, 생성자 ID
 * - updated_at: TIMESTAMP, 수정일시
 * - updated_by: UUID, 수정자 ID
 * 
 * @fields API 키 정보
 * - key_id: VARCHAR(100), 공개 키 ID (ak_xxxxxxxxxx)
 * - key_hash: VARCHAR(255), 해시된 실제 키
 * - key_name: VARCHAR(100), 키 이름/설명
 * 
 * @fields 소유자 정보
 * - user_id: UUID, 사용자 ID
 * - tenant_context: UUID, 테넌트 컨텍스트
 * - service_account: VARCHAR(100), 서비스 계정명
 * 
 * @fields 권한 및 스코프
 * - scopes: TEXT[], API 키 권한 스코프 배열
 * - allowed_ips: INET[], 허용 IP 주소 배열
 * 
 * @fields 사용 제한
 * - rate_limit_per_minute: INTEGER, 분당 요청 제한
 * - rate_limit_per_hour: INTEGER, 시간당 요청 제한
 * - rate_limit_per_day: INTEGER, 일당 요청 제한
 * 
 * @fields 상태 및 만료
 * - status: VARCHAR(20), API 키 상태 (ACTIVE, INACTIVE, REVOKED)
 * - expires_at: TIMESTAMP, 만료일시
 * 
 * @fields 사용 통계
 * - last_used_at: TIMESTAMP, 마지막 사용일시
 * - last_used_ip: INET, 마지막 사용 IP
 * - usage_count: BIGINT, 사용 횟수
 */
export interface ApiKey {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // API 키 정보
  key_id: string;
  key_hash: string;
  key_name: string;

  // 소유자 정보
  user_id: string;
  tenant_context?: string;
  service_account?: string;

  // 권한 및 스코프
  scopes?: string[];
  allowed_ips?: string[];

  // 사용 제한
  rate_limit_per_minute: number;
  rate_limit_per_hour: number;
  rate_limit_per_day: number;

  // 상태 및 만료
  status: ApiKeyStatus;
  expires_at?: string;

  // 사용 통계
  last_used_at?: string;
  last_used_ip?: string;
  usage_count: number;
}

/**
 * API 키 생성 요청 DTO
 * 
 * @required
 * - key_name: 키 이름/설명
 * - user_id: 사용자 ID
 * 
 * @optional
 * - tenant_context: 테넌트 컨텍스트
 * - service_account: 서비스 계정명
 * - scopes: API 키 권한 스코프 배열
 * - allowed_ips: 허용 IP 주소 배열
 * - rate_limit_per_minute: 분당 요청 제한 (기본값: 1000)
 * - rate_limit_per_hour: 시간당 요청 제한 (기본값: 10000)
 * - rate_limit_per_day: 일당 요청 제한 (기본값: 100000)
 * - expires_at: 만료일시
 */
export interface CreateApiKeyRequest {
  key_name: string;
  user_id: string;
  tenant_context?: string;
  service_account?: string;
  scopes?: string[];
  allowed_ips?: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  expires_at?: string;
}

/**
 * API 키 수정 요청 DTO
 * 
 * @optional 모든 필드 선택적 (PATCH 방식)
 * - key_name: 키 이름/설명
 * - scopes: API 키 권한 스코프 배열
 * - allowed_ips: 허용 IP 주소 배열
 * - rate_limit_per_minute: 분당 요청 제한
 * - rate_limit_per_hour: 시간당 요청 제한
 * - rate_limit_per_day: 일당 요청 제한
 * - status: API 키 상태
 * - expires_at: 만료일시
 */
export interface UpdateApiKeyRequest {
  key_name?: string;
  scopes?: string[];
  allowed_ips?: string[];
  rate_limit_per_minute?: number;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  status?: ApiKeyStatus;
  expires_at?: string;
}

/**
 * API 키 목록 응답 DTO
 * 
 * @description
 * 페이지네이션을 포함한 목록 응답
 * 
 * @fields
 * - data: API 키 배열
 * - total: 전체 개수
 * - page: 현재 페이지 (0-based)
 * - pageSize: 페이지당 항목 수
 */
export interface ApiKeyListResponse {
  data: ApiKey[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * API 키 상세 응답 DTO
 */
export interface ApiKeyDetailResponse {
  data: ApiKey;
}

/**
 * API 키 쿼리 파라미터
 * 
 * @description
 * 목록 조회 시 사용하는 쿼리 파라미터
 * 
 * @params
 * - page: 페이지 번호 (0-based)
 * - pageSize: 페이지당 항목 수
 * - search: 검색어 (key_name, key_id 검색)
 * - status: 상태 필터
 * - user_id: 사용자 ID 필터
 * - tenant_context: 테넌트 컨텍스트 필터
 */
export type ApiKeyQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ApiKeyStatus;
  user_id?: string;
  tenant_context?: string;
};
