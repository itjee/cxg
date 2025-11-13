/**
 * Currency Service
 * API를 통한 통화 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Currency,
  CreateCurrencyRequest,
  UpdateCurrencyRequest,
  EnvelopeResponse,
  CurrencyFilterParams,
} from "../types/currencies.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CurrencyServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: CurrencyServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'CurrencyServiceError';

  console.error(`[CurrencyService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/currencies';

// 더미 데이터
const DUMMY_CURRENCIES: Currency[] = [
  {
    id: "1",
    code: "USD",
    name: "미국 달러",
    symbol: "$",
    decimal_places: 2,
    exchange_rate: 1.0,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    code: "EUR",
    name: "유로",
    symbol: "€",
    decimal_places: 2,
    exchange_rate: 0.92,
    is_active: true,
    created_at: "2025-01-02T00:00:00Z",
    updated_at: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    code: "KRW",
    name: "대한민국 원",
    symbol: "₩",
    decimal_places: 0,
    exchange_rate: 1320.5,
    is_active: true,
    created_at: "2025-01-03T00:00:00Z",
    updated_at: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    code: "JPY",
    name: "일본 엔",
    symbol: "¥",
    decimal_places: 0,
    exchange_rate: 149.25,
    is_active: true,
    created_at: "2025-01-04T00:00:00Z",
    updated_at: "2025-01-04T00:00:00Z",
  },
  {
    id: "5",
    code: "GBP",
    name: "영국 파운드",
    symbol: "£",
    decimal_places: 2,
    exchange_rate: 0.79,
    is_active: true,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
];

export const currencyService = {
  /**
   * 통화 목록 조회
   */
  async listCurrencies(params?: CurrencyFilterParams, signal?: AbortSignal): Promise<Currency[]> {
    // 실제 API 호출 코드 (현재는 더미 데이터 반환)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_CURRENCIES];

    // 검색 필터
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (currency) =>
          currency.code.toLowerCase().includes(searchLower) ||
          currency.name.toLowerCase().includes(searchLower) ||
          currency.symbol.includes(searchLower)
      );
    }

    // 활성 상태 필터
    if (params?.isActive === "active") {
      filtered = filtered.filter((currency) => currency.is_active);
    } else if (params?.isActive === "inactive") {
      filtered = filtered.filter((currency) => !currency.is_active);
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

      const response = await api.get<ApiResponse<Currency[]>>(url, { signal });

      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, 'listCurrencies');
    }
    */
  },

  /**
   * 단일 통화 조회
   */
  async getCurrency(id: string, signal?: AbortSignal): Promise<Currency> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const currency = DUMMY_CURRENCIES.find((c) => c.id === id);
    if (!currency) {
      throw new Error("통화를 찾을 수 없습니다");
    }

    return currency;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<Currency>>(`${ENDPOINT}/${id}`, { signal });

      return response.data.data || ({} as Currency);
    } catch (error) {
      return handleApiError(error, `getCurrency(${id})`);
    }
    */
  },

  /**
   * 통화 생성
   */
  async createCurrency(data: CreateCurrencyRequest, signal?: AbortSignal): Promise<Currency> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newCurrency: Currency = {
      id: String(DUMMY_CURRENCIES.length + 1),
      code: data.code,
      name: data.name,
      symbol: data.symbol,
      decimal_places: data.decimal_places,
      exchange_rate: data.exchange_rate,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    DUMMY_CURRENCIES.push(newCurrency);
    return newCurrency;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<Currency>>(ENDPOINT, data, { signal });

      return response.data.data || ({} as Currency);
    } catch (error) {
      return handleApiError(error, 'createCurrency');
    }
    */
  },

  /**
   * 통화 수정
   */
  async updateCurrency(
    id: string,
    data: UpdateCurrencyRequest,
    signal?: AbortSignal
  ): Promise<Currency> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_CURRENCIES.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("통화를 찾을 수 없습니다");
    }

    DUMMY_CURRENCIES[index] = {
      ...DUMMY_CURRENCIES[index],
      code: data.code,
      name: data.name,
      symbol: data.symbol,
      decimal_places: data.decimal_places,
      exchange_rate: data.exchange_rate,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_CURRENCIES[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<Currency>>(`${ENDPOINT}/${id}`, data, { signal });

      return response.data.data || ({} as Currency);
    } catch (error) {
      return handleApiError(error, `updateCurrency(${id})`);
    }
    */
  },

  /**
   * 통화 삭제
   */
  async deleteCurrency(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_CURRENCIES.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("통화를 찾을 수 없습니다");
    }

    DUMMY_CURRENCIES.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteCurrency(${id})`);
    }
    */
  },
};
