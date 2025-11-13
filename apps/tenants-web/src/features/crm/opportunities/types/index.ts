/**
 * Opportunity Types
 * 영업기회 관련 타입 정의
 */

export interface Opportunity {
  id: string;
  name: string;
  description?: string;
  stage?: string;
  expected_revenue?: number;
  expected_close_date?: string;
  probability?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityRequest {
  name: string;
  description?: string;
  stage?: string;
  expected_revenue?: number;
  expected_close_date?: string;
  probability?: number;
}

export interface UpdateOpportunityRequest {
  name?: string;
  description?: string;
  stage?: string;
  expected_revenue?: number;
  expected_close_date?: string;
  probability?: number;
  active?: boolean;
}

export interface OpportunityListResponse {
  data: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OpportunityDetailResponse {
  data: Opportunity;
}

export type OpportunityQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};

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
