"use client";

import { ReactNode, useState } from "react";
import { MainSidebar } from "./main-sidebar";
import { MainHeader } from "./main-header";
import { cn } from "@/lib/utils";
import { BreadcrumbProvider } from "@/contexts/breadcrumb.context";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <BreadcrumbProvider>
      <div className="flex h-screen overflow-hidden">
        <MainSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-200",
            collapsed ? "ml-14" : "ml-60"
          )}
        >
          <MainHeader onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="max-w-[1600px] mx-auto px-3 py-4 lg:px-3 lg:py-6">{children}</div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
