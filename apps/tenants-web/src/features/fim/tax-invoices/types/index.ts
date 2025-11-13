/**
 * TaxInvoices Types
 * 세금계산서 관련 타입 정의
 */

export interface TaxInvoices {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateTaxInvoicesRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateTaxInvoicesRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface TaxInvoicesListResponse {
  data: TaxInvoices[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaxInvoicesDetailResponse {
  data: TaxInvoices;
}

export type TaxInvoicesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
