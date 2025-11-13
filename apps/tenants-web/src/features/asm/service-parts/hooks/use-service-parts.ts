/**
 * useServiceParts Hook
 * TanStack Query를 사용한 A/S 부품 사용 내역 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicePartService } from "../services";
import type {
  ServicePart,
  CreateServicePartRequest,
  UpdateServicePartRequest,
  ServicePartQueryParams,
} from "../types";

const SERVICE_PARTS_QUERY_KEY = ["service-parts"] as const;

export function useServiceParts(params?: ServicePartQueryParams) {
  return useQuery({
    queryKey: [...SERVICE_PARTS_QUERY_KEY, params],
    queryFn: () => servicePartService.listServiceParts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useServicePart(id: string | null | undefined) {
  return useQuery({
    queryKey: [...SERVICE_PARTS_QUERY_KEY, "detail", id],
    queryFn: () => servicePartService.getServicePart(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateServicePart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServicePartRequest) => servicePartService.createServicePart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PARTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create service part:", error);
    },
  });
}

export function useUpdateServicePart(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServicePartRequest) => servicePartService.updateServicePart(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PARTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...SERVICE_PARTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update service part ${id}:`, error);
    },
  });
}

export function useDeleteServicePart(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => servicePartService.deleteServicePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_PARTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete service part ${id}:`, error);
    },
  });
}
