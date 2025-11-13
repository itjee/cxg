/**
 * Partner (Customer) Types
 * 거래처/고객 관련 타입 정의
 */

// 거래처 기본 타입
export interface Partner {
  id: string;
  code: string;
  name: string;
  name_en?: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';

  // 사업자 등록 정보
  tax_no?: string;
  biz_no?: string;
  biz_name?: string;
  biz_type?: 'C' | 'S'; // C: 법인, S: 개인
  biz_kind?: string;
  biz_item?: string;
  ceo_name?: string;

  // 주소 정보
  postcode?: string;
  address1?: string;
  address2?: string;

  // 연락처 정보
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;

  // 거래 조건
  payment_terms?: string;
  credit_limit?: number;
  currency_code?: string; // ISO 4217 (기본: KRW)

  // 추가 정보
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  established_date?: string;

  // 상태
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  is_deleted: boolean;

  // 감사 필드
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
}

// 거래처 담당자
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

// 거래처 주소
export interface PartnerAddress {
  id: string;
  partner_id: string;
  address_type: 'HEADQUARTER' | 'BRANCH' | 'WAREHOUSE' | 'FACTORY' | 'BILLING' | 'SHIPPING' | 'OTHER';
  address_name?: string;
  postcode?: string;
  address1?: string;
  address2?: string;
  building?: string;
  city?: string;
  state_province?: string;
  country_code: string; // ISO 3166-1 alpha-3
  region_code?: string;
  contact_name?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  is_default: boolean;
  is_billing: boolean;
  is_shipping: boolean;
  instruction?: string;
  access_code?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

// 거래처 담당자 배정 (자사 담당자)
export interface PartnerManager {
  id: string;
  partner_id: string;
  employee_id: string;
  employee_name?: string; // 담당자명 (조회 시)
  start_date: string;
  end_date?: string;
  manager_type: 'PRIMARY' | 'SECONDARY' | 'BACKUP' | 'TECHNICAL' | 'SALES' | 'SUPPORT';
  description?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'TERMINATED';
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
}

// 요청 타입
export interface CreatePartnerRequest {
  code: string;
  name: string;
  name_en?: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';
  tax_no?: string;
  biz_no?: string;
  biz_name?: string;
  biz_type?: 'C' | 'S';
  biz_kind?: string;
  biz_item?: string;
  ceo_name?: string;
  postcode?: string;
  address1?: string;
  address2?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  payment_terms?: string;
  credit_limit?: number;
  currency_code?: string;
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  established_date?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
}

export interface UpdatePartnerRequest {
  code?: string;
  name?: string;
  name_en?: string;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';
  tax_no?: string;
  biz_no?: string;
  biz_name?: string;
  biz_type?: 'C' | 'S';
  biz_kind?: string;
  biz_item?: string;
  ceo_name?: string;
  postcode?: string;
  address1?: string;
  address2?: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  payment_terms?: string;
  credit_limit?: number;
  currency_code?: string;
  industry?: string;
  employee_count?: number;
  annual_revenue?: number;
  established_date?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
}

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

export interface CreatePartnerAddressRequest {
  address_type: 'HEADQUARTER' | 'BRANCH' | 'WAREHOUSE' | 'FACTORY' | 'BILLING' | 'SHIPPING' | 'OTHER';
  address_name?: string;
  postcode?: string;
  address1?: string;
  address2?: string;
  building?: string;
  city?: string;
  state_province?: string;
  country_code: string;
  region_code?: string;
  contact_name?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  is_default?: boolean;
  is_billing?: boolean;
  is_shipping?: boolean;
  instruction?: string;
  access_code?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface CreatePartnerManagerRequest {
  employee_id: string;
  start_date: string;
  end_date?: string;
  manager_type: 'PRIMARY' | 'SECONDARY' | 'BACKUP' | 'TECHNICAL' | 'SALES' | 'SUPPORT';
  description?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'TERMINATED';
}

// 응답 타입
export interface PartnerListResponse {
  data?: Partner[];
  items?: Partner[];
  total: number;
  page: number;
  page_size: number;
  total_pages?: number;
}

export interface PartnerDetailResponse {
  data: Partner;
}

export interface PartnerContactListResponse {
  data?: PartnerContact[];
  items?: PartnerContact[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface PartnerAddressListResponse {
  data?: PartnerAddress[];
  items?: PartnerAddress[];
  total: number;
  page?: number;
  page_size?: number;
}

export interface PartnerManagerListResponse {
  data?: PartnerManager[];
  items?: PartnerManager[];
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
export type PartnerQueryParams = {
  page?: number;
  pageSize?: number;
  page_size?: number;
  search?: string;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH' | 'OTHER';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CLOSED';
  active?: boolean;
};
