/**
 * @file use-api-keys.ts
 * @description API 키 관리 React Query hooks
 * 
 * 서버 상태를 관리하는 TanStack Query 훅 컬렉션
 * - useApiKeys: 목록 조회
 * - useApiKey: 상세 조회
 * - useCreateApiKey: 생성
 * - useUpdateApiKey: 수정
 * - useDeleteApiKey: 삭제
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useApiKeys({ page: 0, pageSize: 20 });
 * const createMutation = useCreateApiKey();
 * createMutation.mutate({ key_name: 'API Key', user_id: 'uuid' });
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiKeyService } from "../services";
import type {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyQueryParams,
} from "../types";

/**
 * Query Key Factory
 */
export const apiKeysKeys = {
  all: ["apiKeys"] as const,
  lists: () => [...apiKeysKeys.all, "list"] as const,
  list: (params?: ApiKeyQueryParams) => [...apiKeysKeys.lists(), params] as const,
  detail: (id: string) => [...apiKeysKeys.all, "detail", id] as const,
};

/**
 * 목록 조회 훅
 * 
 * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
 * @returns useQuery result
 * 
 * @example
 * ```typescript
 * const { data, isLoading, error } = useApiKeys({ 
 *   page: 0, 
 *   pageSize: 20,
 *   search: '검색어',
 *   status: 'ACTIVE'
 * });
 * ```
 */
export function useApiKeys(params?: ApiKeyQueryParams) {
  return useQuery({
    queryKey: apiKeysKeys.list(params),
    queryFn: () => apiKeyService.listApiKeys(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

/**
 * 상세 조회 훅
 * 
 * @param id - API 키 ID
 * @returns useQuery result
 * 
 * @example
 * ```typescript
 * const { data, isLoading } = useApiKey('uuid');
 * const apiKey = data?.data;
 * ```
 */
export function useApiKey(id: string | null | undefined) {
  return useQuery({
    queryKey: apiKeysKeys.detail(id!),
    queryFn: () => apiKeyService.getApiKey(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 생성 훅
 * 
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const createMutation = useCreateApiKey();
 * 
 * createMutation.mutate({
 *   key_name: 'Production Key',
 *   user_id: 'uuid'
 * }, {
 *   onSuccess: () => console.log('생성 성공'),
 *   onError: (error) => console.error('생성 실패', error)
 * });
 * ```
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => apiKeyService.createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to create API key:", error);
    },
  });
}

/**
 * 수정 훅
 * 
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const updateMutation = useUpdateApiKey();
 * 
 * updateMutation.mutate({
 *   id: 'uuid',
 *   data: { key_name: 'Updated Name' }
 * });
 * ```
 */
export function useUpdateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateApiKeyRequest }) =>
      apiKeyService.updateApiKey(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() });
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error("Failed to update API key:", error);
    },
  });
}

/**
 * 삭제 훅
 * 
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const deleteMutation = useDeleteApiKey();
 * 
 * deleteMutation.mutate('uuid', {
 *   onSuccess: () => console.log('삭제 성공')
 * });
 * ```
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiKeyService.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() });
    },
    onError: (error) => {
      console.error("Failed to delete API key:", error);
    },
  });
}

/**
 * 상태 변경 훅
 * 
 * @returns useMutation result
 * 
 * @example
 * ```typescript
 * const statusMutation = useUpdateApiKeyStatus();
 * 
 * statusMutation.mutate({ id: 'uuid', status: 'INACTIVE' });
 * ```
 */
export function useUpdateApiKeyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' | 'REVOKED' }) =>
      apiKeyService.updateApiKeyStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.lists() });
      queryClient.invalidateQueries({ queryKey: apiKeysKeys.detail(variables.id) });
    },
    onError: (error) => {
      console.error("Failed to update API key status:", error);
    },
  });
}
