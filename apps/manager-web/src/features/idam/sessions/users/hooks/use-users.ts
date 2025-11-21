/**
 * @file use-sessions.ts
 * @description 사용자 GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * 타입 명명 규칙:
 * - 단일 조회 Hook: useSession(singular)
 * - 목록 조회 Hook: useSessions(plural)
 * - 생성/수정 Hook: useCreateSession, useUpdateSession (singular)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SESSIONS,
  GET_SESSION,
  CREATE_SESSION,
  UPDATE_SESSION,
} from "../graphql";
import type {
  Session,
  SessionsQueryVariables,
  SessionQueryVariables,
  CreateSessionVariables,
  UpdateSessionVariables,
} from "../types/sessions.types";

// ========== useQuery Hooks (조회) ==========

/**
 * 사용자 목록 조회 (복수)
 *
 * @param variables - 목록 조회 파라미터 (limit, offset, status, userType, search)
 * @returns useQuery 결과 (data.sessions 배열)
 *
 * @example
 * const { data, loading, error, refetch } = useSessions({
 *   limit: 20,
 *   offset: 0,
 *   search: "john",      // 백엔드에서 검색 수행
 *   status: "ACTIVE"     // 상태로 필터링
 * });
 * // data.sessions는 Session[] 배열
 */
export function useSessions(variables?: SessionsQueryVariables) {
  return useQuery<
    { sessions: Session[] },
    SessionsQueryVariables
  >(GET_SESSIONS, {
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
 * const { data, loading, error } = useSession("user-id");
 * // data.user는 Session 단일 객체
 */
export function useSession(id: string) {
  return useQuery<{ user: Session }, SessionQueryVariables>(
    GET_SESSION,
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
 * const [createSession, { loading }] = useCreateSession();
 * await createSession({
 *   variables: {
 *     input: { userType, fullName, email, username, password, ... }
 *   }
 * });
 */
export function useCreateSession() {
  return useMutation<
    { sessions: { createSession: Session } },
    CreateSessionVariables
  >(CREATE_SESSION, {
    refetchQueries: [
      {
        query: GET_SESSIONS,
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
 * const [updateSession, { loading }] = useUpdateSession();
 * await updateSession({
 *   variables: {
 *     id: "user-id",
 *     input: { fullName, email, status, ... }
 *   }
 * });
 */
export function useUpdateSession() {
  return useMutation<
    { sessions: { updateSession: Session } },
    UpdateSessionVariables
  >(UPDATE_SESSION, {
    refetchQueries: [
      {
        query: GET_SESSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
