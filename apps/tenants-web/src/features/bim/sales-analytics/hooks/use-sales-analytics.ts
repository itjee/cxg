/**
 * useSalesAnalytics Hook
 * TanStack Query를 사용한 영업 분석 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sales-analyticsService } from '../services';

const QUERY_KEY = ['sales-analytics'] as const;

export function useSalesAnalytics(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => sales-analyticsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSalesAnalyticsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => sales-analyticsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateSalesAnalytics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => sales-analyticsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateSalesAnalytics(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => sales-analyticsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteSalesAnalytics(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sales-analyticsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
