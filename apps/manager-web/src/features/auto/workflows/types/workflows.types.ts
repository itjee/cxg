/**
 * @file workflows.types.ts
 * @description Workflows TypeScript 타입 정의
 */

/**
 * Workflows 정보
 */
export interface Workflows {
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
 * Workflows 생성 요청
 */
export interface CreateWorkflowsRequest {
  name: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Workflows 수정 요청
 */
export interface UpdateWorkflowsRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Workflows 목록 응답
 */
export interface WorkflowsListResponse {
  items: Workflows[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * Workflows 쿼리 파라미터
 */
export interface WorkflowsQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
}
