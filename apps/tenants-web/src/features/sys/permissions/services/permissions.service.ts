/**
 * Permission Service
 * API를 통한 권한 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
  PermissionListResponse,
  PermissionDetailResponse,
  PermissionQueryParams,
} from "../types";

/**
 * 테스트용 Mock 데이터
 */
export const mockPermissions: Permission[] = [
  {
    id: 'perm-001',
    code: 'SYS_USERS_CREATE',
    name: '사용자 생성',
    module_code: 'SYS',
    resource: 'USERS',
    action: 'CREATE',
    description: '새로운 사용자를 생성할 수 있는 권한',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'perm-002',
    code: 'SYS_USERS_READ',
    name: '사용자 조회',
    module_code: 'SYS',
    resource: 'USERS',
    action: 'READ',
    description: '사용자 정보를 조회할 수 있는 권한',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'perm-003',
    code: 'SYS_ROLES_CREATE',
    name: '역할 생성',
    module_code: 'SYS',
    resource: 'ROLES',
    action: 'CREATE',
    description: '새로운 역할을 생성할 수 있는 권한',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'perm-004',
    code: 'PSM_PARTNERS_CREATE',
    name: '거래처 생성',
    module_code: 'PSM',
    resource: 'PARTNERS',
    action: 'CREATE',
    description: '새로운 거래처를 생성할 수 있는 권한',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
];

/**
 * 권한 목록 조회
 */
export async function getPermissions(params?: PermissionQueryParams): Promise<PermissionListResponse> {
  const response = await api.get<PermissionListResponse>('/api/v1/tenants/sys/permissions', { params });
  return response.data;
}

/**
 * 권한 상세 조회
 */
export async function getPermission(id: string): Promise<PermissionDetailResponse> {
  const response = await api.get<PermissionDetailResponse>(`/api/v1/tenants/sys/permissions/${id}`);
  return response.data;
}

/**
 * 권한 생성
 */
export async function createPermission(data: CreatePermissionRequest): Promise<PermissionDetailResponse> {
  const response = await api.post<PermissionDetailResponse>('/api/v1/tenants/sys/permissions', data);
  return response.data;
}

/**
 * 권한 수정
 */
export async function updatePermission(id: string, data: UpdatePermissionRequest): Promise<PermissionDetailResponse> {
  const response = await api.put<PermissionDetailResponse>(`/api/v1/tenants/sys/permissions/${id}`, data);
  return response.data;
}

/**
 * 권한 삭제
 */
export async function deletePermission(id: string): Promise<void> {
  await api.delete(`/api/v1/tenants/sys/permissions/${id}`);
}
