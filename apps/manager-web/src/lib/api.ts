// API 클라이언트 설정
import axios, { AxiosError, AxiosResponse } from "axios";
import type { EnvelopeResponse, ErrorDetail } from '@/shared/types';
import type { ApiError } from '@/shared/types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // localStorage 또는 쿠키에서 토큰 가져오기
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("access_token");

      // localStorage에 없으면 쿠키에서 가져오기
      if (!token) {
        token = ( document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1] ?? null);
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response: AxiosResponse<EnvelopeResponse<unknown>>) => {
    // 응답 래퍼에서 데이터 추출
    if (response.data && "success" in response.data) {
      if (!response.data.success && response.data.error) {
        const error: ApiError = new Error(response.data.error.message);
        error.code = response.data.error.code;
        error.detail = response.data.error.detail;
        throw error;
      }
    }
    return response;
  },
  async (error: AxiosError<EnvelopeResponse<unknown>>) => {
    if (error.response?.status === 401) {
      // 인증 오류 처리
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // 쿠키도 제거
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/signin";
      }
    }

    // 오류 변환
    const apiError: ApiError = new Error(
      error.response?.data?.error?.message || error.message || "오류가 발생했습니다"
    );
    apiError.code = error.response?.data?.error?.code;
    apiError.status = error.response?.status;
    apiError.detail = error.response?.data?.error?.detail;

    return Promise.reject(apiError);
  }
);

// 응답 래퍼를 풀어내는 헬퍼 함수
export function unwrapEnvelope<T>(response: AxiosResponse<EnvelopeResponse<T>>): T {
  if (response.data.success && response.data.data !== null) {
    return response.data.data;
  }
  throw new Error(response.data.error?.message || "알 수 없는 오류");
}
