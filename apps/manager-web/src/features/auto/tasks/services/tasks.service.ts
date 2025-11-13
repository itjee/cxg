/**
 * @file tasks.service.ts
 * @description Tasks API 서비스
 */

import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type {
  Task,
  TasksListResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
  TasksQueryParams,
} from "../types";

const ENDPOINT = "/api/v1/auto/tasks";

export const tasksService = {
  /**
   * 목록 조회 (서버 사이드 페이징)
   */
  async listTasks(
    params?: TasksQueryParams,
    signal?: AbortSignal
  ): Promise<TasksListResponse> {
    try {
      const response = await api.get<{ data: TasksListResponse }>(ENDPOINT, {
        params: {
          page: params?.page,
          page_size: params?.pageSize,
          search: params?.search,
          task_type: params?.task_type,
          enabled: params?.enabled,
          last_run_status: params?.last_run_status,
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
      throw ApiError.fromAxiosError(error, "listTasks");
    }
  },

  /**
   * 상세 조회
   */
  async getTask(id: string): Promise<Task> {
    try {
      const response = await api.get(`${ENDPOINT}/${id}`);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `getTask(${id})`);
    }
  },

  /**
   * 생성
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post(ENDPOINT, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, "createTask");
    }
  },

  /**
   * 수정
   */
  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await api.put(`${ENDPOINT}/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw ApiError.fromAxiosError(error, `updateTask(${id})`);
    }
  },

  /**
   * 삭제
   */
  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `deleteTask(${id})`);
    }
  },

  /**
   * 지금 실행
   */
  async runTaskNow(id: string): Promise<void> {
    try {
      await api.post(`${ENDPOINT}/${id}/run`);
    } catch (error) {
      throw ApiError.fromAxiosError(error, `runTaskNow(${id})`);
    }
  },
};
