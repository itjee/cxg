/**
 * @file tenant-portal.store.ts
 * @description Zustand store for tenant portal state management
 */

import { create } from "zustand";
import type { TenantPortalTab } from "../types/tenant-portal.types";

interface TenantPortalStore {
  // State
  selectedTenantId: string | null;
  activeTab: TenantPortalTab;
  expandedSections: Record<string, boolean>;

  // Actions
  setSelectedTenantId: (tenantId: string) => void;
  setActiveTab: (tab: TenantPortalTab) => void;
  toggleSection: (sectionId: string) => void;
  expandSection: (sectionId: string) => void;
  collapseSection: (sectionId: string) => void;
  reset: () => void;
}

export const useTenantPortalStore = create<TenantPortalStore>((set) => ({
  selectedTenantId: null,
  activeTab: "basic-info",
  expandedSections: {},

  setSelectedTenantId: (tenantId) =>
    set({ selectedTenantId: tenantId }),

  setActiveTab: (tab) =>
    set({ activeTab: tab }),

  toggleSection: (sectionId) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionId]: !state.expandedSections[sectionId],
      },
    })),

  expandSection: (sectionId) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionId]: true,
      },
    })),

  collapseSection: (sectionId) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionId]: false,
      },
    })),

  reset: () =>
    set({
      selectedTenantId: null,
      activeTab: "users",
      expandedSections: {},
    }),
}));
