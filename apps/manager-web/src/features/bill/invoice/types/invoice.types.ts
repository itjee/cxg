/**
 * 청구서 (Invoice) 타입 정의
 *
 * Entity, Request DTO, Response DTO, Query Parameters를 명확히 구분합니다.
 * 스키마 참고: packages/database/schemas/manager/03_bill/02_invoices.sql
 */

// ========== ENUMS & TYPES ==========

/** 청구서 상태 */
export type InvoiceStatus = "PENDING" | "SENT" | "PAID" | "OVERDUE" | "CANCELED";

/** 결제 수단 */
export type PaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER" | "PAYPAL" | "WIRE_TRANSFER" | "CHECK";

// ========== ENTITY ==========

/**
 * 청구서 엔티티 (데이터베이스에서 반환되는 완전한 객체)
 *
 * 백엔드 Invoice 모델과 동기화됨
 */
export interface Invoice {
  // 시스템 필드
  id: string;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  deleted: boolean;

  // 관련 ID
  tenant_id: string;
  subscription_id: string;

  // 청구서 기본 정보
  invoice_no: string;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  start_date: string; // YYYY-MM-DD
  close_date: string; // YYYY-MM-DD

  // 청구 금액 정보
  base_amount: number | string; // Decimal
  usage_amount: number | string;
  discount_amount: number | string;
  tax_amount: number | string;
  total_amount: number | string;
  currency: string; // ISO 4217 코드 (KRW, USD 등)

  // 사용량 상세 정보
  user_count: number;
  used_storage: number | string; // GB
  api_calls: number;

  // 결제 정보
  paid_at?: string | null;
  payment_method?: PaymentMethod | null;

  // 상태
  status: InvoiceStatus;
}

// ========== REQUEST DTO ==========

/**
 * 청구서 생성 요청 (필수 필드만)
 */
export interface CreateInvoiceRequest {
  invoice_no: string;
  tenant_id: string;
  subscription_id: string;

  invoice_date: string;
  due_date: string;
  start_date: string;
  close_date: string;

  base_amount: number | string;
  usage_amount?: number | string;
  discount_amount?: number | string;
  tax_amount?: number | string;
  total_amount: number | string;
  currency?: string;

  user_count: number;
  used_storage?: number | string;
  api_calls?: number;

  payment_method?: PaymentMethod | null;
}

/**
 * 청구서 수정 요청 (모든 필드 선택사항)
 */
export interface UpdateInvoiceRequest {
  invoice_no?: string;
  due_date?: string;
  start_date?: string;
  close_date?: string;

  usage_amount?: number | string;
  discount_amount?: number | string;
  tax_amount?: number | string;
  total_amount?: number | string;

  user_count?: number;
  used_storage?: number | string;
  api_calls?: number;

  status?: InvoiceStatus;
  payment_method?: PaymentMethod | null;
}

// ========== RESPONSE DTO ==========

/**
 * 청구서 목록 응답 (페이지네이션)
 */
export interface InvoiceListResponse {
  items: Invoice[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 청구서 상세 조회 응답
 */
export interface InvoiceDetailResponse {
  data: Invoice;
}

// ========== QUERY PARAMETERS ==========

/**
 * 청구서 목록 조회 쿼리 파라미터
 */
export interface InvoiceQueryParams {
  // 페이지네이션
  page?: number;
  pageSize?: number;

  // 필터링
  search?: string; // 청구서 번호 검색
  status?: InvoiceStatus;
  tenant_id?: string;
  payment_method?: PaymentMethod;

  // 정렬
  sortBy?: "invoice_no" | "invoice_date" | "due_date" | "total_amount" | "status" | "created_at";
  sortOrder?: "asc" | "desc";
}
