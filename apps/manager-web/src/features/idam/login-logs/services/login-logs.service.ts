/**
 * @file login-logs.service.ts
 * @description 로그인 이력 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신입니다.
 *
 * 사용 시나리오:
 * - React Hook을 사용할 수 없는 상황 (유틸리티, 테스트, API 라우트 등)
 * - 일반적으로 React 컴포넌트에서는 Hooks (use-login-logs.ts) 사용 권장
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_LOGIN_LOGS,
  GET_LOGIN_LOG,
  CREATE_LOGIN_LOG,
  DELETE_LOGIN_LOG,
} from "../graphql";

import type {
  LoginLog,
  GetLoginLogsResponse,
  GetLoginLogResponse,
  CreateLoginLogResponse,
  DeleteLoginLogResponse,
  LoginLogsQueryVariables,
  CreateLoginLogVariables,
  DeleteLoginLogVariables,
} from "../types/login-logs.types";

/**
 * 로그인 이력 GraphQL 서비스
 *
 * Apollo Client를 사용하여 GraphQL 쿼리/뮤테이션을 실행합니다.
 *
 * @example
 * // 유틸리티 함수에서 사용
 * async function exportLoginLogs() {
 *   const { items } = await loginLogsService.listLoginLogs({ limit: 1000 });
 *   generateCSV(items);
 * }
 *
 * @example
 * // API 라우트에서 사용
 * export async function GET() {
 *   const { items } = await loginLogsService.listLoginLogs();
 *   return Response.json(items);
 * }
 */
export const loginLogsService = {
  /**
   * 로그인 이력 목록 조회
   *
   * @param params - 쿼리 파라미터 (limit, offset, search, attemptType 등)
   * @returns 로그인 이력 배열과 총 개수
   */
  async listLoginLogs(
    params?: LoginLogsQueryVariables
  ): Promise<{ items: LoginLog[]; total: number }> {
    try {
      const { data } = await apolloClient.query<GetLoginLogsResponse>({
        query: GET_LOGIN_LOGS,
        variables: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          search: params?.search,
          attemptType: params?.attemptType,
          success: params?.success,
          userId: params?.userId,
          userType: params?.userType,
          tenantContext: params?.tenantContext,
          failureReason: params?.failureReason,
          mfaUsed: params?.mfaUsed,
          ipAddress: params?.ipAddress,
          startDate: params?.startDate,
          endDate: params?.endDate,
        },
        fetchPolicy: "network-only",
      });

      const items = data?.loginLogs ?? [];
      return { items, total: items.length };
    } catch (error) {
      console.error("로그인 이력 목록 조회 오류:", error);
      throw new Error(
        `로그인 이력 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 로그인 이력 상세 조회
   *
   * @param id - 로그인 이력 ID
   * @returns 로그인 이력 정보
   * @throws 로그인 이력을 찾을 수 없을 때 에러
   */
  async getLoginLog(id: string): Promise<LoginLog> {
    try {
      const { data } = await apolloClient.query<GetLoginLogResponse>({
        query: GET_LOGIN_LOG,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.loginLog) {
        throw new Error("로그인 이력을 찾을 수 없습니다");
      }

      return data.loginLog;
    } catch (error) {
      console.error(`로그인 이력 조회 오류 (${id}):`, error);
      throw new Error(
        `로그인 이력 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 로그인 이력 생성
   *
   * @param input - 로그인 이력 생성 입력 데이터
   * @returns 생성된 로그인 이력 정보
   */
  async createLoginLog(
    input: CreateLoginLogVariables["input"]
  ): Promise<LoginLog> {
    try {
      const { data } = await apolloClient.mutate<CreateLoginLogResponse>({
        mutation: CREATE_LOGIN_LOG,
        variables: { input },
        refetchQueries: [
          {
            query: GET_LOGIN_LOGS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.createLoginLog) {
        throw new Error("로그인 이력 생성에 실패했습니다");
      }

      return data.createLoginLog;
    } catch (error) {
      console.error("로그인 이력 생성 오류:", error);
      throw new Error(
        `로그인 이력 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 로그인 이력 삭제
   *
   * @param id - 로그인 이력 ID
   * @returns 삭제 결과 메시지
   */
  async deleteLoginLog(id: string): Promise<void> {
    try {
      const { data } = await apolloClient.mutate<DeleteLoginLogResponse>({
        mutation: DELETE_LOGIN_LOG,
        variables: { id },
        refetchQueries: [
          {
            query: GET_LOGIN_LOGS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.deleteLoginLog) {
        throw new Error("로그인 이력 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error(`로그인 이력 삭제 오류 (${id}):`, error);
      throw new Error(
        `로그인 이력 삭제 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
