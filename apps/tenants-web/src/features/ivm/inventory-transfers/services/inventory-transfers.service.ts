/**
 * InventoryTransfer Service
 * API를 통한 InventoryTransfer 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryTransfer,
  CreateInventoryTransferRequest,
  UpdateInventoryTransferRequest,
  InventoryTransferListResponse,
  InventoryTransferDetailResponse,
  InventoryTransferQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryTransferServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryTransferServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryTransferServiceError;
  err.message = `[InventoryTransferService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-transfers';

export const inventoryTransferService = {
  async listInventoryTransfers(params?: InventoryTransferQueryParams, signal?: AbortSignal): Promise<InventoryTransferListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryTransferListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-transfers');
    }
  },

  async getInventoryTransfer(id: string, signal?: AbortSignal): Promise<InventoryTransferDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryTransferDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-transfers ${id}`);
    }
  },

  async createInventoryTransfer(data: CreateInventoryTransferRequest, signal?: AbortSignal): Promise<InventoryTransfer> {
    try {
      const response = await api.post<ApiResponse<InventoryTransfer>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-transfers');
    }
  },

  async updateInventoryTransfer(id: string, data: UpdateInventoryTransferRequest, signal?: AbortSignal): Promise<InventoryTransfer> {
    try {
      const response = await api.patch<ApiResponse<InventoryTransfer>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-transfers ${id}`);
    }
  },

  async deleteInventoryTransfer(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-transfers ${id}`);
    }
  },
};
