/**
 * useJournalEntryLines Hook
 * TanStack Query를 사용한 분개 라인 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalEntryLinesService } from '../services';

const QUERY_KEY = ['journal-entry-lines'] as const;

export function useJournalEntryLines(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => journalEntryLinesService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useJournalEntryLinesById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => journalEntryLinesService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateJournalEntryLines() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => journalEntryLinesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateJournalEntryLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => journalEntryLinesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteJournalEntryLines(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => journalEntryLinesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
