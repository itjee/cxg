/**
 * Users GraphQL Service Layer
 *
 * Apollo Client를 사용한 GraphQL 통신 계층입니다.
 * 컴포넌트에서는 직접 Hooks를 사용하는 것을 권장합니다.
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_MANAGER_USERS,
  GET_MANAGER_USER,
  CREATE_MANAGER_USER,
  UPDATE_MANAGER_USER,
  type GetManagerUsersVariables,
  type GetManagerUserVariables,
  type CreateManagerUserVariables,
  type UpdateManagerUserVariables,
} from "../graphql";
import type { ManagerUser, ManagerUsersListResponse } from "../types/users.types";

/**
 * GraphQL 응답 타입
 */
interface GetManagerUsersResponse {
  managerUsers: ManagerUser[];
}

interface GetManagerUserResponse {
  managerUser: ManagerUser;
}

interface CreateManagerUserResponse {
  createManagerUser: ManagerUser;
}

interface UpdateManagerUserResponse {
  updateManagerUser: ManagerUser;
}

/**
 * Users GraphQL Service
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신
 * 주로 테스트 또는 특수한 상황에서 사용됩니다.
 * 일반적으로 컴포넌트에서는 Hooks를 직접 사용 권장
 */
export const usersService = {
  /**
   * 사용자 목록 조회
   */
  async listUsers(
    params?: GetManagerUsersVariables
  ): Promise<{ items: ManagerUser[]; total: number }> {
    try {
      const variables: GetManagerUsersVariables = {
        limit: params?.limit || 20,
        offset: params?.offset || 0,
        userType: params?.userType,
        status: params?.status,
      };

      const { data } = await apolloClient.query<GetManagerUsersResponse>({
        query: GET_MANAGER_USERS,
        variables,
        fetchPolicy: "network-only",
      });

      const items = data?.managerUsers || [];

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      console.error("listUsers error:", error);
      throw new Error(
        `Failed to fetch users: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  /**
   * 사용자 상세 조회
   */
  async getUser(id: string): Promise<ManagerUser> {
    try {
      const variables: GetManagerUserVariables = { id };

      const { data } = await apolloClient.query<GetManagerUserResponse>({
        query: GET_MANAGER_USER,
        variables,
        fetchPolicy: "network-only",
      });

      if (!data?.manager_user) {
        throw new Error("User not found");
      }

      return data.manager_user;
    } catch (error) {
      console.error(`getUser(${id}) error:`, error);
      throw new Error(
        `Failed to fetch user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  /**
   * 사용자 생성
   */
  async createUser(
    data: CreateManagerUserVariables["input"]
  ): Promise<ManagerUser> {
    try {
      const variables: CreateManagerUserVariables = { input: data };

      const { data: responseData } = await apolloClient.mutate<CreateManagerUserResponse>({
        mutation: CREATE_MANAGER_USER,
        variables,
        refetchQueries: [
          {
            query: GET_MANAGER_USERS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!responseData?.create_manager_user) {
        throw new Error("Failed to create user");
      }

      return responseData.create_manager_user;
    } catch (error) {
      console.error("createUser error:", error);
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },

  /**
   * 사용자 수정
   */
  async updateUser(
    id: string,
    data: UpdateManagerUserVariables["input"]
  ): Promise<ManagerUser> {
    try {
      const variables: UpdateManagerUserVariables = { id, input: data };

      const { data: responseData } = await apolloClient.mutate<UpdateManagerUserResponse>({
        mutation: UPDATE_MANAGER_USER,
        variables,
        refetchQueries: [
          {
            query: GET_MANAGER_USER,
            variables: { id },
          },
        ],
      });

      if (!responseData?.update_manager_user) {
        throw new Error("Failed to update user");
      }

      return responseData.update_manager_user;
    } catch (error) {
      console.error(`updateUser(${id}) error:`, error);
      throw new Error(
        `Failed to update user: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
};
