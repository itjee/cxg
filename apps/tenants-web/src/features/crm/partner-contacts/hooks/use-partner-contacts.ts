/**
 * usePartnerContacts Hook
 * TanStack Query를 사용한 거래처 담당자 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerContactService } from '../services/partner-contacts.service';
import type {
  PartnerContact,
  CreatePartnerContactRequest,
  UpdatePartnerContactRequest,
  PartnerContactQueryParams,
} from '../';

const createQueryKey = (partnerId: string) => ['partner-contacts', partnerId] as const;

/**
 * 거래처 담당자 목록 조회 훅
 */
export function usePartnerContacts(partnerId: string | null | undefined, params?: PartnerContactQueryParams) {
  return useQuery({
    queryKey: [...(createQueryKey(partnerId || ''), 'list'), params],
    queryFn: () => partnerContactService.list(partnerId!, params),
    enabled: !!partnerId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 거래처 담당자 상세 조회 훅
 */
export function usePartnerContact(partnerId: string | null | undefined, contactId: string | null | undefined) {
  return useQuery({
    queryKey: [...createQueryKey(partnerId || ''), 'detail', contactId],
    queryFn: () => partnerContactService.get(partnerId!, contactId!),
    enabled: !!partnerId && !!contactId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 거래처 담당자 생성 훅
 */
export function useCreatePartnerContact(partnerId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerContactRequest) =>
      partnerContactService.create(partnerId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey(partnerId || '') });
    },
    onError: (error) => {
      console.error('Failed to create partner contact:', error);
    },
  });
}

/**
 * 거래처 담당자 수정 훅
 */
export function useUpdatePartnerContact(partnerId: string | null | undefined, contactId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartnerContactRequest) =>
      partnerContactService.update(partnerId!, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey(partnerId || '') });
      queryClient.invalidateQueries({
        queryKey: [...createQueryKey(partnerId || ''), 'detail', contactId],
      });
    },
    onError: (error) => {
      console.error(`Failed to update partner contact ${contactId}:`, error);
    },
  });
}

/**
 * 거래처 담당자 삭제 훅
 */
export function useDeletePartnerContact(partnerId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId }: { contactId: string }) =>
      partnerContactService.delete(partnerId!, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: createQueryKey(partnerId || '') });
    },
    onError: (error) => {
      console.error('Failed to delete partner contact:', error);
    },
  });
}
