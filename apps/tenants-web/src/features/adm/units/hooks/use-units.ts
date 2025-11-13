import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unitService } from "../services/units.service";
import { useUnitStore } from "../stores/units.store";
import type {
  Unit,
  CreateUnitRequest,
  UpdateUnitRequest,
} from "../types/units.types";

// 쿼리 키 정의
const unitQueryKeys = {
  all: ["units"] as const,
  lists: () => [...unitQueryKeys.all, "list"] as const,
  list: (filters: any) => [...unitQueryKeys.lists(), filters] as const,
  details: () => [...unitQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...unitQueryKeys.details(), id] as const,
};

/**
 * 단위 목록 조회 훅
 */
export function useUnitList() {
  const { selectedStatus, currentPage } = useUnitStore();

  const {
    data: units = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: unitQueryKeys.list({ selectedStatus, currentPage }),
    queryFn: () =>
      unitService.getUnits({
        isActive: selectedStatus,
        page: currentPage,
      }),
  });

  return { units, isLoading, error };
}

/**
 * 단일 단위 조회 훅
 */
export function useUnitById(id: string | null) {
  const {
    data: unit,
    isLoading,
    error,
  } = useQuery({
    queryKey: unitQueryKeys.detail(id || ""),
    queryFn: () => unitService.getUnitById(id!),
    enabled: !!id,
  });

  return { unit, isLoading, error };
}

/**
 * 단위 생성 훅
 */
export function useCreateUnit() {
  const queryClient = useQueryClient();
  const { closeForm } = useUnitStore();

  const mutation = useMutation({
    mutationFn: (data: CreateUnitRequest) => unitService.createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.lists() });
      closeForm();
    },
  });

  return {
    createUnit: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 단위 수정 훅
 */
export function useUpdateUnit() {
  const queryClient = useQueryClient();
  const { closeForm } = useUnitStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitRequest }) =>
      unitService.updateUnit(id, data),
    onSuccess: (updatedUnit) => {
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.lists() });
      queryClient.setQueryData(
        unitQueryKeys.detail(updatedUnit.id),
        updatedUnit
      );
      closeForm();
    },
  });

  return {
    updateUnit: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 단위 삭제 훅
 */
export function useDeleteUnit() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => unitService.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.lists() });
    },
  });

  return {
    deleteUnit: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 단위 통계 훅
 */
export function useUnitStats() {
  const { units } = useUnitList();

  const stats = {
    total: units.length,
    active: units.filter((u) => u.is_active).length,
    inactive: units.filter((u) => !u.is_active).length,
    unitCount: units.length,
  };

  return stats;
}
