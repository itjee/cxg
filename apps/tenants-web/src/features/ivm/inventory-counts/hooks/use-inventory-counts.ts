/**
 * useInventoryCounts Hook
 * TanStack Query를 사용한 InventoryCount 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryCountService } from "../services";
import type {
  InventoryCount,
  CreateInventoryCountRequest,
  UpdateInventoryCountRequest,
  InventoryCountQueryParams,
} from "../types";

const INVENTORY_COUNTS_QUERY_KEY = ["inventory-counts"] as const;

export function useInventoryCounts(params?: InventoryCountQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_COUNTS_QUERY_KEY, params],
    queryFn: () => inventoryCountService.listInventoryCounts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryCount(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_COUNTS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryCountService.getInventoryCount(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryCountRequest) => inventoryCountService.createInventoryCount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-counts:", error);
    },
  });
}

export function useUpdateInventoryCount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryCountRequest) => inventoryCountService.updateInventoryCount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_COUNTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-counts ${id}:`, error);
    },
  });
}

export function useDeleteInventoryCount(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryCountService.deleteInventoryCount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-counts ${id}:`, error);
    },
  });
}
