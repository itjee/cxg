/**
 * @file tenant-roles.service.ts
 * @description 테넌트 역할 관리 API 서비스
 */

import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import type {
  TenantRole,
  TenantRoleListResponse,
  CreateTenantRoleRequest,
  UpdateTenantRoleRequest,
  TenantRoleQueryParams,
} from '../types';

const ENDPOINT = '/tenant-roles';

export const tenantRolesService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listTenantRoles(
    params?: TenantRoleQueryParams,
    signal?: AbortSignal
  ): Promise<TenantRoleListResponse> {
    try {
      const response = await api.get<{ data: TenantRoleListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          tenant_id: params?.tenant_id,
          status: params?.status,
          is_system_role: params?.is_system_role,
        },
        signal,
      });
      return (
        response.data.data || {
          items: [],
          total: 0,
          page: 1,
          page_size: 20,
          total_pages: 0,
        }
      );
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'listTenantRoles');
    }
  },

  /**
   * 상세 조회
   */
  async getTenantRole(id: string, signal?: AbortSignal): Promise<TenantRole> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`, { signal });
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getTenantRole(${id})`);
    }
  },

  /**
   * 생성
   */
  async createTenantRole(data: CreateTenantRoleRequest): Promise<TenantRole> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'createTenantRole');
    }
  },

  /**
   * 수정
   */
  async updateTenantRole(
    id: string,
    data: UpdateTenantRoleRequest
  ): Promise<TenantRole> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateTenantRole(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteTenantRole(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteTenantRole(${id})`);
    }
  },
};
