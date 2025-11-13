/**
 * @file users.types.ts
 * @description Users TypeScript 타입 정의
 */

/**
 * Users 정보
 */
export interface Users {
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
 * Users 생성 요청
 */
export interface CreateUsersRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Users 수정 요청
 */
export interface UpdateUsersRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Users 목록 응답
 */
export interface UsersListResponse {
  items: Users[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Users 쿼리 파라미터
 */
export interface UsersQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
