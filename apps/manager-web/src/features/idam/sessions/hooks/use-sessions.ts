/**
 * @file use-sessions.ts
 * @description Sessions GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: SessionsQueryVariables (복수)
 * - 단일 조회: SessionQueryVariables (단수)
 * - 생성/수정/삭제/폐기: CreateSessionVariables, UpdateSessionVariables, DeleteSessionVariables, RevokeSessionVariables (단수)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SESSIONS,
  GET_SESSION,
  CREATE_SESSION,
  UPDATE_SESSION,
  DELETE_SESSION,
  REVOKE_SESSION,
  REVOKE_USER_SESSIONS,
} from "../graphql";
import type {
  Session,
  SessionsQueryVariables,
  SessionQueryVariables,
  CreateSessionVariables,
  UpdateSessionVariables,
  DeleteSessionVariables,
  RevokeSessionVariables,
  RevokeSessionSessionsVariables,
} from "../types/sessions.types";

// ========== useQuery Hooks ==========

/**
 * 세션 목록 조회 (복수)
 *
 * @param variables 목록 조회 파라미터 (SessionsQueryVariables)
 * @example
 * const { data, loading, error, refetch } = useSessions({ limit: 20, offset: 0 });
 */
export function useSessions(variables?: SessionsQueryVariables) {
  return useQuery<
    { sessions: { items: Session[]; total: number } },
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
 * 세션 상세 조회 (단수)
 *
 * @param id 세션 ID
 * @example
 * const { data, loading, error } = useSession("session-id");
 */
export function useSession(id: string) {
  return useQuery<{ session: Session }, SessionQueryVariables>(
    GET_SESSION,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * 세션 생성
 *
 * @example
 * const [createSession, { loading, error }] = useCreateSession();
 * await createSession({
 *   variables: {
 *     input: { userId, ipAddress, expiresAt, ... }
 *   }
 * });
 */
export function useCreateSession() {
  return useMutation<
    { createSession: Session },
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
 * 세션 수정
 *
 * @example
 * const [updateSession, { loading, error }] = useUpdateSession();
 * await updateSession({
 *   variables: {
 *     id: "session-id",
 *     input: { status, lastActivityAt, ... }
 *   }
 * });
 */
export function useUpdateSession() {
  return useMutation<
    { updateSession: Session },
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

/**
 * 세션 삭제
 *
 * @example
 * const [deleteSession, { loading, error }] = useDeleteSession();
 * await deleteSession({
 *   variables: { id: "session-id" }
 * });
 */
export function useDeleteSession() {
  return useMutation<
    { deleteSession: { message: string } },
    DeleteSessionVariables
  >(DELETE_SESSION, {
    refetchQueries: [
      {
        query: GET_SESSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 세션 폐기 (Revoke)
 *
 * @example
 * const [revokeSession, { loading, error }] = useRevokeSession();
 * await revokeSession({
 *   variables: { id: "session-id" }
 * });
 */
export function useRevokeSession() {
  return useMutation<
    { revokeSession: { id: string; status: string } },
    RevokeSessionVariables
  >(REVOKE_SESSION, {
    refetchQueries: [
      {
        query: GET_SESSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 사용자의 모든 세션 폐기
 *
 * @example
 * const [revokeSessionSessions, { loading, error }] = useRevokeSessionSessions();
 * await revokeSessionSessions({
 *   variables: { userId: "user-id" }
 * });
 */
export function useRevokeSessionSessions() {
  return useMutation<
    { revokeSessionSessions: { message: string } },
    RevokeSessionSessionsVariables
  >(REVOKE_USER_SESSIONS, {
    refetchQueries: [
      {
        query: GET_SESSIONS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
