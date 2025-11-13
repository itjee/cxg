import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentTermService } from '../services/payment-term.service';
import { usePaymentTermStore } from '../stores/payment-term.store';
import type { PaymentTerm, CreatePaymentTermRequest, UpdatePaymentTermRequest } from '../types/payment-term.types';

// 쿼리 키 정의
const paymentTermQueryKeys = {
  all: ['payment-terms'] as const,
  lists: () => [...paymentTermQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...paymentTermQueryKeys.lists(), filters] as const,
  details: () => [...paymentTermQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentTermQueryKeys.details(), id] as const,
};

/**
 * 결제조건 목록 조회 훅
 */
export function usePaymentTermList() {
  const { searchQuery, statusFilter, currentPage } = usePaymentTermStore();

  const { data: paymentTerms = [], isLoading, error } = useQuery({
    queryKey: paymentTermQueryKeys.list({ searchQuery, statusFilter, currentPage }),
    queryFn: () =>
      paymentTermService.getPaymentTerms({
        search: searchQuery,
        isActive: statusFilter,
        page: currentPage,
      }),
  });

  return { paymentTerms, isLoading, error };
}

/**
 * 단일 결제조건 조회 훅
 */
export function usePaymentTermById(id: string | null) {
  const { data: paymentTerm, isLoading, error } = useQuery({
    queryKey: paymentTermQueryKeys.detail(id || ''),
    queryFn: () => paymentTermService.getPaymentTermById(id!),
    enabled: !!id,
  });

  return { paymentTerm, isLoading, error };
}

/**
 * 결제조건 생성 훅
 */
export function useCreatePaymentTerm() {
  const queryClient = useQueryClient();
  const { closeSidebar } = usePaymentTermStore();

  const mutation = useMutation({
    mutationFn: (data: CreatePaymentTermRequest) => paymentTermService.createPaymentTerm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentTermQueryKeys.lists() });
      closeSidebar();
    },
  });

  return {
    createPaymentTerm: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 결제조건 수정 훅
 */
export function useUpdatePaymentTerm() {
  const queryClient = useQueryClient();
  const { closeSidebar } = usePaymentTermStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentTermRequest }) =>
      paymentTermService.updatePaymentTerm(id, data),
    onSuccess: (updatedPaymentTerm) => {
      queryClient.invalidateQueries({ queryKey: paymentTermQueryKeys.lists() });
      queryClient.setQueryData(paymentTermQueryKeys.detail(updatedPaymentTerm.id), updatedPaymentTerm);
      closeSidebar();
    },
  });

  return {
    updatePaymentTerm: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 결제조건 삭제 훅
 */
export function useDeletePaymentTerm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => paymentTermService.deletePaymentTerm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentTermQueryKeys.lists() });
    },
  });

  return {
    deletePaymentTerm: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 결제조건 통계 훅
 */
export function usePaymentTermStats() {
  const { paymentTerms } = usePaymentTermList();

  const stats = {
    total: paymentTerms.length,
    active: paymentTerms.filter((p) => p.is_active).length,
    inactive: paymentTerms.filter((p) => !p.is_active).length,
    paymentTermCount: paymentTerms.length,
  };

  return stats;
}
