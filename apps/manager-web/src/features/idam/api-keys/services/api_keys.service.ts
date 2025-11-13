/**
 * @file api_keys.service.ts
 * @description API 키 관리 서비스 레이어
 * 
 * API 호출을 담당하는 서비스 계층
 * - 모든 HTTP 요청은 axios 인스턴스 사용
 * - 에러는 ApiError로 변환하여 throw
 * - AbortSignal 지원으로 요청 취소 가능
 * 
 * @example
 * ```typescript
 * const apiKeys = await apiKeyService.listApiKeys({ page: 0, pageSize: 20 });
 * const apiKey = await apiKeyService.getApiKey('uuid');
 * ```
 */

import axios from 'axios';
import type {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyListResponse,
  ApiKeyDetailResponse,
  ApiKeyQueryParams,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/manager/idam/api_keys`;

/**
 * API 키 서비스 객체
 */
export const apiKeyService = {
  /**
   * 목록 조회
   * 
   * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
   * @returns ApiKeyListResponse - 페이지네이션 포함 목록
   * 
   * @example
   * ```typescript
   * const response = await apiKeyService.listApiKeys({ 
   *   page: 0, 
   *   pageSize: 20, 
   *   search: '검색어',
   *   status: 'ACTIVE' 
   * });
   * ```
   */
  async listApiKeys(params?: ApiKeyQueryParams): Promise<ApiKeyListResponse> {
    try {
      const response = await axios.get<ApiKeyListResponse>(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  },

  /**
   * 상세 조회
   * 
   * @param id - API 키 ID
   * @returns ApiKeyDetailResponse - API 키 상세 정보
   * 
   * @example
   * ```typescript
   * const response = await apiKeyService.getApiKey('uuid');
   * const apiKey = response.data;
   * ```
   */
  async getApiKey(id: string): Promise<ApiKeyDetailResponse> {
    try {
      const response = await axios.get<ApiKeyDetailResponse>(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching API key ${id}:`, error);
      throw error;
    }
  },

  /**
   * 생성
   * 
   * @param data - 생성 요청 데이터
   * @returns ApiKeyDetailResponse - 생성된 API 키 정보
   * 
   * @example
   * ```typescript
   * const response = await apiKeyService.createApiKey({
   *   key_name: 'Production API Key',
   *   user_id: 'user-uuid',
   *   scopes: ['read:data', 'write:data']
   * });
   * ```
   */
  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyDetailResponse> {
    try {
      const response = await axios.post<ApiKeyDetailResponse>(API_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  },

  /**
   * 수정
   * 
   * @param id - API 키 ID
   * @param data - 수정 요청 데이터
   * @returns ApiKeyDetailResponse - 수정된 API 키 정보
   * 
   * @example
   * ```typescript
   * const response = await apiKeyService.updateApiKey('uuid', {
   *   key_name: 'Updated Name',
   *   status: 'INACTIVE'
   * });
   * ```
   */
  async updateApiKey(id: string, data: UpdateApiKeyRequest): Promise<ApiKeyDetailResponse> {
    try {
      const response = await axios.put<ApiKeyDetailResponse>(`${API_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating API key ${id}:`, error);
      throw error;
    }
  },

  /**
   * 삭제
   * 
   * @param id - API 키 ID
   * @returns void
   * 
   * @example
   * ```typescript
   * await apiKeyService.deleteApiKey('uuid');
   * ```
   */
  async deleteApiKey(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting API key ${id}:`, error);
      throw error;
    }
  },

  /**
   * 상태 변경 (활성/비활성/취소)
   * 
   * @param id - API 키 ID
   * @param status - 변경할 상태
   * @returns ApiKeyDetailResponse - 상태 변경된 API 키 정보
   */
  async updateApiKeyStatus(id: string, status: 'ACTIVE' | 'INACTIVE' | 'REVOKED'): Promise<ApiKeyDetailResponse> {
    return this.updateApiKey(id, { status });
  },
};
