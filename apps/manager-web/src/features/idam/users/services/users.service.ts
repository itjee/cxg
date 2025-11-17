/**
 * @file users.service.ts
 * @description 사용자 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신입니다.
 *
 * 사용 시나리오:
 * - React Hook을 사용할 수 없는 상황 (유틸리티, 테스트, API 라우트 등)
 * - 일반적으로 React 컴포넌트에서는 Hooks (use-users.ts) 사용 권장
 */

import { apolloClient } from "@/lib/apollo-client";
import { GET_USERS, GET_USER, CREATE_USER, UPDATE_USER } from "../graphql";

import type {
  User,
  GetUsersResponse,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  UsersQueryVariables,
  CreateUserVariables,
  UpdateUserVariables,
} from "../types/users.types";

/**
 * 사용자 GraphQL 서비스
 *
 * Apollo Client를 사용하여 GraphQL 쿼리/뮤테이션을 실행합니다.
 *
 * @example
 * // 유틸리티 함수에서 사용
 * async function exportUsers() {
 *   const { items } = await usersService.listUsers({ limit: 1000 });
 *   generateCSV(items);
 * }
 *
 * @example
 * // API 라우트에서 사용
 * export async function GET() {
 *   const { items } = await usersService.listUsers();
 *   return Response.json(items);
 * }
 */
export const usersService = {
  /**
   * 사용자 목록 조회
   *
   * @param params - 쿼리 파라미터 (limit, offset, userType, status)
   * @returns 사용자 배열과 총 개수
   */
  async listUsers(
    params?: UsersQueryVariables
  ): Promise<{ items: User[]; total: number }> {
    try {
      const { data } = await apolloClient.query<GetUsersResponse>({
        query: GET_USERS,
        variables: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          userType: params?.userType,
          status: params?.status,
        },
        fetchPolicy: "network-only",
      });

      const items = data?.users ?? [];
      return { items, total: items.length };
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
   *
   * @param id - 사용자 ID
   * @returns 사용자 정보
   * @throws 사용자를 찾을 수 없을 때 에러
   */
  async getUser(id: string): Promise<User> {
    try {
      const { data } = await apolloClient.query<GetUserResponse>({
        query: GET_USER,
        variables: { id },
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
   *
   * @param input - 사용자 생성 입력 데이터
   * @returns 생성된 사용자 정보
   */
  async createUser(input: CreateUserVariables["input"]): Promise<User> {
    try {
      const { data } = await apolloClient.mutate<CreateUserResponse>({
        mutation: CREATE_USER,
        variables: { input },
        refetchQueries: [
          {
            query: GET_USERS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.createUser) {
        throw new Error("사용자 생성에 실패했습니다");
      }

      return data.createUser;
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
   *
   * @param id - 사용자 ID
   * @param input - 사용자 수정 입력 데이터
   * @returns 수정된 사용자 정보
   */
  async updateUser(
    id: string,
    input: UpdateUserVariables["input"]
  ): Promise<User> {
    try {
      const { data } = await apolloClient.mutate<UpdateUserResponse>({
        mutation: UPDATE_USER,
        variables: { id, input },
        refetchQueries: [
          {
            query: GET_USER,
            variables: { id },
          },
        ],
      });

      if (!data?.updateUser) {
        throw new Error("사용자 수정에 실패했습니다");
      }

      return data.updateUser;
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
