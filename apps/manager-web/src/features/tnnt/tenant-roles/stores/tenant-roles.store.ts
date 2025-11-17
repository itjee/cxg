/**
 * @file tenant-roles.store.ts
 * @description 테넌트 역할 관리 Zustand 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { TenantRoleStatus } from '../types';

interface TenantRolesStore {
  // UI State
  selectedStatus: TenantRoleStatus | '';
  selectedTenantId: string;
  showSystemRoles: boolean;
  currentPage: number;
  itemsPerPage: number;
  searchText: string;
  formOpen: boolean;
  selectedId: string | null;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // Actions
  setSelectedStatus: (status: TenantRoleStatus | '') => void;
  setSelectedTenantId: (tenantId: string) => void;
  setShowSystemRoles: (show: boolean) => void;
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
  selectedStatus: '' as TenantRoleStatus | '',
  selectedTenantId: '',
  showSystemRoles: true,
  currentPage: 0,
  itemsPerPage: 20,
  searchText: '',
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const useTenantRolesStore = create<TenantRolesStore>((set) => ({
  ...initialState,

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setSelectedTenantId: (tenantId) =>
    set({ selectedTenantId: tenantId, currentPage: 0 }),
  setShowSystemRoles: (show) => set({ showSystemRoles: show, currentPage: 0 }),
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
      searchText: '',
      selectedStatus: '',
      selectedTenantId: '',
      showSystemRoles: true,
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
