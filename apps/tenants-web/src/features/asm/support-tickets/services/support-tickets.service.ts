/**
 * Support Ticket Service
 * API를 통한 고객 지원 티켓 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  SupportTicket,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  SupportTicketListResponse,
  SupportTicketDetailResponse,
  SupportTicketQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface SupportTicketServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 SupportTicketServiceError로 변환
 */
function handleApiError(error: unknown, context: string): never {
  const err = error as SupportTicketServiceError;
  err.message = `[SupportTicketService] ${context}: ${err.message || 'Unknown error'}`;
  throw err;
}

const ENDPOINT = '/asm/support-tickets';

export const supportTicketService = {
  async listSupportTickets(params?: SupportTicketQueryParams, signal?: AbortSignal): Promise<SupportTicketListResponse> {
    try {
      const response = await api.get<ApiResponse<SupportTicketListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          status: params?.status,
          priority: params?.priority,
          category: params?.category,
          customerId: params?.customerId,
          assignedTo: params?.assignedTo,
        },
        signal,
      });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error fetching support tickets');
    }
  },

  async getSupportTicket(id: string, signal?: AbortSignal): Promise<SupportTicketDetailResponse> {
    try {
      const response = await api.get<ApiResponse<SupportTicketDetailResponse>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error fetching support ticket ${id}`);
    }
  },

  async createSupportTicket(data: CreateSupportTicketRequest, signal?: AbortSignal): Promise<SupportTicket> {
    try {
      const response = await api.post<ApiResponse<SupportTicket>>(ENDPOINT, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, 'Error creating support ticket');
    }
  },

  async updateSupportTicket(id: string, data: UpdateSupportTicketRequest, signal?: AbortSignal): Promise<SupportTicket> {
    try {
      const response = await api.patch<ApiResponse<SupportTicket>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data!;
    } catch (error) {
      return handleApiError(error, `Error updating support ticket ${id}`);
    }
  },

  async deleteSupportTicket(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `Error deleting support ticket ${id}`);
    }
  },
};
