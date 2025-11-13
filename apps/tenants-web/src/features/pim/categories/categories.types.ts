/**
 * Category Types
 * 카테고리 관리 관련 타입 정의
 */

export interface Category {
  id: string;
  code: string;
  name: string;
  parent_category?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  product_count: number;
  created_at: string;
}

export interface CreateCategoryRequest {
  code: string;
  name: string;
  parent_category?: string;
  description?: string;
  display_order: number;
  is_active?: boolean;
}

export interface UpdateCategoryRequest {
  code?: string;
  name?: string;
  parent_category?: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CategoryListResponse {
  data?: Category[];
  items?: Category[];
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

export type CategoryQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
};
