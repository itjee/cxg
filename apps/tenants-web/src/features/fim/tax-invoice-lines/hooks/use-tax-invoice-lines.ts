/**
 * useTaxInvoiceLines Hook
 * TanStack Query를 사용한 세금계산서 라인 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taxInvoiceLinesService } from '../services';

const QUERY_KEY = ['tax-invoice-lines'] as const;

export function useTaxInvoiceLines(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => taxInvoiceLinesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useTaxInvoiceLinesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => taxInvoiceLinesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateTaxInvoiceLines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taxInvoiceLinesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateTaxInvoiceLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => taxInvoiceLinesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteTaxInvoiceLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => taxInvoiceLinesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
