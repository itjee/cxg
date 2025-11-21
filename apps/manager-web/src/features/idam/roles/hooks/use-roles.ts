/**
 * @file use-roles.ts
 * @description 역할 GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * 타입 명명 규칙:
 * - 단일 조회 Hook: useRole(singular)
 * - 목록 조회 Hook: useRoles(plural)
 * - 생성/수정 Hook: useCreateRole, useUpdateRole (singular)
 */

import { useQuery, useMutation } from "@apollo/client";
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
} from "../types/roles.types";

// ========== useQuery Hooks (조회) ==========

/**
 * 역할 목록 조회 (복수)
 *
 * @param variables - 목록 조회 파라미터 (limit, offset, status, search)
 * @returns useQuery 결과 (data.roles 배열)
 *
 * @example
 * const { data, loading, error, refetch } = useRoles({
 *   limit: 20,
 *   offset: 0,
 *   search: "admin",     // 백엔드에서 검색 수행
 *   status: "ACTIVE"     // 상태로 필터링
 * });
 * // data.roles는 Role[] 배열
 */
export function useRoles(variables?: RolesQueryVariables) {
  return useQuery<
    { roles: Role[] },
    RolesQueryVariables
  >(GET_ROLES, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * 역할 상세 조회 (단수)
 *
 * @param id - 조회할 역할 ID
 * @returns useQuery 결과 (data.role 단일 객체)
 *
 * @example
 * const { data, loading, error } = useRole("role-id");
 * // data.role는 Role 단일 객체
 */
export function useRole(id: string) {
  return useQuery<{ role: Role }, RoleQueryVariables>(
    GET_ROLE,
    {
      variables: { id },
      skip: !id,
    }
  );
}

// ========== useMutation Hooks (변경) ==========

/**
 * 역할 생성 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [createRole, { loading }] = useCreateRole();
 * await createRole({
 *   variables: {
 *     input: { code, name, description, category, level, scope, ... }
 *   }
 * });
 */
export function useCreateRole() {
  return useMutation<
    { createRole: Role },
    CreateRoleVariables
  >(CREATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    awaitRefetchQueries: false,
  });
}

/**
 * 역할 수정 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [updateRole, { loading }] = useUpdateRole();
 * await updateRole({
 *   variables: {
 *     id: "role-id",
 *     input: { name, description, status, ... }
 *   }
 * });
 */
export function useUpdateRole() {
  return useMutation<
    { updateRole: Role },
    UpdateRoleVariables
  >(UPDATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    awaitRefetchQueries: false,
  });
}
