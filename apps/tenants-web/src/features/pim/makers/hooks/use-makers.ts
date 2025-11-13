/**
 * useMakers Hook
 * TanStack Query를 사용한 제조사 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makerService } from '../services/makers.service';
import type {
  Maker,
  CreateMakerRequest,
  UpdateMakerRequest,
  MakerQueryParams,
} from '../makers.types';

const MAKERS_QUERY_KEY = ['makers'] as const;

/**
 * 제조사 목록 조회 훅
 */
export function useMakers(params?: MakerQueryParams) {
  return useQuery({
    queryKey: [...MAKERS_QUERY_KEY, params],
    queryFn: () => makerService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 제조사 상세 조회 훅
 */
export function useMaker(id: string | null | undefined) {
  return useQuery({
    queryKey: [...MAKERS_QUERY_KEY, 'detail', id],
    queryFn: () => makerService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 제조사 생성 훅
 */
export function useCreateMaker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMakerRequest) => makerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAKERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create maker:', error);
    },
  });
}

/**
 * 제조사 수정 훅
 */
export function useUpdateMaker(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMakerRequest) =>
      makerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAKERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...MAKERS_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update maker ${id}:`, error);
    },
  });
}

/**
 * 제조사 삭제 훅
 */
export function useDeleteMaker(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => makerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MAKERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete maker ${id}:`, error);
    },
  });
}
