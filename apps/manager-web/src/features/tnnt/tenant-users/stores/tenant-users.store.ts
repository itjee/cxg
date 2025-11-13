/**
 * @file tenant-users.store.ts
 * @description 테넌트 사용자 관리 Zustand 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { TenantUserStatus } from '../types';

interface TenantUsersStore {
  // UI State
  selectedStatus: TenantUserStatus | '';
  selectedTenantId: string;
  selectedRoleId: string;
  showPrimaryOnly: boolean;
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // Actions
  setSelectedStatus: (status: TenantUserStatus | '') => void;
  setSelectedTenantId: (tenantId: string) => void;
  setSelectedRoleId: (roleId: string) => void;
  setShowPrimaryOnly: (show: boolean) => void;
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
  selectedStatus: '' as TenantUserStatus | '',
  selectedTenantId: '',
  selectedRoleId: '',
  showPrimaryOnly: false,
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const useTenantUsersStore = create<TenantUsersStore>((set) => ({
  ...initialState,

  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setSelectedTenantId: (tenantId) =>
    set({ selectedTenantId: tenantId, currentPage: 0 }),
  setSelectedRoleId: (roleId) => set({ selectedRoleId: roleId, currentPage: 0 }),
  setShowPrimaryOnly: (show) => set({ showPrimaryOnly: show, currentPage: 0 }),
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
      selectedTenantId: '',
      selectedRoleId: '',
      showPrimaryOnly: false,
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
