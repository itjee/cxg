/**
 * @file executions.store.ts
 * @description Executions Zustand 스토어
 * 
 * 역할:
 * - UI 상태 관리 (모달, 필터, 정렬, 페이징)
 */

import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface ExecutionsStoreState {
  // 모달 상태
  formOpen: boolean;
  editingId: string | null;

  // 필터 상태
  searchText: string;
  selectedStatus: string;
  selectedTriggerSource: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션
  currentPage: number;
  itemsPerPage: number;

  // 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setSearchText: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedTriggerSource: (source: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

export const useExecutionsStore = create<ExecutionsStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  searchText: "",
  selectedStatus: "",
  selectedTriggerSource: "",
  sorting: [{ id: "started_at", desc: true }], // 기본: 최신 실행 순
  currentPage: 0,
  itemsPerPage: 20,

  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: null }),
  setSearchText: (filter) =>
    set((state) => ({
      searchText:
        typeof filter === "function" ? filter(state.searchText) : filter,
    })),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedTriggerSource: (source) => set({ selectedTriggerSource: source }),
  resetFilters: () =>
    set({
      searchText: "",
      selectedStatus: "",
      selectedTriggerSource: "",
      sorting: [{ id: "started_at", desc: true }],
    }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
}));
