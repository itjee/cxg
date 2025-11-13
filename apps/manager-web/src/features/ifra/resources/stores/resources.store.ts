import { create } from "zustand";
import type { ResourceStatus, ResourceType } from "../types";

interface ResourcesStoreState {
  // Modal/Form state
  formOpen: boolean;
  editingId: string | null;

  openForm: (editingId?: string | null) => void;
  closeForm: () => void;

  // Filter state
  globalFilter: string;
  selectedResource: ResourceType | "";
  selectedStatus: ResourceStatus | "";
  selectedRegion: string;

  setGlobalFilter: (filter: string) => void;
  setSelectedResource: (resource: ResourceType | "") => void;
  setSelectedStatus: (status: ResourceStatus | "") => void;
  setSelectedRegion: (region: string) => void;

  // Sorting state
  sorting: Array<{ id: string; desc: boolean }>;
  setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;

  // Pagination state
  currentPage: number;
  itemsPerPage: number;

  setCurrentPage: (page: number) => void;
  setItemsPerPage: (size: number) => void;

  // Reset
  resetFilters: () => void;
  reset: () => void;
}

const initialState = {
  formOpen: false,
  editingId: null,
  globalFilter: "",
  selectedResource: "" as ResourceType | "",
  selectedStatus: "" as ResourceStatus | "",
  selectedRegion: "",
  sorting: [],
  currentPage: 0,
  itemsPerPage: 20,
};

export const useResourcesStore = create<ResourcesStoreState>((set) => ({
  ...initialState,

  openForm: (editingId = null) => set({ formOpen: true, editingId }),
  closeForm: () => set({ formOpen: false, editingId: null }),

  setGlobalFilter: (filter) => set({ globalFilter: filter, currentPage: 0 }),
  setSelectedResource: (resource) =>
    set({ selectedResource: resource, currentPage: 0 }),
  setSelectedStatus: (status) => set({ selectedStatus: status, currentPage: 0 }),
  setSelectedRegion: (region) => set({ selectedRegion: region, currentPage: 0 }),

  setSorting: (sorting) => set({ sorting, currentPage: 0 }),

  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (size) => set({ itemsPerPage: size, currentPage: 0 }),

  resetFilters: () =>
    set({
      globalFilter: "",
      selectedResource: "",
      selectedStatus: "",
      selectedRegion: "",
      sorting: [],
      currentPage: 0,
    }),

  reset: () => set(initialState),
}));
