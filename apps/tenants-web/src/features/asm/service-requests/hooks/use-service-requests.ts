/**
 * useServiceRequests Hook
 * TanStack Query를 사용한 A/S 요청 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceRequestService } from "../services";
import type {
  ServiceRequest,
  CreateServiceRequestRequest,
  UpdateServiceRequestRequest,
  ServiceRequestQueryParams,
} from "../types";

const SERVICE_REQUESTS_QUERY_KEY = ["service-requests"] as const;

export function useServiceRequests(params?: ServiceRequestQueryParams) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, params],
    queryFn: () => serviceRequestService.listServiceRequests(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useServiceRequest(id: string | null | undefined) {
  return useQuery({
    queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "detail", id],
    queryFn: () => serviceRequestService.getServiceRequest(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequestRequest) => serviceRequestService.createServiceRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create service request:", error);
    },
  });
}

export function useUpdateServiceRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateServiceRequestRequest) => serviceRequestService.updateServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...SERVICE_REQUESTS_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update service request ${id}:`, error);
    },
  });
}

export function useDeleteServiceRequest(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => serviceRequestService.deleteServiceRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICE_REQUESTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete service request ${id}:`, error);
    },
  });
}
