/**
 * @file use-subscriptions.ts
 * @description Subscriptions React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionsService } from "../services/subscriptions.service";
import type {
  SubscriptionQueryParams,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from "../types/subscriptions.types";

/**
 * Query Key Factory
 */
export const subscriptionsKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionsKeys.all, "list"] as const,
  list: (params?: SubscriptionQueryParams) =>
    [...subscriptionsKeys.lists(), params] as const,
  detail: (id: string) => [...subscriptionsKeys.all, "detail", id] as const,
};

/**
 * 목록 조회 hook
 */
export function useSubscriptions(params?: SubscriptionQueryParams) {
  return useQuery({
    queryKey: subscriptionsKeys.list(params),
    queryFn: ({ signal }) =>
      subscriptionsService.listSubscriptions(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useSubscription(id: string) {
  return useQuery({
    queryKey: subscriptionsKeys.detail(id),
    queryFn: ({ signal }) => subscriptionsService.getSubscription(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateSubscription(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) =>
      subscriptionsService.createSubscription(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateSubscription(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSubscriptionRequest;
    }) => subscriptionsService.updateSubscription(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: subscriptionsKeys.detail(variables.id),
      });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteSubscription(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionsService.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionsKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}
