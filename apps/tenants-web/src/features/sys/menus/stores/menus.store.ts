/**
 * @file menus.store.ts
 * @description Zustand 기반 메뉴 관리 UI 상태 관리
 */

import { create } from 'zustand';
import type { Updater } from '@tanstack/react-table';
import type { Menu } from '../types';

/**
 * 메뉴 스토어 상태 인터페이스
 */
interface MenuStoreState {
  // Form/Modal 상태
  formOpen: boolean;
  editingId: string | null;

  // Filter 상태
  globalFilter: string;
  selectedMenuType: string;
  selectedModuleCode: string;
  selectedParentId: string;

  // 정렬 상태
  sorting: Array<{ id: string; desc: boolean }>;

  // 페이지네이션 상태
  currentPage: number;
  itemsPerPage: number;

  // 트리 뷰 상태
  expandedNodes: Set<string>;
  isTreeView: boolean;

  // Form 액션
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  setEditingId: (id: string | null) => void;

  // Filter 액션
  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedMenuType: (menuType: string) => void;
  setSelectedModuleCode: (moduleCode: string) => void;
  setSelectedParentId: (parentId: string) => void;
  resetFilters: () => void;

  // 정렬 액션
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;

  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;

  // 트리 뷰 액션
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setTreeView: (isTreeView: boolean) => void;
}

/**
 * 메뉴 관리 Zustand 스토어
 * 
 * @description
 * - 메뉴 관리 페이지의 UI 상태를 중앙에서 관리
 * - 폼, 필터, 정렬, 페이지네이션, 트리 뷰 상태 포함
 * 
 * @example
 * ```tsx
 * const { formOpen, openForm, closeForm } = useMenuStore();
 * ```
 */
export const useMenuStore = create<MenuStoreState>((set) => ({
  // 초기 상태
  formOpen: false,
  editingId: null,
  globalFilter: '',
  selectedMenuType: '',
  selectedModuleCode: '',
  selectedParentId: '',
  sorting: [],
  currentPage: 0,
  itemsPerPage: 10,
  expandedNodes: new Set<string>(),
  isTreeView: false,

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
    })),

  setSelectedMenuType: (menuType) =>
    set({ selectedMenuType: menuType }),

  setSelectedModuleCode: (moduleCode) =>
    set({ selectedModuleCode: moduleCode }),

  setSelectedParentId: (parentId) =>
    set({ selectedParentId: parentId }),

  resetFilters: () =>
    set({
      globalFilter: '',
      selectedMenuType: '',
      selectedModuleCode: '',
      selectedParentId: '',
      sorting: [],
    }),

  // 정렬 액션
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === 'function' ? sorting(state.sorting) : sorting,
    })),

  // 페이지네이션 액션
  setCurrentPage: (page) =>
    set({ currentPage: page }),

  setItemsPerPage: (itemsPerPage) =>
    set({ itemsPerPage, currentPage: 0 }),

  // 트리 뷰 액션
  toggleNode: (nodeId) =>
    set((state) => {
      const newExpanded = new Set(state.expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return { expandedNodes: newExpanded };
    }),

  expandAll: () =>
    set({ expandedNodes: new Set<string>(['all']) }), // 'all' 키워드로 전체 확장 표시

  collapseAll: () =>
    set({ expandedNodes: new Set<string>() }),

  setTreeView: (isTreeView) =>
    set({ isTreeView }),
}));
