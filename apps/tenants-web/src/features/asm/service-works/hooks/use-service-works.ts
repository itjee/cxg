/**
 * useServiceWorks Hook
 * TanStack Query를 사용한 A/S 작업 내역 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceWorkService } from "../services";
import type {
  ServiceWork,
  CreateServiceWorkRequest,
  UpdateServiceWorkRequest,
  ServiceWorkQueryParams,
} from "../types";

const SERVICE_WORKS_QUERY_KEY = ["service-works"] as const;

export function useServiceWorks(params?: ServiceWorkQueryParams) {
  return useQuery({
    queryKey: [...SERVICE_WORKS_QUERY_KEY, params],
    queryFn: () => serviceWorkService.listServiceWorks(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useServiceWork(id: string | null | undefined) {
  return useQuery({
    queryKey: [...SERVICE_WORKS_QUERY_KEY, "detail", id],
    queryFn: () => serviceWorkService.getServiceWork(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateServiceWork() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceWorkRequest) => serviceWorkService.createServiceWork(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_WORKS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create service work:", error);
    },
  });
}

export function useUpdateServiceWork(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceWorkRequest) => serviceWorkService.updateServiceWork(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_WORKS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...SERVICE_WORKS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update service work ${id}:`, error);
    },
  });
}

export function useDeleteServiceWork(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => serviceWorkService.deleteServiceWork(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_WORKS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete service work ${id}:`, error);
    },
  });
}
