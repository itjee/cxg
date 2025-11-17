/**
 * API Key GraphQL 서비스 계층
 *
 * Apollo Client를 사용한 GraphQL 통신 계층입니다.
 * 컴포넌트에서는 직접 Hooks를 사용하는 것을 권장합니다.
 */

import { apolloClient } from "@/lib/apollo-client";
import {
  GET_API_KEYS,
  GET_API_KEY,
  CREATE_API_KEY,
  UPDATE_API_KEY,
  DELETE_API_KEY,
} from "../graphql";
import type {
  ApiKey,
  ApiKeysQueryVariables,
  GetApiKeysResponse,
  ApiKeyQueryVariables,
  GetApiKeyResponse,
  CreateApiKeyVariables,
  CreateApiKeyResponse,
  UpdateApiKeyVariables,
  UpdateApiKeyResponse,
  DeleteApiKeyVariables,
  DeleteApiKeyResponse,
} from "../types";

/**
 * API Key GraphQL 서비스
 *
 * Apollo Client를 사용한 직접적인 GraphQL 통신
 * 주로 테스트 또는 특수한 상황에서 사용됩니다.
 * 일반적으로 컴포넌트에서는 Hooks를 직접 사용 권장
 */
export const apiKeyService = {
  /**
   * API 키 목록 조회
   *
   * @param params - 쿼리 변수 (limit, offset, status, search 등)
   * @returns API 키 목록 응답
   */
  async listApiKeys(
    params?: ApiKeysQueryVariables
  ): Promise<{ items: ApiKey[]; total: number }> {
    try {
      const variables: ApiKeysQueryVariables = {
        limit: params?.limit || 20,
        offset: params?.offset || 0,
        status: params?.status,
        search: params?.search,
      };

      const { data } = await apolloClient.query<GetApiKeysResponse>({
        query: GET_API_KEYS,
        variables,
        fetchPolicy: "network-only",
      });

      const items = data?.apiKeys || [];

      return {
        items,
        total: items.length,
      };
    } catch (error) {
      console.error("API 키 목록 조회 오류:", error);
      throw new Error(
        `API 키 목록 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * API 키 상세 조회
   *
   * @param id - API 키 ID
   * @returns API 키 정보
   */
  async getApiKey(id: string): Promise<ApiKey> {
    try {
      const variables: ApiKeyQueryVariables = { id };

      const { data } = await apolloClient.query<GetApiKeyResponse>({
        query: GET_API_KEY,
        variables,
        fetchPolicy: "network-only",
      });

      if (!data?.apiKey) {
        throw new Error("API 키를 찾을 수 없습니다");
      }

      return data.apiKey;
    } catch (error) {
      console.error(`API 키 조회 오류 (${id}):`, error);
      throw new Error(
        `API 키 조회 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * API 키 생성
   *
   * @param data - API 키 생성 입력 데이터
   * @returns 생성된 API 키 정보
   */
  async createApiKey(data: CreateApiKeyVariables["input"]): Promise<ApiKey> {
    try {
      const variables: CreateApiKeyVariables = { input: data };

      const { data: responseData } =
        await apolloClient.mutate<CreateApiKeyResponse>({
          mutation: CREATE_API_KEY,
          variables,
          refetchQueries: [
            {
              query: GET_API_KEYS,
              variables: { limit: 20, offset: 0 },
            },
          ],
        });

      if (!responseData?.createApiKey) {
        throw new Error("API 키 생성에 실패했습니다");
      }

      return responseData.createApiKey;
    } catch (error) {
      console.error("API 키 생성 오류:", error);
      throw new Error(
        `API 키 생성 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * API 키 수정
   *
   * @param id - API 키 ID
   * @param data - API 키 수정 입력 데이터
   * @returns 수정된 API 키 정보
   */
  async updateApiKey(
    id: string,
    data: UpdateApiKeyVariables["input"]
  ): Promise<ApiKey> {
    try {
      const variables: UpdateApiKeyVariables = { id, input: data };

      const { data: responseData } =
        await apolloClient.mutate<UpdateApiKeyResponse>({
          mutation: UPDATE_API_KEY,
          variables,
          refetchQueries: [
            {
              query: GET_API_KEY,
              variables: { id },
            },
          ],
        });

      if (!responseData?.updateApiKey) {
        throw new Error("API 키 수정에 실패했습니다");
      }

      return responseData.updateApiKey;
    } catch (error) {
      console.error(`API 키 수정 오류 (${id}):`, error);
      throw new Error(
        `API 키 수정 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },

  /**
   * API 키 삭제
   *
   * @param id - API 키 ID
   * @returns 삭제 결과 메시지
   */
  async deleteApiKey(id: string): Promise<void> {
    try {
      const variables: DeleteApiKeyVariables = { id };

      const { data } = await apolloClient.mutate<DeleteApiKeyResponse>({
        mutation: DELETE_API_KEY,
        variables,
        refetchQueries: [
          {
            query: GET_API_KEYS,
            variables: { limit: 20, offset: 0 },
          },
        ],
      });

      if (!data?.deleteApiKey) {
        throw new Error("API 키 삭제에 실패했습니다");
      }
    } catch (error) {
      console.error(`API 키 삭제 오류 (${id}):`, error);
      throw new Error(
        `API 키 삭제 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
    }
  },
};
