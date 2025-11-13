/**
 * @file login-logs.store.ts
 * @description 로그인 이력 Zustand 상태 저장소
 * 
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(필터, 페이징, 모달)만 Zustand로 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface LoginLogStoreState {
  // Form/Modal 상태
  detailId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedAttemptType: string;
  selectedSuccess: string;
  selectedUserType: string;
  selectedMfaUsed: string;
  startDate: string;
  endDate: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션 상태
  currentPage: number;
  itemsPerPage: number;

  // Detail 액션
  openDetail: (id: string) => void;
  closeDetail: () => void;

  // Filter 액션
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedAttemptType: (type: string) => void;
  setSelectedSuccess: (success: string) => void;
  setSelectedUserType: (type: string) => void;
  setSelectedMfaUsed: (used: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

export const useLoginLogStore = create<LoginLogStoreState>((set) => ({
  // 초기 상태
  detailId: null,
  globalFilter: '',
  selectedAttemptType: '',
  selectedSuccess: '',
  selectedUserType: '',
  selectedMfaUsed: '',
  startDate: '',
  endDate: '',
  sorting: [{ id: 'created_at', desc: true }], // 기본 정렬: 최신순
  currentPage: 0,
  itemsPerPage: 20,

  // Detail 액션
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),

  // Filter 액션
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
    })),

  setSelectedAttemptType: (type) => set({ selectedAttemptType: type }),
  setSelectedSuccess: (success) => set({ selectedSuccess: success }),
  setSelectedUserType: (type) => set({ selectedUserType: type }),
  setSelectedMfaUsed: (used) => set({ selectedMfaUsed: used }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedAttemptType: '',
      selectedSuccess: '',
      selectedUserType: '',
      selectedMfaUsed: '',
      startDate: '',
      endDate: '',
      sorting: [{ id: 'created_at', desc: true }],
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
