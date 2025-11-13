/**
 * useInventoryReservations Hook
 * TanStack Query를 사용한 InventoryReservation 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryReservationService } from "../services";
import type {
  InventoryReservation,
  CreateInventoryReservationRequest,
  UpdateInventoryReservationRequest,
  InventoryReservationQueryParams,
} from "../types";

const INVENTORY_RESERVATIONS_QUERY_KEY = ["inventory-reservations"] as const;

export function useInventoryReservations(params?: InventoryReservationQueryParams) {
  return useQuery({
    queryKey: [...INVENTORY_RESERVATIONS_QUERY_KEY, params],
    queryFn: () => inventoryReservationService.listInventoryReservations(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInventoryReservation(id: string | null | undefined) {
  return useQuery({
    queryKey: [...INVENTORY_RESERVATIONS_QUERY_KEY, "detail", id],
    queryFn: () => inventoryReservationService.getInventoryReservation(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateInventoryReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryReservationRequest) => inventoryReservationService.createInventoryReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_RESERVATIONS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create inventory-reservations:", error);
    },
  });
}

export function useUpdateInventoryReservation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInventoryReservationRequest) => inventoryReservationService.updateInventoryReservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_RESERVATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...INVENTORY_RESERVATIONS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update inventory-reservations ${id}:`, error);
    },
  });
}

export function useDeleteInventoryReservation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => inventoryReservationService.deleteInventoryReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_RESERVATIONS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete inventory-reservations ${id}:`, error);
    },
  });
}
