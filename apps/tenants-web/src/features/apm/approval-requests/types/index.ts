/**
 * ApprovalRequests Types
 * 결재 요청 관련 타입 정의
 */

export interface ApprovalRequests {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at?: string;
}

export interface CreateApprovalRequestsRequest {
  title: string;
  description?: string;
}

export interface UpdateApprovalRequestsRequest {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApprovalRequestsListResponse {
  data: ApprovalRequests[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApprovalRequestsDetailResponse {
  data: ApprovalRequests;
}

export type ApprovalRequestsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
};
