import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { codeService } from "../services/codes.service";
import { useCodeStore } from "../stores/codes.store";
import type {
  Code,
  CreateCodeRequest,
  UpdateCodeRequest,
} from "../types/codes.types";

// 쿼리 키 정의
const codeQueryKeys = {
  all: ["codes"] as const,
  lists: () => [...codeQueryKeys.all, "list"] as const,
  list: (filters: any) => [...codeQueryKeys.lists(), filters] as const,
  details: () => [...codeQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...codeQueryKeys.details(), id] as const,
};

/**
 * 코드 목록 조회 훅
 */
export function useCodes() {
  const { searchQuery, codeGroupFilter, statusFilter, currentPage } =
    useCodeStore();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: codeQueryKeys.list({
      searchQuery,
      codeGroupFilter,
      statusFilter,
      currentPage,
    }),
    queryFn: () =>
      codeService.listCodes({
        search: searchQuery,
        code_group_id: codeGroupFilter || undefined,
        is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : null,
        page: currentPage,
      }),
  });

  const codes = response?.items || [];

  return { codes, isLoading, error };
}

/**
 * 단일 코드 조회 훅
 */
export function useCode(id: string | null) {
  const {
    data: code,
    isLoading,
    error,
  } = useQuery({
    queryKey: codeQueryKeys.detail(id || ""),
    queryFn: () => codeService.getCode(id!),
    enabled: !!id,
  });

  return { code, isLoading, error };
}

/**
 * 코드 생성 훅
 */
export function useCreateCode() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useCodeStore();

  const mutation = useMutation({
    mutationFn: (data: CreateCodeRequest) => codeService.createCode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: codeQueryKeys.lists() });
      closeSidebar();
    },
  });

  return {
    createCode: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드 수정 훅
 */
export function useUpdateCode() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useCodeStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCodeRequest }) =>
      codeService.updateCode(id, data),
    onSuccess: (updatedCode) => {
      queryClient.invalidateQueries({ queryKey: codeQueryKeys.lists() });
      queryClient.setQueryData(
        codeQueryKeys.detail(updatedCode.id),
        updatedCode
      );
      closeSidebar();
    },
  });

  return {
    updateCode: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드 삭제 훅
 */
export function useDeleteCode() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => codeService.deleteCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: codeQueryKeys.lists() });
    },
  });

  return {
    deleteCode: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드 통계 훅
 */
export function useCodeStats() {
  const { codes } = useCodes();

  const stats = {
    total: codes.length,
    active: codes.filter((c) => c.is_active).length,
    inactive: codes.filter((c) => !c.is_active).length,
  };

  return stats;
}
