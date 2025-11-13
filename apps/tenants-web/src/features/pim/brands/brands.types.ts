/**
 * Brand Types
 * 브랜드 관리 관련 타입 정의
 */

export interface Brand {
  id: string;
  code: string;
  name: string;
  country?: string;
  description?: string;
  logo_url?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
}

export interface CreateBrandRequest {
  code: string;
  name: string;
  country?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
}

export interface UpdateBrandRequest {
  code?: string;
  name?: string;
  country?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
}

export interface BrandListResponse {
  data?: Brand[];
  items?: Brand[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface EnvelopeResponse<T> {
  success: boolean;
  code?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    detail?: any;
  };
}

export type BrandQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  country?: string;
  is_active?: boolean;
};
