/**
 * @file users.service.ts
 * @description Users 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Users,
  CreateUsersRequest,
  UpdateUsersRequest,
  UsersListResponse,
  UsersQueryParams,
} from "../types/users.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/idam/users";

/**
 * Users 서비스 객체
 */
export const usersService = {
  /**
   * 목록 조회
   */
  async listUsers(
    params?: UsersQueryParams,
    signal?: AbortSignal
  ): Promise<UsersListResponse> {
    try {
      const response = await api.get<ApiResponse<UsersListResponse>>(ENDPOINT, {
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
      throw ApiError.fromAxiosError(error, "listUsers");
    }
  },

  /**
   * 상세 조회
   */
  async getUsers(id: string, signal?: AbortSignal): Promise<Users> {
    try {
      const response = await api.get<ApiResponse<Users>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('Users not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getUsers(${id})`);
    }
  },

  /**
   * 생성
   */
  async createUsers(
    data: CreateUsersRequest,
    signal?: AbortSignal
  ): Promise<Users> {
    try {
      const response = await api.post<ApiResponse<Users>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as Users);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createUsers");
    }
  },

  /**
   * 수정
   */
  async updateUsers(
    id: string,
    data: UpdateUsersRequest,
    signal?: AbortSignal
  ): Promise<Users> {
    try {
      const response = await api.put<ApiResponse<Users>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as Users);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateUsers(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteUsers(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteUsers(${id})`);
    }
  },
};
