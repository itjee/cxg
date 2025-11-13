/**
 * useAccounts Hook
 * TanStack Query를 사용한 계정과목 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsService } from '../services';

const QUERY_KEY = ['accounts'] as const;

export function useAccounts(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => accountsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAccountsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => accountsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateAccounts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateAccounts(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => accountsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteAccounts(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => accountsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
