/**
 * InventoryLot Service
 * API를 통한 InventoryLot 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryLot,
  CreateInventoryLotRequest,
  UpdateInventoryLotRequest,
  InventoryLotListResponse,
  InventoryLotDetailResponse,
  InventoryLotQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryLotServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryLotServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryLotServiceError;
  err.message = `[InventoryLotService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-lots';

export const inventoryLotService = {
  async listInventoryLots(params?: InventoryLotQueryParams, signal?: AbortSignal): Promise<InventoryLotListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryLotListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-lots');
    }
  },

  async getInventoryLot(id: string, signal?: AbortSignal): Promise<InventoryLotDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryLotDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-lots ${id}`);
    }
  },

  async createInventoryLot(data: CreateInventoryLotRequest, signal?: AbortSignal): Promise<InventoryLot> {
    try {
      const response = await api.post<ApiResponse<InventoryLot>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-lots');
    }
  },

  async updateInventoryLot(id: string, data: UpdateInventoryLotRequest, signal?: AbortSignal): Promise<InventoryLot> {
    try {
      const response = await api.patch<ApiResponse<InventoryLot>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-lots ${id}`);
    }
  },

  async deleteInventoryLot(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-lots ${id}`);
    }
  },
};
