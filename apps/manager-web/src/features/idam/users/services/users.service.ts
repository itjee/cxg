/**
 * @file users.service.ts
 * @description Users 서비스 레이어 (GraphQL)
 * 
 * REST API에서 GraphQL로 변경됨
 */

import { usersGraphQLService } from './users.service.graphql';
import type {
  Users,
  UsersListResponse,
  UsersQueryParams,
} from "../types/users.types";

/**
 * Users 서비스 객체
 * GraphQL 서비스를 래핑하여 기존 인터페이스 유지
 */
export const usersService = {
  /**
   * 목록 조회
   */
  async listUsers(
    params?: UsersQueryParams,
    signal?: AbortSignal
  ): Promise<UsersListResponse> {
    const result = await usersGraphQLService.listUsers({
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      status: params?.active === true ? 'ACTIVE' : params?.active === false ? 'INACTIVE' : undefined,
      signal,
    });

    return {
      items: result.items,
      total: result.total,
      page: params?.page || 1,
      page_size: params?.pageSize || 20,
      total_pages: Math.ceil(result.total / (params?.pageSize || 20)),
    };
  },

  /**
   * 상세 조회
   */
  async getUsers(id: string, signal?: AbortSignal): Promise<Users> {
    return await usersGraphQLService.getUser(id, signal);
  },

  /**
   * 생성
   */
  async createUsers(data: {
    userType: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    department?: string;
    position?: string;
  }): Promise<Users> {
    return await usersGraphQLService.createUser(data);
  },

  /**
   * 수정
   */
  async updateUsers(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
      department?: string;
      position?: string;
      status?: string;
      mfaEnabled?: boolean;
    }
  ): Promise<Users> {
    return await usersGraphQLService.updateUser(id, data);
  },

  /**
   * 삭제
   */
  async deleteUsers(id: string): Promise<void> {
    return await usersGraphQLService.deleteUser(id);
  },
};
