/**
 * Role Service
 * API를 통한 역할 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleListResponse,
  RoleDetailResponse,
  RoleQueryParams,
} from "../types";

/**
 * 테스트용 Mock 데이터
 */
export const mockRoles: Role[] = [
  {
    id: 'role-001',
    code: 'ADMIN',
    name: '관리자',
    description: '시스템 전체 관리 권한',
    is_system: true,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'role-002',
    code: 'MANAGER',
    name: '매니저',
    description: '부서별 관리 권한',
    is_system: true,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'role-003',
    code: 'USER',
    name: '사용자',
    description: '일반 사용자 권한',
    is_system: true,
    is_active: true,
    is_deleted: false,
    created_at: '2025-01-01T00:00:00Z',
    created_by: undefined,
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
  {
    id: 'role-004',
    code: 'GUEST',
    name: '게스트',
    description: '읽기 전용 권한',
    is_system: false,
    is_active: true,
    is_deleted: false,
    created_at: '2025-05-10T00:00:00Z',
    created_by: 'role-001',
    updated_at: '2025-10-28T10:30:00Z',
    updated_by: undefined,
  },
];

/**
 * 역할 목록 조회
 */
export async function getRoles(params?: RoleQueryParams): Promise<RoleListResponse> {
  const response = await api.get<RoleListResponse>('/api/v1/tenants/sys/roles', { params });
  return response.data;
}

/**
 * 역할 상세 조회
 */
export async function getRole(id: string): Promise<RoleDetailResponse> {
  const response = await api.get<RoleDetailResponse>(`/api/v1/tenants/sys/roles/${id}`);
  return response.data;
}

/**
 * 역할 생성
 */
export async function createRole(data: CreateRoleRequest): Promise<RoleDetailResponse> {
  const response = await api.post<RoleDetailResponse>('/api/v1/tenants/sys/roles', data);
  return response.data;
}

/**
 * 역할 수정
 */
export async function updateRole(id: string, data: UpdateRoleRequest): Promise<RoleDetailResponse> {
  const response = await api.put<RoleDetailResponse>(`/api/v1/tenants/sys/roles/${id}`, data);
  return response.data;
}

/**
 * 역할 삭제
 */
export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/api/v1/tenants/sys/roles/${id}`);
}
