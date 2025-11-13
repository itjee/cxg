/**
 * Partner Contacts Types
 * 거래처 담당자/연락처 관련 타입 정의
 */

// 거래처 담당자 (PartnerContact에서 상세 정보)
export interface PartnerContact {
  id: string;
  partner_id: string;
  contact_name: string;
  position?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  contact_type?: 'SALES' | 'PURCHASING' | 'ACCOUNTING' | 'TECHNICAL' | 'MANAGEMENT' | 'OTHER';
  is_primary: boolean;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

// 요청 타입
export interface CreatePartnerContactRequest {
  contact_name: string;
  position?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  contact_type?: 'SALES' | 'PURCHASING' | 'ACCOUNTING' | 'TECHNICAL' | 'MANAGEMENT' | 'OTHER';
  is_primary?: boolean;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdatePartnerContactRequest {
  contact_name?: string;
  position?: string;
  department?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  contact_type?: 'SALES' | 'PURCHASING' | 'ACCOUNTING' | 'TECHNICAL' | 'MANAGEMENT' | 'OTHER';
  is_primary?: boolean;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

// 응답 타입
export interface PartnerContactListResponse {
  data?: PartnerContact[];
  items?: PartnerContact[];
  total: number;
  page?: number;
  page_size?: number;
}

// Envelope 응답
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

// 쿼리 파라미터
export type PartnerContactQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  contact_type?: string;
};
