/**
 * @file tasks.store.ts
 * @description Tasks Zustand 스토어
 */

import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface TasksStoreState {
  // 모달 상태
  formOpen: boolean;
  editingId: string | null | undefined;

  // 필터 상태
  globalFilter: string;
  selectedTaskType: string;
  selectedEnabled: string;
  selectedLastRunStatus: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션
  currentPage: number;
  itemsPerPage: number;

  // 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedTaskType: (type: string) => void;
  setSelectedEnabled: (enabled: string) => void;
  setSelectedLastRunStatus: (status: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

export const useTasksStore = create<TasksStoreState>((set) => ({
  formOpen: false,
  editingId: undefined,
  globalFilter: "",
  selectedTaskType: "",
  selectedEnabled: "",
  selectedLastRunStatus: "",
  sorting: [{ id: "next_run_at", desc: false }], // 기본: 다음 실행 시간 순
  currentPage: 0,
  itemsPerPage: 20,

  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: undefined }),
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter:
        typeof filter === "function" ? filter(state.globalFilter) : filter,
    })),
  setSelectedTaskType: (type) => set({ selectedTaskType: type }),
  setSelectedEnabled: (enabled) => set({ selectedEnabled: enabled }),
  setSelectedLastRunStatus: (status) => set({ selectedLastRunStatus: status }),
  resetFilters: () =>
    set({
      globalFilter: "",
      selectedTaskType: "",
      selectedEnabled: "",
      selectedLastRunStatus: "",
      sorting: [{ id: "next_run_at", desc: false }],
    }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
}));
