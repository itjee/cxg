/**
 * InventoryMovement Service
 * API를 통한 InventoryMovement 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryMovement,
  CreateInventoryMovementRequest,
  UpdateInventoryMovementRequest,
  InventoryMovementListResponse,
  InventoryMovementDetailResponse,
  InventoryMovementQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryMovementServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryMovementServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryMovementServiceError;
  err.message = `[InventoryMovementService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-movements';

export const inventoryMovementService = {
  async listInventoryMovements(params?: InventoryMovementQueryParams, signal?: AbortSignal): Promise<InventoryMovementListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryMovementListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-movements');
    }
  },

  async getInventoryMovement(id: string, signal?: AbortSignal): Promise<InventoryMovementDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryMovementDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-movements ${id}`);
    }
  },

  async createInventoryMovement(data: CreateInventoryMovementRequest, signal?: AbortSignal): Promise<InventoryMovement> {
    try {
      const response = await api.post<ApiResponse<InventoryMovement>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-movements');
    }
  },

  async updateInventoryMovement(id: string, data: UpdateInventoryMovementRequest, signal?: AbortSignal): Promise<InventoryMovement> {
    try {
      const response = await api.patch<ApiResponse<InventoryMovement>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-movements ${id}`);
    }
  },

  async deleteInventoryMovement(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-movements ${id}`);
    }
  },
};
