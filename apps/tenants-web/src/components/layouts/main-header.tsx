"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/providers";
import { generateBreadcrumbs } from "@/lib/breadcrumbs";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useBreadcrumb } from "@/contexts/breadcrumb.context";

export interface MainHeaderProps {
  onToggleSidebar?: () => void;
}

export function MainHeader({ onToggleSidebar }: MainHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { dynamicData } = useBreadcrumb();
  const breadcrumbs = generateBreadcrumbs(pathname, dynamicData);

  const handleLogout = async () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-header/95 backdrop-blur supports-[backdrop-filter]:bg-header/60 text-header-foreground">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Left: Sidebar Toggle and Breadcrumb */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <nav className="flex items-center gap-2 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2 shrink-0">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="검색..."
              className="w-full pl-9 h-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Right: Theme Toggle and User Menu */}
        <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9">
                <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  U
                </div>
                <span className="text-sm font-medium">사용자</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">사용자</p>
                  <p className="text-xs text-muted-foreground">user@company.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>프로필</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
