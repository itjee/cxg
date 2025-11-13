/**
 * Product Types
 * 제품 관리 관련 타입 정의
 */

export interface Product {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand?: string;
  maker_id?: string;
  sku?: string;
  price?: number;
  cost?: number;
  stock?: number;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  code: string;
  name: string;
  category?: string;
  brand?: string;
  maker_id?: string;
  sku?: string;
  price?: number;
  cost?: number;
  stock?: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateProductRequest {
  code?: string;
  name?: string;
  category?: string;
  brand?: string;
  maker_id?: string;
  sku?: string;
  price?: number;
  cost?: number;
  stock?: number;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface ProductListResponse {
  data?: Product[];
  items?: Product[];
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

export type ProductQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  category?: string;
  brand?: string;
  status?: 'active' | 'inactive';
};
