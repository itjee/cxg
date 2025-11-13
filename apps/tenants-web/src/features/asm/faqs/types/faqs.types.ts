/**
 * FAQ Types
 * FAQ 관련 타입 정의
 */

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder: number;
  viewCount: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateFAQRequest {
  category: string;
  question: string;
  answer: string;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface UpdateFAQRequest {
  category?: string;
  question?: string;
  answer?: string;
  displayOrder?: number;
  isPublished?: boolean;
}

export interface FAQListResponse {
  data: FAQ[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FAQDetailResponse {
  data: FAQ;
}

export type FAQQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  isPublished?: boolean;
};
