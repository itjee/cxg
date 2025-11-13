/**
 * FAQ Service
 * API를 통한 FAQ 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  FAQ,
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQListResponse,
  FAQDetailResponse,
  FAQQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface FAQServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 FAQServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as FAQServiceError;
  err.message = `[FAQService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/faqs';

export const faqService = {
  async listFAQs(params?: FAQQueryParams, signal?: AbortSignal): Promise<FAQListResponse> {
    try {
      const response = await api.get<ApiResponse<FAQListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          category: params?.category,
          isPublished: params?.isPublished,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching FAQs');
    }
  },

  async getFAQ(id: string, signal?: AbortSignal): Promise<FAQDetailResponse> {
    try {
      const response = await api.get<ApiResponse<FAQDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching FAQ ${id}`);
    }
  },

  async createFAQ(data: CreateFAQRequest, signal?: AbortSignal): Promise<FAQ> {
    try {
      const response = await api.post<ApiResponse<FAQ>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating FAQ');
    }
  },

  async updateFAQ(id: string, data: UpdateFAQRequest, signal?: AbortSignal): Promise<FAQ> {
    try {
      const response = await api.patch<ApiResponse<FAQ>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating FAQ ${id}`);
    }
  },

  async deleteFAQ(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting FAQ ${id}`);
    }
  },
};
