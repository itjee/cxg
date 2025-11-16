/**
 * @file use-permissions.ts
 * @description Permissions GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: PermissionsQueryVariables (복수)
 * - 단일 조회: PermissionQueryVariables (단수)
 * - 생성/수정/삭제: CreatePermissionVariables, UpdatePermissionVariables, DeletePermissionVariables (단수)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PERMISSIONS,
  GET_PERMISSION,
  CREATE_PERMISSION,
  UPDATE_PERMISSION,
  DELETE_PERMISSION,
  type PermissionsQueryVariables,
  type PermissionQueryVariables,
  type CreatePermissionVariables,
  type UpdatePermissionVariables,
  type DeletePermissionVariables,
} from "../graphql";
import type { Permission } from "../types";

// ========== useQuery Hooks ==========

/**
 * 권한 목록 조회 (복수)
 *
 * @param variables 목록 조회 파라미터 (PermissionsQueryVariables)
 * @example
 * const { data, loading, error, refetch } = usePermissions({ limit: 20, offset: 0 });
 */
export function usePermissions(variables?: PermissionsQueryVariables) {
  return useQuery<
    { permissions: Permission[] },
    PermissionsQueryVariables
  >(GET_PERMISSIONS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * 권한 상세 조회 (단수)
 *
 * @param id 권한 ID
 * @example
 * const { data, loading, error } = usePermission("permission-id");
 */
export function usePermission(id: string) {
  return useQuery<{ permission: Permission }, PermissionQueryVariables>(
    GET_PERMISSION,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * 권한 생성
 *
 * @example
 * const [createPermission, { loading, error }] = useCreatePermission();
 * await createPermission({
 *   variables: {
 *     input: { code, name, category, resource, action, ... }
 *   }
 * });
 */
export function useCreatePermission() {
  return useMutation<
    { createPermission: Permission },
    CreatePermissionVariables
  >(CREATE_PERMISSION, {
    refetchQueries: [
      {
        query: GET_PERMISSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 권한 수정
 *
 * @example
 * const [updatePermission, { loading, error }] = useUpdatePermission();
 * await updatePermission({
 *   variables: {
 *     id: "permission-id",
 *     input: { name, description, status, ... }
 *   }
 * });
 */
export function useUpdatePermission() {
  return useMutation<
    { updatePermission: Permission },
    UpdatePermissionVariables
  >(UPDATE_PERMISSION, {
    refetchQueries: [
      {
        query: GET_PERMISSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 권한 삭제
 *
 * @example
 * const [deletePermission, { loading, error }] = useDeletePermission();
 * await deletePermission({
 *   variables: { id: "permission-id" }
 * });
 */
export function useDeletePermission() {
  return useMutation<
    { deletePermission: { message: string } },
    DeletePermissionVariables
  >(DELETE_PERMISSION, {
    refetchQueries: [
      {
        query: GET_PERMISSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
