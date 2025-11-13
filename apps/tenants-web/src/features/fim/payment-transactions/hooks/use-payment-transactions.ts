/**
 * usePaymentTransactions Hook
 * TanStack Query를 사용한 지급 거래 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentTransactionsService } from '../services';

const QUERY_KEY = ['payment-transactions'] as const;

export function usePaymentTransactions(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => paymentTransactionsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function usePaymentTransactionsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => paymentTransactionsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePaymentTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => paymentTransactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdatePaymentTransactions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => paymentTransactionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeletePaymentTransactions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => paymentTransactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
