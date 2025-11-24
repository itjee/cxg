/**
 * @file tenants.types.ts
 * @description 테넌트 관리 TypeScript 타입 정의
 *
 * 데이터베이스 스키마와 1:1 매핑되는 타입 정의
 * 참고: /packages/database/schemas/manager/01_tnnt/01_tenants.sql
 *
 * - Tenant: 테넌트 엔티티 (DB 스키마 기반)
 * - CreateTenantRequest: 생성 요청 DTO
 * - UpdateTenantRequest: 수정 요청 DTO
 * - TenantListResponse: 목록 응답 DTO
 */

/**
 * 테넌트 상태 타입
 */
export type TenantStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "TERMINATED";

/**
 * 테넌트 유형 타입
 */
export type TenantType = "TRIAL" | "STANDARD" | "PREMIUM" | "ENTERPRISE";

/**
 * 사업자 구분 타입
 */
export type BizType = "C" | "S"; // C: 법인, S: 개인

/**
 * 테넌트 정보 (DB 스키마 기반: tnnt.tenants)
 *
 * GraphQL API는 camelCase를 반환하며, 기존 코드와의 호환성을 위해
 * snake_case와 camelCase 두 형식의 필드를 모두 지원합니다.
 */
export interface Tenant {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at?: string; // snake_case (legacy)
  createdAt?: string; // camelCase (GraphQL)
  created_by?: string; // snake_case (legacy)
  createdBy?: string; // camelCase (GraphQL)
  updated_at?: string; // snake_case (legacy)
  updatedAt?: string; // camelCase (GraphQL)
  updated_by?: string; // snake_case (legacy)
  updatedBy?: string; // camelCase (GraphQL)

  // 테넌트 기본 정보
  code: string; // 테넌트 식별 코드 (영문+숫자 조합)
  name: string; // 테넌트(회사)명
  type: TenantType; // 테넌트 유형

  // 사업자 등록 정보 (camelCase: GraphQL, snake_case: legacy)
  biz_no?: string; // snake_case (legacy)
  bizNo?: string; // camelCase (GraphQL)
  biz_name?: string; // snake_case (legacy)
  bizName?: string; // camelCase (GraphQL)
  biz_type?: BizType; // snake_case (legacy)
  bizType?: BizType; // camelCase (GraphQL)
  ceo_name?: string; // snake_case (legacy)
  ceoName?: string; // camelCase (GraphQL)
  biz_kind?: string; // 업태
  biz_item?: string; // 종목

  // 주소 정보
  postcode?: string; // 우편번호
  address1?: string; // 주소1 (기본주소)
  address2?: string; // 주소2 (상세주소)
  phone_no?: string; // snake_case (legacy)
  phoneNo?: string; // camelCase (GraphQL)
  employee_count?: number; // snake_case (legacy)
  employeeCount?: number; // camelCase (GraphQL)

  // 계약 정보 (camelCase: GraphQL, snake_case: legacy)
  start_date?: string; // snake_case (legacy)
  startDate?: string; // camelCase (GraphQL)
  close_date?: string; // snake_case (legacy)
  closeDate?: string; // camelCase (GraphQL)

  // 지역화 설정
  timezone?: string; // 시간대
  locale?: string; // 로케일
  currency?: string; // 기본 통화

  // 메타데이터
  extra_data?: Record<string, unknown>; // JSON 형태의 추가 메타정보

  // 상태 관리 (camelCase: GraphQL, snake_case: legacy)
  status: TenantStatus; // 테넌트 상태
  is_suspended?: boolean; // snake_case (legacy)
  isSuspended?: boolean; // camelCase (GraphQL)
  suspended_reason?: string; // snake_case (legacy)
  suspendedReason?: string; // camelCase (GraphQL)
  suspended_date?: string; // 중단 일시
  is_deleted?: boolean; // 논리적 삭제 플래그
}

/**
 * 테넌트 생성 요청 DTO
 */
export interface CreateTenantRequest {
  // 필수 필드
  code: string;
  name: string;
  type: TenantType;
  start_date: string;

  // 선택 필드 - 사업자 정보
  biz_no?: string;
  biz_name?: string;
  biz_type?: BizType;
  ceo_name?: string;
  biz_kind?: string;
  biz_item?: string;

  // 선택 필드 - 주소 정보
  postcode?: string;
  address1?: string;
  address2?: string;
  phone_no?: string;
  employee_count?: number;

  // 선택 필드 - 계약 정보
  close_date?: string;

  // 선택 필드 - 지역화 설정
  timezone?: string;
  locale?: string;
  currency?: string;

  // 선택 필드 - 메타데이터
  extra_data?: Record<string, unknown>;
}

/**
 * 테넌트 수정 요청 DTO
 */
export interface UpdateTenantRequest {
  // 수정 가능한 필드 (모두 선택적)
  name?: string;
  type?: TenantType;
  biz_no?: string;
  biz_name?: string;
  biz_type?: BizType;
  ceo_name?: string;
  biz_kind?: string;
  biz_item?: string;
  postcode?: string;
  address1?: string;
  address2?: string;
  phone_no?: string;
  employee_count?: number;
  close_date?: string;
  timezone?: string;
  locale?: string;
  currency?: string;
  extra_data?: Record<string, unknown>;
  status?: TenantStatus;
  is_suspended?: boolean;
  suspended_reason?: string;
}

/**
 * 테넌트 목록 응답 DTO
 */
export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 테넌트 상세 응답 DTO
 */
export interface TenantDetailResponse {
  data: Tenant;
}

/**
 * 테넌트 쿼리 파라미터
 */
export interface TenantQueryParams {
  page?: number;
  pageSize?: number;
  search?: string; // code, name, biz_name, biz_no 검색
  status?: TenantStatus;
  type?: TenantType;
  is_suspended?: boolean;
}

// ===== GraphQL 타입 (Apollo Client 용) =====

/**
 * 테넌트 GraphQL 쿼리 변수 (복수)
 * @plural 목록 조회 파라미터
 */
export interface TenantsQueryVariables {
  limit?: number;
  offset?: number;
  search?: string;
  status?: TenantStatus;
  type?: TenantType;
  is_suspended?: boolean;
}

/**
 * 테넌트 GraphQL 쿼리 변수 (단수)
 * @singular 단수 조회 파라미터
 */
export interface TenantQueryVariables {
  id: string;
}

/**
 * 테넌트 생성 뮤테이션 변수 (단수)
 */
export interface CreateTenantVariables {
  input: CreateTenantRequest;
}

/**
 * 테넌트 수정 뮤테이션 변수 (단수)
 */
export interface UpdateTenantVariables {
  id: string;
  input: UpdateTenantRequest;
}
