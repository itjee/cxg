/**
 * useAccountsReceivable Hook
 * TanStack Query를 사용한 매출채권 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsReceivableService } from '../services';

const QUERY_KEY = ['accounts-receivable'] as const;

export function useAccountsReceivable(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => accountsReceivableService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAccountsReceivableById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => accountsReceivableService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAccountsReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsReceivableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateAccountsReceivable(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsReceivableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteAccountsReceivable(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountsReceivableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
