/**
 * @file subscriptions.types.ts
 * @description 구독 TypeScript 타입 정의
 * 
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * 
 * @sync 데이터베이스 동기화
 * DB 스키마: /packages/database/schemas/manager/01_tnnt/02_subscriptions.sql
 */

/**
 * 구독 상태
 * ACTIVE: 활성
 * SUSPENDED: 일시중단
 * EXPIRED: 만료
 * CANCELED: 해지
 */
export type SubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELED';

/**
 * 청구 주기
 * MONTHLY: 월별
 * QUARTERLY: 분기별
 * YEARLY: 연별
 */
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

/**
 * 구독 정보 (DB 스키마 기반)
 * 
 * @description
 * 데이터베이스 테이블: tnnt.subscriptions
 * 
 * @fields 기본 식별자 및 감사 필드
 * - id: UUID, 구독 고유 식별자
 * - created_at: TIMESTAMP, 구독 등록 일시
 * - created_by: UUID, 구독 등록자
 * - updated_at: TIMESTAMP, 구독 수정 일시
 * - updated_by: UUID, 구독 수정자
 * 
 * @fields 테넌트 연결
 * - tenant_id: UUID, 구독 대상 테넌트 ID
 * 
 * @fields 구독 계획 정보
 * - plan_id: UUID, 구독 계획 ID
 * - start_date: DATE, 구독 시작일
 * - close_date: DATE, 구독 종료일 (NULL: 무기한)
 * - billing_cycle: VARCHAR(20), 청구 주기
 * 
 * @fields 사용량 제한 설정
 * - max_users: INTEGER, 최대 허용 사용자 수
 * - max_storage: INTEGER, 최대 스토리지 용량 (GB)
 * - max_api_calls: INTEGER, 월간 최대 API 호출 횟수
 * 
 * @fields 요금 정보
 * - base_amount: NUMERIC(18,4), 기본 요금
 * - user_amount: NUMERIC(18,4), 사용자당 추가 요금
 * - currency: CHAR(3), 통화 단위 (ISO 4217)
 * 
 * @fields 갱신 설정
 * - auto_renewal: BOOLEAN, 자동 갱신 여부
 * - noti_renewal: BOOLEAN, 갱신 알림 발송 여부
 * 
 * @fields 상태 관리
 * - status: VARCHAR(20), 구독 상태
 * - is_deleted: BOOLEAN, 논리적 삭제 플래그
 */
export interface Subscription {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 테넌트 연결
  tenant_id: string;

  // 구독 계획 정보
  plan_id: string;
  start_date: string;
  close_date?: string;
  billing_cycle: BillingCycle;

  // 사용량 제한 설정
  max_users?: number;
  max_storage?: number;
  max_api_calls?: number;

  // 요금 정보
  base_amount: number;
  user_amount?: number;
  currency: string;

  // 갱신 설정
  auto_renewal: boolean;
  noti_renewal: boolean;

  // 상태 관리
  status: SubscriptionStatus;
  is_deleted: boolean;
}

/**
 * 구독 생성 요청 DTO
 * 
 * @required
 * - tenant_id: 테넌트 ID
 * - plan_id: 구독 계획 ID
 * - start_date: 구독 시작일
 * - base_amount: 기본 요금
 * 
 * @optional
 * - close_date: 구독 종료일
 * - billing_cycle: 청구 주기 (기본값: MONTHLY)
 * - max_users: 최대 사용자 수
 * - max_storage: 최대 스토리지
 * - max_api_calls: 최대 API 호출 수
 * - user_amount: 사용자당 추가 요금
 * - currency: 통화 단위 (기본값: KRW)
 * - auto_renewal: 자동 갱신 (기본값: true)
 * - noti_renewal: 갱신 알림 (기본값: false)
 */
export interface CreateSubscriptionRequest {
  tenant_id: string;
  plan_id: string;
  start_date: string;
  close_date?: string;
  billing_cycle?: BillingCycle;
  max_users?: number;
  max_storage?: number;
  max_api_calls?: number;
  base_amount: number;
  user_amount?: number;
  currency?: string;
  auto_renewal?: boolean;
  noti_renewal?: boolean;
}

/**
 * 구독 수정 요청 DTO
 */
export interface UpdateSubscriptionRequest {
  plan_id?: string;
  close_date?: string;
  billing_cycle?: BillingCycle;
  max_users?: number;
  max_storage?: number;
  max_api_calls?: number;
  base_amount?: number;
  user_amount?: number;
  currency?: string;
  auto_renewal?: boolean;
  noti_renewal?: boolean;
  status?: SubscriptionStatus;
}

/**
 * 구독 목록 응답 DTO
 * 
 * @description
 * 페이지네이션을 포함한 목록 응답
 * 
 * @fields
 * - data: 구독 배열
 * - total: 전체 개수
 * - page: 현재 페이지 (1-based)
 * - pageSize: 페이지당 항목 수
 */
export interface SubscriptionListResponse {
  data: Subscription[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 구독 상세 응답 DTO
 */
export interface SubscriptionDetailResponse {
  data: Subscription;
}

/**
 * 구독 쿼리 파라미터
 * 
 * @description
 * 목록 조회 시 사용하는 쿼리 파라미터
 * 
 * @params
 * - page: 페이지 번호 (1-based for API)
 * - pageSize: 페이지당 항목 수
 * - search: 검색어 (tenant_id, plan_id 검색)
 * - tenant_id: 테넌트 ID 필터
 * - plan_id: 구독 계획 ID 필터
 * - status: 구독 상태 필터
 * - billing_cycle: 청구 주기 필터
 * - auto_renewal: 자동 갱신 여부 필터
 * - is_deleted: 삭제 여부 필터
 */
export interface SubscriptionQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tenant_id?: string;
  plan_id?: string;
  status?: SubscriptionStatus;
  billing_cycle?: BillingCycle;
  auto_renewal?: boolean;
  is_deleted?: boolean;
}
