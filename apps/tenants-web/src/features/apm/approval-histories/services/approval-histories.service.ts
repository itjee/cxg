/**
 * ApprovalHistories Service
 * API를 통한 결재 이력 데이터 관리
 */

import { api } from '@/lib/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ApprovalHistoriesServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: ApprovalHistoriesServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'ApprovalHistoriesServiceError';

  console.error(`[ApprovalHistoriesService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/apm/approval-histories';

export const approvalHistoriesService = {
  /**
   * 결재 이력 목록 조회
   */
  async list(params?: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(ENDPOINT, { params, signal });
      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, 'list');
    }
  },

  /**
   * 결재 이력 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || {};
    } catch (error) {
      return handleApiError(error, `get(${id})`);
    }
  },

  /**
   * 결재 이력 생성
   */
  async create(data: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>(ENDPOINT, data, { signal });
      return response.data.data || {};
    } catch (error) {
      return handleApiError(error, 'create');
    }
  },

  /**
   * 결재 이력 수정
   */
  async update(id: string, data: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.patch<ApiResponse<any>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || {};
    } catch (error) {
      return handleApiError(error, `update(${id})`);
    }
  },

  /**
   * 결재 이력 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `delete(${id})`);
    }
  },
};
