/**
 * useInventoryTransfers Hook
 * TanStack Query를 사용한 InventoryTransfer 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryTransferService } from "../services";
import type {
  InventoryTransfer,
  CreateInventoryTransferRequest,
  UpdateInventoryTransferRequest,
  InventoryTransferQueryParams,
} from "../types";

const INVENTORY_TRANSFERS_QUERY_KEY = ["inventory-transfers"] as const;

export function useInventoryTransfers(params?: InventoryTransferQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_TRANSFERS_QUERY_KEY, params],
    queryFn: () => inventoryTransferService.listInventoryTransfers(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryTransfer(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_TRANSFERS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryTransferService.getInventoryTransfer(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryTransferRequest) => inventoryTransferService.createInventoryTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_TRANSFERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-transfers:", error);
    },
  });
}

export function useUpdateInventoryTransfer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryTransferRequest) => inventoryTransferService.updateInventoryTransfer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_TRANSFERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_TRANSFERS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-transfers ${id}:`, error);
    },
  });
}

export function useDeleteInventoryTransfer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryTransferService.deleteInventoryTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_TRANSFERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-transfers ${id}:`, error);
    },
  });
}
