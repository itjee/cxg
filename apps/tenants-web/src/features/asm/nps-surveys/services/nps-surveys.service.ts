/**
 * NPS Survey Service
 * API를 통한 NPS 설문 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  NPSSurvey,
  CreateNPSSurveyRequest,
  UpdateNPSSurveyRequest,
  NPSSurveyListResponse,
  NPSSurveyDetailResponse,
  NPSSurveyQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface NPSSurveyServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 NPSSurveyServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as NPSSurveyServiceError;
  err.message = `[NPSSurveyService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/nps-surveys';

export const npsSurveyService = {
  async listNPSSurveys(params?: NPSSurveyQueryParams, signal?: AbortSignal): Promise<NPSSurveyListResponse> {
    try {
      const response = await api.get<ApiResponse<NPSSurveyListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          status: params?.status,
          recommendationReason: params?.recommendationReason,
          customerId: params?.customerId,
          npsScore: params?.npsScore,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching NPS surveys');
    }
  },

  async getNPSSurvey(id: string, signal?: AbortSignal): Promise<NPSSurveyDetailResponse> {
    try {
      const response = await api.get<ApiResponse<NPSSurveyDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching NPS survey ${id}`);
    }
  },

  async createNPSSurvey(data: CreateNPSSurveyRequest, signal?: AbortSignal): Promise<NPSSurvey> {
    try {
      const response = await api.post<ApiResponse<NPSSurvey>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating NPS survey');
    }
  },

  async updateNPSSurvey(id: string, data: UpdateNPSSurveyRequest, signal?: AbortSignal): Promise<NPSSurvey> {
    try {
      const response = await api.patch<ApiResponse<NPSSurvey>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating NPS survey ${id}`);
    }
  },

  async deleteNPSSurvey(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting NPS survey ${id}`);
    }
  },
};
