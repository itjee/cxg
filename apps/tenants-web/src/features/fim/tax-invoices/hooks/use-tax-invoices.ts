/**
 * useTaxInvoices Hook
 * TanStack Query를 사용한 세금계산서 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxInvoicesService } from '../services';

const QUERY_KEY = ['tax-invoices'] as const;

export function useTaxInvoices(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => taxInvoicesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useTaxInvoicesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => taxInvoicesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateTaxInvoices() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taxInvoicesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateTaxInvoices(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taxInvoicesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteTaxInvoices(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => taxInvoicesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
