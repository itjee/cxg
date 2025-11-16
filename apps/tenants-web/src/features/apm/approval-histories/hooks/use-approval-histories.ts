/**
 * useApprovalHistories Hook
 * TanStack Query를 사용한 결재 이력 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approvalHistoriesService } from '../services';

const QUERY_KEY = ['approval-histories'] as const;

export function useApprovalHistories(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => approvalHistoriesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useApprovalHistoriesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => approval-historiesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateApprovalHistories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-historiesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateApprovalHistories(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-historiesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteApprovalHistories(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approval-historiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
