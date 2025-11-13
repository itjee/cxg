import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { exchangeRateService } from '../services/exchange-rates.service';
import { useExchangeRatesStore } from '../stores/exchange-rates.store';
import type { ExchangeRate, CreateExchangeRateRequest, UpdateExchangeRateRequest } from '../types/exchange-rates.types';

// 쿼리 키 정의
const exchangeRateQueryKeys = {
  all: ['exchange-rates'] as const,
  lists: () => [...exchangeRateQueryKeys.all, 'list'] as const,
  list: (filters: any) => [...exchangeRateQueryKeys.lists(), filters] as const,
  details: () => [...exchangeRateQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...exchangeRateQueryKeys.details(), id] as const,
};

/**
 * 환율 목록 조회 훅
 */
export function useExchangeRateList() {
  const { searchQuery, statusFilter, currentPage } = useExchangeRatesStore();

  const { data: exchangeRates = [], isLoading, error } = useQuery({
    queryKey: exchangeRateQueryKeys.list({ searchQuery, statusFilter, currentPage }),
    queryFn: () =>
      exchangeRateService.getExchangeRates({
        search: searchQuery,
        isActive: statusFilter,
        page: currentPage,
      }),
  });

  return { exchangeRates, isLoading, error };
}

/**
 * 단일 환율 조회 훅
 */
export function useExchangeRateById(id: string | null) {
  const { data: exchangeRate, isLoading, error } = useQuery({
    queryKey: exchangeRateQueryKeys.detail(id || ''),
    queryFn: () => exchangeRateService.getExchangeRateById(id!),
    enabled: !!id,
  });

  return { exchangeRate, isLoading, error };
}

/**
 * 환율 생성 훅
 */
export function useCreateExchangeRate() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useExchangeRatesStore();

  const mutation = useMutation({
    mutationFn: (data: CreateExchangeRateRequest) => exchangeRateService.createExchangeRate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeRateQueryKeys.lists() });
      closeSidebar();
    },
  });

  return {
    createExchangeRate: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 환율 수정 훅
 */
export function useUpdateExchangeRate() {
  const queryClient = useQueryClient();
  const { closeSidebar } = useExchangeRatesStore();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExchangeRateRequest }) =>
      exchangeRateService.updateExchangeRate(id, data),
    onSuccess: (updatedExchangeRate) => {
      queryClient.invalidateQueries({ queryKey: exchangeRateQueryKeys.lists() });
      queryClient.setQueryData(exchangeRateQueryKeys.detail(updatedExchangeRate.id), updatedExchangeRate);
      closeSidebar();
    },
  });

  return {
    updateExchangeRate: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 환율 삭제 훅
 */
export function useDeleteExchangeRate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => exchangeRateService.deleteExchangeRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exchangeRateQueryKeys.lists() });
    },
  });

  return {
    deleteExchangeRate: mutation.mutate,
    isDeleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * 환율 통계 훅
 */
export function useExchangeRateStats() {
  const { exchangeRates } = useExchangeRateList();

  const stats = {
    total: exchangeRates.length,
    active: exchangeRates.filter((e) => e.is_active).length,
    inactive: exchangeRates.filter((e) => !e.is_active).length,
    currencyPairCount: exchangeRates.length,
  };

  return stats;
}
