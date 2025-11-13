/**
 * Activity Types
 * 활동기록 관련 타입 정의
 */

export interface Activity {
  id: string;
  title: string;
  partner_id: string;
  partner_name: string;
  activity_type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'OTHER';
  description: string;
  scheduled_date?: string;
  completed_date?: string;
  assigned_to: string;
  created_by: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at?: string;
}

export interface CreateActivityRequest {
  title: string;
  partner_id: string;
  activity_type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'OTHER';
  description: string;
  scheduled_date?: string;
  assigned_to: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface UpdateActivityRequest {
  title?: string;
  activity_type?: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'OTHER';
  description?: string;
  scheduled_date?: string;
  completed_date?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface ActivityListResponse {
  data?: Activity[];
  items?: Activity[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface ActivityDetailResponse {
  data: Activity;
}

export interface EnvelopeResponse<T> {
  success: boolean;
  code?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    detail?: any;
  };
}

export type ActivityQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  activity_type?: string;
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
};
