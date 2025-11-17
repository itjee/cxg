/**
 * @file workflows.store.ts
 * @description 워크플로우 관리 Zustand 상태 저장소
 * 
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(모달, 정렬, 필터)만 Zustand로 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface WorkflowsStore {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 필터 상태
  searchText: string;
  selectedStatus: string;

  // Form 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 필터 액션
  setSearchText: (filter: string) => void;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;
}

const initialState = {
  formOpen: false,
  editingId: null,
  sorting: [],
  searchText: '',
  selectedStatus: '',
};

export const useWorkflowsStore = create<WorkflowsStore>((set) => ({
  ...initialState,

  // Form 액션
  openForm: (editingId = null) =>
    set({ formOpen: true, editingId }),

  closeForm: () =>
    set({ formOpen: false, editingId: null }),

  setEditingId: (id) =>
    set({ editingId: id }),

  // 정렬 액션
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  // 필터 액션
  setSearchText: (filter) =>
    set({ searchText: filter }),

  setSelectedStatus: (status) =>
    set({ selectedStatus: status }),

  resetFilters: () =>
    set({
      searchText: '',
      selectedStatus: '',
      sorting: [],
    }),
}));
