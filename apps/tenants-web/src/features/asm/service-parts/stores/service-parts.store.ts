/**
 * Service Part Store
 * Zustand 기반 A/S 부품 사용 내역 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface ServicePartStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedPartCondition: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedPartCondition: (partCondition: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useServicePartStore = create<ServicePartStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedPartCondition: '',
  sorting: [],
  currentPage: 0,

  openForm: (editingId = null) =>
    set({ formOpen: true, editingId }),

  closeForm: () =>
    set({ formOpen: false, editingId: null }),

  setEditingId: (id) =>
    set({ editingId: id }),

  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
    })),

  setSelectedPartCondition: (partCondition) =>
    set({ selectedPartCondition: partCondition }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedPartCondition: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
