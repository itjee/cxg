/**
 * 청구서 서비스 계층 (API 클라이언트)
 *
 * API 통신, Parameter Mapping, Error Handling을 담당합니다.
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";

import type {
  Invoice,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceListResponse,
  InvoiceQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/manager/bill/invoices";

/**
 * 백엔드 응답 구조: { success: true, data: {...}, error: null }
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: null | { code: string; message: string; detail?: unknown };
}

export const invoiceService = {
  /**
   * 청구서 목록 조회
   *
   * @param params 쿼리 파라미터 (페이지네이션, 필터링)
   * @param signal 요청 취소 신호 (AbortController)
   * @returns 청구서 목록 및 페이지 정보
   */
  async listInvoices(
    params?: InvoiceQueryParams,
    signal?: AbortSignal
  ): Promise<InvoiceListResponse> {
    try {
      // Parameter Mapping: camelCase → snake_case
      const mappedParams = {
        page: params?.page,
        page_size: params?.pageSize,
        search: params?.search,
        status: params?.status,
        tenant_id: params?.tenant_id,
        payment_method: params?.payment_method,
        sort_by: params?.sortBy,
        sort_order: params?.sortOrder,
      };

      const response = await api.get<ApiResponse<InvoiceListResponse>>(
        ENDPOINT,
        {
          params: mappedParams,
          signal, // AbortSignal for request cancellation
        }
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listInvoices");
    }
  },

  /**
   * 청구서 상세 조회
   *
   * @param invoiceId 청구서 ID
   * @param signal 요청 취소 신호
   * @returns 청구서 상세 정보
   */
  async getInvoice(
    invoiceId: string,
    signal?: AbortSignal
  ): Promise<Invoice> {
    try {
      const response = await api.get<ApiResponse<Invoice>>(
        `${ENDPOINT}/${invoiceId}`,
        { signal }
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getInvoice(${invoiceId})`);
    }
  },

  /**
   * 청구서 생성
   *
   * @param data 생성 요청 데이터
   * @returns 생성된 청구서
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<Invoice> {
    try {
      const response = await api.post<ApiResponse<Invoice>>(
        ENDPOINT,
        data
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createInvoice");
    }
  },

  /**
   * 청구서 수정
   *
   * @param invoiceId 청구서 ID
   * @param data 수정할 필드들 (부분 업데이트)
   * @returns 수정된 청구서
   */
  async updateInvoice(
    invoiceId: string,
    data: UpdateInvoiceRequest
  ): Promise<Invoice> {
    try {
      const response = await api.put<ApiResponse<Invoice>>(
        `${ENDPOINT}/${invoiceId}`,
        data
      );

      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateInvoice(${invoiceId})`);
    }
  },

  /**
   * 청구서 삭제 (소프트 삭제)
   *
   * @param invoiceId 청구서 ID
   */
  async deleteInvoice(invoiceId: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${invoiceId}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteInvoice(${invoiceId})`);
    }
  },
};
