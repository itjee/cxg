/**
 * PaymentTerm Types
 * 결제조건 관련 타입 정의
 */

export interface PaymentTerm {
  id: string;
  code: string;
  name: string;
  days: number; // -1: 선금, 0: 현금, 양수: n일
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreatePaymentTermRequest {
  code: string;
  name: string;
  days: number;
  description?: string;
}

export interface UpdatePaymentTermRequest {
  code?: string;
  name?: string;
  days?: number;
  description?: string;
  is_active?: boolean;
}

export interface PaymentTermListResponse {
  data: PaymentTerm[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PaymentTermDetailResponse {
  data: PaymentTerm;
}

export type PaymentTermQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
};

export interface PaymentTermStats {
  total: number;
  active: number;
  inactive: number;
  paymentTermCount: number;
}

/**
 * 기한(일) 특수값 처리 헬퍼 함수
 * -1: 선금, 0: 현금, 양수: n일
 */
export function formatPaymentDays(days: number): string {
  if (days === -1) return '선금';
  if (days === 0) return '현금';
  return `${days}일`;
}
