/**
 * Employee Service
 * API를 통한 직원 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeListResponse,
  EmployeeQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface EmployeeServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: EmployeeServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'EmployeeServiceError';

  console.error(`[EmployeeService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/hrm/employees';

// 더미 데이터
const DUMMY_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employee_number: 'E001',
    username: 'john.doe',
    full_name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    department_id: '2',
    department_name: '개발팀',
    position: '선임 개발자',
    hire_date: '2023-01-15',
    is_active: true,
    created_at: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    employee_number: 'E002',
    username: 'jane.smith',
    full_name: '김영희',
    email: 'kim@example.com',
    phone: '010-2345-6789',
    department_id: '3',
    department_name: '영업팀',
    position: '영업 관리자',
    hire_date: '2023-03-20',
    is_active: true,
    created_at: '2023-03-20T00:00:00Z',
  },
  {
    id: '3',
    employee_number: 'E003',
    username: 'mike.wilson',
    full_name: '이철수',
    email: 'lee@example.com',
    department_id: '2',
    department_name: '개발팀',
    position: '주니어 개발자',
    hire_date: '2024-01-10',
    is_active: true,
    created_at: '2024-01-10T00:00:00Z',
  },
];

export const employeeService = {
  /**
   * 직원 목록 조회
   */
  async getEmployees(
    params?: EmployeeQueryParams,
    signal?: AbortSignal
  ): Promise<EmployeeListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_EMPLOYEES];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.employee_number.toLowerCase().includes(searchLower) ||
          emp.full_name.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.username.toLowerCase().includes(searchLower)
      );
    }

    if (params?.is_active !== undefined) {
      filtered = filtered.filter((emp) => emp.is_active === params.is_active);
    }

    if (params?.department_id) {
      filtered = filtered.filter((emp) => emp.department_id === params.department_id);
    }

    return {
      items: filtered,
      total: filtered.length,
      page: params?.page || 1,
      page_size: params?.page_size || 20,
      total_pages: Math.ceil(filtered.length / (params?.page_size || 20)),
    };

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<EmployeeListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.page_size,
          search: params?.search,
          is_active: params?.is_active,
          department_id: params?.department_id,
        },
        signal,
      });
      return (
        response.data.data || {
          items: [],
          total: 0,
          page: 1,
          page_size: 20,
          total_pages: 0,
        }
      );
    } catch (error) {
      return handleApiError(error, 'getEmployees');
    }
    */
  },

  /**
   * 직원 상세 조회
   */
  async getEmployeeById(id: string, signal?: AbortSignal): Promise<Employee> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const employee = DUMMY_EMPLOYEES.find((e) => e.id === id);
    if (!employee) {
      throw new Error('직원을 찾을 수 없습니다');
    }

    return employee;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<Employee>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as Employee);
    } catch (error) {
      return handleApiError(error, `getEmployeeById(${id})`);
    }
    */
  },

  /**
   * 직원 생성
   */
  async createEmployee(
    data: CreateEmployeeRequest,
    signal?: AbortSignal
  ): Promise<Employee> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newEmployee: Employee = {
      id: String(DUMMY_EMPLOYEES.length + 1),
      employee_number: data.employee_number,
      username: data.username,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      department_id: data.department_id,
      position: data.position,
      hire_date: data.hire_date,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    DUMMY_EMPLOYEES.push(newEmployee);
    return newEmployee;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<Employee>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Employee);
    } catch (error) {
      return handleApiError(error, 'createEmployee');
    }
    */
  },

  /**
   * 직원 수정
   */
  async updateEmployee(
    id: string,
    data: UpdateEmployeeRequest,
    signal?: AbortSignal
  ): Promise<Employee> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_EMPLOYEES.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('직원을 찾을 수 없습니다');
    }

    DUMMY_EMPLOYEES[index] = {
      ...DUMMY_EMPLOYEES[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_EMPLOYEES[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<Employee>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Employee);
    } catch (error) {
      return handleApiError(error, `updateEmployee(${id})`);
    }
    */
  },

  /**
   * 직원 삭제
   */
  async deleteEmployee(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_EMPLOYEES.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new Error('직원을 찾을 수 없습니다');
    }

    DUMMY_EMPLOYEES.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteEmployee(${id})`);
    }
    */
  },
};
