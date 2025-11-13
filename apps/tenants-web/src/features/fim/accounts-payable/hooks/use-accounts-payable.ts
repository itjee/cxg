/**
 * useAccountsPayable Hook
 * TanStack Query를 사용한 매입채무 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsPayableService } from '../services';

const QUERY_KEY = ['accounts-payable'] as const;

export function useAccountsPayable(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => accountsPayableService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAccountsPayableById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => accountsPayableService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAccountsPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsPayableService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateAccountsPayable(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsPayableService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteAccountsPayable(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountsPayableService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
