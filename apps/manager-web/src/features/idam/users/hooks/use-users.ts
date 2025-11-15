/**
 * Users GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 */

import { useQuery, useMutation } from "@apollo/client";
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
import type { User } from "../types/users.types";

// ========== useQuery Hooks ==========

/**
 * 사용자 목록 조회
 *
 * @example
 * const { data, loading, error, refetch } = useUsers({ limit: 20, offset: 0 });
 */
export function useUsers(variables?: GetUsersVariables) {
  return useQuery<
    { users: User[] },
    GetUsersVariables
  >(GET_USERS, {
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
 * const { data, loading, error } = useUser("user-id");
 */
export function useUser(id: string) {
  return useQuery<{ user: User }, GetUserVariables>(
    GET_USER,
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
 * const [createUser, { loading, error }] = useCreateUser();
 * await createUser({
 *   variables: {
 *     input: { username, email, password, ... }
 *   }
 * });
 */
export function useCreateUser() {
  return useMutation<
    { createUser: User },
    CreateUserVariables
  >(CREATE_USER, {
    refetchQueries: [
      {
        query: GET_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 사용자 수정
 *
 * @example
 * const [updateUser, { loading, error }] = useUpdateUser();
 * await updateUser({
 *   variables: {
 *     id: "user-id",
 *     input: { fullName, email, ... }
 *   }
 * });
 */
export function useUpdateUser() {
  return useMutation<
    { updateUser: User },
    UpdateUserVariables
  >(UPDATE_USER, {
    refetchQueries: [
      {
        query: GET_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
