/**
 * Customer Feedback Types
 * 고객 피드백 관련 타입 정의
 */

export interface CustomerFeedback {
  id: string;
  customerId: string;
  transactionType: 'SALE' | 'SERVICE' | 'SUPPORT';
  transactionId?: string;
  rating: number;
  comment?: string;
  feedbackCategories?: string[];
  responseText?: string;
  responseBy?: string;
  responseDate?: string;
  status: 'NEW' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateCustomerFeedbackRequest {
  customerId: string;
  transactionType: 'SALE' | 'SERVICE' | 'SUPPORT';
  transactionId?: string;
  rating: number;
  comment?: string;
  feedbackCategories?: string[];
}

export interface UpdateCustomerFeedbackRequest {
  rating?: number;
  comment?: string;
  feedbackCategories?: string[];
  responseText?: string;
  status?: 'NEW' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
}

export interface CustomerFeedbackListResponse {
  data: CustomerFeedback[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CustomerFeedbackDetailResponse {
  data: CustomerFeedback;
}

export type CustomerFeedbackQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  transactionType?: string;
  customerId?: string;
  rating?: number;
};
