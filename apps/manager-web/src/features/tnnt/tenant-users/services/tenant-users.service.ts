/**
 * @file tenant-users.service.ts
 * @description 테넌트 사용자 관리 API 서비스
 */

import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import type {
  TenantUser,
  TenantUserListResponse,
  CreateTenantUserRequest,
  UpdateTenantUserRequest,
  ChangePasswordRequest,
  TenantUserQueryParams,
} from '../types';

const ENDPOINT = '/tenant-users';

export const tenantUsersService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listTenantUsers(
    params?: TenantUserQueryParams,
    signal?: AbortSignal
  ): Promise<TenantUserListResponse> {
    try {
      const response = await api.get<{ data: TenantUserListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          tenant_id: params?.tenant_id,
          role_id: params?.role_id,
          status: params?.status,
          is_primary: params?.is_primary,
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
      throw ApiError.fromAxiosError(error, 'listTenantUsers');
    }
  },

  /**
   * 상세 조회
   */
  async getTenantUser(id: string, signal?: AbortSignal): Promise<TenantUser> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`, { signal });
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getTenantUser(${id})`);
    }
  },

  /**
   * 생성
   */
  async createTenantUser(data: CreateTenantUserRequest): Promise<TenantUser> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'createTenantUser');
    }
  },

  /**
   * 수정
   */
  async updateTenantUser(
    id: string,
    data: UpdateTenantUserRequest
  ): Promise<TenantUser> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateTenantUser(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteTenantUser(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteTenantUser(${id})`);
    }
  },

  /**
   * 비밀번호 변경
   */
  async changePassword(
    id: string,
    data: ChangePasswordRequest
  ): Promise<void> {
    try {
      await api.post(`${ENDPOINT}/${id}/change-password`, data);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `changePassword(${id})`);
    }
  },

  /**
   * 비밀번호 재설정
   */
  async resetPassword(id: string): Promise<{ temporary_password: string }> {
    try {
      const response = await api.post(`${ENDPOINT}/${id}/reset-password`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `resetPassword(${id})`);
    }
  },
};
