/**
 * Support Ticket Store
 * Zustand 기반 고객 지원 티켓 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface SupportTicketStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedStatus: string;
  selectedPriority: string;
  selectedCategory: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedPriority: (priority: string) => void;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useSupportTicketStore = create<SupportTicketStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedPriority: '',
  selectedCategory: '',
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

  setSelectedStatus: (status) =>
    set({ selectedStatus: status }),

  setSelectedPriority: (priority) =>
    set({ selectedPriority: priority }),

  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedPriority: '',
      selectedCategory: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
