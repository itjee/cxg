/**
 * AccountsPayable Types
 * 매입채무 관련 타입 정의
 */

export interface AccountsPayable {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAccountsPayableRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateAccountsPayableRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface AccountsPayableListResponse {
  data: AccountsPayable[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AccountsPayableDetailResponse {
  data: AccountsPayable;
}

export type AccountsPayableQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
