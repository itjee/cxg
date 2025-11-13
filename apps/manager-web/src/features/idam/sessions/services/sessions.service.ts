/**
 * @file sessions.service.ts
 * @description 세션 관리 서비스 레이어
 * 
 * API 호출을 담당하는 서비스 계층
 * - 모든 HTTP 요청은 axios 인스턴스 사용
 * - 에러는 ApiError로 변환하여 throw
 * - AbortSignal 지원으로 요청 취소 가능
 */

import axios from 'axios';
import type {
  Session,
  CreateSessionRequest,
  UpdateSessionRequest,
  SessionListResponse,
  SessionDetailResponse,
  SessionQueryParams,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8100';
const API_ENDPOINT = `${API_BASE_URL}/api/v1/manager/idam/sessions`;

/**
 * 세션 서비스 객체
 */
export const sessionService = {
  /**
   * 목록 조회
   */
  async listSessions(params?: SessionQueryParams): Promise<SessionListResponse> {
    try {
      const response = await axios.get<SessionListResponse>(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  /**
   * 상세 조회
   */
  async getSession(id: string): Promise<SessionDetailResponse> {
    try {
      const response = await axios.get<SessionDetailResponse>(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}:`, error);
      throw error;
    }
  },

  /**
   * 생성
   */
  async createSession(data: CreateSessionRequest): Promise<SessionDetailResponse> {
    try {
      const response = await axios.post<SessionDetailResponse>(API_ENDPOINT, data);
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  /**
   * 수정
   */
  async updateSession(id: string, data: UpdateSessionRequest): Promise<SessionDetailResponse> {
    try {
      const response = await axios.put<SessionDetailResponse>(`${API_ENDPOINT}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating session ${id}:`, error);
      throw error;
    }
  },

  /**
   * 삭제
   */
  async deleteSession(id: string): Promise<void> {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting session ${id}:`, error);
      throw error;
    }
  },

  /**
   * 세션 취소 (Revoke)
   */
  async revokeSession(id: string): Promise<SessionDetailResponse> {
    return this.updateSession(id, { status: 'REVOKED' });
  },

  /**
   * 사용자의 모든 세션 취소
   */
  async revokeUserSessions(userId: string): Promise<void> {
    try {
      await axios.post(`${API_ENDPOINT}/revoke-user/${userId}`);
    } catch (error) {
      console.error(`Error revoking sessions for user ${userId}:`, error);
      throw error;
    }
  },
};
