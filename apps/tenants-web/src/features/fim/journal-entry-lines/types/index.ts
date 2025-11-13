/**
 * JournalEntryLines Types
 * 분개 라인 관련 타입 정의
 */

export interface JournalEntryLines {
  id: string;
  description: string;
  amount?: number;
  transaction_date?: string;
  status: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateJournalEntryLinesRequest {
  description: string;
  amount?: number;
  transaction_date?: string;
  memo?: string;
}

export interface UpdateJournalEntryLinesRequest {
  description?: string;
  amount?: number;
  transaction_date?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  memo?: string;
}

export interface JournalEntryLinesListResponse {
  data: JournalEntryLines[];
  total: number;
  page: number;
  pageSize: number;
}

export interface JournalEntryLinesDetailResponse {
  data: JournalEntryLines;
}

export type JournalEntryLinesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'DRAFT' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
};
