/**
 * Users GraphQL Service Layer
 *
 * Apollo Client를 사용한 GraphQL 통신 계층입니다.
 * 컴포넌트에서는 직접 Hooks를 사용하는 것을 권장합니다.
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  type GetUsersVariables,
  type GetUserVariables,
  type CreateUserVariables,
  type UpdateUserVariables,
} from "../graphql";
import type { User, UsersListResponse } from "../types/users.types";

/**
 * GraphQL 응답 타입
 */
interface GetUsersResponse {
  users: User[];
}

interface GetUserResponse {
  user: User;
}

interface CreateUserResponse {
  createUser: User;
}

interface UpdateUserResponse {
  updateUser: User;
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
    params?: GetUsersVariables
  ): Promise<{ items: User[]; total: number }> {
    try {
      const variables: GetUsersVariables = {
        limit: params?.limit || 20,
        offset: params?.offset || 0,
        userType: params?.userType,
        status: params?.status,
      };

      const { data } = await apolloClient.query<GetUsersResponse>({
        query: GET_USERS,
        variables,
        fetchPolicy: "network-only",
      });

      const items = data?.users || [];

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      console.error("listUsers error:", error);
      throw new Error(
        `Failed to fetch users: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * 사용자 상세 조회
   */
  async getUser(id: string): Promise<User> {
    try {
      const variables: GetUserVariables = { id };

      const { data } = await apolloClient.query<GetUserResponse>({
        query: GET_USER,
        variables,
        fetchPolicy: "network-only",
      });

      if (!data?.user) {
        throw new Error("User not found");
      }

      return data.user;
    } catch (error) {
      console.error(`getUser(${id}) error:`, error);
      throw new Error(
        `Failed to fetch user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * 사용자 생성
   */
  async createUser(data: CreateUserVariables["input"]): Promise<User> {
    try {
      const variables: CreateUserVariables = { input: data };

      const { data: responseData } =
        await apolloClient.mutate<CreateUserResponse>({
          mutation: CREATE_USER,
          variables,
          refetchQueries: [
            {
              query: GET_USERS,
              variables: { limit: 20, offset: 0 },
            },
          ],
        });

      if (!responseData?.createUser) {
        throw new Error("Failed to create user");
      }

      return responseData.createUser;
    } catch (error) {
      console.error("createUser error:", error);
      throw new Error(
        `Failed to create user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * 사용자 수정
   */
  async updateUser(
    id: string,
    data: UpdateUserVariables["input"]
  ): Promise<User> {
    try {
      const variables: UpdateUserVariables = { id, input: data };

      const { data: responseData } =
        await apolloClient.mutate<UpdateUserResponse>({
          mutation: UPDATE_USER,
          variables,
          refetchQueries: [
            {
              query: GET_USER,
              variables: { id },
            },
          ],
        });

      if (!responseData?.updateUser) {
        throw new Error("Failed to update user");
      }

      return responseData.updateUser;
    } catch (error) {
      console.error(`updateUser(${id}) error:`, error);
      throw new Error(
        `Failed to update user: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};
