/**
 * @file roles.types.ts
 * @description Roles TypeScript 타입 정의
 */

/**
 * Roles 정보
 */
export interface Roles {
  // 기본 식별자
  id: string;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;

  // TODO: 필드 정의
  name: string;
  description?: string;
  
  // 상태
  is_active: boolean;
  is_deleted: boolean;
}

/**
 * Roles 생성 요청
 */
export interface CreateRolesRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Roles 수정 요청
 */
export interface UpdateRolesRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Roles 목록 응답
 */
export interface RolesListResponse {
  items: Roles[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Roles 쿼리 파라미터
 */
export interface RolesQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
