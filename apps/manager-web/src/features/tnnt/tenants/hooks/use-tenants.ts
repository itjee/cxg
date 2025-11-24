/**
 * @file use-tenants.ts
 * @description 테넌트 GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * 타입 명명 규칙:
 * - 단일 조회 Hook: useTenant(singular)
 * - 목록 조회 Hook: useTenants(plural)
 * - 생성/수정 Hook: useCreateTenant, useUpdateTenant (singular)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TENANTS,
  GET_TENANT,
  CREATE_TENANT,
  UPDATE_TENANT,
  DELETE_TENANT,
} from "../graphql";
import type {
  Tenant,
  TenantsQueryVariables,
  TenantQueryVariables,
  CreateTenantVariables,
  UpdateTenantVariables,
} from "../types/tenants.types";

// ========== useQuery Hooks (조회) ==========

/**
 * 테넌트 목록 조회 (복수)
 *
 * @param variables - 목록 조회 파라미터 (limit, offset)
 * @returns useQuery 결과 (data.tenants 배열)
 *
 * @example
 * const { data, loading, error, refetch } = useTenants({
 *   limit: 20,
 *   offset: 0
 * });
 * // data.tenants는 Tenant[] 배열
 */
export function useTenants(variables?: TenantsQueryVariables) {
  return useQuery<
    { tenants: Tenant[] },
    TenantsQueryVariables
  >(GET_TENANTS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * 테넌트 상세 조회 (단수)
 *
 * @param id - 조회할 테넌트 ID
 * @returns useQuery 결과 (data.tenant 단일 객체)
 *
 * @example
 * const { data, loading, error } = useTenant("tenant-id");
 * // data.tenant는 Tenant 단일 객체
 */
export function useTenant(id: string) {
  return useQuery<{ tenant: Tenant }, TenantQueryVariables>(
    GET_TENANT,
    {
      variables: { id },
      skip: !id,
    }
  );
}

// ========== useMutation Hooks (변경) ==========

/**
 * 테넌트 생성 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [createTenant, { loading }] = useCreateTenant();
 * await createTenant({
 *   variables: {
 *     input: { code, name, domain, email, ... }
 *   }
 * });
 */
export function useCreateTenant() {
  return useMutation<
    { tenants: { createTenant: Tenant } },
    CreateTenantVariables
  >(CREATE_TENANT, {
    refetchQueries: [
      {
        query: GET_TENANTS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 테넌트 수정 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [updateTenant, { loading }] = useUpdateTenant();
 * await updateTenant({
 *   variables: {
 *     id: "tenant-id",
 *     input: { name, email, status, ... }
 *   }
 * });
 */
export function useUpdateTenant() {
  return useMutation<
    { tenants: { updateTenant: Tenant } },
    UpdateTenantVariables
  >(UPDATE_TENANT, {
    refetchQueries: [
      {
        query: GET_TENANTS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 테넌트 삭제 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [deleteTenant, { loading }] = useDeleteTenant();
 * await deleteTenant({
 *   variables: {
 *     id: "tenant-id"
 *   }
 * });
 */
export function useDeleteTenant() {
  return useMutation<
    { tenants: { deleteTenant: { success: boolean; message: string } } },
    { id: string }
  >(DELETE_TENANT, {
    refetchQueries: [
      {
        query: GET_TENANTS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
