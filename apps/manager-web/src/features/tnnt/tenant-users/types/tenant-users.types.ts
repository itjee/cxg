/**
 * @file tenant-users.types.ts
 * @description 테넌트 사용자 관리 TypeScript 타입 정의
 */

/**
 * 사용자 상태 enum
 */
export type TenantUserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

/**
 * 테넌트 사용자 엔티티
 */
export interface TenantUser {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 테넌트 사용자 정보
  tenant_id: string;
  user_id: string;
  username: string;
  email: string;
  full_name?: string;
  phone_number?: string;

  // 역할 및 권한
  role_id?: string;
  role_name?: string;
  permissions: string[];

  // 로그인 정보
  last_login_at?: string;
  login_count: number;
  failed_login_count: number;

  // 상태 관리
  status: TenantUserStatus;
  is_primary: boolean;
  is_deleted: boolean;
}

/**
 * 테넌트 사용자 생성 요청 DTO
 */
export interface CreateTenantUserRequest {
  tenant_id: string;
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  role_id?: string;
  status?: TenantUserStatus;
  is_primary?: boolean;
}

/**
 * 테넌트 사용자 수정 요청 DTO
 */
export interface UpdateTenantUserRequest {
  email?: string;
  full_name?: string;
  phone_number?: string;
  role_id?: string;
  status?: TenantUserStatus;
}

/**
 * 비밀번호 변경 요청 DTO
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * 테넌트 사용자 목록 응답 DTO
 */
export interface TenantUserListResponse {
  items: TenantUser[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 테넌트 사용자 쿼리 파라미터
 */
export interface TenantUserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tenant_id?: string;
  role_id?: string;
  status?: TenantUserStatus;
  is_primary?: boolean;
}
