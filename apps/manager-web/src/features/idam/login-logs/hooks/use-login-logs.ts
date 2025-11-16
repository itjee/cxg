/**
 * @file use-login-logs.ts
 * @description Login Logs GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: LoginLogsQueryVariables (복수)
 * - 단일 조회: LoginLogQueryVariables (단수)
 * - 생성/삭제: CreateLoginLogVariables, DeleteLoginLogVariables (단수)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_LOGIN_LOGS,
  GET_LOGIN_LOG,
  CREATE_LOGIN_LOG,
  DELETE_LOGIN_LOG,
  type LoginLogsQueryVariables,
  type LoginLogQueryVariables,
  type CreateLoginLogVariables,
  type DeleteLoginLogVariables,
} from "../graphql";
import type { LoginLog } from "../types";

// ========== useQuery Hooks ==========

/**
 * 로그인 이력 목록 조회 (복수)
 *
 * @param variables 목록 조회 파라미터 (LoginLogsQueryVariables)
 * @example
 * const { data, loading, error, refetch } = useLoginLogs({ limit: 20, offset: 0 });
 */
export function useLoginLogs(variables?: LoginLogsQueryVariables) {
  return useQuery<
    { loginLogs: LoginLog[] },
    LoginLogsQueryVariables
  >(GET_LOGIN_LOGS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * 로그인 이력 상세 조회 (단수)
 *
 * @param id 로그인 이력 ID
 * @example
 * const { data, loading, error } = useLoginLog("login-log-id");
 */
export function useLoginLog(id: string) {
  return useQuery<{ loginLog: LoginLog }, LoginLogQueryVariables>(
    GET_LOGIN_LOG,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * 로그인 이력 생성
 *
 * @example
 * const [createLoginLog, { loading, error }] = useCreateLoginLog();
 * await createLoginLog({
 *   variables: {
 *     input: { attemptType, success, ipAddress, mfaUsed, ... }
 *   }
 * });
 */
export function useCreateLoginLog() {
  return useMutation<
    { createLoginLog: LoginLog },
    CreateLoginLogVariables
  >(CREATE_LOGIN_LOG, {
    refetchQueries: [
      {
        query: GET_LOGIN_LOGS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * 로그인 이력 삭제
 *
 * @example
 * const [deleteLoginLog, { loading, error }] = useDeleteLoginLog();
 * await deleteLoginLog({
 *   variables: { id: "login-log-id" }
 * });
 */
export function useDeleteLoginLog() {
  return useMutation<
    { deleteLoginLog: { message: string } },
    DeleteLoginLogVariables
  >(DELETE_LOGIN_LOG, {
    refetchQueries: [
      {
        query: GET_LOGIN_LOGS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
