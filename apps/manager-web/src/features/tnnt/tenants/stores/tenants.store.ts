/**
 * @file tenants.store.ts
 * @description 테넌트 관리 Zustand 상태 저장소
 *
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(필터, 페이징, 모달)만 Zustand로 관리
 *
 * @state
 * - 모달: formOpen, editingId
 * - 필터: globalFilter, selectedStatus, selectedType, selectedIsSuspended
 * - 정렬: sorting
 * - 페이징: currentPage, itemsPerPage
 *
 * @example
 * ```typescript
 * const { formOpen, openForm, closeForm } = useTenantsStore();
 * openForm('uuid'); // 수정
 * openForm(); // 생성
 * closeForm();
 * ```
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { TenantStatus, TenantType } from '../types';

/**
 * TenantsStoreState 인터페이스
 * Zustand 스토어의 상태 및 액션 타입 정의
 */
interface TenantsStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedStatus: TenantStatus | '';
  selectedType: TenantType | '';
  selectedIsSuspended: string;

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
  setSelectedStatus: (status: TenantStatus | '') => void;
  setSelectedType: (type: TenantType | '') => void;
  setSelectedIsSuspended: (isSuspended: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;

  // 전체 리셋
  reset: () => void;
}

const initialState = {
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '' as TenantStatus | '',
  selectedType: '' as TenantType | '',
  selectedIsSuspended: '',
  sorting: [{ id: 'created_at', desc: true }],
  currentPage: 0,
  itemsPerPage: 20,
};

/**
 * useTenantsStore
 * 테넌트 관리 UI 상태 스토어
 */
export const useTenantsStore = create<TenantsStoreState>((set) => ({
  ...initialState,

  // Form 액션
  openForm: (editingId = null) =>
    set({ formOpen: true, editingId }),

  closeForm: () =>
    set({ formOpen: false, editingId: null }),

  setEditingId: (id) =>
    set({ editingId: id }),

  // Filter 액션
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
      currentPage: 0,
    })),

  setSelectedStatus: (status) =>
    set({ selectedStatus: status, currentPage: 0 }),

  setSelectedType: (type) =>
    set({ selectedType: type, currentPage: 0 }),

  setSelectedIsSuspended: (isSuspended) =>
    set({ selectedIsSuspended: isSuspended, currentPage: 0 }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedType: '',
      selectedIsSuspended: '',
      sorting: [{ id: 'created_at', desc: true }],
      currentPage: 0,
    }),

  // 정렬 액션
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  // 페이지네이션 액션
  setCurrentPage: (page) =>
    set({ currentPage: page }),

  setItemsPerPage: (size) =>
    set({
      itemsPerPage: size,
      currentPage: 0,
    }),

  // 전체 리셋
  reset: () => set(initialState),
}));
