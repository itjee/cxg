import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { complianceService } from "../services/compliances.service";
import type { ComplianceQueryParams, CreateComplianceRequest, UpdateComplianceRequest } from "../types/compliances.types";

const compliancesKeys = {
  all: ["compliances"] as const,
  lists: () => [...compliancesKeys.all, "list"] as const,
  list: (params?: ComplianceQueryParams) =>
    [...compliancesKeys.lists(), params] as const,
  detail: (id: string) => [...compliancesKeys.all, "detail", id] as const,
};

export function useCompliances(params?: ComplianceQueryParams) {
  return useQuery({
    queryKey: compliancesKeys.list(params),
    queryFn: ({ signal }) => complianceService.listCompliances(params, signal),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useCompliance(id?: string | null) {
  return useQuery({
    queryKey: compliancesKeys.detail(id!),
    queryFn: () => complianceService.getCompliance(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCompliance(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComplianceRequest) =>
      complianceService.createCompliance(data),
    onSuccess: (newCompliance) => {
      queryClient.invalidateQueries({ queryKey: compliancesKeys.lists() });
      options?.onSuccess?.(newCompliance);
    },
    onError: options?.onError,
  });
}

export function useUpdateCompliance(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComplianceRequest }) =>
      complianceService.updateCompliance(id, data),
    onSuccess: (updatedCompliance) => {
      queryClient.invalidateQueries({ queryKey: compliancesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: compliancesKeys.detail(updatedCompliance.id) });
      options?.onSuccess?.(updatedCompliance);
    },
    onError: options?.onError,
  });
}

export function useDeleteCompliance(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => complianceService.deleteCompliance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: compliancesKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
