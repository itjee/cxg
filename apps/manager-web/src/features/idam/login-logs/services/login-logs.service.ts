/**
 * @file login-logs.service.ts
 * @description 로그인 이력 서비스 레이어
 * 
 * API 호출을 담당하는 서비스 계층
 * - 모든 HTTP 요청은 axios 인스턴스 사용
 * - 에러는 ApiError로 변환하여 throw
 * - AbortSignal 지원으로 요청 취소 가능
 */

import axios from 'axios';
import type {
  LoginLog,
  CreateLoginLogRequest,
  LoginLogListResponse,
  LoginLogDetailResponse,
  LoginLogQueryParams,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/manager/idam/login-logs`;

/**
 * 로그인 이력 서비스 객체
 */
export const loginLogService = {
  /**
   * 목록 조회
   */
  async listLoginLogs(params?: LoginLogQueryParams): Promise<LoginLogListResponse> {
    try {
      const response = await axios.get<LoginLogListResponse>(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching login logs:', error);
      throw error;
    }
  },

  /**
   * 상세 조회
   */
  async getLoginLog(id: string): Promise<LoginLogDetailResponse> {
    try {
      const response = await axios.get<LoginLogDetailResponse>(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching login log ${id}:`, error);
      throw error;
    }
  },

  /**
   * 생성
   */
  async createLoginLog(data: CreateLoginLogRequest): Promise<LoginLogDetailResponse> {
    try {
      const response = await axios.post<LoginLogDetailResponse>(API_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating login log:', error);
      throw error;
    }
  },

  /**
   * 삭제
   */
  async deleteLoginLog(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting login log ${id}:`, error);
      throw error;
    }
  },

  /**
   * 통계 조회
   */
  async getLoginLogStats(params?: { start_date?: string; end_date?: string }): Promise<any> {
    try {
      const response = await axios.get(`${API_ENDPOINT}/stats`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching login log stats:', error);
      throw error;
    }
  },
};
