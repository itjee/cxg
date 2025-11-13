/**
 * InventoryCount Service
 * API를 통한 InventoryCount 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryCount,
  CreateInventoryCountRequest,
  UpdateInventoryCountRequest,
  InventoryCountListResponse,
  InventoryCountDetailResponse,
  InventoryCountQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryCountServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryCountServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryCountServiceError;
  err.message = `[InventoryCountService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-counts';

export const inventoryCountService = {
  async listInventoryCounts(params?: InventoryCountQueryParams, signal?: AbortSignal): Promise<InventoryCountListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCountListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-counts');
    }
  },

  async getInventoryCount(id: string, signal?: AbortSignal): Promise<InventoryCountDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCountDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-counts ${id}`);
    }
  },

  async createInventoryCount(data: CreateInventoryCountRequest, signal?: AbortSignal): Promise<InventoryCount> {
    try {
      const response = await api.post<ApiResponse<InventoryCount>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-counts');
    }
  },

  async updateInventoryCount(id: string, data: UpdateInventoryCountRequest, signal?: AbortSignal): Promise<InventoryCount> {
    try {
      const response = await api.patch<ApiResponse<InventoryCount>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-counts ${id}`);
    }
  },

  async deleteInventoryCount(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-counts ${id}`);
    }
  },
};
