/**
 * Code Rule Store
 * Zustand 기반 코드 규칙 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { ResetCycle } from '../types';

interface CodeRuleStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedResetCycle: ResetCycle | 'all';
  selectedStatus: string; // 'all' | 'active' | 'inactive'

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션 상태
  currentPage: number;
  itemsPerPage: number;

  // Form 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;

  // Filter 액션
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedResetCycle: (cycle: ResetCycle | 'all') => void;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
}

export const useCodeRuleStore = create<CodeRuleStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedResetCycle: 'all',
  selectedStatus: 'all',
  sorting: [],
  currentPage: 0,
  itemsPerPage: 10,

  // Form 액션
  openForm: (editingId = null) =>
    set({ formOpen: true, editingId }),

  closeForm: () =>
    set({ formOpen: false, editingId: null }),

  setEditingId: (id) =>
    set({ editingId: id }),

  // Filter 액션
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
    })),

  setSelectedResetCycle: (cycle) =>
    set({ selectedResetCycle: cycle }),

  setSelectedStatus: (status) =>
    set({ selectedStatus: status }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedResetCycle: 'all',
      selectedStatus: 'all',
      sorting: [],
    }),

  // 정렬 액션
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  // 페이지네이션 액션
  setCurrentPage: (page) =>
    set({ currentPage: page }),

  setItemsPerPage: (itemsPerPage) =>
    set({ itemsPerPage, currentPage: 0 }),
}));
