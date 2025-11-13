/**
 * useInventoryCountItems Hook
 * TanStack Query를 사용한 InventoryCountItem 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryCountItemService } from "../services";
import type {
  InventoryCountItem,
  CreateInventoryCountItemRequest,
  UpdateInventoryCountItemRequest,
  InventoryCountItemQueryParams,
} from "../types";

const INVENTORY_COUNT_ITEMS_QUERY_KEY = ["inventory-count-items"] as const;

export function useInventoryCountItems(params?: InventoryCountItemQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_COUNT_ITEMS_QUERY_KEY, params],
    queryFn: () => inventoryCountItemService.listInventoryCountItems(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryCountItem(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_COUNT_ITEMS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryCountItemService.getInventoryCountItem(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryCountItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryCountItemRequest) => inventoryCountItemService.createInventoryCountItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNT_ITEMS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-count-items:", error);
    },
  });
}

export function useUpdateInventoryCountItem(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryCountItemRequest) => inventoryCountItemService.updateInventoryCountItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNT_ITEMS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_COUNT_ITEMS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-count-items ${id}:`, error);
    },
  });
}

export function useDeleteInventoryCountItem(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryCountItemService.deleteInventoryCountItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_COUNT_ITEMS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-count-items ${id}:`, error);
    },
  });
}
