/**
 * Role Types
 * 역할 관련 타입 정의 (sys.roles 테이블 기반)
 */

/**
 * 역할 정보 (DB 스키마 기반)
 */
export interface Role {
  // 기본 식별자 및 감사 필드
  id: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  created_by?: string; // UUID (NULL 가능)
  updated_at?: string; // TIMESTAMP WITH TIME ZONE
  updated_by?: string; // UUID

  // 역할 정보
  code: string; // VARCHAR(50) - 역할 코드
  name: string; // VARCHAR(100) - 역할명
  description?: string; // TEXT - 역할 설명

  // 역할 속성
  is_system: boolean; // BOOLEAN - 시스템 기본 역할 여부

  // 상태 관리
  is_active: boolean; // BOOLEAN - 활성 상태
  is_deleted: boolean; // BOOLEAN - 논리 삭제 플래그
}

/**
 * 역할 생성 요청
 */
export interface CreateRoleRequest {
  code: string;
  name: string;
  description?: string;
  is_system?: boolean;
  is_active?: boolean;
}

/**
 * 역할 수정 요청
 */
export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * 역할 목록 응답
 */
export interface RoleListResponse {
  data: Role[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 역할 상세 응답
 */
export interface RoleDetailResponse {
  data: Role;
}

/**
 * 역할 조회 파라미터
 */
export type RoleQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  is_active?: boolean;
  is_system?: boolean;
};
