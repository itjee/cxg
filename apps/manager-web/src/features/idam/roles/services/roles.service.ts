/**
 * 역할 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 GraphQL 통신 계층입니다.
 * 컴포넌트에서는 직접 Hooks를 사용하는 것을 권장합니다.
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_ROLES,
  GET_ROLE,
  CREATE_ROLE,
  UPDATE_ROLE,
} from "../graphql";
import type {
  Role,
  RolesQueryVariables,
  RoleQueryVariables,
  CreateRoleVariables,
  UpdateRoleVariables,
} from "../types";

/**
 * GraphQL 응답 타입
 */
interface GetRolesResponse {
  roles: Role[];
}

interface GetRoleResponse {
  role: Role;
}

interface CreateRoleResponse {
  createRole: Role;
}

interface UpdateRoleResponse {
  updateRole: Role;
}

/**
 * 역할 GraphQL 서비스
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신
 * 주로 테스트 또는 특수한 상황에서 사용됩니다.
 * 일반적으로 컴포넌트에서는 Hooks를 직접 사용 권장
 */
export const rolesService = {
  /**
   * 역할 목록 조회
   *
   * @param params - 쿼리 변수 (limit, offset, status, search 등)
   * @returns 역할 목록 응답
   */
  async listRoles(
    params?: RolesQueryVariables
  ): Promise<{ items: Role[]; total: number }> {
    try {
      const variables: RolesQueryVariables = {
        limit: params?.limit || 20,
        offset: params?.offset || 0,
        status: params?.status,
        category: params?.category,
        search: params?.search,
      };

      const { data } = await apolloClient.query<GetRolesResponse>({
        query: GET_ROLES,
        variables,
        fetchPolicy: "network-only",
      });

      const items = data?.roles || [];

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      console.error("역할 목록 조회 오류:", error);
      throw new Error(
        `역할 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 역할 상세 조회
   *
   * @param id - 역할 ID
   * @returns 역할 정보
   */
  async getRole(id: string): Promise<Role> {
    try {
      const variables: RoleQueryVariables = { id };

      const { data } = await apolloClient.query<GetRoleResponse>({
        query: GET_ROLE,
        variables,
        fetchPolicy: "network-only",
      });

      if (!data?.role) {
        throw new Error("역할을 찾을 수 없습니다");
      }

      return data.role;
    } catch (error) {
      console.error(`역할 조회 오류 (${id}):`, error);
      throw new Error(
        `역할 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 역할 생성
   *
   * @param data - 역할 생성 입력 데이터
   * @returns 생성된 역할 정보
   */
  async createRole(data: CreateRoleVariables["input"]): Promise<Role> {
    try {
      const variables: CreateRoleVariables = { input: data };

      const { data: responseData } =
        await apolloClient.mutate<CreateRoleResponse>({
          mutation: CREATE_ROLE,
          variables,
          refetchQueries: [
            {
              query: GET_ROLES,
              variables: { limit: 20, offset: 0 },
            },
          ],
        });

      if (!responseData?.createRole) {
        throw new Error("역할 생성에 실패했습니다");
      }

      return responseData.createRole;
    } catch (error) {
      console.error("역할 생성 오류:", error);
      throw new Error(
        `역할 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 역할 수정
   *
   * @param id - 역할 ID
   * @param data - 역할 수정 입력 데이터
   * @returns 수정된 역할 정보
   */
  async updateRole(
    id: string,
    data: UpdateRoleVariables["input"]
  ): Promise<Role> {
    try {
      const variables: UpdateRoleVariables = { id, input: data };

      const { data: responseData } =
        await apolloClient.mutate<UpdateRoleResponse>({
          mutation: UPDATE_ROLE,
          variables,
          refetchQueries: [
            {
              query: GET_ROLE,
              variables: { id },
            },
          ],
        });

      if (!responseData?.updateRole) {
        throw new Error("역할 수정에 실패했습니다");
      }

      return responseData.updateRole;
    } catch (error) {
      console.error(`역할 수정 오류 (${id}):`, error);
      throw new Error(
        `역할 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

};
