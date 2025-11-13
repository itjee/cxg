/**
 * Maker Types
 * 제조사 관리 관련 타입 정의
 */

export interface Maker {
  id: string;
  code: string;
  name: string;
  country?: string;
  region?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
}

export interface CreateMakerRequest {
  code: string;
  name: string;
  country?: string;
  region?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
}

export interface UpdateMakerRequest {
  code?: string;
  name?: string;
  country?: string;
  region?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  is_active?: boolean;
}

export interface MakerListResponse {
  data?: Maker[];
  items?: Maker[];
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

export type MakerQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  country?: string;
  region?: string;
  is_active?: boolean;
};
