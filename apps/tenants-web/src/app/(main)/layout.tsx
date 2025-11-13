"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BreadcrumbProvider } from "@/contexts/breadcrumb.context";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <BreadcrumbProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={collapsed} mobileOpen={false} onMobileClose={() => {}} />
        <div
          className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-200",
            collapsed ? "ml-14" : "ml-60"
          )}
        >
          <Header onToggleSidebar={handleToggleSidebar} />
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="max-w-[1600px] mx-auto px-2 lg:px-3 py-4 lg:py-6">{children}</div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}
