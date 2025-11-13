/**
 * @file plans.service.ts
 * @description 요금제 관리 API 서비스 (에러 처리, Parameter Mapping 포함)
 */

import { api } from '@/lib/api';
import { ApiError } from '@/lib/errors';
import type {
  Plan,
  PlansListResponse,
  CreatePlanRequest,
  UpdatePlanRequest,
  PlanQueryParams,
} from '../types';

const ENDPOINT = '/api/v1/manager/bill/plans';

export const plansService = {
  /**
   * 목록 조회 (서버 사이드 페이징, 필터링, 정렬 지원)
   *
   * camelCase → snake_case 변환 처리:
   * - pageSize → page_size
   * - sort_by / sort_order → sort_by / sort_order
   */
  async listPlans(
    params?: PlanQueryParams,
    signal?: AbortSignal
  ): Promise<PlansListResponse> {
    try {
      const response = await api.get<{ data: PlansListResponse }>(ENDPOINT, {
        params: {
          // 페이지네이션
          page: params?.page,
          page_size: params?.pageSize,        // ⭐ Parameter Mapping

          // 필터링
          search: params?.search,
          status: params?.status,
          type: params?.type,
          billing_cycle: params?.billing_cycle,

          // 정렬
          sort_by: params?.sort_by,           // ⭐ Parameter Mapping
          sort_order: params?.sort_order,     // ⭐ Parameter Mapping
        },
        signal,  // ⭐ AbortSignal for request cancellation
      });

      // 응답 데이터 검증 및 기본값 제공
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
      // ⭐ ApiError로 변환하여 일관된 에러 처리
      throw ApiError.fromAxiosError(error, 'listPlans');
    }
  },

  /**
   * 단일 요금제 조회
   */
  async getPlan(id: string, signal?: AbortSignal): Promise<Plan> {
    try {
      const response = await api.get<{ data: Plan }>(`${ENDPOINT}/${id}`, {
        signal,
      });
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getPlan(${id})`);
    }
  },

  /**
   * 요금제 생성
   */
  async createPlan(data: CreatePlanRequest): Promise<Plan> {
    try {
      const response = await api.post<{ data: Plan }>(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, 'createPlan');
    }
  },

  /**
   * 요금제 수정
   */
  async updatePlan(
    id: string,
    data: UpdatePlanRequest
  ): Promise<Plan> {
    try {
      const response = await api.put<{ data: Plan }>(
        `${ENDPOINT}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updatePlan(${id})`);
    }
  },

  /**
   * 요금제 삭제
   */
  async deletePlan(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deletePlan(${id})`);
    }
  },
};
