/**
 * useKpiDefinitions Hook
 * TanStack Query를 사용한 KPI 정의 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kpi-definitionsService } from '../services';

const QUERY_KEY = ['kpi-definitions'] as const;

export function useKpiDefinitions(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => kpi-definitionsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useKpiDefinitionsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => kpi-definitionsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateKpiDefinitions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => kpi-definitionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateKpiDefinitions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => kpi-definitionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteKpiDefinitions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => kpi-definitionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
