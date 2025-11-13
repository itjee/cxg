/**
 * NPS Survey Store
 * Zustand 기반 NPS 설문 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface NPSSurveyStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedStatus: string;
  selectedRecommendationReason: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedRecommendationReason: (recommendationReason: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useNPSSurveyStore = create<NPSSurveyStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedRecommendationReason: '',
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

  setSelectedRecommendationReason: (recommendationReason) =>
    set({ selectedRecommendationReason: recommendationReason }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedRecommendationReason: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
