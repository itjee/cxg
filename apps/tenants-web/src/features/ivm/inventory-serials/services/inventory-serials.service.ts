/**
 * InventorySerial Service
 * API를 통한 InventorySerial 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventorySerial,
  CreateInventorySerialRequest,
  UpdateInventorySerialRequest,
  InventorySerialListResponse,
  InventorySerialDetailResponse,
  InventorySerialQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventorySerialServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventorySerialServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventorySerialServiceError;
  err.message = `[InventorySerialService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-serials';

export const inventorySerialService = {
  async listInventorySerials(params?: InventorySerialQueryParams, signal?: AbortSignal): Promise<InventorySerialListResponse> {
    try {
      const response = await api.get<ApiResponse<InventorySerialListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-serials');
    }
  },

  async getInventorySerial(id: string, signal?: AbortSignal): Promise<InventorySerialDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventorySerialDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-serials ${id}`);
    }
  },

  async createInventorySerial(data: CreateInventorySerialRequest, signal?: AbortSignal): Promise<InventorySerial> {
    try {
      const response = await api.post<ApiResponse<InventorySerial>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-serials');
    }
  },

  async updateInventorySerial(id: string, data: UpdateInventorySerialRequest, signal?: AbortSignal): Promise<InventorySerial> {
    try {
      const response = await api.patch<ApiResponse<InventorySerial>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-serials ${id}`);
    }
  },

  async deleteInventorySerial(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-serials ${id}`);
    }
  },
};
