/**
 * useCodeRules Hook
 * TanStack Query를 사용한 코드 규칙 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCodeRules, getCodeRule, createCodeRule, updateCodeRule, deleteCodeRule } from "../services";
import type { CodeRule, CreateCodeRuleRequest, UpdateCodeRuleRequest, CodeRuleQueryParams } from "../types";

// 쿼리 키 팩토리 패턴
const codeRulesKeys = {
  all: ["code-rules"] as const,
  lists: () => [...codeRulesKeys.all, "list"] as const,
  list: (params?: CodeRuleQueryParams) => [...codeRulesKeys.lists(), params] as const,
  details: () => [...codeRulesKeys.all, "detail"] as const,
  detail: (id: string) => [...codeRulesKeys.details(), id] as const,
};

/**
 * 코드 규칙 목록 조회 훅
 */
export function useCodeRules(params?: CodeRuleQueryParams) {
  return useQuery({
    queryKey: codeRulesKeys.list(params),
    queryFn: () => getCodeRules(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 코드 규칙 상세 조회 훅
 */
export function useCodeRule(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? codeRulesKeys.detail(id) : [],
    queryFn: () => getCodeRule(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 코드 규칙 생성 훅
 */
export function useCreateCodeRule(options?: {
  onSuccess?: (codeRule: CodeRule) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCodeRuleRequest) => createCodeRule(data),
    onSuccess: (newCodeRule) => {
      queryClient.invalidateQueries({ queryKey: codeRulesKeys.lists() });
      options?.onSuccess?.(newCodeRule.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 코드 규칙 수정 훅
 */
export function useUpdateCodeRule(options?: {
  onSuccess?: (codeRule: CodeRule) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCodeRuleRequest }) =>
      updateCodeRule(id, data),
    onSuccess: (updatedCodeRule, variables) => {
      queryClient.invalidateQueries({ queryKey: codeRulesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: codeRulesKeys.detail(variables.id) });
      options?.onSuccess?.(updatedCodeRule.data);
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}

/**
 * 코드 규칙 삭제 훅
 */
export function useDeleteCodeRule(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCodeRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: codeRulesKeys.lists() });
      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}
