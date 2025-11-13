/**
 * BusinessDocuments Types
 * 증빙서류 관련 타입 정의
 */

export interface BusinessDocuments {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateBusinessDocumentsRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateBusinessDocumentsRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface BusinessDocumentsListResponse {
  data: BusinessDocuments[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BusinessDocumentsDetailResponse {
  data: BusinessDocuments;
}

export type BusinessDocumentsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
