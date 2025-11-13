/**
 * @file use-onboardings.ts
 * @description 온보딩 프로세스 React Query hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingsService } from '../services/onboardings.service';
import type { 
  OnboardingQueryParams,
  CreateOnboardingRequest,
  UpdateOnboardingRequest
} from '../types/onboardings.types';

/**
 * Query Key Factory
 */
export const onboardingsKeys = {
  all: ['onboardings'] as const,
  lists: () => [...onboardingsKeys.all, 'list'] as const,
  list: (params?: OnboardingQueryParams) => [...onboardingsKeys.lists(), params] as const,
  detail: (id: string) => [...onboardingsKeys.all, 'detail', id] as const,
};

/**
 * 목록 조회 hook
 */
export function useOnboardings(params?: OnboardingQueryParams) {
  return useQuery({
    queryKey: onboardingsKeys.list(params),
    queryFn: ({ signal }) => onboardingsService.listOnboardings(params, signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 상세 조회 hook
 */
export function useOnboardingById(id: string) {
  return useQuery({
    queryKey: onboardingsKeys.detail(id),
    queryFn: ({ signal }) => onboardingsService.getOnboarding(id, signal),
    enabled: !!id,
  });
}

/**
 * 생성 mutation hook
 */
export function useCreateOnboarding(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOnboardingRequest) => 
      onboardingsService.createOnboarding(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 수정 mutation hook
 */
export function useUpdateOnboarding(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOnboardingRequest }) =>
      onboardingsService.updateOnboarding(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.detail(variables.id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

/**
 * 삭제 mutation hook
 */
export function useDeleteOnboarding(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => onboardingsService.deleteOnboarding(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.lists() });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * 재시도 mutation hook
 */
export function useRetryOnboarding(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => onboardingsService.retryOnboardingStep(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: onboardingsKeys.detail(id) });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}
