/**
 * 거래(결제) 관련 TanStack Query 훅
 *
 * Query Key Factory 패턴을 사용한 캐시 관리
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services";
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionQueryParams,
} from "../types";

// Query Key Factory
const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params?: TransactionQueryParams) => [
    ...transactionKeys.lists(),
    params,
  ] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

/**
 * 거래 목록 조회 훅
 *
 * @param params 쿼리 파라미터 (페이지네이션, 필터링)
 */
export function useTransactions(params?: TransactionQueryParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: ({ signal }) => transactionService.listTransactions(params, signal),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });
}

/**
 * 거래 상세 조회 훅
 *
 * @param transactionId 거래 ID
 */
export function useTransaction(
  transactionId: string | null | undefined
) {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId || ""),
    queryFn: ({ signal }) => transactionService.getTransaction(transactionId!, signal),
    enabled: !!transactionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * 거래 생성 훅
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionService.createTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
}

/**
 * 거래 수정 훅
 *
 * @param transactionId 거래 ID
 */
export function useUpdateTransaction(transactionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTransactionRequest) =>
      transactionService.updateTransaction(transactionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: transactionKeys.detail(transactionId),
      });
    },
    onError: (error) => {
      console.error(`Failed to update transaction ${transactionId}:`, error);
    },
  });
}

/**
 * 거래 삭제 훅
 *
 * @param transactionId 거래 ID
 */
export function useDeleteTransaction(transactionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => transactionService.deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
    onError: (error) => {
      console.error(`Failed to delete transaction ${transactionId}:`, error);
    },
  });
}
