/**
 * Service Request Service
 * API를 통한 A/S 요청 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  ServiceRequest,
  CreateServiceRequestRequest,
  UpdateServiceRequestRequest,
  ServiceRequestListResponse,
  ServiceRequestDetailResponse,
  ServiceRequestQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ServiceRequestServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 ServiceRequestServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as ServiceRequestServiceError;
  err.message = `[ServiceRequestService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/service-requests';

export const serviceRequestService = {
  async listServiceRequests(params?: ServiceRequestQueryParams, signal?: AbortSignal): Promise<ServiceRequestListResponse> {
    try {
      const response = await api.get<ApiResponse<ServiceRequestListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          status: params?.status,
          serviceType: params?.serviceType,
          priority: params?.priority,
          customerId: params?.customerId,
          assignedTechnicianId: params?.assignedTechnicianId,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching service requests');
    }
  },

  async getServiceRequest(id: string, signal?: AbortSignal): Promise<ServiceRequestDetailResponse> {
    try {
      const response = await api.get<ApiResponse<ServiceRequestDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching service request ${id}`);
    }
  },

  async createServiceRequest(data: CreateServiceRequestRequest, signal?: AbortSignal): Promise<ServiceRequest> {
    try {
      const response = await api.post<ApiResponse<ServiceRequest>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating service request');
    }
  },

  async updateServiceRequest(id: string, data: UpdateServiceRequestRequest, signal?: AbortSignal): Promise<ServiceRequest> {
    try {
      const response = await api.patch<ApiResponse<ServiceRequest>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating service request ${id}`);
    }
  },

  async deleteServiceRequest(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting service request ${id}`);
    }
  },
};
