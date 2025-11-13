/**
 * useInventoryAdjustments Hook
 * TanStack Query를 사용한 InventoryAdjustment 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryAdjustmentService } from "../services";
import type {
  InventoryAdjustment,
  CreateInventoryAdjustmentRequest,
  UpdateInventoryAdjustmentRequest,
  InventoryAdjustmentQueryParams,
} from "../types";

const INVENTORY_ADJUSTMENTS_QUERY_KEY = ["inventory-adjustments"] as const;

export function useInventoryAdjustments(params?: InventoryAdjustmentQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_ADJUSTMENTS_QUERY_KEY, params],
    queryFn: () => inventoryAdjustmentService.listInventoryAdjustments(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryAdjustment(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_ADJUSTMENTS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryAdjustmentService.getInventoryAdjustment(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryAdjustment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryAdjustmentRequest) => inventoryAdjustmentService.createInventoryAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ADJUSTMENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-adjustments:", error);
    },
  });
}

export function useUpdateInventoryAdjustment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryAdjustmentRequest) => inventoryAdjustmentService.updateInventoryAdjustment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ADJUSTMENTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_ADJUSTMENTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-adjustments ${id}:`, error);
    },
  });
}

export function useDeleteInventoryAdjustment(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryAdjustmentService.deleteInventoryAdjustment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_ADJUSTMENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-adjustments ${id}:`, error);
    },
  });
}
