/**
 * 시스템 관리 타입 정의
 */

/**
 * 사용자 타입 (sys.users 테이블 기반)
 * 기본 필드는 users.types.ts와 동일하게 유지
 */
export interface User {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 사용자 기본 정보
  username: string;
  full_name?: string;
  email: string;
  phone?: string;

  // 역할 및 권한
  role_id?: string;
  role_name?: string; // 조인 필드 (응답용)
  default_conflict_resolution_policy_id?: string;

  // 시스템 사용자 플래그
  is_system_user: boolean;

  // 로그인 추적
  last_login_at?: string;
  last_login_ip?: string;
  failed_login_attempts: number;
  locked_until?: string;

  // 상태 정보
  is_active: boolean;
  is_deleted?: boolean;
}

/**
 * 사용자 생성 입력
 */
export interface UserCreateInput {
  username: string;
  full_name?: string;
  email: string;
  phone?: string;
  password: string;
  role_id?: string;
  is_system_user?: boolean;
  default_conflict_resolution_policy_id?: string;
}

/**
 * 사용자 수정 입력
 */
export interface UserUpdateInput {
  username?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  is_active?: boolean;
  is_system_user?: boolean;
  default_conflict_resolution_policy_id?: string;
  last_login_at?: string;
  last_login_ip?: string;
  failed_login_attempts?: number;
  locked_until?: string;
}

// 역할 타입
export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_system: boolean;
  is_active: boolean;
  user_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface RoleCreateInput {
  code: string;
  name: string;
  description?: string;
}

export interface RoleUpdateInput {
  name?: string;
  description?: string;
  is_active?: boolean;
}

// 권한 타입
export interface Permission {
  id: string;
  code: string;
  name: string;
  module_code: string;
  resource: string;
  action: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PermissionCreateInput {
  code: string;
  name: string;
  module_code: string;
  resource: string;
  action: string;
  description?: string;
}

// 검색 타입
export interface UserSearchFilter {
  keyword?: string;
  role_id?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface RoleSearchFilter {
  keyword?: string;
  is_system?: boolean;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

export interface PermissionSearchFilter {
  keyword?: string;
  module_code?: string;
  action?: string;
  is_active?: boolean;
  page?: number;
  limit?: number;
}

// 기본 설정 타입 - 코드 관리
export interface Code {
  id: string;
  code_group_id?: string;
  code_group_name?: string;
  code: string;
  name: string;
  value?: string;
  description?: string;
  display_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 코드 그룹
export interface CodeGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  code_count?: number;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 설정 정보
export interface Setting {
  id: string;
  code: string;
  name: string;
  value: string;
  type: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 통화
export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 환율
export interface ExchangeRate {
  id: string;
  from_currency?: string;
  to_currency?: string;
  rate: number;
  effective_date: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 단위
export interface Unit {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 기본 설정 타입 - 결제 조건
export interface PaymentTerm {
  id: string;
  code: string;
  name: string;
  days?: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
