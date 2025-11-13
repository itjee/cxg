/**
 * @file workflows.service.ts
 * @description Workflows 서비스 레이어
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Workflows,
  CreateWorkflowsRequest,
  UpdateWorkflowsRequest,
  WorkflowsListResponse,
  WorkflowsQueryParams,
} from "../types/workflows.types";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const ENDPOINT = "/api/v1/manager/auto/workflows";

/**
 * Workflows 서비스 객체
 */
export const workflowsService = {
  /**
   * 목록 조회
   */
  async listWorkflows(
    params?: WorkflowsQueryParams,
    signal?: AbortSignal
  ): Promise<WorkflowsListResponse> {
    try {
      const response = await api.get<ApiResponse<WorkflowsListResponse>>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          active: params?.active,
        },
        signal,
      });
      
      return response.data.data || { 
        items: [], 
        total: 0, 
        page: 1, 
        page_size: 10,
        total_pages: 0
      };
    } catch (error) {
      throw ApiError.fromAxiosError(error, "listWorkflows");
    }
  },

  /**
   * 상세 조회
   */
  async getWorkflows(id: string, signal?: AbortSignal): Promise<Workflows> {
    try {
      const response = await api.get<ApiResponse<Workflows>>(
        `${ENDPOINT}/${id}`,
        { signal }
      );
      
      if (!response.data.data) {
        throw new Error('Workflows not found');
      }
      
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getWorkflows(${id})`);
    }
  },

  /**
   * 생성
   */
  async createWorkflows(
    data: CreateWorkflowsRequest,
    signal?: AbortSignal
  ): Promise<Workflows> {
    try {
      const response = await api.post<ApiResponse<Workflows>>(ENDPOINT, data, {
        signal,
      });
      return response.data.data || ({} as Workflows);
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createWorkflows");
    }
  },

  /**
   * 수정
   */
  async updateWorkflows(
    id: string,
    data: UpdateWorkflowsRequest,
    signal?: AbortSignal
  ): Promise<Workflows> {
    try {
      const response = await api.put<ApiResponse<Workflows>>(
        `${ENDPOINT}/${id}`,
        data,
        { signal }
      );
      return response.data.data || ({} as Workflows);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateWorkflows(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteWorkflows(id: string, signal?: AbortSignal): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`, { signal });
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteWorkflows(${id})`);
    }
  },
};
