/**
 * @file roles.service.ts
 * @description Roles 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Roles,
  CreateRolesRequest,
  UpdateRolesRequest,
  RolesListResponse,
  RolesQueryParams,
} from "../types/roles.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/idam/roles";

/**
 * Roles 서비스 객체
 */
export const rolesService = {
  /**
   * 목록 조회
   */
  async listRoles(
    params?: RolesQueryParams,
    signal?: AbortSignal
  ): Promise<RolesListResponse> {
    try {
      const response = await api.get<ApiResponse<RolesListResponse>>(ENDPOINT, {
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
      throw ApiError.fromAxiosError(error, "listRoles");
    }
  },

  /**
   * 상세 조회
   */
  async getRoles(id: string, signal?: AbortSignal): Promise<Roles> {
    try {
      const response = await api.get<ApiResponse<Roles>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('Roles not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getRoles(${id})`);
    }
  },

  /**
   * 생성
   */
  async createRoles(
    data: CreateRolesRequest,
    signal?: AbortSignal
  ): Promise<Roles> {
    try {
      const response = await api.post<ApiResponse<Roles>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as Roles);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createRoles");
    }
  },

  /**
   * 수정
   */
  async updateRoles(
    id: string,
    data: UpdateRolesRequest,
    signal?: AbortSignal
  ): Promise<Roles> {
    try {
      const response = await api.put<ApiResponse<Roles>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as Roles);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateRoles(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteRoles(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteRoles(${id})`);
    }
  },
};
