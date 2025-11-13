"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface DynamicBreadcrumbData {
  [key: string]: string;
}

interface BreadcrumbContextValue {
  dynamicData: DynamicBreadcrumbData;
  setDynamicData: (data: DynamicBreadcrumbData) => void;
  clearDynamicData: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [dynamicData, setDynamicData] = useState<DynamicBreadcrumbData>({});

  const memoizedSetDynamicData = useCallback((data: DynamicBreadcrumbData) => {
    setDynamicData(data);
  }, []);

  const memoizedClearDynamicData = useCallback(() => {
    setDynamicData({});
  }, []);

  return (
    <BreadcrumbContext.Provider value={{
      dynamicData,
      setDynamicData: memoizedSetDynamicData,
      clearDynamicData: memoizedClearDynamicData
    }}>
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
