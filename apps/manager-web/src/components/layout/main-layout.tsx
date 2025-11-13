"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
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
        <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-200",
            collapsed ? "ml-14" : "ml-60"
          )}
        >
          <Header onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="max-w-[1600px] mx-auto p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
