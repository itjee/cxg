/**
 * useInventoryMovements Hook
 * TanStack Query를 사용한 InventoryMovement 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryMovementService } from "../services";
import type {
  InventoryMovement,
  CreateInventoryMovementRequest,
  UpdateInventoryMovementRequest,
  InventoryMovementQueryParams,
} from "../types";

const INVENTORY_MOVEMENTS_QUERY_KEY = ["inventory-movements"] as const;

export function useInventoryMovements(params?: InventoryMovementQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_MOVEMENTS_QUERY_KEY, params],
    queryFn: () => inventoryMovementService.listInventoryMovements(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryMovement(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_MOVEMENTS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryMovementService.getInventoryMovement(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryMovementRequest) => inventoryMovementService.createInventoryMovement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_MOVEMENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-movements:", error);
    },
  });
}

export function useUpdateInventoryMovement(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryMovementRequest) => inventoryMovementService.updateInventoryMovement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_MOVEMENTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_MOVEMENTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-movements ${id}:`, error);
    },
  });
}

export function useDeleteInventoryMovement(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryMovementService.deleteInventoryMovement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_MOVEMENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-movements ${id}:`, error);
    },
  });
}
