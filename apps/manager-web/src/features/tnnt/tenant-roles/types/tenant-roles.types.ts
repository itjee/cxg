/**
 * @file tenant-roles.types.ts
 * @description 테넌트 역할 관리 TypeScript 타입 정의
 */

/**
 * 역할 상태 enum
 */
export type TenantRoleStatus = 'ACTIVE' | 'INACTIVE';

/**
 * 테넌트 역할 엔티티
 */
export interface TenantRole {
  // 기본 식별자 및 감사 필드
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;

  // 테넌트 역할 정보
  tenant_id: string;
  role_name: string;
  role_code: string;
  description?: string;

  // 권한 정보
  permissions: string[];

  // 상태 관리
  status: TenantRoleStatus;
  is_system_role: boolean;
  is_deleted: boolean;
}

/**
 * 테넌트 역할 생성 요청 DTO
 */
export interface CreateTenantRoleRequest {
  tenant_id: string;
  role_name: string;
  role_code: string;
  description?: string;
  permissions?: string[];
  status?: TenantRoleStatus;
}

/**
 * 테넌트 역할 수정 요청 DTO
 */
export interface UpdateTenantRoleRequest {
  role_name?: string;
  description?: string;
  permissions?: string[];
  status?: TenantRoleStatus;
}

/**
 * 테넌트 역할 목록 응답 DTO
 */
export interface TenantRoleListResponse {
  items: TenantRole[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 테넌트 역할 쿼리 파라미터
 */
export interface TenantRoleQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tenant_id?: string;
  status?: TenantRoleStatus;
  is_system_role?: boolean;
}
