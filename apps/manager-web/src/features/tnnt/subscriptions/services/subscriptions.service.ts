/**
 * @file subscriptions.service.ts
 * @description 구독 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionListResponse,
  SubscriptionDetailResponse,
  SubscriptionQueryParams,
} from "../types/subscriptions.types";

const ENDPOINT = "/manager/tnnt/subscriptions";

/**
 * 구독 서비스 객체
 */
export const subscriptionsService = {
  /**
   * 목록 조회
   */
  async listSubscriptions(
    params?: SubscriptionQueryParams,
    signal?: AbortSignal
  ): Promise<SubscriptionListResponse> {
    try {
      const response = await api.get<SubscriptionListResponse>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          tenant_id: params?.tenant_id,
          plan_id: params?.plan_id,
          status: params?.status,
          billing_cycle: params?.billing_cycle,
          auto_renewal: params?.auto_renewal,
          is_deleted: params?.is_deleted,
        },
        signal,
      });

      return (
        response.data || {
          data: [],
          total: 0,
          page: 1,
          pageSize: 20,
        }
      );
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listSubscriptions");
    }
  },

  /**
   * 상세 조회
   */
  async getSubscription(
    id: string,
    signal?: AbortSignal
  ): Promise<Subscription> {
    try {
      const response = await api.get<SubscriptionDetailResponse>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getSubscription(${id})`);
    }
  },

  /**
   * 생성
   */
  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<Subscription> {
    try {
      const response = await api.post<SubscriptionDetailResponse>(
        ENDPOINT,
        data
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createSubscription");
    }
  },

  /**
   * 수정
   */
  async updateSubscription(
    id: string,
    data: UpdateSubscriptionRequest
  ): Promise<Subscription> {
    try {
      const response = await api.put<SubscriptionDetailResponse>(
        `${ENDPOINT}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateSubscription(${id})`);
    }
  },

  /**
   * 삭제 (논리적 삭제)
   */
  async deleteSubscription(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteSubscription(${id})`);
    }
  },
};
