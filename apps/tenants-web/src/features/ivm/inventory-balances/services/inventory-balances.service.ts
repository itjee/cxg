/**
 * InventoryBalance Service
 * API를 통한 InventoryBalance 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryBalance,
  CreateInventoryBalanceRequest,
  UpdateInventoryBalanceRequest,
  InventoryBalanceListResponse,
  InventoryBalanceDetailResponse,
  InventoryBalanceQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryBalanceServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryBalanceServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryBalanceServiceError;
  err.message = `[InventoryBalanceService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-balances';

export const inventoryBalanceService = {
  async listInventoryBalances(params?: InventoryBalanceQueryParams, signal?: AbortSignal): Promise<InventoryBalanceListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryBalanceListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-balances');
    }
  },

  async getInventoryBalance(id: string, signal?: AbortSignal): Promise<InventoryBalanceDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryBalanceDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-balances ${id}`);
    }
  },

  async createInventoryBalance(data: CreateInventoryBalanceRequest, signal?: AbortSignal): Promise<InventoryBalance> {
    try {
      const response = await api.post<ApiResponse<InventoryBalance>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-balances');
    }
  },

  async updateInventoryBalance(id: string, data: UpdateInventoryBalanceRequest, signal?: AbortSignal): Promise<InventoryBalance> {
    try {
      const response = await api.patch<ApiResponse<InventoryBalance>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-balances ${id}`);
    }
  },

  async deleteInventoryBalance(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-balances ${id}`);
    }
  },
};
