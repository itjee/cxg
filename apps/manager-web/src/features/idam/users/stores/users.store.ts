/**
 * Users Zustand Store
 *
 * UI 상태만 관리합니다.
 * 서버 상태(데이터)는 Apollo Client가 관리합니다.
 *
 * @example
 * const { selectedStatus, currentPage, setSelectedStatus } = useUsersStore();
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface UsersStore {
  // ===== UI 상태 =====
  selectedStatus: 'ACTIVE' | 'INACTIVE' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  sorting: Array<{ id: string; desc: boolean }>;

  // ===== 액션 =====
  setSelectedStatus: (status: 'ACTIVE' | 'INACTIVE' | '') => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  resetFilters: () => void;
  reset: () => void;
}

const initialState = {
  selectedStatus: '' as 'ACTIVE' | 'INACTIVE' | '',
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const useUsersStore = create<UsersStore>((set) => ({
  ...initialState,

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
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
      globalFilter: '',
      selectedStatus: '',
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
