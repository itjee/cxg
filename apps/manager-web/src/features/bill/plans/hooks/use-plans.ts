/**
 * @file use-plans.ts
 * @description 요금제 관리 TanStack Query 훅
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { plansService } from '../services';
import type {
  Plan,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanQueryParams,
} from '../types';

/**
 * 쿼리 키 팩토리 패턴
 */
export const plansQueryKeys = {
  all: ['plans'] as const,
  lists: () => [...plansQueryKeys.all, 'list'] as const,
  list: (params?: PlanQueryParams) =>
    [...plansQueryKeys.lists(), { ...params }] as const,
  details: () => [...plansQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...plansQueryKeys.details(), id] as const,
};

/**
 * 요금제 목록 조회 훅
 */
export function usePlans(params?: PlanQueryParams) {
  return useQuery({
    queryKey: plansQueryKeys.list(params),
    queryFn: ({ signal }) => plansService.listPlans(params, signal),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
  });
}

/**
 * 요금제 상세 조회 훅
 */
export function usePlan(id: string | undefined) {
  return useQuery({
    queryKey: plansQueryKeys.detail(id || ''),
    queryFn: ({ signal }) => plansService.getPlan(id!, signal),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * 요금제 생성 훅
 */
export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanRequest) => plansService.createPlan(data),
    onSuccess: (newPlan) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: plansQueryKeys.lists() });
      // 새로 생성된 항목을 캐시에 추가
      queryClient.setQueryData(plansQueryKeys.detail(newPlan.id), newPlan);
    },
  });
}

/**
 * 요금제 수정 훅
 */
export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      plansService.updatePlan(id, data),
    onSuccess: (updatedPlan) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: plansQueryKeys.lists() });
      // 상세 조회 캐시 업데이트
      queryClient.setQueryData(plansQueryKeys.detail(updatedPlan.id), updatedPlan);
    },
  });
}

/**
 * 요금제 삭제 훅
 */
export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansService.deletePlan(id),
    onSuccess: (_data, deletedId) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: plansQueryKeys.lists() });
      // 상세 조회 캐시 제거
      queryClient.removeQueries({
        queryKey: plansQueryKeys.detail(deletedId),
      });
    },
  });
}
