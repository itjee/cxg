/**
 * ApprovalHistories Types
 * 결재 이력 관련 타입 정의
 */

export interface ApprovalHistories {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at?: string;
}

export interface CreateApprovalHistoriesRequest {
  title: string;
  description?: string;
}

export interface UpdateApprovalHistoriesRequest {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApprovalHistoriesListResponse {
  data: ApprovalHistories[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApprovalHistoriesDetailResponse {
  data: ApprovalHistories;
}

export type ApprovalHistoriesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};
