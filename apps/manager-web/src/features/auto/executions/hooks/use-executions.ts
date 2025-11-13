/**
 * @file use-executions.ts
 * @description Executions TanStack Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { executionsService } from "../services";
import type {
  Execution,
  CreateExecutionRequest,
  UpdateExecutionRequest,
  ExecutionsQueryParams,
} from "../types";

/**
 * Query Key Factory
 */
const executionsKeys = {
  all: ["executions"] as const,
  lists: () => [...executionsKeys.all, "list"] as const,
  list: (params?: ExecutionsQueryParams) =>
    [...executionsKeys.lists(), params] as const,
  detail: (id: string | null | undefined) => 
    [...executionsKeys.all, "detail", id] as const,
};

/**
 * 실행 이력 목록 조회
 */
export function useExecutions(params?: ExecutionsQueryParams) {
  return useQuery({
    queryKey: executionsKeys.list(params),
    queryFn: ({ signal }) => executionsService.listExecutions(params, signal),
    staleTime: 30 * 1000, // 30초 (실시간성이 중요하므로 짧게 설정)
    retry: 2,
  });
}

/**
 * 실행 이력 상세 조회
 */
export function useExecution(id: string | null | undefined) {
  return useQuery({
    queryKey: executionsKeys.detail(id),
    queryFn: () => executionsService.getExecution(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1분
    retry: 2,
  });
}

/**
 * 실행 이력 생성
 */
export function useCreateExecution(options?: {
  onSuccess?: (execution: Execution) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExecutionRequest) =>
      executionsService.createExecution(data),
    onSuccess: (newExecution) => {
      queryClient.invalidateQueries({ queryKey: executionsKeys.lists() });
      options?.onSuccess?.(newExecution);
    },
    onError: options?.onError,
  });
}

/**
 * 실행 이력 수정
 */
export function useUpdateExecution(options?: {
  onSuccess?: (execution: Execution) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExecutionRequest }) =>
      executionsService.updateExecution(id, data),
    onSuccess: (updatedExecution) => {
      queryClient.invalidateQueries({ queryKey: executionsKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: executionsKeys.detail(updatedExecution.id) 
      });
      options?.onSuccess?.(updatedExecution);
    },
    onError: options?.onError,
  });
}

/**
 * 실행 이력 삭제
 */
export function useDeleteExecution(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => executionsService.deleteExecution(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: executionsKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
