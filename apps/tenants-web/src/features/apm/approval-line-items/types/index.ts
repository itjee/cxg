export type ApprovalLineItems = {
  id: string;
  approval_line_id: string;
  line_number: string;
  approver_id: string;
  approver_name: string;
  approval_amount_from: number;
  approval_amount_to: number;
  approval_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateApprovalLineItemsRequest = Omit<ApprovalLineItems, 'id' | 'created_at' | 'updated_at'>;

export type UpdateApprovalLineItemsRequest = Partial<ApprovalLineItems>;

export type ApprovalLineItemsListResponse = {
  data: ApprovalLineItems[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApprovalLineItemsDetailResponse = ApprovalLineItems;

export type ApprovalLineItemsQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
