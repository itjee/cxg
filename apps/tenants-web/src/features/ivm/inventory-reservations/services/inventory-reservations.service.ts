/**
 * InventoryReservation Service
 * API를 통한 InventoryReservation 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  InventoryReservation,
  CreateInventoryReservationRequest,
  UpdateInventoryReservationRequest,
  InventoryReservationListResponse,
  InventoryReservationDetailResponse,
  InventoryReservationQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryReservationServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 InventoryReservationServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as InventoryReservationServiceError;
  err.message = `[InventoryReservationService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/ivm/inventory-reservations';

export const inventoryReservationService = {
  async listInventoryReservations(params?: InventoryReservationQueryParams, signal?: AbortSignal): Promise<InventoryReservationListResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryReservationListResponse>>(ENDPOINT, { params, signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching inventory-reservations');
    }
  },

  async getInventoryReservation(id: string, signal?: AbortSignal): Promise<InventoryReservationDetailResponse> {
    try {
      const response = await api.get<ApiResponse<InventoryReservationDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching inventory-reservations ${id}`);
    }
  },

  async createInventoryReservation(data: CreateInventoryReservationRequest, signal?: AbortSignal): Promise<InventoryReservation> {
    try {
      const response = await api.post<ApiResponse<InventoryReservation>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating inventory-reservations');
    }
  },

  async updateInventoryReservation(id: string, data: UpdateInventoryReservationRequest, signal?: AbortSignal): Promise<InventoryReservation> {
    try {
      const response = await api.patch<ApiResponse<InventoryReservation>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating inventory-reservations ${id}`);
    }
  },

  async deleteInventoryReservation(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting inventory-reservations ${id}`);
    }
  },
};
