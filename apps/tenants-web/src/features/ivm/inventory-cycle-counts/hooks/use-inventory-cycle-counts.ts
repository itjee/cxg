/**
 * useInventoryCycleCounts Hook
 * TanStack Query를 사용한 InventoryCycleCount 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryCycleCountService } from "../services";
import type {
  InventoryCycleCount,
  CreateInventoryCycleCountRequest,
  UpdateInventoryCycleCountRequest,
  InventoryCycleCountQueryParams,
} from "../types";

const INVENTORY_CYCLE_COUNTS_QUERY_KEY = ["inventory-cycle-counts"] as const;

export function useInventoryCycleCounts(params?: InventoryCycleCountQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_CYCLE_COUNTS_QUERY_KEY, params],
    queryFn: () => inventoryCycleCountService.listInventoryCycleCounts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryCycleCount(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_CYCLE_COUNTS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryCycleCountService.getInventoryCycleCount(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryCycleCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryCycleCountRequest) => inventoryCycleCountService.createInventoryCycleCount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_CYCLE_COUNTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-cycle-counts:", error);
    },
  });
}

export function useUpdateInventoryCycleCount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryCycleCountRequest) => inventoryCycleCountService.updateInventoryCycleCount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_CYCLE_COUNTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_CYCLE_COUNTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-cycle-counts ${id}:`, error);
    },
  });
}

export function useDeleteInventoryCycleCount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryCycleCountService.deleteInventoryCycleCount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_CYCLE_COUNTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-cycle-counts ${id}:`, error);
    },
  });
}
