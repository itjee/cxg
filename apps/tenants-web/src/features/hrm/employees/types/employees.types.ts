// 직원 타입 정의
export interface Employee {
  id: string;
  employee_number: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  department_name?: string;
  position?: string;
  hire_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// 직원 생성 요청 타입
export interface CreateEmployeeRequest {
  employee_number: string;
  username: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id?: string;
  position?: string;
  hire_date?: string;
  password: string;
}

// 직원 수정 요청 타입
export interface UpdateEmployeeRequest {
  employee_number?: string;
  username?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  department_id?: string;
  position?: string;
  hire_date?: string;
  is_active?: boolean;
}

// API List 응답 타입
export interface EmployeeListResponse {
  items: Employee[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// API Detail 응답 타입
export interface EmployeeDetailResponse {
  employee: Employee;
}

// Query 파라미터 타입
export interface EmployeeQueryParams {
  search?: string;
  department_id?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
