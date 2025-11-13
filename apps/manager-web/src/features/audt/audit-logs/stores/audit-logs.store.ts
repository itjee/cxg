import { create } from "zustand";
import type { Updater } from "@tanstack/react-table";

interface AuditLogsStoreState {
  globalFilter: string;
  selectedEventType: string;
  selectedEventCategory: string;
  selectedResult: string;
  selectedRiskLevel: string;
  selectedTenant: string;
  selectedUser: string;
  startDate: string;
  endDate: string;
  
  sorting: Array<{ id: string; desc: boolean }>;
  
  currentPage: number;
  itemsPerPage: number;
  
  detailId: string | null;

  setGlobalFilter: (filter: Updater<string>) => void;
  setSelectedEventType: (type: string) => void;
  setSelectedEventCategory: (category: string) => void;
  setSelectedResult: (result: string) => void;
  setSelectedRiskLevel: (level: string) => void;
  setSelectedTenant: (tenant: string) => void;
  setSelectedUser: (user: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  resetFilters: () => void;
  setSorting: (sorting: Updater<Array<{ id: string; desc: boolean }>>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;
  openDetail: (id: string) => void;
  closeDetail: () => void;
}

export const useAuditLogsStore = create<AuditLogsStoreState>((set) => ({
  globalFilter: "",
  selectedEventType: "",
  selectedEventCategory: "",
  selectedResult: "",
  selectedRiskLevel: "",
  selectedTenant: "",
  selectedUser: "",
  startDate: "",
  endDate: "",
  sorting: [{ id: "created_at", desc: true }],
  currentPage: 0,
  itemsPerPage: 20,
  detailId: null,

  setGlobalFilter: (filter) =>
    set((state) => ({
      globalFilter:
        typeof filter === "function" ? filter(state.globalFilter) : filter,
    })),
  setSelectedEventType: (type) => set({ selectedEventType: type }),
  setSelectedEventCategory: (category) => set({ selectedEventCategory: category }),
  setSelectedResult: (result) => set({ selectedResult: result }),
  setSelectedRiskLevel: (level) => set({ selectedRiskLevel: level }),
  setSelectedTenant: (tenant) => set({ selectedTenant: tenant }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  resetFilters: () =>
    set({
      globalFilter: "",
      selectedEventType: "",
      selectedEventCategory: "",
      selectedResult: "",
      selectedRiskLevel: "",
      selectedTenant: "",
      selectedUser: "",
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
  openDetail: (id) => set({ detailId: id }),
  closeDetail: () => set({ detailId: null }),
}));
