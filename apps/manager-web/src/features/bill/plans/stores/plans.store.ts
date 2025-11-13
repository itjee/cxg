/**
 * @file plans.store.ts
 * @description 요금제 관리 Zustand 스토어
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Plan,
  PlansFilterState,
  PlansPageState,
  PlanStatus,
  PlanType,
  BillingCycle,
} from '../types';

/**
 * 요금제 스토어 상태 인터페이스
 */
interface PlansStore {
  // 필터 상태
  filters: PlansFilterState;
  setSearch: (search: string) => void;
  setStatus: (status?: PlanStatus | string) => void;
  setType: (type?: PlanType | string) => void;
  setBillingCycle: (cycle?: BillingCycle | string) => void;
  resetFilters: () => void;

  // 페이지 상태
  pageState: PlansPageState;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSorting: (
    sorting: {
      id: string;
      desc: boolean;
    }[]
  ) => void;

  // 모달 상태 (생성/수정)
  isEditModalOpen: boolean;
  selectedPlan: Plan | null;
  openForm: (plan?: Plan) => void;
  closeEditModal: () => void;
}

/**
 * 초기 필터 상태
 */
const initialFilters: PlansFilterState = {
  search: '',
  status: undefined,
  type: undefined,
  billing_cycle: undefined,
};

/**
 * 초기 페이지 상태
 */
const initialPageState: PlansPageState = {
  currentPage: 0,
  pageSize: 20,
  sorting: [{ id: 'created_at', desc: true }],
};

/**
 * 요금제 스토어 생성
 */
export const usePlansStore = create<PlansStore>()(
  immer((set) => ({
    // 필터 상태
    filters: initialFilters,
    setSearch: (search) =>
      set((state) => {
        state.filters.search = search;
        state.pageState.currentPage = 0; // 검색 시 첫 페이지로
      }),
    setStatus: (status) =>
      set((state) => {
        state.filters.status = status;
        state.pageState.currentPage = 0;
      }),
    setType: (type) =>
      set((state) => {
        state.filters.type = type;
        state.pageState.currentPage = 0;
      }),
    setBillingCycle: (cycle) =>
      set((state) => {
        state.filters.billing_cycle = cycle;
        state.pageState.currentPage = 0;
      }),
    resetFilters: () =>
      set((state) => {
        state.filters = initialFilters;
        state.pageState.currentPage = 0;
      }),

    // 페이지 상태
    pageState: initialPageState,
    setCurrentPage: (page) =>
      set((state) => {
        state.pageState.currentPage = page;
      }),
    setPageSize: (size) =>
      set((state) => {
        state.pageState.pageSize = size;
        state.pageState.currentPage = 0;
      }),
    setSorting: (sorting) =>
      set((state) => {
        state.pageState.sorting = sorting;
      }),

    // 모달 상태 (생성/수정)
    isEditModalOpen: false,
    selectedPlan: null,
    openForm: (plan) =>
      set((state) => {
        state.isEditModalOpen = true;
        state.selectedPlan = plan || null;
      }),
    closeEditModal: () =>
      set((state) => {
        state.isEditModalOpen = false;
        state.selectedPlan = null;
      }),
  }))
);
