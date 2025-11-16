/**
 * @file use-api-keys.ts
 * @description API Key GraphQL Hooks
 *
 * Apollo Client를 사용한 GraphQL Hooks
 * Feature-driven 아키텍처를 따릅니다.
 *
 * 타입 명명 규칙:
 * - 목록 조회: ApiKeysQueryVariables (복수)
 * - 단일 조회: ApiKeyQueryVariables (단수)
 * - 생성/수정/삭제: CreateApiKeyVariables, UpdateApiKeyVariables, DeleteApiKeyVariables (단수)
 */

import { useQuery, useMutation } from "@apollo/client";
import {
  GET_API_KEYS,
  GET_API_KEY,
  CREATE_API_KEY,
  UPDATE_API_KEY,
  DELETE_API_KEY,
  type ApiKeysQueryVariables,
  type ApiKeyQueryVariables,
  type CreateApiKeyVariables,
  type UpdateApiKeyVariables,
  type DeleteApiKeyVariables,
} from "../graphql";
import type { ApiKey } from "../types";

// ========== useQuery Hooks ==========

/**
 * API 키 목록 조회 (복수)
 *
 * @param variables 목록 조회 파라미터 (ApiKeysQueryVariables)
 * @example
 * const { data, loading, error, refetch } = useApiKeys({ limit: 20, offset: 0 });
 */
export function useApiKeys(variables?: ApiKeysQueryVariables) {
  return useQuery<
    { apiKeys: ApiKey[] },
    ApiKeysQueryVariables
  >(GET_API_KEYS, {
    variables: {
      limit: 20,
      offset: 0,
      ...variables,
    },
    fetchPolicy: "cache-and-network",
  });
}

/**
 * API 키 상세 조회 (단수)
 *
 * @param id API 키 ID
 * @example
 * const { data, loading, error } = useApiKey("api-key-id");
 */
export function useApiKey(id: string) {
  return useQuery<{ apiKey: ApiKey }, ApiKeyQueryVariables>(
    GET_API_KEY,
    {
      variables: { id },
      skip: !id, // id가 없으면 쿼리 실행 안 함
    }
  );
}

// ========== useMutation Hooks ==========

/**
 * API 키 생성
 *
 * @example
 * const [createApiKey, { loading, error }] = useCreateApiKey();
 * await createApiKey({
 *   variables: {
 *     input: { keyName, userId, ... }
 *   }
 * });
 */
export function useCreateApiKey() {
  return useMutation<
    { createApiKey: ApiKey },
    CreateApiKeyVariables
  >(CREATE_API_KEY, {
    refetchQueries: [
      {
        query: GET_API_KEYS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * API 키 수정
 *
 * @example
 * const [updateApiKey, { loading, error }] = useUpdateApiKey();
 * await updateApiKey({
 *   variables: {
 *     id: "api-key-id",
 *     input: { keyName, status, ... }
 *   }
 * });
 */
export function useUpdateApiKey() {
  return useMutation<
    { updateApiKey: ApiKey },
    UpdateApiKeyVariables
  >(UPDATE_API_KEY, {
    refetchQueries: [
      {
        query: GET_API_KEYS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}

/**
 * API 키 삭제
 *
 * @example
 * const [deleteApiKey, { loading, error }] = useDeleteApiKey();
 * await deleteApiKey({
 *   variables: { id: "api-key-id" }
 * });
 */
export function useDeleteApiKey() {
  return useMutation<
    { deleteApiKey: { message: string } },
    DeleteApiKeyVariables
  >(DELETE_API_KEY, {
    refetchQueries: [
      {
        query: GET_API_KEYS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
