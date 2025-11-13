/**
 * FAQ Store
 * Zustand 기반 FAQ 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface FAQStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedCategory: string;
  selectedPublished: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedPublished: (published: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useFAQStore = create<FAQStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedCategory: '',
  selectedPublished: '',
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

  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),

  setSelectedPublished: (published) =>
    set({ selectedPublished: published }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedCategory: '',
      selectedPublished: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
