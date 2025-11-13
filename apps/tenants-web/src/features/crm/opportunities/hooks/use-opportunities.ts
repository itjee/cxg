/**
 * useOpportunities Hook
 * TanStack Query를 사용한 영업기회 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunityService } from '../services';
import type {
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  OpportunityQueryParams,
} from '../types';

const OPPORTUNITIES_QUERY_KEY = ['opportunities'] as const;

/**
 * 영업기회 목록 조회 훅
 */
export function useOpportunities(params?: OpportunityQueryParams) {
  return useQuery({
    queryKey: [...OPPORTUNITIES_QUERY_KEY, params],
    queryFn: () => opportunityService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 영업기회 상세 조회 훅
 */
export function useOpportunity(id: string | null | undefined) {
  return useQuery({
    queryKey: [...OPPORTUNITIES_QUERY_KEY, 'detail', id],
    queryFn: () => opportunityService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 영업기회 생성 훅
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOpportunityRequest) => opportunityService.create(data),
    onSuccess: (newOpportunity) => {
      queryClient.invalidateQueries({ queryKey: OPPORTUNITIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create opportunity:', error);
    },
  });
}

/**
 * 영업기회 수정 훅
 */
export function useUpdateOpportunity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOpportunityRequest) => opportunityService.update(id, data),
    onSuccess: (updatedOpportunity) => {
      queryClient.invalidateQueries({ queryKey: OPPORTUNITIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...OPPORTUNITIES_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update opportunity ${id}:`, error);
    },
  });
}

/**
 * 영업기회 삭제 훅
 */
export function useDeleteOpportunity(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => opportunityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OPPORTUNITIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete opportunity ${id}:`, error);
    },
  });
}
