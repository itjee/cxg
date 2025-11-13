/**
 * Currency Types
 * 통화 관련 타입 정의
 */

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  exchange_rate?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  exchange_rate?: number;
}

export interface UpdateCurrencyRequest {
  code?: string;
  name?: string;
  symbol?: string;
  decimal_places?: number;
  exchange_rate?: number;
  is_active?: boolean;
}

export interface CurrencyListResponse {
  data: Currency[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CurrencyDetailResponse {
  data: Currency;
}

export type CurrencyQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
};

export interface CurrencyStats {
  total: number;
  active: number;
  inactive: number;
  currencyCount: number;
}
