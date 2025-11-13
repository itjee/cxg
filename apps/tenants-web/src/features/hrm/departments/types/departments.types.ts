// 부서 타입 정의
export interface Department {
  id: string;
  code: string;
  name: string;
  parent_id?: string | null;
  parent_name?: string;
  manager_id?: string | null;
  manager_name?: string;
  description?: string;
  is_active: boolean;
  level?: number;
  sort_order?: number;
  created_at: string;
  updated_at?: string;
}

// 부서 생성 요청 타입
export interface CreateDepartmentRequest {
  code: string;
  name: string;
  parent_id?: string | null;
  manager_id?: string | null;
  description?: string;
  sort_order?: number;
}

// 부서 수정 요청 타입
export interface UpdateDepartmentRequest {
  code?: string;
  name?: string;
  parent_id?: string | null;
  manager_id?: string | null;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

// API List 응답 타입
export interface DepartmentListResponse {
  items: Department[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// API Detail 응답 타입
export interface DepartmentDetailResponse {
  department: Department;
}

// Query 파라미터 타입
export interface DepartmentQueryParams {
  search?: string;
  parent_id?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
