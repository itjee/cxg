/**
 * @file plans.types.ts
 * @description 요금제 관리 기능의 타입 정의 (Entity, DTO, Query Parameters)
 */

import type { BaseQueryParams, ListResponse } from '@/shared/types';

// ========== ENUMS & TYPES ==========

/**
 * 요금제 유형 (TRIAL/STANDARD/PREMIUM/ENTERPRISE)
 */
export enum PlanType {
  TRIAL = 'TRIAL',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

/**
 * 청구 주기 (MONTHLY/QUARTERLY/YEARLY)
 */
export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

/**
 * 요금제 상태 (ACTIVE/INACTIVE/ARCHIVED)
 */
export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

/**
 * 정렬 필드
 */
export type SortByField = 'name' | 'base_price' | 'type' | 'status' | 'start_time' | 'created_at';

// ========== ENTITY ==========

/**
 * 요금제 엔티티 (데이터베이스에서 반환되는 완전한 객체)
 */
export interface Plan {
  // 시스템 필드
  id: string;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  deleted: boolean;

  // 요금제 기본 정보
  code: string;
  name: string;
  type: PlanType | string;
  description?: string | null;

  // 가격 정보
  base_price: number;
  user_price: number;
  currency: string;
  billing_cycle: BillingCycle | string;

  // 사용량 제한
  max_users?: number | null;
  max_storage?: number | null;
  max_api_calls?: number | null;

  // 기능
  features?: Record<string, any> | null;

  // 유효 기간
  start_time: string; // YYYY-MM-DD
  close_time?: string | null; // YYYY-MM-DD

  // 상태
  status: PlanStatus | string;
}

// ========== REQUEST DTO ==========

/**
 * 요금제 생성 요청 (필수 필드만)
 */
export interface CreatePlanRequest {
  code: string;
  name: string;
  type: PlanType | string;
  description?: string | null;
  base_price: number;
  user_price?: number;
  currency?: string;
  billing_cycle?: BillingCycle | string;
  max_users?: number | null;
  max_storage?: number | null;
  max_api_calls?: number | null;
  features?: Record<string, any> | null;
  start_time: string;
  close_time?: string | null;
  status?: PlanStatus | string;
}

/**
 * 요금제 수정 요청 (모든 필드 선택사항)
 */
export interface UpdatePlanRequest {
  code?: string;
  name?: string;
  type?: PlanType | string;
  description?: string | null;
  base_price?: number;
  user_price?: number;
  currency?: string;
  billing_cycle?: BillingCycle | string;
  max_users?: number | null;
  max_storage?: number | null;
  max_api_calls?: number | null;
  features?: Record<string, any> | null;
  start_time?: string;
  close_time?: string | null;
  status?: PlanStatus | string;
}

// ========== RESPONSE DTO ==========

/**
 * 요금제 목록 응답
 */
export type PlansListResponse = ListResponse<Plan>;

// ========== QUERY PARAMETERS ==========

/**
 * 요금제 목록 조회 쿼리 파라미터
 */
export interface PlanQueryParams extends BaseQueryParams {
  // 페이지네이션
  page?: number;
  pageSize?: number;

  // 필터링
  search?: string;
  status?: PlanStatus | string;
  type?: PlanType | string;
  billing_cycle?: BillingCycle | string;

  // 정렬
  sort_by?: SortByField;
  sort_order?: 'asc' | 'desc';
}

// ========== UI STATE ==========

/**
 * 요금제 필터 상태
 */
export interface PlansFilterState {
  search: string;
  status?: PlanStatus | string;
  type?: PlanType | string;
  billing_cycle?: BillingCycle | string;
}

/**
 * 요금제 페이지 상태
 */
export interface PlansPageState {
  currentPage: number;
  pageSize: number;
  sorting: {
    id: string;
    desc: boolean;
  }[];
}
