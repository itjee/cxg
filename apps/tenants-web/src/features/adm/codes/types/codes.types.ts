/**
 * Code Types
 * 코드 관련 타입 정의
 */

export interface Code {
  id: string;
  code_group_id: string;
  code_group_name: string;
  code: string;
  name: string;
  value: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreateCodeRequest {
  code_group_id: string;
  code: string;
  name: string;
  value: string;
  description?: string;
  display_order: number;
}

export interface UpdateCodeRequest {
  code_group_id?: string;
  code?: string;
  name?: string;
  value?: string;
  description?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CodeListResponse {
  items: Code[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CodeDetailResponse {
  data: Code;
}

export type CodeQueryParams = {
  page?: number;
  page_size?: number;
  search?: string;
  code_group_id?: string;
  is_active?: boolean | null;
};

export interface CodeStats {
  total: number;
  active: number;
  inactive: number;
}
