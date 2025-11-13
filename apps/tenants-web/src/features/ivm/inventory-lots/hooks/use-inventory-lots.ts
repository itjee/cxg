/**
 * useInventoryLots Hook
 * TanStack Query를 사용한 InventoryLot 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryLotService } from "../services";
import type {
  InventoryLot,
  CreateInventoryLotRequest,
  UpdateInventoryLotRequest,
  InventoryLotQueryParams,
} from "../types";

const INVENTORY_LOTS_QUERY_KEY = ["inventory-lots"] as const;

export function useInventoryLots(params?: InventoryLotQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_LOTS_QUERY_KEY, params],
    queryFn: () => inventoryLotService.listInventoryLots(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryLot(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_LOTS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryLotService.getInventoryLot(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryLot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryLotRequest) => inventoryLotService.createInventoryLot(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_LOTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-lots:", error);
    },
  });
}

export function useUpdateInventoryLot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryLotRequest) => inventoryLotService.updateInventoryLot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_LOTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_LOTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-lots ${id}:`, error);
    },
  });
}

export function useDeleteInventoryLot(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryLotService.deleteInventoryLot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_LOTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-lots ${id}:`, error);
    },
  });
}
