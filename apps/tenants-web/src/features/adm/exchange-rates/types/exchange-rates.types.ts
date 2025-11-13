/**
 * ExchangeRate Types
 * 환율 관련 타입 정의
 */

export interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  effective_date: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateExchangeRateRequest {
  from_currency: string;
  to_currency: string;
  rate: number;
  effective_date: string;
  description?: string;
}

export interface UpdateExchangeRateRequest {
  from_currency?: string;
  to_currency?: string;
  rate?: number;
  effective_date?: string;
  description?: string;
  is_active?: boolean;
}

export interface ExchangeRateListResponse {
  data: ExchangeRate[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ExchangeRateDetailResponse {
  data: ExchangeRate;
}

export type ExchangeRateQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
};

export interface ExchangeRateStats {
  total: number;
  active: number;
  inactive: number;
  currencyPairCount: number;
}
