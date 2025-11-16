/**
 * 역할 Zustand Store
 *
 * UI 상태만 관리합니다.
 * 서버 상태(데이터)는 Apollo Client가 관리합니다.
 *
 * @example
 * const { selectedStatus, currentPage, setSelectedStatus } = useRolesStore();
 */

import { create } from 'zustand';

interface RolesStore {
  // ===== UI 상태 =====
  selectedStatus: string;
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // ===== 액션 =====
  setSelectedStatus: (status: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setGlobalFilter: (filter: string) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  resetFilters: () => void;
  reset: () => void;
}

const initialState = {
  selectedStatus: '',
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
};

/**
 * 역할 UI 상태 스토어
 */
export const useRolesStore = create<RolesStore>((set) => ({
  ...initialState,

  // UI 상태 변경 - 상태 필터링
  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),

  // UI 상태 변경 - 페이지 이동
  setCurrentPage: (page) => set({ currentPage: page }),

  // UI 상태 변경 - 페이지 크기
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),

  // UI 상태 변경 - 전역 필터 (검색어)
  setGlobalFilter: (filter) => set({ globalFilter: filter, currentPage: 0 }),

  // UI 상태 변경 - 폼 열기
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),

  // UI 상태 변경 - 폼 닫기
  closeForm: () => set({ formOpen: false, selectedId: null }),

  // UI 상태 변경 - 필터 리셋
  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      currentPage: 0,
    }),

  // UI 상태 변경 - 전체 리셋
  reset: () => set(initialState),
}));
