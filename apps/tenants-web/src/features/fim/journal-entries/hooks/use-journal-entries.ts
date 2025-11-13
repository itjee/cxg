/**
 * useJournalEntries Hook
 * TanStack Query를 사용한 분개 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalEntriesService } from '../services';

const QUERY_KEY = ['journal-entries'] as const;

export function useJournalEntries(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => journalEntriesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useJournalEntriesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => journalEntriesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateJournalEntries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => journalEntriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateJournalEntries(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => journalEntriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteJournalEntries(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => journalEntriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
