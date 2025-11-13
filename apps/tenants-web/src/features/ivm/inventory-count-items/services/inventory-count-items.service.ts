/**
 * InventoryCountItem Service
 * API를 통한 InventoryCountItem 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryCountItem,
  CreateInventoryCountItemRequest,
  UpdateInventoryCountItemRequest,
  InventoryCountItemListResponse,
  InventoryCountItemDetailResponse,
  InventoryCountItemQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryCountItemServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryCountItemServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryCountItemServiceError;
  err.message = `[InventoryCountItemService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-count-items';

export const inventoryCountItemService = {
  async listInventoryCountItems(params?: InventoryCountItemQueryParams, signal?: AbortSignal): Promise<InventoryCountItemListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCountItemListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-count-items');
    }
  },

  async getInventoryCountItem(id: string, signal?: AbortSignal): Promise<InventoryCountItemDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryCountItemDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-count-items ${id}`);
    }
  },

  async createInventoryCountItem(data: CreateInventoryCountItemRequest, signal?: AbortSignal): Promise<InventoryCountItem> {
    try {
      const response = await api.post<ApiResponse<InventoryCountItem>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-count-items');
    }
  },

  async updateInventoryCountItem(id: string, data: UpdateInventoryCountItemRequest, signal?: AbortSignal): Promise<InventoryCountItem> {
    try {
      const response = await api.patch<ApiResponse<InventoryCountItem>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-count-items ${id}`);
    }
  },

  async deleteInventoryCountItem(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-count-items ${id}`);
    }
  },
};
