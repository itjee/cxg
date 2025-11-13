/**
 * Setting Service
 * API를 통한 설정정보 데이터 관리
 */

import { api } from "@/lib/api";
import type {
  Setting,
  CreateSettingRequest,
  UpdateSettingRequest,
  EnvelopeResponse,
  SettingFilterParams,
  SettingListResponse,
} from "../types/settings.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface SettingServiceError extends Error {
  code?: string;
  status?: number;
}

/**
 * API 에러를 구조화된 에러로 변환
 */
const handleApiError = (error: any, context: string) => {
  const err: SettingServiceError = new Error(
    error.response?.data?.message ||
      error.message ||
      '요청 처리 중 오류가 발생했습니다.'
  );
  err.code = error.response?.data?.error || 'UNKNOWN_ERROR';
  err.status = error.response?.status;
  err.name = 'SettingServiceError';

  console.error(`[SettingService] ${context}:`, {
    message: err.message,
    code: err.code,
    status: err.status,
  });

  throw err;
};

const ENDPOINT = '/adm/settings';

export const settingService = {
  /**
   * 설정정보 목록 조회 (페이지네이션 포함)
   */
  async getSettings(
    params?: SettingFilterParams,
    signal?: AbortSignal
  ): Promise<SettingListResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.search) queryParams.append("search", params.search);
      if (params?.category) queryParams.append("category", params.category);
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

      const response = await api.get<ApiResponse<SettingListResponse>>(
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
      return handleApiError(error, 'getSettings');
    }
  },

  /**
   * 단일 설정정보 조회
   */
  async getSettingById(id: string, signal?: AbortSignal): Promise<Setting> {
    try {
      const response = await api.get<ApiResponse<Setting>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );

      return response.data.data || ({} as Setting);
    } catch (error) {
      return handleApiError(error, `getSettingById(${id})`);
    }
  },

  /**
   * 설정정보 생성
   */
  async createSetting(
    data: CreateSettingRequest,
    signal?: AbortSignal
  ): Promise<Setting> {
    try {
      const response = await api.post<ApiResponse<Setting>>(
        ENDPOINT,
        {
          key: data.key,
          value: data.value,
          value_type: data.value_type,
          default_value: data.default_value,
          description: data.description,
          category: data.category,
          is_active: data.is_active !== false,
          is_system: data.is_system || false,
          is_encrypted: data.is_encrypted || false,
        },
        { signal }
      );

      return response.data.data || ({} as Setting);
    } catch (error) {
      return handleApiError(error, 'createSetting');
    }
  },

  /**
   * 설정정보 수정
   */
  async updateSetting(
    id: string,
    data: UpdateSettingRequest,
    signal?: AbortSignal
  ): Promise<Setting> {
    try {
      const response = await api.put<ApiResponse<Setting>>(
        `${ENDPOINT}/${id}`,
        {
          key: data.key,
          value: data.value,
          value_type: data.value_type,
          default_value: data.default_value,
          description: data.description,
          category: data.category,
          is_active: data.is_active,
          is_system: data.is_system,
          is_encrypted: data.is_encrypted,
        },
        { signal }
      );

      return response.data.data || ({} as Setting);
    } catch (error) {
      return handleApiError(error, `updateSetting(${id})`);
    }
  },

  /**
   * 설정정보 삭제
   */
  async deleteSetting(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      return handleApiError(error, `deleteSetting(${id})`);
    }
  },
};
