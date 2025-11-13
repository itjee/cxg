/**
 * @file onboardings.service.ts
 * @description 온보딩 프로세스 API 서비스
 */

import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import type {
  Onboarding,
  OnboardingListResponse,
  OnboardingDetailResponse,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  OnboardingQueryParams,
} from '../types';

const ENDPOINT = '/manager/tnnt/onboardings';

export const onboardingsService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listOnboardings(
    params?: OnboardingQueryParams,
    signal?: AbortSignal
  ): Promise<OnboardingListResponse> {
    try {
      const response = await api.get<OnboardingListResponse>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          tenant_id: params?.tenant_id,
          step_name: params?.step_name,
          step_status: params?.step_status,
          status: params?.status,
          is_deleted: params?.is_deleted,
        },
        signal,
      });
      return response.data || {
        data: [],
        total: 0,
        page: 1,
        pageSize: 20,
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'listOnboardings');
    }
  },

  /**
   * 상세 조회
   */
  async getOnboarding(id: string, signal?: AbortSignal): Promise<Onboarding> {
    try {
      const response = await api.get<OnboardingDetailResponse>(`${ENDPOINT}/${id}`, { signal });
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getOnboarding(${id})`);
    }
  },

  /**
   * 생성
   */
  async createOnboarding(data: CreateOnboardingRequest): Promise<Onboarding> {
    try {
      const response = await api.post<OnboardingDetailResponse>(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'createOnboarding');
    }
  },

  /**
   * 수정
   */
  async updateOnboarding(
    id: string,
    data: UpdateOnboardingRequest
  ): Promise<Onboarding> {
    try {
      const response = await api.put<OnboardingDetailResponse>(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateOnboarding(${id})`);
    }
  },

  /**
   * 삭제 (논리적 삭제)
   */
  async deleteOnboarding(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteOnboarding(${id})`);
    }
  },

  /**
   * 온보딩 단계 재시도
   */
  async retryOnboardingStep(id: string): Promise<Onboarding> {
    try {
      const response = await api.post<OnboardingDetailResponse>(`${ENDPOINT}/${id}/retry`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `retryOnboardingStep(${id})`);
    }
  },
};
