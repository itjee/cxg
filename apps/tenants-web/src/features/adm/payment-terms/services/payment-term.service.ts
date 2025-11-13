/**
 * Payment Term Service
 * API를 통한 결제조건 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  PaymentTerm,
  CreatePaymentTermRequest,
  UpdatePaymentTermRequest,
  EnvelopeResponse,
  PaymentTermFilterParams,
} from '../types/payment-term.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaymentTermServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: PaymentTermServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'PaymentTermServiceError';

  console.error(`[PaymentTermService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/payment-terms';

// 더미 데이터
const DUMMY_PAYMENT_TERMS: PaymentTerm[] = [
  {
    id: '1',
    code: 'NET30',
    name: '30일 후 지급',
    days: 30,
    description: '납품 후 30일 이내 지급',
    is_active: true,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-01T00:00:00Z',
  },
  {
    id: '2',
    code: 'NET60',
    name: '60일 후 지급',
    days: 60,
    description: '납품 후 60일 이내 지급',
    is_active: true,
    created_at: '2025-10-02T00:00:00Z',
    updated_at: '2025-10-02T00:00:00Z',
  },
  {
    id: '3',
    code: 'COD',
    name: '착불',
    days: 0,
    description: '배송 시 현금 지급',
    is_active: true,
    created_at: '2025-10-03T00:00:00Z',
    updated_at: '2025-10-03T00:00:00Z',
  },
  {
    id: '4',
    code: 'ADVANCE',
    name: '선금',
    days: -1,
    description: '납품 전 선금 지급',
    is_active: true,
    created_at: '2025-10-04T00:00:00Z',
    updated_at: '2025-10-04T00:00:00Z',
  },
  {
    id: '5',
    code: 'INSTALLMENT',
    name: '할부',
    days: 90,
    description: '3개월 할부 지급',
    is_active: true,
    created_at: '2025-10-05T00:00:00Z',
    updated_at: '2025-10-05T00:00:00Z',
  },
];

export const paymentTermService = {
  /**
   * 결제조건 목록 조회
   */
  async getPaymentTerms(params?: PaymentTermFilterParams, signal?: AbortSignal): Promise<PaymentTerm[]> {
    // 실제 API 호출 코드 (현재는 더미 데이터 반환)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_PAYMENT_TERMS];

    // 검색 필터
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (paymentTerm) =>
          paymentTerm.code.toLowerCase().includes(searchLower) ||
          paymentTerm.name.toLowerCase().includes(searchLower) ||
          paymentTerm.description?.toLowerCase().includes(searchLower)
      );
    }

    // 활성 상태 필터
    if (params?.isActive === 'active') {
      filtered = filtered.filter((paymentTerm) => paymentTerm.is_active);
    } else if (params?.isActive === 'inactive') {
      filtered = filtered.filter((paymentTerm) => !paymentTerm.is_active);
    }

    return filtered;

    // 실제 API 호출
    /*
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.isActive && params.isActive !== 'all') {
        queryParams.append('isActive', params.isActive === 'active' ? 'true' : 'false');
      }
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));

      const queryString = queryParams.toString();
      const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;

      const response = await api.get<ApiResponse<PaymentTerm[]>>(url, { signal });

      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, 'getPaymentTerms');
    }
    */
  },

  /**
   * 단일 결제조건 조회
   */
  async getPaymentTermById(id: string, signal?: AbortSignal): Promise<PaymentTerm> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const paymentTerm = DUMMY_PAYMENT_TERMS.find((p) => p.id === id);
    if (!paymentTerm) {
      throw new Error('결제조건을 찾을 수 없습니다');
    }

    return paymentTerm;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<PaymentTerm>>(`${ENDPOINT}/${id}`, { signal });

      return response.data.data || ({} as PaymentTerm);
    } catch (error) {
      return handleApiError(error, `getPaymentTermById(${id})`);
    }
    */
  },

  /**
   * 결제조건 생성
   */
  async createPaymentTerm(data: CreatePaymentTermRequest, signal?: AbortSignal): Promise<PaymentTerm> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newPaymentTerm: PaymentTerm = {
      id: String(DUMMY_PAYMENT_TERMS.length + 1),
      code: data.code,
      name: data.name,
      days: data.days,
      description: data.description,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    DUMMY_PAYMENT_TERMS.push(newPaymentTerm);
    return newPaymentTerm;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<PaymentTerm>>(ENDPOINT, data, { signal });

      return response.data.data || ({} as PaymentTerm);
    } catch (error) {
      return handleApiError(error, 'createPaymentTerm');
    }
    */
  },

  /**
   * 결제조건 수정
   */
  async updatePaymentTerm(id: string, data: UpdatePaymentTermRequest, signal?: AbortSignal): Promise<PaymentTerm> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_PAYMENT_TERMS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('결제조건을 찾을 수 없습니다');
    }

    DUMMY_PAYMENT_TERMS[index] = {
      ...DUMMY_PAYMENT_TERMS[index],
      code: data.code,
      name: data.name,
      days: data.days,
      description: data.description,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_PAYMENT_TERMS[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<PaymentTerm>>(`${ENDPOINT}/${id}`, data, { signal });

      return response.data.data || ({} as PaymentTerm);
    } catch (error) {
      return handleApiError(error, `updatePaymentTerm(${id})`);
    }
    */
  },

  /**
   * 결제조건 삭제
   */
  async deletePaymentTerm(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_PAYMENT_TERMS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error('결제조건을 찾을 수 없습니다');
    }

    DUMMY_PAYMENT_TERMS.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deletePaymentTerm(${id})`);
    }
    */
  },
};
