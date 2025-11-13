/**
 * useInventoryBalances Hook
 * TanStack Query를 사용한 InventoryBalance 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryBalanceService } from "../services";
import type {
  InventoryBalance,
  CreateInventoryBalanceRequest,
  UpdateInventoryBalanceRequest,
  InventoryBalanceQueryParams,
} from "../types";

const INVENTORY_BALANCES_QUERY_KEY = ["inventory-balances"] as const;

export function useInventoryBalances(params?: InventoryBalanceQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_BALANCES_QUERY_KEY, params],
    queryFn: () => inventoryBalanceService.listInventoryBalances(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryBalance(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_BALANCES_QUERY_KEY, "detail", id],
    queryFn: () => inventoryBalanceService.getInventoryBalance(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryBalanceRequest) => inventoryBalanceService.createInventoryBalance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_BALANCES_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-balances:", error);
    },
  });
}

export function useUpdateInventoryBalance(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryBalanceRequest) => inventoryBalanceService.updateInventoryBalance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_BALANCES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_BALANCES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-balances ${id}:`, error);
    },
  });
}

export function useDeleteInventoryBalance(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryBalanceService.deleteInventoryBalance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_BALANCES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-balances ${id}:`, error);
    },
  });
}
