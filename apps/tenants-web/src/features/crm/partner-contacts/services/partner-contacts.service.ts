/**
 * Partner Contacts Service
 * API를 통한 거래처 담당자/연락처 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  PartnerContact,
  CreatePartnerContactRequest,
  UpdatePartnerContactRequest,
  PartnerContactListResponse,
  PartnerContactQueryParams,
} from '../';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PartnerContactServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: PartnerContactServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'PartnerContactServiceError';

  console.error(`[PartnerContactService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/crm/partner-contacts';

export const partnerContactService = {
  /**
   * 거래처 담당자 목록 조회
   */
  async list(
    partnerId: string,
    params?: PartnerContactQueryParams,
    signal?: AbortSignal
  ): Promise<PartnerContactListResponse> {
    try {
      const response = await api.get<ApiResponse<PartnerContactListResponse>>(
        `${ENDPOINT}`,
        {
          params: {
            partner_id: partnerId,
            page: params?.page || 1,
            page_size: params?.pageSize || params?.page_size || 20,
            search: params?.search,
            status: params?.status,
            contact_type: params?.contact_type,
          },
          signal,
        }
      );
      return response.data.data || { items: [], total: 0, page: 1, page_size: 20 };
    } catch (error) {
      return handleApiError(error, `list(partnerId: ${partnerId})`);
    }
  },

  /**
   * 거래처 담당자 상세 조회
   */
  async get(partnerId: string, contactId: string, signal?: AbortSignal): Promise<PartnerContact> {
    try {
      const response = await api.get<ApiResponse<PartnerContact>>(
        `${ENDPOINT}/${contactId}`,
        {
          params: { partner_id: partnerId },
          signal,
        }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `get(partnerId: ${partnerId}, contactId: ${contactId})`);
    }
  },

  /**
   * 거래처 담당자 생성
   */
  async create(
    partnerId: string,
    data: CreatePartnerContactRequest,
    signal?: AbortSignal
  ): Promise<PartnerContact> {
    try {
      const response = await api.post<ApiResponse<PartnerContact>>(
        `${ENDPOINT}`,
        { ...data, partner_id: partnerId },
        { signal }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `create(partnerId: ${partnerId})`);
    }
  },

  /**
   * 거래처 담당자 수정
   */
  async update(
    partnerId: string,
    contactId: string,
    data: UpdatePartnerContactRequest,
    signal?: AbortSignal
  ): Promise<PartnerContact> {
    try {
      const response = await api.patch<ApiResponse<PartnerContact>>(
        `${ENDPOINT}/${contactId}`,
        { ...data, partner_id: partnerId },
        { signal }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `update(partnerId: ${partnerId}, contactId: ${contactId})`);
    }
  },

  /**
   * 거래처 담당자 삭제
   */
  async delete(partnerId: string, contactId: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${contactId}`, {
        params: { partner_id: partnerId },
        signal,
      });
    } catch (error) {
      return handleApiError(error, `delete(partnerId: ${partnerId}, contactId: ${contactId})`);
    }
  },
};
