/**
 * Departments Store
 * Zustand 기반 부서 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Department } from '../types';

interface DepartmentsStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  selectedStatus: string;

  // 페이지네이션 상태
  currentPage: number;

  // Form 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;

  // Filter 액션
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
}

export const useDepartmentsStore = create<DepartmentsStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  selectedStatus: '',
  currentPage: 0,

  // Form 액션
  openForm: (editingId = null) =>
    set({ formOpen: true, editingId }),

  closeForm: () =>
    set({ formOpen: false, editingId: null }),

  setEditingId: (id) =>
    set({ editingId: id }),

  // Filter 액션
  setSelectedStatus: (status) =>
    set({ selectedStatus: status }),

  resetFilters: () =>
    set({
      selectedStatus: '',
      currentPage: 0,
    }),

  // 페이지네이션 액션
  setCurrentPage: (page) =>
    set({ currentPage: page }),
}));
