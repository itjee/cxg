/**
 * useApprovalRequests Hook
 * TanStack Query를 사용한 결재 요청 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { approval-requestsService } from '../services';

const QUERY_KEY = ['approval-requests'] as const;

export function useApprovalRequests(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => approval-requestsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useApprovalRequestsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => approval-requestsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateApprovalRequests() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-requestsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateApprovalRequests(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => approval-requestsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteApprovalRequests(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approval-requestsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
