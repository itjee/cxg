/**
 * Partner Service
 * API를 통한 거래처/고객 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
  PartnerListResponse,
  PartnerQueryParams,
  PartnerContact,
  PartnerContactListResponse,
  CreatePartnerContactRequest,
  UpdatePartnerContactRequest,
  PartnerAddress,
  PartnerAddressListResponse,
  CreatePartnerAddressRequest,
  PartnerManager,
  PartnerManagerListResponse,
  CreatePartnerManagerRequest,
} from '../';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PartnerServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: PartnerServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'PartnerServiceError';

  console.error(`[PartnerService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/crm/partners';

export const partnerService = {
  // ==================== 거래처 기본 정보 ====================

  /**
   * 거래처 목록 조회
   */
  async list(
    params?: PartnerQueryParams,
    signal?: AbortSignal
  ): Promise<PartnerListResponse> {
    try {
      const response = await api.get<ApiResponse<PartnerListResponse>>(ENDPOINT, {
        params: {
          page: params?.page || 1,
          page_size: params?.pageSize || params?.page_size || 20,
          search: params?.search,
          type: params?.type,
          status: params?.status,
        },
        signal,
      });
      return (
        response.data.data || { items: [], total: 0, page: 1, page_size: 20 }
      );
    } catch (error) {
      return handleApiError(error, 'list');
    }
  },

  /**
   * 거래처 상세 조회
   */
  async get(id: string, signal?: AbortSignal): Promise<Partner> {
    try {
      const response = await api.get<ApiResponse<Partner>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as Partner);
    } catch (error) {
      return handleApiError(error, `get(${id})`);
    }
  },

  /**
   * 거래처 생성
   */
  async create(data: CreatePartnerRequest, signal?: AbortSignal): Promise<Partner> {
    try {
      const response = await api.post<ApiResponse<Partner>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Partner);
    } catch (error) {
      return handleApiError(error, 'create');
    }
  },

  /**
   * 거래처 수정
   */
  async update(id: string, data: UpdatePartnerRequest, signal?: AbortSignal): Promise<Partner> {
    try {
      const response = await api.patch<ApiResponse<Partner>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Partner);
    } catch (error) {
      return handleApiError(error, `update(${id})`);
    }
  },

  /**
   * 거래처 삭제
   */
  async delete(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `delete(${id})`);
    }
  },

  // ==================== 거래처 담당자 ====================

  /**
   * 거래처 담당자 목록 조회
   */
  async listContacts(partnerId: string, signal?: AbortSignal): Promise<PartnerContactListResponse> {
    try {
      const response = await api.get<ApiResponse<PartnerContactListResponse>>(
        `${ENDPOINT}/${partnerId}/contacts`,
        { signal }
      );
      return response.data.data || { items: [], total: 0, page: 1, page_size: 20 };
    } catch (error) {
      return handleApiError(error, `listContacts(${partnerId})`);
    }
  },

  /**
   * 거래처 담당자 상세 조회
   */
  async getContact(partnerId: string, contactId: string, signal?: AbortSignal): Promise<PartnerContact> {
    try {
      const response = await api.get<ApiResponse<PartnerContact>>(
        `${ENDPOINT}/${partnerId}/contacts/${contactId}`,
        { signal }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `getContact(${partnerId}, ${contactId})`);
    }
  },

  /**
   * 거래처 담당자 생성
   */
  async createContact(
    partnerId: string,
    data: CreatePartnerContactRequest,
    signal?: AbortSignal
  ): Promise<PartnerContact> {
    try {
      const response = await api.post<ApiResponse<PartnerContact>>(
        `${ENDPOINT}/${partnerId}/contacts`,
        data,
        { signal }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `createContact(${partnerId})`);
    }
  },

  /**
   * 거래처 담당자 수정
   */
  async updateContact(
    partnerId: string,
    contactId: string,
    data: UpdatePartnerContactRequest,
    signal?: AbortSignal
  ): Promise<PartnerContact> {
    try {
      const response = await api.patch<ApiResponse<PartnerContact>>(
        `${ENDPOINT}/${partnerId}/contacts/${contactId}`,
        data,
        { signal }
      );
      return response.data.data || ({} as PartnerContact);
    } catch (error) {
      return handleApiError(error, `updateContact(${partnerId}, ${contactId})`);
    }
  },

  /**
   * 거래처 담당자 삭제
   */
  async deleteContact(partnerId: string, contactId: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${partnerId}/contacts/${contactId}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteContact(${partnerId}, ${contactId})`);
    }
  },

  // ==================== 거래처 주소 ====================

  /**
   * 거래처 주소 목록 조회
   */
  async listAddresses(partnerId: string, signal?: AbortSignal): Promise<PartnerAddressListResponse> {
    try {
      const response = await api.get<ApiResponse<PartnerAddressListResponse>>(
        `${ENDPOINT}/${partnerId}/addresses`,
        { signal }
      );
      return response.data.data || { items: [], total: 0, page: 1, page_size: 20 };
    } catch (error) {
      return handleApiError(error, `listAddresses(${partnerId})`);
    }
  },

  /**
   * 거래처 주소 상세 조회
   */
  async getAddress(partnerId: string, addressId: string, signal?: AbortSignal): Promise<PartnerAddress> {
    try {
      const response = await api.get<ApiResponse<PartnerAddress>>(
        `${ENDPOINT}/${partnerId}/addresses/${addressId}`,
        { signal }
      );
      return response.data.data || ({} as PartnerAddress);
    } catch (error) {
      return handleApiError(error, `getAddress(${partnerId}, ${addressId})`);
    }
  },

  /**
   * 거래처 주소 생성
   */
  async createAddress(
    partnerId: string,
    data: CreatePartnerAddressRequest,
    signal?: AbortSignal
  ): Promise<PartnerAddress> {
    try {
      const response = await api.post<ApiResponse<PartnerAddress>>(
        `${ENDPOINT}/${partnerId}/addresses`,
        data,
        { signal }
      );
      return response.data.data || ({} as PartnerAddress);
    } catch (error) {
      return handleApiError(error, `createAddress(${partnerId})`);
    }
  },

  /**
   * 거래처 주소 수정
   */
  async updateAddress(
    partnerId: string,
    addressId: string,
    data: Partial<CreatePartnerAddressRequest>,
    signal?: AbortSignal
  ): Promise<PartnerAddress> {
    try {
      const response = await api.patch<ApiResponse<PartnerAddress>>(
        `${ENDPOINT}/${partnerId}/addresses/${addressId}`,
        data,
        { signal }
      );
      return response.data.data || ({} as PartnerAddress);
    } catch (error) {
      return handleApiError(error, `updateAddress(${partnerId}, ${addressId})`);
    }
  },

  /**
   * 거래처 주소 삭제
   */
  async deleteAddress(partnerId: string, addressId: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${partnerId}/addresses/${addressId}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteAddress(${partnerId}, ${addressId})`);
    }
  },

  // ==================== 당사 담당자 (Partner Manager) ====================

  /**
   * 당사 담당자 목록 조회
   */
  async listManagers(partnerId: string, signal?: AbortSignal): Promise<PartnerManagerListResponse> {
    try {
      const response = await api.get<ApiResponse<PartnerManagerListResponse>>(
        `${ENDPOINT}/${partnerId}/managers`,
        { signal }
      );
      return response.data.data || { items: [], total: 0, page: 1, page_size: 20 };
    } catch (error) {
      return handleApiError(error, `listManagers(${partnerId})`);
    }
  },

  /**
   * 당사 담당자 생성
   */
  async createManager(
    partnerId: string,
    data: CreatePartnerManagerRequest,
    signal?: AbortSignal
  ): Promise<PartnerManager> {
    try {
      const response = await api.post<ApiResponse<PartnerManager>>(
        `${ENDPOINT}/${partnerId}/managers`,
        data,
        { signal }
      );
      return response.data.data || ({} as PartnerManager);
    } catch (error) {
      return handleApiError(error, `createManager(${partnerId})`);
    }
  },

  /**
   * 당사 담당자 삭제
   */
  async deleteManager(partnerId: string, managerId: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${partnerId}/managers/${managerId}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteManager(${partnerId}, ${managerId})`);
    }
  },
};
