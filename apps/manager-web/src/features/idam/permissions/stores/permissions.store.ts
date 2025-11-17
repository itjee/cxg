/**
 * Permissions Zustand Store
 *
 * UI 상태만 관리합니다.
 * 서버 상태(데이터)는 Apollo Client가 관리합니다.
 *
 * @example
 * const { currentPage, itemsPerPage, formOpen } = usePermissionsStore();
 */

import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface PermissionsStore {
  // ===== UI 상태 =====
  currentPage: number;
  itemsPerPage: number;
  searchText: string;
  formOpen: boolean;
  selectedId: string | null;
  sorting: Array<{ id: string; desc: boolean }>;

  // ===== 액션 =====
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setSearchText: (filter: Updater<string>) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  resetFilters: () => void;
  reset: () => void;
}

const initialState = {
  currentPage: 0,
  itemsPerPage: 20,
  searchText: "",
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const usePermissionsStore = create<PermissionsStore>((set) => ({
  ...initialState,

  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  setSearchText: (filter) =>
    set((state) => ({
      searchText: typeof filter === 'function' ? filter(state.searchText) : filter,
      currentPage: 0,
    })),
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),
  closeForm: () => set({ formOpen: false, selectedId: null }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),
  resetFilters: () =>
    set({
      searchText: "",
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
