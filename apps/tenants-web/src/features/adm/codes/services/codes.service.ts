/**
 * Code Service
 * API를 통한 코드 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Code,
  CreateCodeRequest,
  UpdateCodeRequest,
  EnvelopeResponse,
  CodeFilterParams,
  CodeListResponse,
} from "../types/codes.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CodeServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: CodeServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'CodeServiceError';

  console.error(`[CodeService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/codes';

export const codeService = {
  /**
   * 코드 목록 조회 (페이지네이션 포함)
   */
  async listCodes(
    params?: CodeFilterParams,
    signal?: AbortSignal
  ): Promise<CodeListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.code_group_id)
        queryParams.append("code_group_id", params.code_group_id);
      if (params?.is_active !== undefined && params?.is_active !== null) {
        queryParams.append("is_active", String(params.is_active));
      }
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.page_size)
        queryParams.append("page_size", String(params.page_size));

      const queryString = queryParams.toString();
      const url = queryString
        ? `${ENDPOINT}?${queryString}`
        : ENDPOINT;

      const response = await api.get<ApiResponse<CodeListResponse>>(url, { signal });

      return (
        response.data.data || {
          items: [],
          total: 0,
          page: params?.page || 1,
          page_size: params?.page_size || 20,
          total_pages: 0,
        }
      );
    } catch (error) {
      return handleApiError(error, 'listCodes');
    }
  },

  /**
   * 단일 코드 조회
   */
  async getCode(id: string, signal?: AbortSignal): Promise<Code> {
    try {
      const response = await api.get<ApiResponse<Code>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );

      return response.data.data || ({} as Code);
    } catch (error) {
      return handleApiError(error, `getCode(${id})`);
    }
  },

  /**
   * 코드 생성
   */
  async createCode(
    data: CreateCodeRequest,
    signal?: AbortSignal
  ): Promise<Code> {
    try {
      const response = await api.post<ApiResponse<Code>>(
        ENDPOINT,
        {
          code_group_id: data.code_group_id,
          code: data.code,
          name: data.name,
          value: data.value,
          description: data.description,
          display_order: data.display_order,
        },
        { signal }
      );

      return response.data.data || ({} as Code);
    } catch (error) {
      return handleApiError(error, 'createCode');
    }
  },

  /**
   * 코드 수정
   */
  async updateCode(
    id: string,
    data: UpdateCodeRequest,
    signal?: AbortSignal
  ): Promise<Code> {
    try {
      const response = await api.put<ApiResponse<Code>>(
        `${ENDPOINT}/${id}`,
        {
          code_group_id: data.code_group_id,
          code: data.code,
          name: data.name,
          value: data.value,
          description: data.description,
          display_order: data.display_order,
          is_active: data.is_active,
        },
        { signal }
      );

      return response.data.data || ({} as Code);
    } catch (error) {
      return handleApiError(error, `updateCode(${id})`);
    }
  },

  /**
   * 코드 삭제
   */
  async deleteCode(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteCode(${id})`);
    }
  },
};
