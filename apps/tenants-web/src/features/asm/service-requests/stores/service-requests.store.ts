/**
 * Service Request Store
 * Zustand 기반 A/S 요청 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface ServiceRequestStoreState {
  formOpen: boolean;
  editingId: string | null;
  globalFilter: string;
  selectedStatus: string;
  selectedServiceType: string;
  selectedPriority: string;
  sorting: Array<{ id: string; desc: boolean }>;
  currentPage: number;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedServiceType: (serviceType: string) => void;
  setSelectedPriority: (priority: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
}

export const useServiceRequestStore = create<ServiceRequestStoreState>((set) => ({
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedServiceType: '',
  selectedPriority: '',
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

  setSelectedServiceType: (serviceType) =>
    set({ selectedServiceType: serviceType }),

  setSelectedPriority: (priority) =>
    set({ selectedPriority: priority }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedServiceType: '',
      selectedPriority: '',
      sorting: [],
    }),

  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
