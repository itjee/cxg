/**
 * ApprovalLines Types
 * 결재 라인 관련 타입 정의
 */

export interface ApprovalLines {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at?: string;
}

export interface CreateApprovalLinesRequest {
  title: string;
  description?: string;
}

export interface UpdateApprovalLinesRequest {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApprovalLinesListResponse {
  data: ApprovalLines[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApprovalLinesDetailResponse {
  data: ApprovalLines;
}

export type ApprovalLinesQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};
