import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface PoliciesStoreState {
  searchText: string;
  selectedPolicyType: string;
  selectedPolicyCategory: string;
  selectedStatus: string;
  selectedEnforcementLevel: string;
  startDate: string;
  endDate: string;

  sorting: Array<{ id: string; desc: boolean }>;

  currentPage: number;
  itemsPerPage: number;

  formOpen: boolean;
  editingId: string | null;
  detailId: string | null;

  setSearchText: (filter: Updater<string>) => void;
  setSelectedPolicyType: (type: string) => void;
  setSelectedPolicyCategory: (category: string) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedEnforcementLevel: (level: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  openForm: (editingId?: string | null) => void;
  closeForm: () => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
}

export const usePoliciesStore = create<PoliciesStoreState>((set) => ({
  searchText: "",
  selectedPolicyType: "",
  selectedPolicyCategory: "",
  selectedStatus: "",
  selectedEnforcementLevel: "",
  startDate: "",
  endDate: "",
  sorting: [{ id: "created_at", desc: true }],
  currentPage: 0,
  itemsPerPage: 20,
  formOpen: false,
  editingId: null,
  detailId: null,

  setSearchText: (filter) =>
    set((state) => ({
      searchText:
        typeof filter === "function" ? filter(state.searchText) : filter,
    })),
  setSelectedPolicyType: (type) => set({ selectedPolicyType: type }),
  setSelectedPolicyCategory: (category) => set({ selectedPolicyCategory: category }),
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedEnforcementLevel: (level) => set({ selectedEnforcementLevel: level }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  resetFilters: () =>
    set({
      searchText: "",
      selectedPolicyType: "",
      selectedPolicyCategory: "",
      selectedStatus: "",
      selectedEnforcementLevel: "",
      startDate: "",
      endDate: "",
      sorting: [{ id: "created_at", desc: true }],
    }),
  setSorting: (sorting) =>
    set((state) => ({
      sorting: typeof sorting === "function" ? sorting(state.sorting) : sorting,
    })),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),
  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: null }),
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
}));
