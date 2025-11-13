/**
 * PaymentTransactions Types
 * 지급 거래 관련 타입 정의
 */

export interface PaymentTransactions {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreatePaymentTransactionsRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdatePaymentTransactionsRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface PaymentTransactionsListResponse {
  data: PaymentTransactions[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentTransactionsDetailResponse {
  data: PaymentTransactions;
}

export type PaymentTransactionsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
