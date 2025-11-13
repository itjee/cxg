/**
 * Interactions Store
 * Zustand 기반 interactions 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface InteractionsStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedType: string;
  selectedStatus: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedType: (type: string) => void;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useInteractionsStore = create<InteractionsStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedType: '',
  selectedStatus: '',
  sorting: [],
  currentPage: 0,
  itemsPerPage: 10,
  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: null }),
  setEditingId: (id) => set({ editingId: id }),
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
    })),
  setSelectedType: (type) => set({ selectedType: type }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  resetFilters: () => set({ globalFilter: '', selectedType: '', selectedStatus: '', sorting: [] }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
