/**
 * Activities Service
 * API를 통한 활동기록 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityListResponse,
  ActivityQueryParams,
} from '../';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ActivityServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: ActivityServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'ActivityServiceError';

  console.error(`[ActivityService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/crm/activities';

export const activityService = {
  /**
   * 활동기록 목록 조회
   */
  async list(params?: ActivityQueryParams, signal?: AbortSignal): Promise<ActivityListResponse> {
    try {
      const response = await api.get<ApiResponse<ActivityListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          activity_type: params?.activity_type,
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
   * 활동기록 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Activity> {
    try {
      const response = await api.get<ApiResponse<Activity>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as Activity);
    } catch (error) {
      return handleApiError(error, `get(${id})`);
    }
  },

  /**
   * 활동기록 생성
   */
  async create(data: CreateActivityRequest, signal?: AbortSignal): Promise<Activity> {
    try {
      const response = await api.post<ApiResponse<Activity>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Activity);
    } catch (error) {
      return handleApiError(error, 'create');
    }
  },

  /**
   * 활동기록 수정
   */
  async update(id: string, data: UpdateActivityRequest, signal?: AbortSignal): Promise<Activity> {
    try {
      const response = await api.patch<ApiResponse<Activity>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Activity);
    } catch (error) {
      return handleApiError(error, `update(${id})`);
    }
  },

  /**
   * 활동기록 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `delete(${id})`);
    }
  },
};
