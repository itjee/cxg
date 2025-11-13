/**
 * @file executions.service.ts
 * @description Executions API 서비스
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Execution,
  ExecutionsListResponse,
  CreateExecutionRequest,
  UpdateExecutionRequest,
  ExecutionsQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/auto/executions";

export const executionsService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listExecutions(
    params?: ExecutionsQueryParams,
    signal?: AbortSignal
  ): Promise<ExecutionsListResponse> {
    try {
      const response = await api.get<{ data: ExecutionsListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          status: params?.status,
          trigger_source: params?.trigger_source,
          workflow_id: params?.workflow_id,
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
      throw ApiError.fromAxiosError(error, "listExecutions");
    }
  },

  /**
   * 상세 조회
   */
  async getExecution(id: string): Promise<Execution> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getExecution(${id})`);
    }
  },

  /**
   * 생성
   */
  async createExecution(data: CreateExecutionRequest): Promise<Execution> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createExecution");
    }
  },

  /**
   * 수정
   */
  async updateExecution(
    id: string,
    data: UpdateExecutionRequest
  ): Promise<Execution> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateExecution(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteExecution(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteExecution(${id})`);
    }
  },
};
