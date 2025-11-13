/**
 * usePartners Hook
 * TanStack Query를 사용한 거래처/고객 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerService } from '../services/partners.service';
import type {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerQueryParams,
} from '../';

const PARTNERS_QUERY_KEY = ['partners'] as const;

/**
 * 거래처 목록 조회 훅
 */
export function usePartners(params?: PartnerQueryParams) {
  return useQuery({
    queryKey: [...PARTNERS_QUERY_KEY, params],
    queryFn: () => partnerService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 거래처 상세 조회 훅
 */
export function usePartner(id: string | null | undefined) {
  return useQuery({
    queryKey: [...PARTNERS_QUERY_KEY, 'detail', id],
    queryFn: () => partnerService.get(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 거래처 생성 훅
 */
export function useCreatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerRequest) => partnerService.create(data),
    onSuccess: (newPartner) => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create partner:', error);
    },
  });
}

/**
 * 거래처 수정 훅
 */
export function useUpdatePartner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartnerRequest) => partnerService.update(id, data),
    onSuccess: (updatedPartner) => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...PARTNERS_QUERY_KEY, 'detail', id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update partner ${id}:`, error);
    },
  });
}

/**
 * 거래처 삭제 훅
 */
export function useDeletePartner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => partnerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTNERS_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete partner ${id}:`, error);
    },
  });
}
