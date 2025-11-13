/**
 * Code Group Service
 * API를 통한 코드그룹 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  CodeGroup,
  CreateCodeGroupRequest,
  UpdateCodeGroupRequest,
  EnvelopeResponse,
  CodeGroupFilterParams,
  CodeGroupListResponse,
} from "../types/code-groups.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface CodeGroupServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: CodeGroupServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'CodeGroupServiceError';

  console.error(`[CodeGroupService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/code-groups';

export const codeGroupService = {
  /**
   * 코드그룹 목록 조회 (페이지네이션 포함)
   */
  async listCodeGroups(
    params?: CodeGroupFilterParams,
    signal?: AbortSignal
  ): Promise<CodeGroupListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.is_active !== undefined && params?.is_active !== null) {
        queryParams.append("is_active", String(params.is_active));
      }
      if (params?.is_system !== undefined && params?.is_system !== null) {
        queryParams.append("is_system", String(params.is_system));
      }
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.page_size)
        queryParams.append("page_size", String(params.page_size));

      const queryString = queryParams.toString();
      const url = queryString
        ? `${ENDPOINT}?${queryString}`
        : ENDPOINT;

      const response = await api.get<ApiResponse<CodeGroupListResponse>>(
        url,
        { signal }
      );

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
      return handleApiError(error, 'listCodeGroups');
    }
  },

  /**
   * 단일 코드그룹 조회
   */
  async getCodeGroup(id: string, signal?: AbortSignal): Promise<CodeGroup> {
    try {
      const response = await api.get<ApiResponse<CodeGroup>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );

      return response.data.data || ({} as CodeGroup);
    } catch (error) {
      return handleApiError(error, `getCodeGroup(${id})`);
    }
  },

  /**
   * 코드그룹 생성
   */
  async createCodeGroup(
    data: CreateCodeGroupRequest,
    signal?: AbortSignal
  ): Promise<CodeGroup> {
    try {
      const response = await api.post<ApiResponse<CodeGroup>>(
        ENDPOINT,
        {
          code: data.code,
          name: data.name,
          description: data.description,
          is_system: data.is_system || false,
          is_active: data.is_active !== false,
        },
        { signal }
      );

      return response.data.data || ({} as CodeGroup);
    } catch (error) {
      return handleApiError(error, 'createCodeGroup');
    }
  },

  /**
   * 코드그룹 수정
   */
  async updateCodeGroup(
    id: string,
    data: UpdateCodeGroupRequest,
    signal?: AbortSignal
  ): Promise<CodeGroup> {
    try {
      const response = await api.put<ApiResponse<CodeGroup>>(
        `${ENDPOINT}/${id}`,
        {
          code: data.code,
          name: data.name,
          description: data.description,
          is_system: data.is_system,
          is_active: data.is_active,
        },
        { signal }
      );

      return response.data.data || ({} as CodeGroup);
    } catch (error) {
      return handleApiError(error, `updateCodeGroup(${id})`);
    }
  },

  /**
   * 코드그룹 삭제
   */
  async deleteCodeGroup(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteCodeGroup(${id})`);
    }
  },
};
