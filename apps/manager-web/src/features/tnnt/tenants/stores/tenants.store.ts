/**
 * Tenants Zustand Store
 *
 * UI 상태만 관리합니다.
 * 서버 상태(데이터)는 Apollo Client가 관리합니다.
 *
 * @example
 * const { currentPage, itemsPerPage, formOpen } = useTenantsStore();
 */

import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface TenantsStore {
  // ===== UI 상태 =====
  currentPage: number;
  itemsPerPage: number;
  searchText: string;
  selectedStatus: string | null;
  formOpen: boolean;
  selectedId: string | null;
  sorting: Array<{ id: string; desc: boolean }>;

  // ===== 액션 =====
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setSearchText: (text: Updater<string>) => void;
  setSelectedStatus: (status: string | null) => void;
  setSelectedId: (id: string | null) => void;
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
  selectedStatus: null,
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const useTenantsStore = create<TenantsStore>((set) => ({
  ...initialState,

  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  setSearchText: (text) =>
    set((state) => ({
      searchText: typeof text === "function" ? text(state.searchText) : text,
      currentPage: 0,
    })),
  setSelectedStatus: (status) =>
    set({
      selectedStatus: status,
      currentPage: 0,
    }),
  setSelectedId: (id) => set({ selectedId: id }),
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),
  closeForm: () => set({ formOpen: false, selectedId: null }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
    })),
  resetFilters: () =>
    set({
      searchText: "",
      selectedStatus: null,
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
