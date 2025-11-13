/**
 * @file transaction.store.ts
 * @description 거래(결제) 관리 Zustand 상태 저장소
 *
 * UI 상태를 관리하는 클라이언트 사이드 스토어
 * - 서버 상태(데이터)는 TanStack Query가 관리
 * - UI 상태(모달, 정렬)만 Zustand로 관리
 * - 필터 및 페이징은 DataTable 내부에서 관리
 *
 * @state
 * - 모달: formOpen, editingId
 * - 정렬: sorting
 *
 * @example
 * ```typescript
 * const { formOpen, openForm } = useTransactionStore();
 * openForm('transaction-id');
 * ```
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';

interface TransactionStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // Form 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  sorting: [],

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
}));
