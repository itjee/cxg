/**
 * @file permissions.service.ts
 * @description 권한 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신입니다.
 *
 * 사용 시나리오:
 * - React Hook을 사용할 수 없는 상황 (유틸리티, 테스트, API 라우트 등)
 * - 일반적으로 React 컴포넌트에서는 Hooks (use-permissions.ts) 사용 권장
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_PERMISSIONS,
  GET_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
} from "../graphql";

import type {
  Permission,
  GetPermissionsResponse,
  GetPermissionResponse,
  CreatePermissionResponse,
  UpdatePermissionResponse,
  DeletePermissionResponse,
  PermissionsQueryVariables,
  CreatePermissionVariables,
  UpdatePermissionVariables,
  DeletePermissionVariables,
} from "../types/permissions.types";

/**
 * 권한 GraphQL 서비스
 *
 * Apollo Client를 사용하여 GraphQL 쿼리/뮤테이션을 실행합니다.
 *
 * @example
 * // 유틸리티 함수에서 사용
 * async function exportPermissions() {
 *   const { items } = await permissionsService.listPermissions({ limit: 1000 });
 *   generateCSV(items);
 * }
 *
 * @example
 * // API 라우트에서 사용
 * export async function GET() {
 *   const { items } = await permissionsService.listPermissions();
 *   return Response.json(items);
 * }
 */
export const permissionsService = {
  /**
   * 권한 목록 조회
   *
   * @param params - 쿼리 파라미터 (limit, offset, search, status 등)
   * @returns 권한 배열과 총 개수
   */
  async listPermissions(
    params?: PermissionsQueryVariables
  ): Promise<{ items: Permission[]; total: number }> {
    try {
      const { data } = await apolloClient.query<GetPermissionsResponse>({
        query: GET_PERMISSIONS,
        variables: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          search: params?.search,
          status: params?.status,
          category: params?.category,
          resource: params?.resource,
          action: params?.action,
          scope: params?.scope,
        },
        fetchPolicy: "network-only",
      });

      const items = data?.permissions ?? [];
      return { items, total: items.length };
    } catch (error) {
      console.error("권한 목록 조회 오류:", error);
      throw new Error(
        `권한 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 권한 상세 조회
   *
   * @param id - 권한 ID
   * @returns 권한 정보
   * @throws 권한을 찾을 수 없을 때 에러
   */
  async getPermission(id: string): Promise<Permission> {
    try {
      const { data } = await apolloClient.query<GetPermissionResponse>({
        query: GET_PERMISSION,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.permission) {
        throw new Error("권한을 찾을 수 없습니다");
      }

      return data.permission;
    } catch (error) {
      console.error(`권한 조회 오류 (${id}):`, error);
      throw new Error(
        `권한 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 권한 생성
   *
   * @param input - 권한 생성 입력 데이터
   * @returns 생성된 권한 정보
   */
  async createPermission(
    input: CreatePermissionVariables["input"]
  ): Promise<Permission> {
    try {
      const { data } = await apolloClient.mutate<CreatePermissionResponse>({
        mutation: CREATE_PERMISSION,
        variables: { input },
        refetchQueries: [
          {
            query: GET_PERMISSIONS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.createPermission) {
        throw new Error("권한 생성에 실패했습니다");
      }

      return data.createPermission;
    } catch (error) {
      console.error("권한 생성 오류:", error);
      throw new Error(
        `권한 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 권한 수정
   *
   * @param id - 권한 ID
   * @param input - 권한 수정 입력 데이터
   * @returns 수정된 권한 정보
   */
  async updatePermission(
    id: string,
    input: UpdatePermissionVariables["input"]
  ): Promise<Permission> {
    try {
      const { data } = await apolloClient.mutate<UpdatePermissionResponse>({
        mutation: UPDATE_PERMISSION,
        variables: { id, input },
        refetchQueries: [
          {
            query: GET_PERMISSION,
            variables: { id },
          },
        ],
      });

      if (!data?.updatePermission) {
        throw new Error("권한 수정에 실패했습니다");
      }

      return data.updatePermission;
    } catch (error) {
      console.error(`권한 수정 오류 (${id}):`, error);
      throw new Error(
        `권한 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 권한 삭제
   *
   * @param id - 권한 ID
   * @returns 삭제 결과 메시지
   */
  async deletePermission(id: string): Promise<void> {
    try {
      const { data } = await apolloClient.mutate<DeletePermissionResponse>({
        mutation: DELETE_PERMISSION,
        variables: { id },
        refetchQueries: [
          {
            query: GET_PERMISSIONS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.deletePermission) {
        throw new Error("권한 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error(`권한 삭제 오류 (${id}):`, error);
      throw new Error(
        `권한 삭제 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
