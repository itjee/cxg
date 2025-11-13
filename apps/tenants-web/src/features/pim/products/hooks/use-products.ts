/**
 * useProducts Hook
 * TanStack Query를 사용한 제품 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/products.service';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductQueryParams,
} from '../products.types';

const PRODUCTS_QUERY_KEY = ['products'] as const;

/**
 * 제품 목록 조회 훅
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: () => productService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 제품 상세 조회 훅
 */
export function useProduct(id: string | null | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'detail', id],
    queryFn: () => productService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 제품 생성 훅
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
}

/**
 * 제품 수정 훅
 */
export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductRequest) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PRODUCTS_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update product ${id}:`, error);
    },
  });
}

/**
 * 제품 삭제 훅
 */
export function useDeleteProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete product ${id}:`, error);
    },
  });
}
