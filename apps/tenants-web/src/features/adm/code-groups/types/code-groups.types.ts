/**
 * CodeGroup Types
 * 코드그룹 관련 타입 정의
 */

export interface CodeGroup {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_system: boolean;
  is_active: boolean;
  code_count?: number;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateCodeGroupRequest {
  code: string;
  name: string;
  description?: string;
  is_system?: boolean;
  is_active?: boolean;
}

export interface UpdateCodeGroupRequest {
  code?: string;
  name?: string;
  description?: string;
  is_system?: boolean;
  is_active?: boolean;
}

export interface CodeGroupListResponse {
  items: CodeGroup[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CodeGroupDetailResponse {
  data: CodeGroup;
}

export type CodeGroupQueryParams = {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean | null;
  is_system?: boolean | null;
};

export interface CodeGroupStats {
  total: number;
  active: number;
  inactive: number;
  system: number;
  custom: number;
}
