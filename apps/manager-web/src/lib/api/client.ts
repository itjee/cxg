/**
 * API 클라이언트 설정
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// API 베이스 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100/api/v1";

// Axios 인스턴스 생성
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage에서 액세스 토큰 가져오기
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답이지만 success=false인 경우 에러로 처리
    if (response.data && response.data.success === false) {
      const error = response.data.error;
      const apiError: any = new Error(error?.message || "요청 처리 중 오류가 발생했습니다.");
      apiError.code = error?.code;
      apiError.detail = error?.detail;
      apiError.response = response;
      return Promise.reject(apiError);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 백엔드 에러 응답 구조 확인
    const responseData = error.response?.data as any;
    if (responseData && responseData.error) {
      // 백엔드 에러 구조를 Error 객체에 추가
      const apiError: any = new Error(responseData.error.message || "요청 처리 중 오류가 발생했습니다.");
      apiError.code = responseData.error.code;
      apiError.detail = responseData.error.detail;
      apiError.response = error.response;

      // 401 Unauthorized 처리
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 리프레시 토큰으로 새 액세스 토큰 발급
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/manager/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { access_token, refresh_token: newRefreshToken } = response.data.data;

            // 새 토큰 저장
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", newRefreshToken);

            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // 리프레시 실패 시 로그아웃 처리
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");

          // 로그인 페이지로 리다이렉트
          if (typeof window !== "undefined") {
            window.location.href = "/signin";
          }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);
