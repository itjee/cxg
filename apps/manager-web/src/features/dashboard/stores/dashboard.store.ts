import { create } from "zustand";

interface DashboardStoreState {
  // UI 상태
  selectedPeriod: "day" | "week" | "month" | "year";
  isRefreshing: boolean;

  // Actions
  setSelectedPeriod: (period: "day" | "week" | "month" | "year") => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
}

/**
 * Dashboard UI 상태 관리
 * - 필터, 정렬, 페이지네이션 등 UI 상태만 관리
 * - 서버 데이터는 Apollo Cache에서 관리
 */
export const useDashboardStore = create<DashboardStoreState>((set) => ({
  // 초기 상태
  selectedPeriod: "month",
  isRefreshing: false,

  // Actions
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
}));
