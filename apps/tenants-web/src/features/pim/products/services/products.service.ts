/**
 * Products Service
 * API를 통한 제품 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductQueryParams,
} from '../products.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ProductServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 ProductServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as ProductServiceError;
  err.message = `[ProductService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/pim/products';

export const productService = {
  /**
   * 제품 목록 조회
   */
  async list(params?: ProductQueryParams, signal?: AbortSignal): Promise<ProductListResponse> {
    try {
      const response = await api.get<ApiResponse<ProductListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          category: params?.category,
          brand: params?.brand,
          status: params?.status,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching products');
    }
  },

  /**
   * 제품 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching product ${id}`);
    }
  },

  /**
   * 제품 생성
   */
  async create(data: CreateProductRequest, signal?: AbortSignal): Promise<Product> {
    try {
      const response = await api.post<ApiResponse<Product>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating product');
    }
  },

  /**
   * 제품 수정
   */
  async update(id: string, data: UpdateProductRequest, signal?: AbortSignal): Promise<Product> {
    try {
      const response = await api.patch<ApiResponse<Product>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating product ${id}`);
    }
  },

  /**
   * 제품 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting product ${id}`);
    }
  },
};
