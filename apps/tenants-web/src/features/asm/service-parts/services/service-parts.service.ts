/**
 * Service Part Service
 * API를 통한 A/S 부품 사용 내역 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  ServicePart,
  CreateServicePartRequest,
  UpdateServicePartRequest,
  ServicePartListResponse,
  ServicePartDetailResponse,
  ServicePartQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ServicePartServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 ServicePartServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as ServicePartServiceError;
  err.message = `[ServicePartService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/service-parts';

export const servicePartService = {
  async listServiceParts(params?: ServicePartQueryParams, signal?: AbortSignal): Promise<ServicePartListResponse> {
    try {
      const response = await api.get<ApiResponse<ServicePartListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          serviceRequestId: params?.serviceRequestId,
          productId: params?.productId,
          partCondition: params?.partCondition,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching service parts');
    }
  },

  async getServicePart(id: string, signal?: AbortSignal): Promise<ServicePartDetailResponse> {
    try {
      const response = await api.get<ApiResponse<ServicePartDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching service part ${id}`);
    }
  },

  async createServicePart(data: CreateServicePartRequest, signal?: AbortSignal): Promise<ServicePart> {
    try {
      const response = await api.post<ApiResponse<ServicePart>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating service part');
    }
  },

  async updateServicePart(id: string, data: UpdateServicePartRequest, signal?: AbortSignal): Promise<ServicePart> {
    try {
      const response = await api.patch<ApiResponse<ServicePart>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating service part ${id}`);
    }
  },

  async deleteServicePart(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting service part ${id}`);
    }
  },
};
