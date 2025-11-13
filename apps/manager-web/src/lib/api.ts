// API client configuration
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

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie
    if (typeof window !== "undefined") {
      let token = localStorage.getItem("access_token");
      
      // If not in localStorage, try to get from cookie
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

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<EnvelopeResponse<unknown>>) => {
    // Extract data from envelope if present
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
      // Handle unauthorized
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Remove cookies as well
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/signin";
      }
    }

    // Transform error
    const apiError: ApiError = new Error(
      error.response?.data?.error?.message || error.message || "An error occurred"
    );
    apiError.code = error.response?.data?.error?.code;
    apiError.status = error.response?.status;
    apiError.detail = error.response?.data?.error?.detail;

    return Promise.reject(apiError);
  }
);

// Helper function to unwrap envelope response
export function unwrapEnvelope<T>(response: AxiosResponse<EnvelopeResponse<T>>): T {
  if (response.data.success && response.data.data !== null) {
    return response.data.data;
  }
  throw new Error(response.data.error?.message || "Unknown error");
}
