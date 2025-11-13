"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { DynamicBreadcrumbData } from "@/lib/breadcrumbs";

interface BreadcrumbContextValue {
  dynamicData: DynamicBreadcrumbData;
  setDynamicData: (data: DynamicBreadcrumbData) => void;
  clearDynamicData: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [dynamicData, setDynamicData] = useState<DynamicBreadcrumbData>({});

  const clearDynamicData = () => {
    setDynamicData({});
  };

  return (
    <BreadcrumbContext.Provider value={{ dynamicData, setDynamicData, clearDynamicData }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }
  return context;
}
