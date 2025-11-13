import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { policyService } from "../services/policies.service";
import type { PolicyQueryParams, CreatePolicyRequest, UpdatePolicyRequest } from "../types/policies.types";

const policiesKeys = {
  all: ["policies"] as const,
  lists: () => [...policiesKeys.all, "list"] as const,
  list: (params?: PolicyQueryParams) =>
    [...policiesKeys.lists(), params] as const,
  detail: (id: string) => [...policiesKeys.all, "detail", id] as const,
};

export function usePolicies(params?: PolicyQueryParams) {
  return useQuery({
    queryKey: policiesKeys.list(params),
    queryFn: ({ signal }) => policyService.listPolicies(params, signal),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function usePolicy(id?: string | null) {
  return useQuery({
    queryKey: policiesKeys.detail(id!),
    queryFn: () => policyService.getPolicy(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePolicy(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePolicyRequest) =>
      policyService.createPolicy(data),
    onSuccess: (newPolicy) => {
      queryClient.invalidateQueries({ queryKey: policiesKeys.lists() });
      options?.onSuccess?.(newPolicy);
    },
    onError: options?.onError,
  });
}

export function useUpdatePolicy(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePolicyRequest }) =>
      policyService.updatePolicy(id, data),
    onSuccess: (updatedPolicy) => {
      queryClient.invalidateQueries({ queryKey: policiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: policiesKeys.detail(updatedPolicy.id) });
      options?.onSuccess?.(updatedPolicy);
    },
    onError: options?.onError,
  });
}

export function useDeletePolicy(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => policyService.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: policiesKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

export function useApprovePolicy(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, approver }: { id: string; approver: string }) =>
      policyService.approvePolicy(id, approver),
    onSuccess: (approvedPolicy) => {
      queryClient.invalidateQueries({ queryKey: policiesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: policiesKeys.detail(approvedPolicy.id) });
      options?.onSuccess?.(approvedPolicy);
    },
    onError: options?.onError,
  });
}
