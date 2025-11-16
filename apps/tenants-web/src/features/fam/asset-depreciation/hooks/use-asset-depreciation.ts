/**
 * useAssetDepreciation Hook
 * TanStack Query를 사용한 감가상각 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetDepreciationService } from '../services';

const QUERY_KEY = ['asset-depreciation'] as const;

export function useAssetDepreciation(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => assetDepreciationService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAssetDepreciationById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => assetDepreciationService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAssetDepreciation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => assetDepreciationService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateAssetDepreciation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => assetDepreciationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteAssetDepreciation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => assetDepreciationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
