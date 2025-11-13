/**
 * Code Rule Types
 * 코드 규칙 관련 타입 정의 (sys.code_rules 테이블 기반)
 */

/**
 * 리셋 주기 타입
 */
export type ResetCycle = 'NONE' | 'DAILY' | 'MONTHLY' | 'YEARLY';

/**
 * 코드 규칙 정보 (DB 스키마 기반)
 */
export interface CodeRule {
  // 기본 식별자 및 감사 필드
  id: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  created_by?: string; // UUID (NULL 가능)
  updated_at?: string; // TIMESTAMP WITH TIME ZONE
  updated_by?: string; // UUID

  // 엔티티 정보
  entity_code: string; // VARCHAR(100) - 엔티티 코드
  entity_name: string; // VARCHAR(200) - 엔티티명
  entity_name_en?: string; // VARCHAR(200) - 엔티티명 (영문)

  // 코드 생성 규칙
  prefix: string; // VARCHAR(10) - 코드 Prefix
  current_number: number; // INTEGER - 현재 일련번호
  digit_length: number; // SMALLINT - 일련번호 자릿수

  separator: string; // VARCHAR(5) - 구분자

  // 추가 설정
  use_date: boolean; // BOOLEAN - 날짜 사용 여부
  date_format: string; // VARCHAR(20) - 날짜 포맷
  reset_cycle: ResetCycle; // VARCHAR(20) - 리셋 주기

  // 예시 및 설명
  description?: string; // TEXT - 규칙 설명
  example_code?: string; // VARCHAR(50) - 예시 코드

  // 상태 관리
  is_active: boolean; // BOOLEAN - 활성 상태
  is_deleted: boolean; // BOOLEAN - 논리 삭제 플래그

  // 메타 데이터
  meta_data?: Record<string, unknown>; // JSONB - 추가 메타 정보
}

/**
 * 코드 규칙 생성 요청
 */
export interface CreateCodeRuleRequest {
  entity_code: string;
  entity_name: string;
  entity_name_en?: string;
  prefix: string;
  current_number?: number;
  digit_length: number;
  separator?: string;
  use_date?: boolean;
  date_format?: string;
  reset_cycle?: ResetCycle;
  description?: string;
  example_code?: string;
  is_active?: boolean;
  meta_data?: Record<string, unknown>;
}

/**
 * 코드 규칙 수정 요청
 */
export interface UpdateCodeRuleRequest {
  entity_name?: string;
  entity_name_en?: string;
  prefix?: string;
  current_number?: number;
  digit_length?: number;
  separator?: string;
  use_date?: boolean;
  date_format?: string;
  reset_cycle?: ResetCycle;
  description?: string;
  example_code?: string;
  is_active?: boolean;
  meta_data?: Record<string, unknown>;
}

/**
 * 코드 규칙 목록 응답
 */
export interface CodeRuleListResponse {
  data: CodeRule[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 코드 규칙 상세 응답
 */
export interface CodeRuleDetailResponse {
  data: CodeRule;
}

/**
 * 코드 규칙 조회 파라미터
 */
export type CodeRuleQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  is_active?: boolean;
  prefix?: string;
  reset_cycle?: ResetCycle;
};
