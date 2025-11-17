/**
 * @file use-users.ts
 * @description 사용자 GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * 타입 명명 규칙:
 * - 단일 조회 Hook: useUser(singular)
 * - 목록 조회 Hook: useUsers(plural)
 * - 생성/수정 Hook: useCreateUser, useUpdateUser (singular)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
} from "../graphql";
import type {
  User,
  UsersQueryVariables,
  UserQueryVariables,
  CreateUserVariables,
  UpdateUserVariables,
} from "../types/users.types";

// ========== useQuery Hooks (조회) ==========

/**
 * 사용자 목록 조회 (복수)
 *
 * @param variables - 목록 조회 파라미터 (limit, offset, status, userType, search)
 * @returns useQuery 결과 (data.users 배열)
 *
 * @example
 * const { data, loading, error, refetch } = useUsers({
 *   limit: 20,
 *   offset: 0,
 *   search: "john",      // 백엔드에서 검색 수행
 *   status: "ACTIVE"     // 상태로 필터링
 * });
 * // data.users는 User[] 배열
 */
export function useUsers(variables?: UsersQueryVariables) {
  return useQuery<
    { users: User[] },
    UsersQueryVariables
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
 * 사용자 상세 조회 (단수)
 *
 * @param id - 조회할 사용자 ID
 * @returns useQuery 결과 (data.user 단일 객체)
 *
 * @example
 * const { data, loading, error } = useUser("user-id");
 * // data.user는 User 단일 객체
 */
export function useUser(id: string) {
  return useQuery<{ user: User }, UserQueryVariables>(
    GET_USER,
    {
      variables: { id },
      skip: !id,
    }
  );
}

// ========== useMutation Hooks (변경) ==========

/**
 * 사용자 생성 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [createUser, { loading }] = useCreateUser();
 * await createUser({
 *   variables: {
 *     input: { userType, fullName, email, username, password, ... }
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
 * 사용자 수정 (단수)
 *
 * @returns useMutation 튜플 [mutation 함수, result 객체]
 *
 * @example
 * const [updateUser, { loading }] = useUpdateUser();
 * await updateUser({
 *   variables: {
 *     id: "user-id",
 *     input: { fullName, email, status, ... }
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
