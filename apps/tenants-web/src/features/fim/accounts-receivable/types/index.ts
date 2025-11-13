/**
 * AccountsReceivable Types
 * 매출채권 관련 타입 정의
 */

export interface AccountsReceivable {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAccountsReceivableRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateAccountsReceivableRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface AccountsReceivableListResponse {
  data: AccountsReceivable[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AccountsReceivableDetailResponse {
  data: AccountsReceivable;
}

export type AccountsReceivableQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
