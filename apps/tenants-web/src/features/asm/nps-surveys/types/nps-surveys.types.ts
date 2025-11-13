/**
 * NPS Survey Types
 * NPS 설문 관련 타입 정의
 */

export interface NPSSurvey {
  id: string;
  customerId: string;
  npsScore: number;
  recommendationReason?: 'PROMOTER' | 'PASSIVE' | 'DETRACTOR';
  recommendationText?: string;
  sentDate?: string;
  responseDate?: string;
  responseTimeDays?: number;
  status: 'PENDING' | 'SENT' | 'RESPONDED' | 'CLOSED';
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface CreateNPSSurveyRequest {
  customerId: string;
  npsScore: number;
  recommendationText?: string;
}

export interface UpdateNPSSurveyRequest {
  npsScore?: number;
  recommendationReason?: 'PROMOTER' | 'PASSIVE' | 'DETRACTOR';
  recommendationText?: string;
  responseDate?: string;
  status?: 'PENDING' | 'SENT' | 'RESPONDED' | 'CLOSED';
}

export interface NPSSurveyListResponse {
  data: NPSSurvey[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NPSSurveyDetailResponse {
  data: NPSSurvey;
}

export type NPSSurveyQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  recommendationReason?: string;
  customerId?: string;
  npsScore?: number;
};
