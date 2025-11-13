/**
 * @file sessions.store.ts
 * @description 세션 관리 Zustand 상태 저장소
 * 
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(필터, 페이징, 모달)만 Zustand로 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface SessionStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedStatus: string;
  selectedSessionType: string;
  selectedUser: string;

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
  setSelectedStatus: (status: string) => void;
  setSelectedSessionType: (type: string) => void;
  setSelectedUser: (user: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

export const useSessionStore = create<SessionStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedSessionType: '',
  selectedUser: '',
  sorting: [],
  currentPage: 0,
  itemsPerPage: 20,

  // Form 액션
  openForm: (editingId = null) =>
    set({
      formOpen: true,
      editingId,
    }),

  closeForm: () =>
    set({
      formOpen: false,
      editingId: null,
    }),

  setEditingId: (id) => set({ editingId: id }),

  // Filter 액션
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
    })),

  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedSessionType: (type) => set({ selectedSessionType: type }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedSessionType: '',
      selectedUser: '',
      sorting: [],
    }),

  // 정렬 액션
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  // 페이지네이션 액션
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) =>
    set({
      itemsPerPage: size,
      currentPage: 0,
    }),
}));
