/**
 * useInventorySerials Hook
 * TanStack Query를 사용한 InventorySerial 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventorySerialService } from "../services";
import type {
  InventorySerial,
  CreateInventorySerialRequest,
  UpdateInventorySerialRequest,
  InventorySerialQueryParams,
} from "../types";

const INVENTORY_SERIALS_QUERY_KEY = ["inventory-serials"] as const;

export function useInventorySerials(params?: InventorySerialQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_SERIALS_QUERY_KEY, params],
    queryFn: () => inventorySerialService.listInventorySerials(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventorySerial(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_SERIALS_QUERY_KEY, "detail", id],
    queryFn: () => inventorySerialService.getInventorySerial(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventorySerial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventorySerialRequest) => inventorySerialService.createInventorySerial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_SERIALS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-serials:", error);
    },
  });
}

export function useUpdateInventorySerial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventorySerialRequest) => inventorySerialService.updateInventorySerial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_SERIALS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_SERIALS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-serials ${id}:`, error);
    },
  });
}

export function useDeleteInventorySerial(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventorySerialService.deleteInventorySerial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_SERIALS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-serials ${id}:`, error);
    },
  });
}
