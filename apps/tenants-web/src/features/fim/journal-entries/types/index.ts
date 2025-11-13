/**
 * JournalEntries Types
 * 분개 관련 타입 정의
 */

export interface JournalEntries {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateJournalEntriesRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateJournalEntriesRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface JournalEntriesListResponse {
  data: JournalEntries[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JournalEntriesDetailResponse {
  data: JournalEntries;
}

export type JournalEntriesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
