/**
 * @file tenants.service.ts
 * @description 테넌트 관리 서비스 레이어
 *
 * API 호출을 담당하는 서비스 계층
 * - 모든 HTTP 요청은 axios 인스턴스 사용
 * - 에러는 ApiError로 변환하여 throw
 * - AbortSignal 지원으로 요청 취소 가능
 *
 * @example
 * ```typescript
 * const tenants = await tenantService.listTenants({ page: 0, pageSize: 20 });
 * const tenant = await tenantService.getTenant('uuid');
 * ```
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  TenantListResponse,
  TenantDetailResponse,
  TenantQueryParams,
} from "../types";

const ENDPOINT = "/manager/tnnt/tenants";

/**
 * 테넌트 서비스 객체
 */
export const tenantService = {
  /**
   * 목록 조회
   *
   * @param params - 쿼리 파라미터 (페이징, 검색, 필터)
   * @param signal - AbortSignal (요청 취소 가능)
   * @returns TenantListResponse - 페이지네이션 포함 목록
   */
  async listTenants(
    params?: TenantQueryParams,
    signal?: AbortSignal
  ): Promise<TenantListResponse> {
    try {
      const response = await api.get<TenantListResponse>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          status: params?.status,
          type: params?.type,
          is_suspended: params?.is_suspended,
        },
        signal,
      });
      return (
        response.data || {
          data: [],
          total: 0,
          page: 0,
          pageSize: 20,
        }
      );
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listTenants");
    }
  },

  /**
   * 상세 조회
   *
   * @param id - 테넌트 ID
   * @param signal - AbortSignal
   * @returns Tenant - 테넌트 상세 정보
   */
  async getTenant(id: string, signal?: AbortSignal): Promise<Tenant> {
    try {
      const response = await api.get<TenantDetailResponse>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getTenant(${id})`);
    }
  },

  /**
   * 생성
   *
   * @param data - 생성 요청 데이터
   * @returns Tenant - 생성된 테넌트 정보
   */
  async createTenant(data: CreateTenantRequest): Promise<Tenant> {
    try {
      const response = await api.post<TenantDetailResponse>(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createTenant");
    }
  },

  /**
   * 수정
   *
   * @param id - 테넌트 ID
   * @param data - 수정 요청 데이터
   * @returns Tenant - 수정된 테넌트 정보
   */
  async updateTenant(id: string, data: UpdateTenantRequest): Promise<Tenant> {
    try {
      const response = await api.put<TenantDetailResponse>(
        `${ENDPOINT}/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateTenant(${id})`);
    }
  },

  /**
   * 삭제 (논리적 삭제)
   *
   * @param id - 테넌트 ID
   */
  async deleteTenant(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteTenant(${id})`);
    }
  },
};
