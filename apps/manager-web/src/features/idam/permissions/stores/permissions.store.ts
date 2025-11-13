/**
 * @file permissions.store.ts
 * @description Permissions Zustand 상태 관리
 */

import { create } from 'zustand';

interface PermissionsStore {
  // UI State
  selectedStatus: 'active' | 'inactive' | '';
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // Actions
  setSelectedStatus: (status: 'active' | 'inactive' | '') => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  setGlobalFilter: (filter: string) => void;
  openForm: (id?: string) => void;
  closeForm: () => void;
  reset: () => void;
}

const initialState = {
  selectedStatus: '' as 'active' | 'inactive' | '',
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
};

export const usePermissionsStore = create<PermissionsStore>((set) => ({
  ...initialState,

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  setGlobalFilter: (filter) => set({ globalFilter: filter, currentPage: 0 }),
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),
  closeForm: () => set({ formOpen: false, selectedId: null }),
  reset: () => set(initialState),
}));
