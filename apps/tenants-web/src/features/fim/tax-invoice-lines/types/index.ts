/**
 * TaxInvoiceLines Types
 * 세금계산서 라인 관련 타입 정의
 */

export interface TaxInvoiceLines {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateTaxInvoiceLinesRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateTaxInvoiceLinesRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface TaxInvoiceLinesListResponse {
  data: TaxInvoiceLines[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaxInvoiceLinesDetailResponse {
  data: TaxInvoiceLines;
}

export type TaxInvoiceLinesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
