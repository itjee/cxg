/**
 * Accounts Types
 * 계정과목 관련 타입 정의
 */

export interface Accounts {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateAccountsRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateAccountsRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface AccountsListResponse {
  data: Accounts[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AccountsDetailResponse {
  data: Accounts;
}

export type AccountsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
