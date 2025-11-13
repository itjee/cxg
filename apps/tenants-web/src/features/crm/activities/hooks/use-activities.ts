/**
 * useActivities Hook
 * TanStack Query를 사용한 활동기록 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activities.service';
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityQueryParams,
} from '../';

const ACTIVITIES_QUERY_KEY = ['activities'] as const;

/**
 * 활동기록 목록 조회 훅
 */
export function useActivities(params?: ActivityQueryParams) {
  return useQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, params],
    queryFn: () => activityService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 활동기록 상세 조회 훅
 */
export function useActivity(id: string | null | undefined) {
  return useQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, 'detail', id],
    queryFn: () => activityService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 활동기록 생성 훅
 */
export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityRequest) => activityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create activity:', error);
    },
  });
}

/**
 * 활동기록 수정 훅
 */
export function useUpdateActivity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateActivityRequest) =>
      activityService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...ACTIVITIES_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update activity ${id}:`, error);
    },
  });
}

/**
 * 활동기록 삭제 훅
 */
export function useDeleteActivity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete activity ${id}:`, error);
    },
  });
}
