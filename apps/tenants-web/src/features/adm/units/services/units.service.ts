/**
 * Unit Service
 * API를 통한 단위 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Unit,
  CreateUnitRequest,
  UpdateUnitRequest,
  EnvelopeResponse,
  UnitFilterParams,
} from "../types/units.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface UnitServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: UnitServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'UnitServiceError';

  console.error(`[UnitService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/units';

// 더미 데이터
const DUMMY_UNITS: Unit[] = [
  {
    id: "1",
    code: "EA",
    name: "개",
    description: "낱개 단위",
    is_active: true,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-01T00:00:00Z",
  },
  {
    id: "2",
    code: "BOX",
    name: "박스",
    description: "박스 단위",
    is_active: true,
    created_at: "2025-10-02T00:00:00Z",
    updated_at: "2025-10-02T00:00:00Z",
  },
  {
    id: "3",
    code: "KG",
    name: "킬로그램",
    description: "무게 단위 (킬로그램)",
    is_active: true,
    created_at: "2025-10-03T00:00:00Z",
    updated_at: "2025-10-03T00:00:00Z",
  },
  {
    id: "4",
    code: "M",
    name: "미터",
    description: "길이 단위 (미터)",
    is_active: true,
    created_at: "2025-10-04T00:00:00Z",
    updated_at: "2025-10-04T00:00:00Z",
  },
  {
    id: "5",
    code: "SET",
    name: "세트",
    description: "세트 단위",
    is_active: true,
    created_at: "2025-10-05T00:00:00Z",
    updated_at: "2025-10-05T00:00:00Z",
  },
];

export const unitService = {
  /**
   * 단위 목록 조회
   */
  async getUnits(params?: UnitFilterParams, signal?: AbortSignal): Promise<Unit[]> {
    // 실제 API 호출 코드 (현재는 더미 데이터 반환)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = [...DUMMY_UNITS];

    // 검색 필터
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (unit) =>
          unit.code.toLowerCase().includes(searchLower) ||
          unit.name.toLowerCase().includes(searchLower) ||
          unit.description?.toLowerCase().includes(searchLower)
      );
    }

    // 활성 상태 필터
    if (params?.isActive === "active") {
      filtered = filtered.filter((unit) => unit.is_active);
    } else if (params?.isActive === "inactive") {
      filtered = filtered.filter((unit) => !unit.is_active);
    }

    return filtered;

    // 실제 API 호출
    /*
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.isActive && params.isActive !== 'all') {
        queryParams.append('isActive', params.isActive === 'active' ? 'true' : 'false');
      }
      if (params?.page) queryParams.append('page', String(params.page));
      if (params?.pageSize) queryParams.append('pageSize', String(params.pageSize));

      const queryString = queryParams.toString();
      const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;

      const response = await api.get<ApiResponse<Unit[]>>(url, { signal });

      return response.data.data || [];
    } catch (error) {
      return handleApiError(error, 'getUnits');
    }
    */
  },

  /**
   * 단일 단위 조회
   */
  async getUnitById(id: string, signal?: AbortSignal): Promise<Unit> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const unit = DUMMY_UNITS.find((u) => u.id === id);
    if (!unit) {
      throw new Error("단위를 찾을 수 없습니다");
    }

    return unit;

    // 실제 API 호출
    /*
    try {
      const response = await api.get<ApiResponse<Unit>>(`${ENDPOINT}/${id}`, { signal });

      return response.data.data || ({} as Unit);
    } catch (error) {
      return handleApiError(error, `getUnitById(${id})`);
    }
    */
  },

  /**
   * 단위 생성
   */
  async createUnit(data: CreateUnitRequest, signal?: AbortSignal): Promise<Unit> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newUnit: Unit = {
      id: String(DUMMY_UNITS.length + 1),
      code: data.code,
      name: data.name,
      description: data.description,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    DUMMY_UNITS.push(newUnit);
    return newUnit;

    // 실제 API 호출
    /*
    try {
      const response = await api.post<ApiResponse<Unit>>(ENDPOINT, data, { signal });

      return response.data.data || ({} as Unit);
    } catch (error) {
      return handleApiError(error, 'createUnit');
    }
    */
  },

  /**
   * 단위 수정
   */
  async updateUnit(id: string, data: UpdateUnitRequest, signal?: AbortSignal): Promise<Unit> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_UNITS.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("단위를 찾을 수 없습니다");
    }

    DUMMY_UNITS[index] = {
      ...DUMMY_UNITS[index],
      code: data.code,
      name: data.name,
      description: data.description,
      is_active: data.is_active,
      updated_at: new Date().toISOString(),
    };

    return DUMMY_UNITS[index];

    // 실제 API 호출
    /*
    try {
      const response = await api.put<ApiResponse<Unit>>(`${ENDPOINT}/${id}`, data, { signal });

      return response.data.data || ({} as Unit);
    } catch (error) {
      return handleApiError(error, `updateUnit(${id})`);
    }
    */
  },

  /**
   * 단위 삭제
   */
  async deleteUnit(id: string, signal?: AbortSignal): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = DUMMY_UNITS.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new Error("단위를 찾을 수 없습니다");
    }

    DUMMY_UNITS.splice(index, 1);

    // 실제 API 호출
    /*
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteUnit(${id})`);
    }
    */
  },
};
