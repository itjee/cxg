/**
 * @file permissions.types.ts
 * @description Permissions TypeScript 타입 정의
 */

/**
 * Permissions 정보
 */
export interface Permissions {
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
 * Permissions 생성 요청
 */
export interface CreatePermissionsRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Permissions 수정 요청
 */
export interface UpdatePermissionsRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Permissions 목록 응답
 */
export interface PermissionsListResponse {
  items: Permissions[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Permissions 쿼리 파라미터
 */
export interface PermissionsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
