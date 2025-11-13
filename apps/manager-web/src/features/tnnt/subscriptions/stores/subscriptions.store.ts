/**
 * @file subscriptions.store.ts
 * @description 구독 Zustand 상태 저장소
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { SubscriptionStatus, BillingCycle } from '../types/subscriptions.types';

interface SubscriptionsStore {
  // Form/Modal 상태
  formOpen: boolean;
  selectedId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedStatus: SubscriptionStatus | '';
  selectedBillingCycle: BillingCycle | '';
  selectedAutoRenewal: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션 상태
  currentPage: number;
  itemsPerPage: number;

  // Form 액션
  openForm: (id?: string) => void;
  closeForm: () => void;

  // Filter 액션
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedStatus: (status: SubscriptionStatus | '') => void;
  setSelectedBillingCycle: (cycle: BillingCycle | '') => void;
  setSelectedAutoRenewal: (renewal: string) => void;
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
  selectedId: null,
  globalFilter: '',
  selectedStatus: '' as SubscriptionStatus | '',
  selectedBillingCycle: '' as BillingCycle | '',
  selectedAutoRenewal: '',
  sorting: [{ id: 'start_date', desc: true }],
  currentPage: 0,
  itemsPerPage: 20,
};

export const useSubscriptionsStore = create<SubscriptionsStore>((set) => ({
  ...initialState,

  // Form 액션
  openForm: (id) => set({ formOpen: true, selectedId: id || null }),
  closeForm: () => set({ formOpen: false, selectedId: null }),

  // Filter 액션
  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter: typeof filter === 'function' ? filter(state.globalFilter) : filter,
      currentPage: 0,
    })),
  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setSelectedBillingCycle: (cycle) => set({ selectedBillingCycle: cycle, currentPage: 0 }),
  setSelectedAutoRenewal: (renewal) => set({ selectedAutoRenewal: renewal, currentPage: 0 }),
  resetFilters: () =>
    set({
      globalFilter: '',
      selectedStatus: '',
      selectedBillingCycle: '',
      selectedAutoRenewal: '',
      sorting: [{ id: 'start_date', desc: true }],
      currentPage: 0,
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

  // 전체 리셋
  reset: () => set(initialState),
}));
