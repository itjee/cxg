/**
 * 역할 GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ROLES,
  GET_ROLE,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  type RolesQueryVariables,
  type RoleQueryVariables,
  type CreateRoleVariables,
  type UpdateRoleVariables,
  type DeleteRoleVariables,
} from "../graphql";
import type { Role } from "../types";

// ========== useQuery Hooks ==========

/**
 * 역할 목록 조회 (복수)
 *
 * @param variables 목록 조회 파라미터 (RolesQueryVariables)
 * @example
 * const { data, loading, error, refetch } = useRoles({ limit: 20, offset: 0 });
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
 * @param id 역할 ID
 * @example
 * const { data, loading, error } = useRole("role-id");
 */
export function useRole(id: string) {
  return useQuery<{ role: Role }, RoleQueryVariables>(
    GET_ROLE,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * 역할 생성
 *
 * @example
 * const [createRole, { loading, error }] = useCreateRole();
 * await createRole({
 *   variables: {
 *     input: { name, description, status, ... }
 *   }
 * });
 */
export function useCreateRole() {
  return useMutation<
    { createRole: Role },
    CreateRoleVariables
  >(CREATE_ROLE, {
    refetchQueries: [
      {
        query: GET_ROLES,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 역할 수정
 *
 * @example
 * const [updateRole, { loading, error }] = useUpdateRole();
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
    refetchQueries: [
      {
        query: GET_ROLES,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 역할 삭제
 *
 * @example
 * const [deleteRole, { loading, error }] = useDeleteRole();
 * await deleteRole({
 *   variables: { id: "role-id" }
 * });
 */
export function useDeleteRole() {
  return useMutation<
    { deleteRole: { message: string } },
    DeleteRoleVariables
  >(DELETE_ROLE, {
    refetchQueries: [
      {
        query: GET_ROLES,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
