/**
 * InventoryCycleCount Service
 * API를 통한 InventoryCycleCount 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryCycleCount,
  CreateInventoryCycleCountRequest,
  UpdateInventoryCycleCountRequest,
  InventoryCycleCountListResponse,
  InventoryCycleCountDetailResponse,
  InventoryCycleCountQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryCycleCountServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryCycleCountServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryCycleCountServiceError;
  err.message = `[InventoryCycleCountService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-cycle-counts';

export const inventoryCycleCountService = {
  async listInventoryCycleCounts(params?: InventoryCycleCountQueryParams, signal?: AbortSignal): Promise<InventoryCycleCountListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCycleCountListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-cycle-counts');
    }
  },

  async getInventoryCycleCount(id: string, signal?: AbortSignal): Promise<InventoryCycleCountDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCycleCountDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-cycle-counts ${id}`);
    }
  },

  async createInventoryCycleCount(data: CreateInventoryCycleCountRequest, signal?: AbortSignal): Promise<InventoryCycleCount> {
    try {
      const response = await api.post<ApiResponse<InventoryCycleCount>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-cycle-counts');
    }
  },

  async updateInventoryCycleCount(id: string, data: UpdateInventoryCycleCountRequest, signal?: AbortSignal): Promise<InventoryCycleCount> {
    try {
      const response = await api.patch<ApiResponse<InventoryCycleCount>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-cycle-counts ${id}`);
    }
  },

  async deleteInventoryCycleCount(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-cycle-counts ${id}`);
    }
  },
};
