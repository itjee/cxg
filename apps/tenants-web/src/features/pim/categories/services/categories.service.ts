/**
 * Categories Service
 * API를 통한 카테고리 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
  CategoryQueryParams,
} from '../categories.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CategoryServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 CategoryServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as CategoryServiceError;
  err.message = `[CategoryService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/pim/categories';

export const categoryService = {
  /**
   * 카테고리 목록 조회
   */
  async list(params?: CategoryQueryParams, signal?: AbortSignal): Promise<CategoryListResponse> {
    try {
      const response = await api.get<ApiResponse<CategoryListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          is_active: params?.is_active,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching categories');
    }
  },

  /**
   * 카테고리 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching category ${id}`);
    }
  },

  /**
   * 카테고리 생성
   */
  async create(data: CreateCategoryRequest, signal?: AbortSignal): Promise<Category> {
    try {
      const response = await api.post<ApiResponse<Category>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating category');
    }
  },

  /**
   * 카테고리 수정
   */
  async update(id: string, data: UpdateCategoryRequest, signal?: AbortSignal): Promise<Category> {
    try {
      const response = await api.patch<ApiResponse<Category>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating category ${id}`);
    }
  },

  /**
   * 카테고리 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting category ${id}`);
    }
  },
};
