/**
 * Department Service
 * API를 통한 부서 데이터 관리
 */

import { api } from '@/lib/api';
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  DepartmentListResponse,
  DepartmentQueryParams,
} from '../types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface DepartmentServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: DepartmentServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'DepartmentServiceError';

  console.error(`[DepartmentService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/hrm/departments';

// 더미 데이터
const DUMMY_DEPARTMENTS: Department[] = [
  {
    id: '1',
    code: 'EXEC',
    name: '경영진',
    is_active: true,
    level: 1,
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    code: 'DEV',
    name: '개발팀',
    parent_id: '1',
    parent_name: '경영진',
    is_active: true,
    level: 2,
    sort_order: 1,
    created_at: '2025-01-02T00:00:00Z',
  },
  {
    id: '3',
    code: 'SALES',
    name: '영업팀',
    parent_id: '1',
    parent_name: '경영진',
    is_active: true,
    level: 2,
    sort_order: 2,
    created_at: '2025-01-03T00:00:00Z',
  },
];

export const departmentService = {
  /**
   * 부서 목록 조회
   */
  async getDepartments(
    params?: DepartmentQueryParams,
    signal?: AbortSignal
  ): Promise<DepartmentListResponse> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_DEPARTMENTS];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.code.toLowerCase().includes(searchLower) ||
          dept.name.toLowerCase().includes(searchLower)
      );
    }

    if (params?.is_active !== undefined) {
      filtered = filtered.filter((dept) => dept.is_active === params.is_active);
    }

    if (params?.parent_id) {
      filtered = filtered.filter((dept) => dept.parent_id === params.parent_id);
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
      const response = await api.get<ApiResponse<DepartmentListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.page_size,
          search: params?.search,
          is_active: params?.is_active,
          parent_id: params?.parent_id,
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
      return handleApiError(error, 'getDepartments');
    }
    */
  },

  /**
   * 부서 상세 조회
   */
  async getDepartmentById(id: string, signal?: AbortSignal): Promise<Department> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const department = DUMMY_DEPARTMENTS.find((d) => d.id === id);
    if (!department) {
      throw new Error('부서를 찾을 수 없습니다');
    }

    return department;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<Department>>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data || ({} as Department);
    } catch (error) {
      return handleApiError(error, `getDepartmentById(${id})`);
    }
    */
  },

  /**
   * 부서 생성
   */
  async createDepartment(
    data: CreateDepartmentRequest,
    signal?: AbortSignal
  ): Promise<Department> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newDepartment: Department = {
      id: String(DUMMY_DEPARTMENTS.length + 1),
      code: data.code,
      name: data.name,
      parent_id: data.parent_id,
      manager_id: data.manager_id,
      description: data.description,
      is_active: true,
      sort_order: data.sort_order || 0,
      created_at: new Date().toISOString(),
    };

    DUMMY_DEPARTMENTS.push(newDepartment);
    return newDepartment;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<Department>>(ENDPOINT, data, { signal });
      return response.data.data || ({} as Department);
    } catch (error) {
      return handleApiError(error, 'createDepartment');
    }
    */
  },

  /**
   * 부서 수정
   */
  async updateDepartment(
    id: string,
    data: UpdateDepartmentRequest,
    signal?: AbortSignal
  ): Promise<Department> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_DEPARTMENTS.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('부서를 찾을 수 없습니다');
    }

    DUMMY_DEPARTMENTS[index] = {
      ...DUMMY_DEPARTMENTS[index],
      ...data,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_DEPARTMENTS[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<Department>>(`${ENDPOINT}/${id}`, data, { signal });
      return response.data.data || ({} as Department);
    } catch (error) {
      return handleApiError(error, `updateDepartment(${id})`);
    }
    */
  },

  /**
   * 부서 삭제
   */
  async deleteDepartment(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_DEPARTMENTS.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error('부서를 찾을 수 없습니다');
    }

    DUMMY_DEPARTMENTS.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteDepartment(${id})`);
    }
    */
  },
};
