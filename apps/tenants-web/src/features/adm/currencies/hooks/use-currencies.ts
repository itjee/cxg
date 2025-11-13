/**
 * useCurrencies Hook
 * TanStack Query를 사용한 통화 데이터 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { currencyService } from "../services/currencies.service";
import type {
  Currency,
  CreateCurrencyRequest,
  UpdateCurrencyRequest,
  CurrencyFilterParams,
} from "../types/currencies.types";

const CURRENCIES_QUERY_KEY = ["currencies"] as const;

/**
 * 통화 목록 조회 훅
 */
export function useCurrencies(params?: CurrencyFilterParams) {
  return useQuery({
    queryKey: [...CURRENCIES_QUERY_KEY, params],
    queryFn: () => currencyService.listCurrencies(params),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
}

/**
 * 통화 상세 조회 훅
 */
export function useCurrency(id: string | null | undefined) {
  return useQuery({
    queryKey: [...CURRENCIES_QUERY_KEY, "detail", id],
    queryFn: () => currencyService.getCurrency(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 통화 생성 훅
 */
export function useCreateCurrency() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCurrencyRequest) =>
      currencyService.createCurrency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENCIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error("Failed to create currency:", error);
    },
  });
}

/**
 * 통화 수정 훅
 */
export function useUpdateCurrency(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCurrencyRequest) =>
      currencyService.updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENCIES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CURRENCIES_QUERY_KEY, "detail", id],
      });
    },
    onError: (error) => {
      console.error(`Failed to update currency ${id}:`, error);
    },
  });
}

/**
 * 통화 삭제 훅
 */
export function useDeleteCurrency(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => currencyService.deleteCurrency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CURRENCIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error(`Failed to delete currency ${id}:`, error);
    },
  });
}
