import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { codeGroupService } from "../services";
import { useCodeGroupStore } from "../stores";
import type {
  CodeGroup,
  CreateCodeGroupRequest,
  UpdateCodeGroupRequest,
} from "../types/code-groups.types";

// 쿼리 키 정의
const codeGroupQueryKeys = {
  all: ["code-groups"] as const,
  lists: () => [...codeGroupQueryKeys.all, "list"] as const,
  list: (filters: any) => [...codeGroupQueryKeys.lists(), filters] as const,
  details: () => [...codeGroupQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...codeGroupQueryKeys.details(), id] as const,
};

/**
 * 코드그룹 목록 조회 훅
 */
export function useCodeGroups() {
  const { searchQuery, statusFilter, systemFilter, currentPage } =
    useCodeGroupStore();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: codeGroupQueryKeys.list({
      searchQuery,
      statusFilter,
      systemFilter,
      currentPage,
    }),
    queryFn: () =>
      codeGroupService.listCodeGroups({
        search: searchQuery,
        is_active:
          statusFilter === "active"
            ? true
            : statusFilter === "inactive"
            ? false
            : null,
        is_system:
          systemFilter === "system"
            ? true
            : systemFilter === "custom"
            ? false
            : null,
        page: currentPage,
      }),
  });

  const codeGroups = response?.items || [];

  return { codeGroups, isLoading, error };
}

/**
 * 단일 코드그룹 조회 훅
 */
export function useCodeGroup(id: string | null) {
  const {
    data: codeGroup,
    isLoading,
    error,
  } = useQuery({
    queryKey: codeGroupQueryKeys.detail(id || ""),
    queryFn: () => codeGroupService.getCodeGroup(id!),
    enabled: !!id,
  });

  return { codeGroup, isLoading, error };
}

/**
 * 코드그룹 생성 훅
 */
export function useCreateCodeGroup() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useCodeGroupStore();

  const mutation = useMutation({
    mutationFn: (data: CreateCodeGroupRequest) =>
      codeGroupService.createCodeGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: codeGroupQueryKeys.lists() });
      closeSidebar();
    },
  });

  return {
    createCodeGroup: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드그룹 수정 훅
 */
export function useUpdateCodeGroup() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useCodeGroupStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCodeGroupRequest }) =>
      codeGroupService.updateCodeGroup(id, data),
    onSuccess: (updatedCodeGroup) => {
      queryClient.invalidateQueries({ queryKey: codeGroupQueryKeys.lists() });
      queryClient.setQueryData(
        codeGroupQueryKeys.detail(updatedCodeGroup.id),
        updatedCodeGroup
      );
      closeSidebar();
    },
  });

  return {
    updateCodeGroup: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드그룹 삭제 훅
 */
export function useDeleteCodeGroup() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => codeGroupService.deleteCodeGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: codeGroupQueryKeys.lists() });
    },
  });

  return {
    deleteCodeGroup: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 코드그룹 통계 훅
 */
export function useCodeGroupStats() {
  const { codeGroups } = useCodeGroups();

  const stats = {
    total: codeGroups.length,
    active: codeGroups.filter((g) => g.is_active).length,
    inactive: codeGroups.filter((g) => !g.is_active).length,
    system: codeGroups.filter((g) => g.is_system).length,
    custom: codeGroups.filter((g) => !g.is_system).length,
  };

  return stats;
}
