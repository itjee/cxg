/**
 * 거래(결제) 서비스 계층 (API 클라이언트)
 *
 * API 통신, Parameter Mapping, Error Handling을 담당합니다.
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";

import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionListResponse,
  TransactionQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/manager/bill/transactions";

/**
 * 백엔드 응답 구조: { success: true, data: {...}, 오류: null }
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  오류: null | { code: string; message: string; detail?: unknown };
}

export const transactionService = {
  /**
   * 거래 목록 조회
   *
   * @param params 쿼리 파라미터 (페이지네이션, 필터링)
   * @param signal 요청 취소 신호 (AbortController)
   * @returns 거래 목록 및 페이지 정보
   */
  async listTransactions(
    params?: TransactionQueryParams,
    signal?: AbortSignal
  ): Promise<TransactionListResponse> {
    try {
      // Parameter Mapping: camelCase → snake_case
      const mappedParams = {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        status: params?.status,
        tenant_id: params?.tenant_id,
        transaction_type: params?.transaction_type,
        payment_gateway: params?.payment_gateway,
        sort_by: params?.sortBy,
        sort_order: params?.sortOrder,
      };

      const response = await api.get<ApiResponse<TransactionListResponse>>(
        ENDPOINT,
        {
          params: mappedParams,
          signal, // AbortSignal for request cancellation
        }
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listTransactions");
    }
  },

  /**
   * 거래 상세 조회
   *
   * @param transactionId 거래 ID
   * @param signal 요청 취소 신호
   * @returns 거래 상세 정보
   */
  async getTransaction(
    transactionId: string,
    signal?: AbortSignal
  ): Promise<Transaction> {
    try {
      const response = await api.get<ApiResponse<Transaction>>(
        `${ENDPOINT}/${transactionId}`,
        { signal }
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getTransaction(${transactionId})`);
    }
  },

  /**
   * 거래 생성
   *
   * @param data 생성 요청 데이터
   * @returns 생성된 거래
   */
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    try {
      const response = await api.post<ApiResponse<Transaction>>(
        ENDPOINT,
        data
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createTransaction");
    }
  },

  /**
   * 거래 수정
   *
   * @param transactionId 거래 ID
   * @param data 수정할 필드들 (부분 업데이트)
   * @returns 수정된 거래
   */
  async updateTransaction(
    transactionId: string,
    data: UpdateTransactionRequest
  ): Promise<Transaction> {
    try {
      const response = await api.put<ApiResponse<Transaction>>(
        `${ENDPOINT}/${transactionId}`,
        data
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateTransaction(${transactionId})`);
    }
  },

  /**
   * 거래 삭제 (소프트 삭제)
   *
   * @param transactionId 거래 ID
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${transactionId}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteTransaction(${transactionId})`);
    }
  },
};
