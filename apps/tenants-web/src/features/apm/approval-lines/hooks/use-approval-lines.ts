/**
 * useApprovalLines Hook
 * TanStack Query를 사용한 결재 라인 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approval-linesService } from '../services';

const QUERY_KEY = ['approval-lines'] as const;

export function useApprovalLines(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => approval-linesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useApprovalLinesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => approval-linesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateApprovalLines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-linesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateApprovalLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-linesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteApprovalLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approval-linesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
