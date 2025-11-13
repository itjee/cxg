/**
 * @file api_keys.store.ts
 * @description API 키 관리 Zustand 상태 저장소
 * 
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(필터, 페이징, 모달)만 Zustand로 관리
 * 
 * @state
 * - 모달: formOpen, editingId
 * - 필터: globalFilter, selectedStatus, selectedUser, selectedTenant
 * - 정렬: sorting
 * - 페이징: currentPage, itemsPerPage
 * 
 * @example
 * ```typescript
 * const { formOpen, openForm, closeForm } = useApiKeyStore();
 * openForm('uuid'); // 수정
 * openForm(); // 생성
 * closeForm();
 * ```
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

/**
 * ApiKeyStoreState 인터페이스
 * Zustand 스토어의 상태 및 액션 타입 정의
 */
interface ApiKeyStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedStatus: string;
  selectedUser: string;
  selectedTenant: string;

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
  setSelectedUser: (user: string) => void;
  setSelectedTenant: (tenant: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
}

/**
 * useApiKeyStore
 * API 키 관리 UI 상태 스토어
 */
export const useApiKeyStore = create<ApiKeyStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedStatus: '',
  selectedUser: '',
  selectedTenant: '',
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
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedUser: '',
      selectedTenant: '',
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
      currentPage: 0, // 페이지 크기 변경시 첫 페이지로
    }),
}));
