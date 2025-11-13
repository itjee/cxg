/**
 * Exchange Rate Service
 * API를 통한 환율 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  ExchangeRate,
  CreateExchangeRateRequest,
  UpdateExchangeRateRequest,
  EnvelopeResponse,
  ExchangeRateFilterParams,
} from '../types/exchange-rates.types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ExchangeRateServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: ExchangeRateServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'ExchangeRateServiceError';

  console.error(`[ExchangeRateService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/exchange-rates';

// 더미 데이터
const DUMMY_EXCHANGE_RATES: ExchangeRate[] = [
  {
    id: '1',
    from_currency: 'USD',
    to_currency: 'KRW',
    rate: 1320.5000,
    effective_date: '2025-10-28',
    description: '미국 달러 → 한국 원',
    is_active: true,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-10-28T00:00:00Z',
  },
  {
    id: '2',
    from_currency: 'EUR',
    to_currency: 'KRW',
    rate: 1435.2500,
    effective_date: '2025-10-28',
    description: '유로 → 한국 원',
    is_active: true,
    created_at: '2025-10-02T00:00:00Z',
    updated_at: '2025-10-28T00:00:00Z',
  },
  {
    id: '3',
    from_currency: 'JPY',
    to_currency: 'KRW',
    rate: 8.8500,
    effective_date: '2025-10-28',
    description: '일본 엔 → 한국 원',
    is_active: true,
    created_at: '2025-10-03T00:00:00Z',
    updated_at: '2025-10-28T00:00:00Z',
  },
  {
    id: '4',
    from_currency: 'GBP',
    to_currency: 'USD',
    rate: 1.2650,
    effective_date: '2025-10-28',
    description: '영국 파운드 → 미국 달러',
    is_active: true,
    created_at: '2025-10-04T00:00:00Z',
    updated_at: '2025-10-28T00:00:00Z',
  },
  {
    id: '5',
    from_currency: 'CNY',
    to_currency: 'KRW',
    rate: 182.3500,
    effective_date: '2025-10-28',
    description: '중국 위안 → 한국 원',
    is_active: true,
    created_at: '2025-10-05T00:00:00Z',
    updated_at: '2025-10-28T00:00:00Z',
  },
];

export const exchangeRateService = {
  /**
   * 환율 목록 조회
   */
  async getExchangeRates(
    params?: ExchangeRateFilterParams,
    signal?: AbortSignal
  ): Promise<ExchangeRate[]> {
    // 실제 API 호출 코드 (현재는 더미 데이터 반환)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_EXCHANGE_RATES];

    // 검색 필터
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (exchangeRate) =>
          exchangeRate.from_currency.toLowerCase().includes(searchLower) ||
          exchangeRate.to_currency.toLowerCase().includes(searchLower) ||
          exchangeRate.description?.toLowerCase().includes(searchLower)
      );
    }

    // 활성 상태 필터
    if (params?.isActive === 'active') {
      filtered = filtered.filter((exchangeRate) => exchangeRate.is_active);
    } else if (params?.isActive === 'inactive') {
      filtered = filtered.filter((exchangeRate) => !exchangeRate.is_active);
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

      const response = await api.get<ApiResponse<ExchangeRate[]>>(url, { signal });

      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, 'getExchangeRates');
    }
    */
  },

  /**
   * 단일 환율 조회
   */
  async getExchangeRateById(id: string, signal?: AbortSignal): Promise<ExchangeRate> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const exchangeRate = DUMMY_EXCHANGE_RATES.find((e) => e.id === id);
    if (!exchangeRate) {
      throw new Error('환율을 찾을 수 없습니다');
    }

    return exchangeRate;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<ExchangeRate>>(`${ENDPOINT}/${id}`, { signal });

      return response.data.data || ({} as ExchangeRate);
    } catch (error) {
      return handleApiError(error, `getExchangeRateById(${id})`);
    }
    */
  },

  /**
   * 환율 생성
   */
  async createExchangeRate(data: CreateExchangeRateRequest, signal?: AbortSignal): Promise<ExchangeRate> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newExchangeRate: ExchangeRate = {
      id: String(DUMMY_EXCHANGE_RATES.length + 1),
      from_currency: data.from_currency,
      to_currency: data.to_currency,
      rate: data.rate,
      effective_date: data.effective_date,
      description: data.description,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    DUMMY_EXCHANGE_RATES.push(newExchangeRate);
    return newExchangeRate;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<ExchangeRate>>(ENDPOINT, data, { signal });

      return response.data.data || ({} as ExchangeRate);
    } catch (error) {
      return handleApiError(error, 'createExchangeRate');
    }
    */
  },

  /**
   * 환율 수정
   */
  async updateExchangeRate(id: string, data: UpdateExchangeRateRequest, signal?: AbortSignal): Promise<ExchangeRate> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_EXCHANGE_RATES.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('환율을 찾을 수 없습니다');
    }

    DUMMY_EXCHANGE_RATES[index] = {
      ...DUMMY_EXCHANGE_RATES[index],
      from_currency: data.from_currency,
      to_currency: data.to_currency,
      rate: data.rate,
      effective_date: data.effective_date,
      description: data.description,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_EXCHANGE_RATES[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<ExchangeRate>>(`${ENDPOINT}/${id}`, data, { signal });

      return response.data.data || ({} as ExchangeRate);
    } catch (error) {
      return handleApiError(error, `updateExchangeRate(${id})`);
    }
    */
  },

  /**
   * 환율 삭제
   */
  async deleteExchangeRate(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_EXCHANGE_RATES.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('환율을 찾을 수 없습니다');
    }

    DUMMY_EXCHANGE_RATES.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteExchangeRate(${id})`);
    }
    */
  },
};
