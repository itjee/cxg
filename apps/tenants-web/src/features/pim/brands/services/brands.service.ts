/**
 * Brands Service
 * API를 통한 브랜드 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest,
  BrandListResponse,
  BrandQueryParams,
} from '../brands.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface BrandServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 BrandServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as BrandServiceError;
  err.message = `[BrandService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/pim/brands';

export const brandService = {
  /**
   * 브랜드 목록 조회
   */
  async list(params?: BrandQueryParams, signal?: AbortSignal): Promise<BrandListResponse> {
    try {
      const response = await api.get<ApiResponse<BrandListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          country: params?.country,
          is_active: params?.is_active,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching brands');
    }
  },

  /**
   * 브랜드 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Brand> {
    try {
      const response = await api.get<ApiResponse<Brand>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching brand ${id}`);
    }
  },

  /**
   * 브랜드 생성
   */
  async create(data: CreateBrandRequest, signal?: AbortSignal): Promise<Brand> {
    try {
      const response = await api.post<ApiResponse<Brand>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating brand');
    }
  },

  /**
   * 브랜드 수정
   */
  async update(id: string, data: UpdateBrandRequest, signal?: AbortSignal): Promise<Brand> {
    try {
      const response = await api.patch<ApiResponse<Brand>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating brand ${id}`);
    }
  },

  /**
   * 브랜드 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting brand ${id}`);
    }
  },
};
