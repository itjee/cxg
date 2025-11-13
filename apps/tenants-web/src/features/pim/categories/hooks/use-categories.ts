/**
 * useCategories Hook
 * TanStack Query를 사용한 카테고리 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categories.service';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryQueryParams,
} from '../categories.types';

const CATEGORIES_QUERY_KEY = ['categories'] as const;

/**
 * 카테고리 목록 조회 훅
 */
export function useCategories(params?: CategoryQueryParams) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, params],
    queryFn: () => categoryService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 카테고리 상세 조회 훅
 */
export function useCategory(id: string | null | undefined) {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, 'detail', id],
    queryFn: () => categoryService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 카테고리 생성 훅
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
    },
  });
}

/**
 * 카테고리 수정 훅
 */
export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) =>
      categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CATEGORIES_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update category ${id}:`, error);
    },
  });
}

/**
 * 카테고리 삭제 훅
 */
export function useDeleteCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete category ${id}:`, error);
    },
  });
}
