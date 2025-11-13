/**
 * Campaigns Service
 * API를 통한 캠페인 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignListResponse,
  CampaignQueryParams,
} from '../';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CampaignServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: CampaignServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'CampaignServiceError';

  console.error(`[CampaignService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/crm/campaigns';

export const campaignService = {
  /**
   * 캠페인 목록 조회
   */
  async list(params?: CampaignQueryParams, signal?: AbortSignal): Promise<CampaignListResponse> {
    try {
      const response = await api.get<ApiResponse<CampaignListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          type: params?.type,
          status: params?.status,
        },
        signal,
      });
      return response.data.data || { items: [], total: 0, page: 1, page_size: 20 };
    } catch (error) {
      return handleApiError(error, 'list');
    }
  },

  /**
   * 캠페인 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Campaign> {
    try {
      const response = await api.get<ApiResponse<Campaign>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as Campaign);
    } catch (error) {
      return handleApiError(error, `get(${id})`);
    }
  },

  /**
   * 캠페인 생성
   */
  async create(data: CreateCampaignRequest, signal?: AbortSignal): Promise<Campaign> {
    try {
      const response = await api.post<ApiResponse<Campaign>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Campaign);
    } catch (error) {
      return handleApiError(error, 'create');
    }
  },

  /**
   * 캠페인 수정
   */
  async update(id: string, data: UpdateCampaignRequest, signal?: AbortSignal): Promise<Campaign> {
    try {
      const response = await api.patch<ApiResponse<Campaign>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Campaign);
    } catch (error) {
      return handleApiError(error, `update(${id})`);
    }
  },

  /**
   * 캠페인 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `delete(${id})`);
    }
  },
};
