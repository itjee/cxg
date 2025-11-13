/**
 * @file onboardings.store.ts
 * @description 온보딩 프로세스 Zustand 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { OnboardingStepName, OnboardingStepStatus } from '../types/onboardings.types';

interface OnboardingsStore {
  // UI State
  selectedStepName: OnboardingStepName | '';
  selectedStepStatus: OnboardingStepStatus | '';
  selectedTenantId: string;
  currentPage: number;
  itemsPerPage: number;
  globalFilter: string;
  formOpen: boolean;
  selectedId: string | null;
  
  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // Actions
  setSelectedStepName: (stepName: OnboardingStepName | '') => void;
  setSelectedStepStatus: (stepStatus: OnboardingStepStatus | '') => void;
  setSelectedTenantId: (tenantId: string) => void;
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
  selectedStepName: '' as OnboardingStepName | '',
  selectedStepStatus: '' as OnboardingStepStatus | '',
  selectedTenantId: '',
  currentPage: 0,
  itemsPerPage: 20,
  globalFilter: '',
  formOpen: false,
  selectedId: null,
  sorting: [],
};

export const useOnboardingsStore = create<OnboardingsStore>((set) => ({
  ...initialState,

  setSelectedStepName: (stepName) => set({ selectedStepName: stepName, currentPage: 0 }),
  setSelectedStepStatus: (stepStatus) => set({ selectedStepStatus: stepStatus, currentPage: 0 }),
  setSelectedTenantId: (tenantId) => set({ selectedTenantId: tenantId, currentPage: 0 }),
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
      selectedStepName: '',
      selectedStepStatus: '',
      selectedTenantId: '',
      sorting: [],
      currentPage: 0,
    }),
  reset: () => set(initialState),
}));
