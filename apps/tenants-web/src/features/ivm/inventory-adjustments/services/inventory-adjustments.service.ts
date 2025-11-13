/**
 * InventoryAdjustment Service
 * API를 통한 InventoryAdjustment 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryAdjustment,
  CreateInventoryAdjustmentRequest,
  UpdateInventoryAdjustmentRequest,
  InventoryAdjustmentListResponse,
  InventoryAdjustmentDetailResponse,
  InventoryAdjustmentQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryAdjustmentServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryAdjustmentServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryAdjustmentServiceError;
  err.message = `[InventoryAdjustmentService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-adjustments';

export const inventoryAdjustmentService = {
  async listInventoryAdjustments(params?: InventoryAdjustmentQueryParams, signal?: AbortSignal): Promise<InventoryAdjustmentListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryAdjustmentListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-adjustments');
    }
  },

  async getInventoryAdjustment(id: string, signal?: AbortSignal): Promise<InventoryAdjustmentDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryAdjustmentDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-adjustments ${id}`);
    }
  },

  async createInventoryAdjustment(data: CreateInventoryAdjustmentRequest, signal?: AbortSignal): Promise<InventoryAdjustment> {
    try {
      const response = await api.post<ApiResponse<InventoryAdjustment>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-adjustments');
    }
  },

  async updateInventoryAdjustment(id: string, data: UpdateInventoryAdjustmentRequest, signal?: AbortSignal): Promise<InventoryAdjustment> {
    try {
      const response = await api.patch<ApiResponse<InventoryAdjustment>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-adjustments ${id}`);
    }
  },

  async deleteInventoryAdjustment(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-adjustments ${id}`);
    }
  },
};
