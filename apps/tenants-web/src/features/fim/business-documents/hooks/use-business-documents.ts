/**
 * useBusinessDocuments Hook
 * TanStack Query를 사용한 증빙서류 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessDocumentsService } from '../services';

const QUERY_KEY = ['business-documents'] as const;

export function useBusinessDocuments(params?: any) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => businessDocumentsService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBusinessDocumentsById(id: string | null | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'detail', id],
    queryFn: () => businessDocumentsService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateBusinessDocuments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => businessDocumentsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create:', error);
    },
  });
}

export function useUpdateBusinessDocuments(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => businessDocumentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', id] });
    },
    onError: (error) => {
      console.error(`Failed to update ${id}:`, error);
    },
  });
}

export function useDeleteBusinessDocuments(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => businessDocumentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete ${id}:`, error);
    },
  });
}
