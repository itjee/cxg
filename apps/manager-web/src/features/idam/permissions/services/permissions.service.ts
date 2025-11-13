/**
 * @file permissions.service.ts
 * @description Permissions 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Permissions,
  CreatePermissionsRequest,
  UpdatePermissionsRequest,
  PermissionsListResponse,
  PermissionsQueryParams,
} from "../types/permissions.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/idam/permissions";

/**
 * Permissions 서비스 객체
 */
export const permissionsService = {
  /**
   * 목록 조회
   */
  async listPermissions(
    params?: PermissionsQueryParams,
    signal?: AbortSignal
  ): Promise<PermissionsListResponse> {
    try {
      const response = await api.get<ApiResponse<PermissionsListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          active: params?.active,
        },
        signal,
      });
      
      return response.data.data || { 
        items: [], 
        total: 0, 
        page: 1, 
        page_size: 10,
        total_pages: 0
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listPermissions");
    }
  },

  /**
   * 상세 조회
   */
  async getPermissions(id: string, signal?: AbortSignal): Promise<Permissions> {
    try {
      const response = await api.get<ApiResponse<Permissions>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('Permissions not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getPermissions(${id})`);
    }
  },

  /**
   * 생성
   */
  async createPermissions(
    data: CreatePermissionsRequest,
    signal?: AbortSignal
  ): Promise<Permissions> {
    try {
      const response = await api.post<ApiResponse<Permissions>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as Permissions);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createPermissions");
    }
  },

  /**
   * 수정
   */
  async updatePermissions(
    id: string,
    data: UpdatePermissionsRequest,
    signal?: AbortSignal
  ): Promise<Permissions> {
    try {
      const response = await api.put<ApiResponse<Permissions>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as Permissions);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updatePermissions(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deletePermissions(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deletePermissions(${id})`);
    }
  },
};
