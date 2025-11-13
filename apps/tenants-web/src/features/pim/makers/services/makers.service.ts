/**
 * Makers Service
 * API를 통한 제조사 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Maker,
  CreateMakerRequest,
  UpdateMakerRequest,
  MakerListResponse,
  MakerQueryParams,
} from '../makers.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface MakerServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 MakerServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as MakerServiceError;
  err.message = `[MakerService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/pim/makers';

export const makerService = {
  /**
   * 제조사 목록 조회
   */
  async list(params?: MakerQueryParams, signal?: AbortSignal): Promise<MakerListResponse> {
    try {
      const response = await api.get<ApiResponse<MakerListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          country: params?.country,
          region: params?.region,
          is_active: params?.is_active,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching makers');
    }
  },

  /**
   * 제조사 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Maker> {
    try {
      const response = await api.get<ApiResponse<Maker>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching maker ${id}`);
    }
  },

  /**
   * 제조사 생성
   */
  async create(data: CreateMakerRequest, signal?: AbortSignal): Promise<Maker> {
    try {
      const response = await api.post<ApiResponse<Maker>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating maker');
    }
  },

  /**
   * 제조사 수정
   */
  async update(id: string, data: UpdateMakerRequest, signal?: AbortSignal): Promise<Maker> {
    try {
      const response = await api.patch<ApiResponse<Maker>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating maker ${id}`);
    }
  },

  /**
   * 제조사 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting maker ${id}`);
    }
  },
};
