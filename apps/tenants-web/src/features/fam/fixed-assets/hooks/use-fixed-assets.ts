/**
 * useFixedAssets Hook
 * TanStack Query를 사용한 고정자산 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fixed-assetsService } from '../services';

const QUERY_KEY = ['fixed-assets'] as const;

export function useFixedAssets(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => fixed-assetsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFixedAssetsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => fixed-assetsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateFixedAssets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => fixed-assetsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateFixedAssets(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => fixed-assetsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteFixedAssets(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fixed-assetsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
