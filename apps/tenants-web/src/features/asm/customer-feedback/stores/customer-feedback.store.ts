/**
 * Customer Feedback Store
 * Zustand 기반 고객 피드백 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface CustomerFeedbackStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedStatus: string;
  selectedTransactionType: string;
  selectedRating: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedTransactionType: (transactionType: string) => void;
  setSelectedRating: (rating: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useCustomerFeedbackStore = create<CustomerFeedbackStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedTransactionType: '',
  selectedRating: '',
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

  setSelectedTransactionType: (transactionType) =>
    set({ selectedTransactionType: transactionType }),

  setSelectedRating: (rating) =>
    set({ selectedRating: rating }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedTransactionType: '',
      selectedRating: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
