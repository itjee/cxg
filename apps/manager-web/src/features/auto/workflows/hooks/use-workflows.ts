/**
 * @file use-workflows.ts
 * @description 워크플로우 관리 TanStack Query Hooks
 * 
 * 워크플로우 CRUD 작업을 위한 React Query hooks 모음
 * - 서버 상태 관리 (캐싱, 동기화, 재요청)
 * - Optimistic Updates (낙관적 업데이트)
 * - 자동 에러 처리 및 재시도
 * - 무효화 및 재조회 자동화
 * 
 * @architecture
 * ```
 * Component → Hook (여기) → Service → Backend API
 *              ↓
 *         TanStack Query
 *         (캐싱, 동기화)
 * ```
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowsService } from "../services";
import type {
  Workflows,
  CreateWorkflowsRequest,
  UpdateWorkflowsRequest,
  WorkflowsQueryParams,
} from "../types";

/**
 * Query Key Factory
 * 
 * @description
 * TanStack Query의 캐시 키를 생성하는 팩토리 함수들
 * - 일관된 키 네이밍 규칙
 * - 타입 안전한 키 생성
 * - 무효화 및 재조회 시 사용
 */
const workflowsKeys = {
  /** 전체 workflows 쿼리 키 */
  all: ["workflows"] as const,
  
  /** 모든 목록 쿼리 키 */
  lists: () => [...workflowsKeys.all, "list"] as const,
  
  /** 특정 파라미터의 목록 쿼리 키 */
  list: (params?: WorkflowsQueryParams) => [...workflowsKeys.lists(), params] as const,
  
  /** 모든 상세 쿼리 키 */
  details: () => [...workflowsKeys.all, "detail"] as const,
  
  /** 특정 워크플로우의 상세 쿼리 키 */
  detail: (id: string) => [...workflowsKeys.details(), id] as const,
};

/**
 * 워크플로우 목록 조회 Hook
 * 
 * @description
 * 서버 사이드 페이징 및 필터링을 지원하는 워크플로우 목록 조회
 * - 자동 캐싱 (staleTime: 5분, gcTime: 10분)
 * - 페이지 변경 시 자동 재조회
 * - 백그라운드 자동 재검증
 * - 지수 백오프 재시도 (최대 2회)
 */
export function useWorkflows(params?: WorkflowsQueryParams) {
  return useQuery({
    queryKey: workflowsKeys.list(params),
    queryFn: ({ signal }) => workflowsService.listWorkflows(params, signal),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 워크플로우 상세 조회 Hook
 * 
 * @description
 * 특정 워크플로우의 상세 정보를 조회
 * - 수정 폼에 데이터를 채울 때 사용
 * - id가 null/undefined면 쿼리 비활성화
 */
export function useWorkflow(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? workflowsKeys.detail(id) : [],
    queryFn: ({ signal }) => workflowsService.getWorkflows(id!, signal),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * 워크플로우 생성 Hook (Mutation)
 * 
 * @description
 * 새로운 워크플로우를 생성하는 Mutation hook
 * - Optimistic Update: 즉시 UI 업데이트 (실패 시 롤백)
 * - 자동 캐시 무효화: 생성 후 목록 재조회
 */
export function useCreateWorkflow(options?: {
  onSuccess?: (workflow: Workflows) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkflowsRequest) => workflowsService.createWorkflows(data),
    onMutate: async (newWorkflow) => {
      await queryClient.cancelQueries({ queryKey: workflowsKeys.lists() });
      const previousWorkflows = queryClient.getQueryData(workflowsKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: workflowsKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: [
            ...(old.items || []),
            { ...newWorkflow, id: "temp-id", created_at: new Date().toISOString() },
          ],
        };
      });

      return { previousWorkflows };
    },
    onSuccess: (newWorkflow) => {
      queryClient.invalidateQueries({ queryKey: workflowsKeys.lists() });
      options?.onSuccess?.(newWorkflow);
    },
    onError: (error, variables, context) => {
      if (context?.previousWorkflows) {
        queryClient.setQueryData(workflowsKeys.lists(), context.previousWorkflows);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workflowsKeys.lists() });
    },
    retry: 1,
  });
}

/**
 * 워크플로우 수정 Hook (Mutation)
 * 
 * @description
 * 기존 워크플로우를 수정하는 Mutation hook
 * - Optimistic Update: 상세 + 목록 모두 즉시 업데이트
 * - 부분 업데이트 지원: 변경된 필드만 전송
 */
export function useUpdateWorkflow(options?: {
  onSuccess?: (workflow: Workflows) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkflowsRequest }) =>
      workflowsService.updateWorkflows(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: workflowsKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: workflowsKeys.lists() });

      const previousWorkflow = queryClient.getQueryData(workflowsKeys.detail(id));
      const previousList = queryClient.getQueryData(workflowsKeys.lists());

      // Optimistic Update - 상세
      queryClient.setQueryData(workflowsKeys.detail(id), (old: any) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      // Optimistic Update - 목록
      queryClient.setQueriesData({ queryKey: workflowsKeys.lists() }, (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.map((workflow: Workflows) =>
            workflow.id === id ? { ...workflow, ...data } : workflow
          ),
        };
      });

      return { previousWorkflow, previousList, id };
    },
    onSuccess: (updatedWorkflow, { id }) => {
      queryClient.setQueryData(workflowsKeys.detail(id), updatedWorkflow);
      queryClient.invalidateQueries({ queryKey: workflowsKeys.lists() });
      options?.onSuccess?.(updatedWorkflow);
    },
    onError: (error, { id }, context) => {
      if (context?.previousWorkflow) {
        queryClient.setQueryData(workflowsKeys.detail(id), context.previousWorkflow);
      }
      if (context?.previousList) {
        queryClient.setQueryData(workflowsKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: workflowsKeys.detail(id) });
    },
    retry: 1,
  });
}

/**
 * 워크플로우 삭제 Hook (Mutation)
 * 
 * @description
 * 워크플로우를 삭제하는 Mutation hook
 * - Optimistic Update: 목록에서 즉시 제거 (실패 시 복구)
 * - 자동 캐시 무효화: 삭제 후 목록 재조회
 */
export function useDeleteWorkflow(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workflowsService.deleteWorkflows(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: workflowsKeys.lists() });

      const previousList = queryClient.getQueryData(workflowsKeys.lists());

      // Optimistic Update
      queryClient.setQueriesData({ queryKey: workflowsKeys.lists() }, (old: any) => {
        if (!old?.items) return old;
        return {
          ...old,
          items: old.items.filter((workflow: Workflows) => workflow.id !== id),
        };
      });

      return { previousList, id };
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: workflowsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: workflowsKeys.lists() });
      options?.onSuccess?.();
    },
    onError: (error, id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(workflowsKeys.lists(), context.previousList);
      }
      options?.onError?.(error as Error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workflowsKeys.lists() });
    },
    retry: 1,
  });
}
