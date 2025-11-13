/**
 * Opportunity Service
 * API를 통한 영업기회 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  OpportunityListResponse,
  OpportunityDetailResponse,
  OpportunityQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface OpportunityServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: OpportunityServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'OpportunityServiceError';

  console.error(`[OpportunityService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/crm/opportunities';

export const opportunityService = {
  /**
   * 영업기회 목록 조회
   */
  async list(params?: OpportunityQueryParams, signal?: AbortSignal): Promise<OpportunityListResponse> {
    try {
      const response = await api.get<ApiResponse<OpportunityListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          active: params?.active,
        },
        signal,
      });
      return response.data.data || { items: [], total: 0, page: 1, pageSize: 10 };
    } catch (error) {
      return handleApiError(error, 'list');
    }
  },

  /**
   * 영업기회 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<OpportunityDetailResponse> {
    try {
      const response = await api.get<ApiResponse<OpportunityDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as OpportunityDetailResponse);
    } catch (error) {
      return handleApiError(error, `get(${id})`);
    }
  },

  /**
   * 영업기회 생성
   */
  async create(data: CreateOpportunityRequest, signal?: AbortSignal): Promise<Opportunity> {
    try {
      const response = await api.post<ApiResponse<Opportunity>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Opportunity);
    } catch (error) {
      return handleApiError(error, 'create');
    }
  },

  /**
   * 영업기회 수정
   */
  async update(id: string, data: UpdateOpportunityRequest, signal?: AbortSignal): Promise<Opportunity> {
    try {
      const response = await api.patch<ApiResponse<Opportunity>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Opportunity);
    } catch (error) {
      return handleApiError(error, `update(${id})`);
    }
  },

  /**
   * 영업기회 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `delete(${id})`);
    }
  },
};
