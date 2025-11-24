/**
 * @file tenants.service.ts
 * @description 테넌트 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신입니다.
 *
 * 사용 시나리오:
 * - React Hook을 사용할 수 없는 상황 (유틸리티, 테스트, API 라우트 등)
 * - 일반적으로 React 컴포넌트에서는 Hooks (use-tenants.ts) 사용 권장
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_TENANTS,
  GET_TENANT,
  CREATE_TENANT,
  UPDATE_TENANT,
} from "../graphql";

import type {
  Tenant,
  TenantsQueryVariables,
  CreateTenantVariables,
  UpdateTenantVariables,
} from "../types/tenants.types";

/**
 * 테넌트 GraphQL 서비스
 *
 * Apollo Client를 사용하여 GraphQL 쿼리/뮤테이션을 실행합니다.
 *
 * @example
 * // 유틸리티 함수에서 사용
 * async function exportTenants() {
 *   const { items } = await tenantsService.listTenants({ limit: 1000 });
 *   generateCSV(items);
 * }
 *
 * @example
 * // API 라우트에서 사용
 * export async function GET() {
 *   const { items } = await tenantsService.listTenants();
 *   return Response.json(items);
 * }
 */
export const tenantsService = {
  /**
   * 테넌트 목록 조회
   *
   * @param params - 쿼리 파라미터 (limit, offset, status, type)
   * @returns 테넌트 배열과 총 개수
   */
  async listTenants(
    params?: TenantsQueryVariables
  ): Promise<{ items: Tenant[]; total: number }> {
    try {
      const { data } = await apolloClient.query<{
        tenants: Tenant[];
      }>({
        query: GET_TENANTS,
        variables: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          search: params?.search,
          status: params?.status,
          type: params?.type,
          is_suspended: params?.is_suspended,
        },
        fetchPolicy: "network-only",
      });

      const items = data?.tenants ?? [];
      return { items, total: items.length };
    } catch (error) {
      console.error("테넌트 목록 조회 오류:", error);
      throw new Error(
        `테넌트 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 테넌트 상세 조회
   *
   * @param id - 테넌트 ID
   * @returns 테넌트 정보
   * @throws 테넌트를 찾을 수 없을 때 에러
   */
  async getTenant(id: string): Promise<Tenant> {
    try {
      const { data } = await apolloClient.query<{
        tenant: Tenant;
      }>({
        query: GET_TENANT,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.tenant) {
        throw new Error("테넌트를 찾을 수 없습니다");
      }

      return data.tenant;
    } catch (error) {
      console.error(`테넌트 조회 오류 (${id}):`, error);
      throw new Error(
        `테넌트 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 테넌트 생성
   *
   * @param input - 테넌트 생성 입력 데이터
   * @returns 생성된 테넌트 정보
   */
  async createTenant(
    input: CreateTenantVariables["input"]
  ): Promise<Tenant> {
    try {
      const { data } = await apolloClient.mutate<{
        createTenant: Tenant;
      }>({
        mutation: CREATE_TENANT,
        variables: { input },
        refetchQueries: [
          {
            query: GET_TENANTS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.createTenant) {
        throw new Error("테넌트 생성에 실패했습니다");
      }

      return data.createTenant;
    } catch (error) {
      console.error("테넌트 생성 오류:", error);
      throw new Error(
        `테넌트 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 테넌트 수정
   *
   * @param id - 테넌트 ID
   * @param input - 테넌트 수정 입력 데이터
   * @returns 수정된 테넌트 정보
   */
  async updateTenant(
    id: string,
    input: UpdateTenantVariables["input"]
  ): Promise<Tenant> {
    try {
      const { data } = await apolloClient.mutate<{
        updateTenant: Tenant;
      }>({
        mutation: UPDATE_TENANT,
        variables: { id, input },
        refetchQueries: [
          {
            query: GET_TENANT,
            variables: { id },
          },
        ],
      });

      if (!data?.updateTenant) {
        throw new Error("테넌트 수정에 실패했습니다");
      }

      return data.updateTenant;
    } catch (error) {
      console.error(`테넌트 수정 오류 (${id}):`, error);
      throw new Error(
        `테넌트 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
