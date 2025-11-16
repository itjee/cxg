/**
 * 사용자 GraphQL 서비스 계층
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
import type { User, UsersResponse } from "../types/users.types";

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
 * 사용자 GraphQL 서비스
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
      console.error("사용자 목록 조회 오류:", error);
      throw new Error(
        `사용자 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
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
        throw new Error("사용자를 찾을 수 없습니다");
      }

      return data.user;
    } catch (error) {
      console.error(`사용자 조회 오류 (${id}):`, error);
      throw new Error(
        `사용자 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
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
        throw new Error("사용자 생성에 실패했습니다");
      }

      return responseData.createUser;
    } catch (error) {
      console.error("사용자 생성 오류:", error);
      throw new Error(
        `사용자 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
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
        throw new Error("사용자 수정에 실패했습니다");
      }

      return responseData.updateUser;
    } catch (error) {
      console.error(`사용자 수정 오류 (${id}):`, error);
      throw new Error(
        `사용자 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
