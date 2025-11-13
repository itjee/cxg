/**
 * Customer Feedback Service
 * API를 통한 고객 피드백 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  CustomerFeedback,
  CreateCustomerFeedbackRequest,
  UpdateCustomerFeedbackRequest,
  CustomerFeedbackListResponse,
  CustomerFeedbackDetailResponse,
  CustomerFeedbackQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CustomerFeedbackServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 CustomerFeedbackServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as CustomerFeedbackServiceError;
  err.message = `[CustomerFeedbackService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/customer-feedback';

export const customerFeedbackService = {
  async listCustomerFeedback(params?: CustomerFeedbackQueryParams, signal?: AbortSignal): Promise<CustomerFeedbackListResponse> {
    try {
      const response = await api.get<ApiResponse<CustomerFeedbackListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          status: params?.status,
          transactionType: params?.transactionType,
          customerId: params?.customerId,
          rating: params?.rating,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching customer feedback');
    }
  },

  async getCustomerFeedback(id: string, signal?: AbortSignal): Promise<CustomerFeedbackDetailResponse> {
    try {
      const response = await api.get<ApiResponse<CustomerFeedbackDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching customer feedback ${id}`);
    }
  },

  async createCustomerFeedback(data: CreateCustomerFeedbackRequest, signal?: AbortSignal): Promise<CustomerFeedback> {
    try {
      const response = await api.post<ApiResponse<CustomerFeedback>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating customer feedback');
    }
  },

  async updateCustomerFeedback(id: string, data: UpdateCustomerFeedbackRequest, signal?: AbortSignal): Promise<CustomerFeedback> {
    try {
      const response = await api.patch<ApiResponse<CustomerFeedback>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating customer feedback ${id}`);
    }
  },

  async deleteCustomerFeedback(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting customer feedback ${id}`);
    }
  },
};
