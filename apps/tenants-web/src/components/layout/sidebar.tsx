"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ChevronDown, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { menuGroups } from "@/constants/menu-config";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string> | null>(
    null
  );

  const isExpanded = !collapsed;

  // Helper function to check if pathname matches menu item (supports dynamic routes)
  const isPathActive = (menuHref: string) => {
    if (pathname === menuHref) return true;

    // Support dynamic routes: /bim/partner-portal/[id] matches /bim/partner-portal/1, /bim/partner-portal/2, etc.
    const menuSegments = menuHref.split("/").filter(Boolean);
    const pathSegments = pathname.split("/").filter(Boolean);

    // If menu href has more segments than current path, it can't be active
    if (menuSegments.length > pathSegments.length) return false;

    // For portal routes: /bim/partner-portal/1 matches menu href /bim/partner-portal/1
    // by checking if all menu segments match path segments
    if (
      menuSegments.every((segment, index) => segment === pathSegments[index])
    ) {
      // If it's a portal route and menu has fewer segments, check if the last path segment is an ID
      if (menuSegments.length < pathSegments.length) {
        const lastPathSegment = pathSegments[pathSegments.length - 1];
        return lastPathSegment?.match(/^\d+$/) !== null; // true if it's a number (ID)
      }
      return true;
    }

    return false;
  };

  // Initialize collapsed groups
  useEffect(() => {
    // 초기화: 현재 활성 그룹을 제외한 모든 그룹을 축소
    const activeGroup = menuGroups.find((group) =>
      group.items.some((item) => isPathActive(item.href))
    );

    const initialCollapsed = new Set<string>();
    menuGroups.forEach((group) => {
      if (group.name !== activeGroup?.name) {
        initialCollapsed.add(group.name);
      }
    });

    setCollapsedGroups(initialCollapsed);
  }, [pathname]);

  const handleLogout = () => {
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/signin");
  };

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  // 현재 경로가 그룹의 어떤 항목과 일치하는지 확인
  const isGroupActive = (groupName: string) => {
    const group = menuGroups.find((g) => g.name === groupName);
    if (!group) return false;
    return group.items.some((item) => isPathActive(item.href));
  };

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
                style={{ width: "48px", height: "48px", objectFit: "contain" }}
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight">
                  ConexGrow
                </span>
                <span className="text-xs text-muted-foreground">Workspace</span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full">
              <Image
                src="/logos/logo_text_indigo.png"
                alt="CXG"
                width={32}
                height={32}
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
                priority
              />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {menuGroups.map((group) => (
            <div key={group.name} className="mb-2">
              {isExpanded ? (
                <>
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    {group.icon}
                    <span className="flex-1 text-left">{group.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        collapsedGroups &&
                          collapsedGroups.has(group.name) &&
                          "rotate-0"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      !(collapsedGroups && collapsedGroups.has(group.name)) &&
                        "max-h-[1000px] opacity-100",
                      collapsedGroups &&
                        collapsedGroups.has(group.name) &&
                        "max-h-0 opacity-0"
                    )}
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground pl-9",
                          isPathActive(item.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  className={cn(
                    "w-full flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md",
                    isGroupActive(group.name) &&
                      "bg-accent text-accent-foreground"
                  )}
                  title={group.name}
                >
                  {group.icon}
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
