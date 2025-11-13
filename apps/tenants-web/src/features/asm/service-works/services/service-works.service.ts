/**
 * Service Work Service
 * API를 통한 A/S 작업 내역 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  ServiceWork,
  CreateServiceWorkRequest,
  UpdateServiceWorkRequest,
  ServiceWorkListResponse,
  ServiceWorkDetailResponse,
  ServiceWorkQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ServiceWorkServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 ServiceWorkServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as ServiceWorkServiceError;
  err.message = `[ServiceWorkService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/service-works';

export const serviceWorkService = {
  async listServiceWorks(params?: ServiceWorkQueryParams, signal?: AbortSignal): Promise<ServiceWorkListResponse> {
    try {
      const response = await api.get<ApiResponse<ServiceWorkListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          serviceRequestId: params?.serviceRequestId,
          technicianId: params?.technicianId,
          status: params?.status,
          workResult: params?.workResult,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching service works');
    }
  },

  async getServiceWork(id: string, signal?: AbortSignal): Promise<ServiceWorkDetailResponse> {
    try {
      const response = await api.get<ApiResponse<ServiceWorkDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching service work ${id}`);
    }
  },

  async createServiceWork(data: CreateServiceWorkRequest, signal?: AbortSignal): Promise<ServiceWork> {
    try {
      const response = await api.post<ApiResponse<ServiceWork>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating service work');
    }
  },

  async updateServiceWork(id: string, data: UpdateServiceWorkRequest, signal?: AbortSignal): Promise<ServiceWork> {
    try {
      const response = await api.patch<ApiResponse<ServiceWork>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating service work ${id}`);
    }
  },

  async deleteServiceWork(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting service work ${id}`);
    }
  },
};
