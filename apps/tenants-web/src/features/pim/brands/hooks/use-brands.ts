/**
 * useBrands Hook
 * TanStack Query를 사용한 브랜드 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../services/brands.service';
import type {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandQueryParams,
} from '../brands.types';

const BRANDS_QUERY_KEY = ['brands'] as const;

/**
 * 브랜드 목록 조회 훅
 */
export function useBrands(params?: BrandQueryParams) {
  return useQuery({
    queryKey: [...BRANDS_QUERY_KEY, params],
    queryFn: () => brandService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 브랜드 상세 조회 훅
 */
export function useBrand(id: string | null | undefined) {
  return useQuery({
    queryKey: [...BRANDS_QUERY_KEY, 'detail', id],
    queryFn: () => brandService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 브랜드 생성 훅
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandRequest) => brandService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
    },
  });
}

/**
 * 브랜드 수정 훅
 */
export function useUpdateBrand(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBrandRequest) =>
      brandService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...BRANDS_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update brand ${id}:`, error);
    },
  });
}

/**
 * 브랜드 삭제 훅
 */
export function useDeleteBrand(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => brandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANDS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete brand ${id}:`, error);
    },
  });
}
