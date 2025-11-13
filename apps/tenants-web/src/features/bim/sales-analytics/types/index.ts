/**
 * SalesAnalytics Types
 * 영업 분석 관련 타입 정의
 */

export interface SalesAnalytics {
  id: string;
  name: string;
  description?: string;
  value?: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateSalesAnalyticsRequest {
  name: string;
  description?: string;
  value?: number;
}

export interface UpdateSalesAnalyticsRequest {
  name?: string;
  description?: string;
  value?: number;
  active?: boolean;
}

export interface SalesAnalyticsListResponse {
  data: SalesAnalytics[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SalesAnalyticsDetailResponse {
  data: SalesAnalytics;
}

export type SalesAnalyticsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};
