/**
 * @file onboardings.types.ts
 * @description 온보딩 프로세스 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마: /packages/database/schemas/manager/01_tnnt/03_onboardings.sql
 */

/**
 * 온보딩 단계명
 * REGISTRATION: 가입
 * EMAIL_VERIFICATION: 이메일 인증
 * SCHEMA_CREATION: 스키마 생성
 * INITIAL_SETUP: 초기 설정
 * DATA_MIGRATION: 데이터 마이그레이션
 * CONFIGURATION: 환경 설정
 * COMPLETED: 완료
 */
export type OnboardingStepName =
  | 'REGISTRATION'
  | 'EMAIL_VERIFICATION'
  | 'SCHEMA_CREATION'
  | 'INITIAL_SETUP'
  | 'DATA_MIGRATION'
  | 'CONFIGURATION'
  | 'COMPLETED';

/**
 * 온보딩 단계 상태
 * PENDING: 대기중
 * IN_PROGRESS: 진행중
 * COMPLETED: 완료
 * FAILED: 실패
 * SKIPPED: 건너뜀
 */
export type OnboardingStepStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

/**
 * 온보딩 레코드 상태
 * ACTIVE: 활성
 * ARCHIVED: 보관
 * OBSOLETE: 구버전
 */
export type OnboardingStatus = 'ACTIVE' | 'ARCHIVED' | 'OBSOLETE';

/**
 * 온보딩 프로세스 정보 (DB 스키마 기반)
 * 
 * @description
 * 데이터베이스 테이블: tnnt.onboardings
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, 온보딩 프로세스 고유 식별자
 * - created_at: TIMESTAMP, 온보딩 단계 생성 일시
 * - created_by: UUID, 온보딩 단계 생성자
 * - updated_at: TIMESTAMP, 온보딩 단계 수정 일시
 * - updated_by: UUID, 온보딩 단계 수정자
 * 
 * @fields 대상 테넌트
 * - tenant_id: UUID, 온보딩 대상 테넌트 ID
 * 
 * @fields 온보딩 단계 정보
 * - step_name: VARCHAR(50), 온보딩 단계명
 * - step_order: INTEGER, 단계 실행 순서
 * - step_status: VARCHAR(20), 단계 상태
 * 
 * @fields 단계 처리 시간 정보
 * - started_at: TIMESTAMP, 단계 시작 일시
 * - completed_at: TIMESTAMP, 단계 완료 일시
 * - error_message: TEXT, 실패 시 오류 메시지
 * - retry_count: INTEGER, 재시도 횟수
 * 
 * @fields 단계별 메타데이터
 * - step_data: JSONB, 각 단계별 필요한 추가 데이터
 * 
 * @fields 상태 관리
 * - status: VARCHAR(20), 온보딩 레코드 상태
 * - is_deleted: BOOLEAN, 논리적 삭제 플래그
 */
export interface Onboarding {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 대상 테넌트
  tenant_id: string;

  // 온보딩 단계 정보
  step_name: OnboardingStepName;
  step_order: number;
  step_status: OnboardingStepStatus;

  // 단계 처리 시간 정보
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count: number;

  // 단계별 메타데이터
  step_data?: Record<string, any>;

  // 상태 관리
  status: OnboardingStatus;
  is_deleted: boolean;
}

/**
 * 온보딩 생성 요청 DTO
 */
export interface CreateOnboardingRequest {
  tenant_id: string;
  step_name: OnboardingStepName;
  step_order: number;
  step_status?: OnboardingStepStatus;
  step_data?: Record<string, any>;
}

/**
 * 온보딩 수정 요청 DTO
 */
export interface UpdateOnboardingRequest {
  step_status?: OnboardingStepStatus;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  retry_count?: number;
  step_data?: Record<string, any>;
  status?: OnboardingStatus;
}

/**
 * 온보딩 목록 응답 DTO
 * 
 * @description
 * 페이지네이션을 포함한 목록 응답
 * 
 * @fields
 * - data: 온보딩 프로세스 배열
 * - total: 전체 개수
 * - page: 현재 페이지 (1-based)
 * - pageSize: 페이지당 항목 수
 */
export interface OnboardingListResponse {
  data: Onboarding[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 온보딩 상세 응답 DTO
 */
export interface OnboardingDetailResponse {
  data: Onboarding;
}

/**
 * 온보딩 쿼리 파라미터
 * 
 * @description
 * 목록 조회 시 사용하는 쿼리 파라미터
 * 
 * @params
 * - page: 페이지 번호 (1-based for API)
 * - pageSize: 페이지당 항목 수
 * - search: 검색어 (tenant_id, step_name 검색)
 * - tenant_id: 테넌트 ID 필터
 * - step_name: 단계명 필터
 * - step_status: 단계 상태 필터
 * - status: 레코드 상태 필터
 * - is_deleted: 삭제 여부 필터
 */
export interface OnboardingQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tenant_id?: string;
  step_name?: OnboardingStepName;
  step_status?: OnboardingStepStatus;
  status?: OnboardingStatus;
  is_deleted?: boolean;
}
