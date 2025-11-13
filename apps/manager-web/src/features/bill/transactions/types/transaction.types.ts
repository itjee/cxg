/**
 * 거래(결제) (Transaction) 타입 정의
 *
 * Entity, Request DTO, Response DTO, Query Parameters를 명확히 구분합니다.
 * 스키마 참고: packages/database/schemas/manager/03_bill/03_transactions.sql
 */

// ========== ENUMS & TYPES ==========

/** 거래 상태 */
export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";

/** 거래 유형 */
export type TransactionType = "PAYMENT" | "REFUND" | "CHARGEBACK";

/** 결제 수단 */
export type PaymentMethod = "CREDIT_CARD" | "BANK_TRANSFER" | "VIRTUAL_ACCOUNT" | "PAYPAL" | "KAKAOPAY" | "NAVERPAY";

/** 결제 게이트웨이 */
export type PaymentGateway = "STRIPE" | "PAYPAL" | "TOSS" | "KAKAOPAY" | "NAVERPAY";

// ========== ENTITY ==========

/**
 * 거래 엔티티 (데이터베이스에서 반환되는 완전한 객체)
 *
 * 백엔드 Transaction 모델과 동기화됨
 */
export interface Transaction {
  // 시스템 필드
  id: string;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  deleted: boolean;

  // 관련 ID
  tenant_id: string;
  invoice_id?: string | null;

  // 거래 식별 정보
  transaction_no: string;
  transaction_type: TransactionType;

  // 결제 게이트웨이 정보
  payment_gateway?: PaymentGateway | null;
  payment_gateway_id?: string | null;

  // 결제 금액 정보
  amount: number | string; // Decimal
  currency: string; // ISO 4217 코드
  exchange_rate?: number | string | null;

  // 결제 수단 정보
  payment_method: PaymentMethod;
  card_digits?: string | null; // 마지막 4자리

  // 처리 시간 정보
  processed_at?: string | null;
  failed_at?: string | null;
  failure_reason?: string | null;

  // 상태
  status: TransactionStatus;
}

// ========== REQUEST DTO ==========

/**
 * 거래 생성 요청 (필수 필드만)
 */
export interface CreateTransactionRequest {
  transaction_no: string;
  tenant_id: string;
  invoice_id?: string | null;

  transaction_type?: TransactionType;
  amount: number | string;
  currency?: string;

  payment_method: PaymentMethod;
  payment_gateway?: PaymentGateway | null;
  payment_gateway_id?: string | null;

  exchange_rate?: number | string | null;
  card_digits?: string | null;

  status?: TransactionStatus;
}

/**
 * 거래 수정 요청 (모든 필드 선택사항)
 */
export interface UpdateTransactionRequest {
  status?: TransactionStatus;
  processed_at?: string | null;
  failed_at?: string | null;
  failure_reason?: string | null;

  exchange_rate?: number | string | null;
  card_digits?: string | null;
}

// ========== RESPONSE DTO ==========

/**
 * 거래 목록 응답 (페이지네이션)
 */
export interface TransactionListResponse {
  items: Transaction[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 거래 상세 조회 응답
 */
export interface TransactionDetailResponse {
  data: Transaction;
}

// ========== QUERY PARAMETERS ==========

/**
 * 거래 목록 조회 쿼리 파라미터
 */
export interface TransactionQueryParams {
  // 페이지네이션
  page?: number;
  pageSize?: number;

  // 필터링
  search?: string; // 거래 번호 검색
  status?: TransactionStatus;
  tenant_id?: string;
  transaction_type?: TransactionType;
  payment_gateway?: PaymentGateway;

  // 정렬
  sortBy?: "transaction_no" | "amount" | "status" | "processed_at" | "created_at";
  sortOrder?: "asc" | "desc";
}
