/**
 * @file users.store.ts
 * @description Users Zustand 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface UsersStore {
  // UI State
  selectedStatus: 'active' | 'inactive' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  
  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // Actions
  setSelectedStatus: (status: 'active' | 'inactive' | '') => void;
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
  selectedStatus: '' as 'active' | 'inactive' | '',
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
