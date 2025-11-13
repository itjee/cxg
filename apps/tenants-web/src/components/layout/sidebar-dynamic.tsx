"use client";

/**
 * @file sidebar-dynamic.tsx
 * @description 데이터베이스에서 메뉴를 조회하여 동적으로 사이드바를 생성하는 컴포넌트
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  HelpCircle,
  Home,
  Users,
  Building2,
  Briefcase,
  Package,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  Clock,
  Gauge,
  Store,
  Box,
  AlertCircle,
  DollarSign,
  Workflow,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMenuTree } from "@/lib/menus-api";
import type { MenuTreeNode } from "@/features/sys/menus/types";

// 아이콘 매핑
const iconMap: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  "building-2": Building2,
  briefcase: Briefcase,
  package: Package,
  warehouse: Warehouse,
  "shopping-cart": ShoppingCart,
  "trending-up": TrendingUp,
  "bar-chart-3": BarChart3,
  settings: Settings,
  clock: Clock,
  gauge: Gauge,
  store: Store,
  box: Box,
  "alert-circle": AlertCircle,
  "dollar-sign": DollarSign,
  workflow: Workflow,
};

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function SidebarDynamic({
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuTree, setMenuTree] = useState<MenuTreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string> | null>(
    null
  );

  const isExpanded = !collapsed;

  // Load menu tree from API
  useEffect(() => {
    async function loadMenus() {
      try {
        const response = await fetchMenuTree(true, true);
        setMenuTree(response.items);
      } catch (error) {
        console.error("Failed to load menus:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMenus();
  }, []);

  // Initialize collapsed groups
  useEffect(() => {
    if (menuTree.length === 0 || collapsedGroups !== null) return;

    const activeGroup = menuTree.find((group) =>
      group.children?.some((item) => isPathActive(item.route_path || ""))
    );

    const initialCollapsed = new Set<string>();
    menuTree.forEach((group) => {
      if (group.code !== activeGroup?.code) {
        initialCollapsed.add(group.code);
      }
    });

    setCollapsedGroups(initialCollapsed);
  }, [menuTree, pathname]);

  // Check if path is active
  const isPathActive = (menuPath: string) => {
    if (!menuPath) return false;
    if (pathname === menuPath) return true;

    const menuSegments = menuPath.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);

    if (menuSegments.length > pathSegments.length) return false;

    if (
      menuSegments.every((segment, index) => segment === pathSegments[index])
    ) {
      if (menuSegments.length < pathSegments.length) {
        const lastPathSegment = pathSegments[pathSegments.length - 1];
        return lastPathSegment?.match(/^\d+$/) !== null;
      }
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/signin");
  };

  const toggleGroup = (groupCode: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupCode)) {
        next.delete(groupCode);
      } else {
        next.add(groupCode);
      }
      return next;
    });
  };

  const isGroupActive = (group: MenuTreeNode) => {
    return (
      group.children?.some((item) => isPathActive(item.route_path || "")) ||
      false
    );
  };

  const getIcon = (iconName: string | null | undefined) => {
    if (!iconName) return null;
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  if (loading) {
    return (
      <aside
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r bg-sidebar transition-all duration-200",
          isExpanded ? "w-60" : "w-14",
          "z-40"
        )}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 flex h-screen flex-col border-r bg-sidebar transition-all duration-200",
          isExpanded ? "w-60" : "w-14",
          "z-40"
        )}
      >
        {/* Logo */}
        <div
          className="flex items-center border-b border-sidebar-border px-3 bg-sidebar text-sidebar-foreground"
          style={{ height: "57px" }}
        >
          {isExpanded ? (
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logos/logo_text_indigo.png"
                alt="CXG"
                width={48}
                height={48}
                style={{ height: "auto" }}
                className="object-contain"
                quality={100}
                priority
                unoptimized
              />
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight">
                  ConexGrow
                </span>
                <span className="text-xs text-muted-foreground">Tenants</span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full">
              <Image
                src="/logos/logo_text_indigo.png"
                alt="CXG"
                width={32}
                height={32}
                style={{ height: "auto" }}
                className="object-contain"
                quality={100}
                priority
                unoptimized
              />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {menuTree.map((group) => (
            <div key={group.code} className="mb-2">
              {isExpanded ? (
                <>
                  <button
                    onClick={() => toggleGroup(group.code)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    {getIcon(group.icon)}
                    <span className="flex-1 text-left">{group.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        collapsedGroups &&
                          collapsedGroups.has(group.code) &&
                          "rotate-0"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      !(collapsedGroups && collapsedGroups.has(group.code)) &&
                        "max-h-[1000px] opacity-100",
                      collapsedGroups &&
                        collapsedGroups.has(group.code) &&
                        "max-h-0 opacity-0"
                    )}
                  >
                    {group.children?.map((item) => (
                      <Link
                        key={item.code}
                        href={item.route_path || "#"}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground pl-9",
                          isPathActive(item.route_path || "")
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="flex-1">{item.name}</span>
                        {item.badge_text && (
                          <span
                            className={cn(
                              "px-1.5 py-0.5 text-xs rounded",
                              item.badge_color === "blue" &&
                                "bg-blue-100 text-blue-700"
                            )}
                          >
                            {item.badge_text}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  className={cn(
                    "w-full flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md",
                    isGroupActive(group) && "bg-accent text-accent-foreground"
                  )}
                  title={group.name}
                >
                  {getIcon(group.icon)}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t p-2 space-y-1">
          {isExpanded ? (
            <>
              <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground">
                <HelpCircle className="h-5 w-5" />
                <span>도움말</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
              >
                <LogOut className="h-5 w-5" />
                <span>로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <button
                className="w-full flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                title="도움말"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                title="로그아웃"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
