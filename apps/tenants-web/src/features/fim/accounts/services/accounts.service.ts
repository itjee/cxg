/**
 * Accounts Service
 * API를 통한 계정과목 데이터 관리
 */

import { api } from '@/lib/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface AccountsServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 AccountsServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as AccountsServiceError;
  err.message = `[AccountsService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/fim/accounts';

export const accountsService = {
  async list(params?: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching data');
    }
  },

  async get(id: string, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching ${id}`);
    }
  },

  async create(data: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating');
    }
  },

  async update(id: string, data: any, signal?: AbortSignal): Promise<any> {
    try {
      const response = await api.patch<ApiResponse<any>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating ${id}`);
    }
  },

  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting ${id}`);
    }
  },
};
