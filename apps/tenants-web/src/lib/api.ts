import axios from "axios";

// API 클라이언트 생성
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 요청 인터셉터 - Authorization 헤더 추가
api.interceptors.request.use(
  (config) => {
    // localStorage 또는 Zustand store에서 토큰 가져오기
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401 Unauthorized - 인증 실패 시 스토어 초기화
    if (error.response?.status === 401) {
      // 동적 import로 circular dependency 방지
      if (typeof window !== "undefined") {
        const { useAuthStore } = await import("@/shared/stores/auth/auth.store");
        useAuthStore.getState().clearAuth();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(error);
  }
);
