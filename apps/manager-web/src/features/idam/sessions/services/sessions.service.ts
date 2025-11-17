/**
 * @file sessions.service.ts
 * @description 세션 관리 GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신입니다.
 *
 * 사용 시나리오:
 * - React Hook을 사용할 수 없는 상황 (유틸리티, 테스트, API 라우트 등)
 * - 일반적으로 React 컴포넌트에서는 Hooks (use-sessions.ts) 사용 권장
 */

import { apolloClient } from "@/lib/apollo-client";
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
  GetSessionsResponse,
  GetSessionResponse,
  CreateSessionResponse,
  UpdateSessionResponse,
  DeleteSessionResponse,
  RevokeSessionResponse,
  RevokeUserSessionsResponse,
  SessionsQueryVariables,
  CreateSessionVariables,
  UpdateSessionVariables,
  DeleteSessionVariables,
  RevokeSessionVariables,
  RevokeUserSessionsVariables,
} from "../types/sessions.types";

/**
 * 세션 관리 GraphQL 서비스
 *
 * Apollo Client를 사용하여 GraphQL 쿼리/뮤테이션을 실행합니다.
 *
 * @example
 * // 유틸리티 함수에서 사용
 * async function exportSessions() {
 *   const { items } = await sessionsService.listSessions({ limit: 1000 });
 *   generateCSV(items);
 * }
 *
 * @example
 * // API 라우트에서 사용
 * export async function GET() {
 *   const { items } = await sessionsService.listSessions();
 *   return Response.json(items);
 * }
 */
export const sessionsService = {
  /**
   * 세션 목록 조회
   *
   * @param params - 쿼리 파라미터 (limit, offset, status, userId 등)
   * @returns 세션 배열과 총 개수
   */
  async listSessions(
    params?: SessionsQueryVariables
  ): Promise<{ items: Session[]; total: number }> {
    try {
      const { data } = await apolloClient.query<GetSessionsResponse>({
        query: GET_SESSIONS,
        variables: {
          limit: params?.limit ?? 20,
          offset: params?.offset ?? 0,
          search: params?.search,
          status: params?.status,
          userId: params?.userId,
          sessionType: params?.sessionType,
          tenantContext: params?.tenantContext,
          fingerprint: params?.fingerprint,
          ipAddress: params?.ipAddress,
          mfaVerified: params?.mfaVerified,
        },
        fetchPolicy: "network-only",
      });

      const items = data?.sessions ?? [];
      return { items, total: items.length };
    } catch (error) {
      console.error("세션 목록 조회 오류:", error);
      throw new Error(
        `세션 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 세션 상세 조회
   *
   * @param id - 세션 ID
   * @returns 세션 정보
   * @throws 세션을 찾을 수 없을 때 에러
   */
  async getSession(id: string): Promise<Session> {
    try {
      const { data } = await apolloClient.query<GetSessionResponse>({
        query: GET_SESSION,
        variables: { id },
        fetchPolicy: "network-only",
      });

      if (!data?.session) {
        throw new Error("세션을 찾을 수 없습니다");
      }

      return data.session;
    } catch (error) {
      console.error(`세션 조회 오류 (${id}):`, error);
      throw new Error(
        `세션 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 세션 생성
   *
   * @param input - 세션 생성 입력 데이터
   * @returns 생성된 세션 정보
   */
  async createSession(
    input: CreateSessionVariables["input"]
  ): Promise<Session> {
    try {
      const { data } = await apolloClient.mutate<CreateSessionResponse>({
        mutation: CREATE_SESSION,
        variables: { input },
        refetchQueries: [
          {
            query: GET_SESSIONS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.createSession) {
        throw new Error("세션 생성에 실패했습니다");
      }

      return data.createSession;
    } catch (error) {
      console.error("세션 생성 오류:", error);
      throw new Error(
        `세션 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 세션 수정
   *
   * @param id - 세션 ID
   * @param input - 세션 수정 입력 데이터
   * @returns 수정된 세션 정보
   */
  async updateSession(
    id: string,
    input: UpdateSessionVariables["input"]
  ): Promise<Session> {
    try {
      const { data } = await apolloClient.mutate<UpdateSessionResponse>({
        mutation: UPDATE_SESSION,
        variables: { id, input },
        refetchQueries: [
          {
            query: GET_SESSION,
            variables: { id },
          },
        ],
      });

      if (!data?.updateSession) {
        throw new Error("세션 수정에 실패했습니다");
      }

      return data.updateSession;
    } catch (error) {
      console.error(`세션 수정 오류 (${id}):`, error);
      throw new Error(
        `세션 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 세션 삭제
   *
   * @param id - 세션 ID
   * @returns 삭제 결과 메시지
   */
  async deleteSession(id: string): Promise<void> {
    try {
      const { data } = await apolloClient.mutate<DeleteSessionResponse>({
        mutation: DELETE_SESSION,
        variables: { id },
        refetchQueries: [
          {
            query: GET_SESSIONS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.deleteSession) {
        throw new Error("세션 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error(`세션 삭제 오류 (${id}):`, error);
      throw new Error(
        `세션 삭제 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 세션 폐기 (Revoke)
   *
   * @param id - 세션 ID
   * @returns 폐기 결과
   */
  async revokeSession(id: string): Promise<{ id: string; status: string }> {
    try {
      const { data } = await apolloClient.mutate<RevokeSessionResponse>({
        mutation: REVOKE_SESSION,
        variables: { id },
        refetchQueries: [
          {
            query: GET_SESSION,
            variables: { id },
          },
        ],
      });

      if (!data?.revokeSession) {
        throw new Error("세션 폐기에 실패했습니다");
      }

      return data.revokeSession;
    } catch (error) {
      console.error(`세션 폐기 오류 (${id}):`, error);
      throw new Error(
        `세션 폐기 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * 사용자의 모든 세션 폐기
   *
   * @param userId - 사용자 ID
   * @returns 폐기 결과 메시지
   */
  async revokeUserSessions(userId: string): Promise<void> {
    try {
      const { data } = await apolloClient.mutate<RevokeUserSessionsResponse>({
        mutation: REVOKE_USER_SESSIONS,
        variables: { userId },
        refetchQueries: [
          {
            query: GET_SESSIONS,
            variables: { limit: 20, offset: 0, userId },
          },
        ],
      });

      if (!data?.revokeUserSessions) {
        throw new Error("사용자 세션 폐기에 실패했습니다");
      }
    } catch (error) {
      console.error(`사용자 세션 폐기 오류 (${userId}):`, error);
      throw new Error(
        `사용자 세션 폐기 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
