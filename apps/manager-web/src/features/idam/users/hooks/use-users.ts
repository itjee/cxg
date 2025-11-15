/**
 * Users GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MANAGER_USERS,
  GET_MANAGER_USER,
  CREATE_MANAGER_USER,
  UPDATE_MANAGER_USER,
  type GetManagerUsersVariables,
  type GetManagerUserVariables,
  type CreateManagerUserVariables,
  type UpdateManagerUserVariables,
} from "../graphql";
import type { ManagerUser } from "../types/users.types";

// ========== useQuery Hooks ==========

/**
 * 사용자 목록 조회
 *
 * @example
 * const { data, loading, error, refetch } = useManagerUsers({ limit: 20, offset: 0 });
 */
export function useManagerUsers(variables?: GetManagerUsersVariables) {
  return useQuery<
    { manager_users: ManagerUser[] },
    GetManagerUsersVariables
  >(GET_MANAGER_USERS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * 사용자 상세 조회
 *
 * @example
 * const { data, loading, error } = useManagerUser("user-id");
 */
export function useManagerUser(id: string) {
  return useQuery<{ manager_user: ManagerUser }, GetManagerUserVariables>(
    GET_MANAGER_USER,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * 사용자 생성
 *
 * @example
 * const [createUser, { loading, error }] = useCreateManagerUser();
 * await createUser({
 *   variables: {
 *     input: { username, email, password, ... }
 *   }
 * });
 */
export function useCreateManagerUser() {
  return useMutation<
    { create_manager_user: ManagerUser },
    CreateManagerUserVariables
  >(CREATE_MANAGER_USER, {
    refetchQueries: [
      {
        query: GET_MANAGER_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 사용자 수정
 *
 * @example
 * const [updateUser, { loading, error }] = useUpdateManagerUser();
 * await updateUser({
 *   variables: {
 *     id: "user-id",
 *     input: { fullName, email, ... }
 *   }
 * });
 */
export function useUpdateManagerUser() {
  return useMutation<
    { update_manager_user: ManagerUser },
    UpdateManagerUserVariables
  >(UPDATE_MANAGER_USER, {
    refetchQueries: [
      {
        query: GET_MANAGER_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
