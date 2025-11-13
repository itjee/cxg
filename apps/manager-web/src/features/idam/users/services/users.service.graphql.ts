/**
 * @file users.service.graphql.ts
 * @description Users GraphQL 서비스 레이어
 */

import { graphqlClient } from '@/lib/graphql-client';
import {
  GET_MANAGER_USERS,
  GET_MANAGER_USER,
  CREATE_MANAGER_USER,
  UPDATE_MANAGER_USER,
  type GetManagerUsersVariables,
  type GetManagerUserVariables,
  type CreateManagerUserVariables,
  type UpdateManagerUserVariables,
} from '@/lib/graphql/users.graphql';
import type { Users } from '../types/users.types';

/**
 * GraphQL 응답 타입
 */
interface GetManagerUsersResponse {
  managerUsers: Users[];
}

interface GetManagerUserResponse {
  managerUser: Users;
}

interface CreateManagerUserResponse {
  createManagerUser: Users;
}

interface UpdateManagerUserResponse {
  updateManagerUser: Users;
}

/**
 * Users GraphQL 서비스 객체
 */
export const usersGraphQLService = {
  /**
   * 목록 조회
   */
  async listUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    userType?: string;
    status?: string;
    signal?: AbortSignal;
  }): Promise<{ items: Users[]; total: number }> {
    try {
      const limit = params?.pageSize || 20;
      const offset = ((params?.page || 1) - 1) * limit;
      
      const variables: GetManagerUsersVariables = {
        limit,
        offset,
        userType: params?.userType,
        status: params?.status,
      };

      const response = await graphqlClient.request<GetManagerUsersResponse>(
        GET_MANAGER_USERS,
        variables
      );

      const items = response.managerUsers || [];
      
      // TODO: GraphQL에서 total count를 반환하도록 수정 필요
      // 현재는 items 길이를 total로 사용
      return {
        items,
        total: items.length,
      };
    } catch (error) {
      console.error('listUsers error:', error);
      throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 상세 조회
   */
  async getUser(id: string, signal?: AbortSignal): Promise<Users> {
    try {
      const variables: GetManagerUserVariables = { id };

      const response = await graphqlClient.request<GetManagerUserResponse>(
        GET_MANAGER_USER,
        variables
      );

      if (!response.managerUser) {
        throw new Error('User not found');
      }

      return response.managerUser;
    } catch (error) {
      console.error(`getUser(${id}) error:`, error);
      throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 생성
   */
  async createUser(data: {
    userType: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    department?: string;
    position?: string;
  }): Promise<Users> {
    try {
      const variables: CreateManagerUserVariables = { input: data };

      const response = await graphqlClient.request<CreateManagerUserResponse>(
        CREATE_MANAGER_USER,
        variables
      );

      return response.createManagerUser;
    } catch (error) {
      console.error('createUser error:', error);
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 수정
   */
  async updateUser(
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
    try {
      const variables: UpdateManagerUserVariables = {
        id,
        input: data,
      };

      const response = await graphqlClient.request<UpdateManagerUserResponse>(
        UPDATE_MANAGER_USER,
        variables
      );

      return response.updateManagerUser;
    } catch (error) {
      console.error(`updateUser(${id}) error:`, error);
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 삭제 (현재 backend에 delete mutation이 없으므로 status를 INACTIVE로 변경)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await this.updateUser(id, { status: 'INACTIVE' });
    } catch (error) {
      console.error(`deleteUser(${id}) error:`, error);
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};
