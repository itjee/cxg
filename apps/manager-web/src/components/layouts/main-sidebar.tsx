"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Shield,
  Server,
  Activity,
  FileText,
  Settings,
  HelpCircle,
  Users,
  Lock,
  KeyRound,
  Bell,
  Headphones,
  Plug,
  Sliders,
  BarChart3,
  Zap,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useThemeStore } from "@/shared/stores";
import { ChevronRight } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: Omit<NavItem, "children">[];
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

interface MainSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

// 대시보드
const dashboardItems: NavItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    href: "/core/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
];

// 메뉴 그룹 정의
const navGroups: NavGroup[] = [
  {
    id: "tenant-management",
    label: "테넌트 관리",
    icon: <Building2 className="h-4 w-4" />,
    items: [
      {
        id: "tenants",
        label: "테넌트 관리",
        href: "/tnnt/tenants",
        icon: <Building2 className="h-5 w-5" />,
        badge: "12",
      },
      {
        id: "tenant-users",
        label: "테넌트 사용자",
        href: "/tnnt/tenant-users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        id: "tenant-roles",
        label: "테넌트 역할",
        href: "/tnnt/tenant-roles",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        id: "onboardings",
        label: "온보딩 프로세스",
        href: "/tnnt/onboardings",
        icon: <Activity className="h-5 w-5" />,
      },
      {
        id: "subscriptions",
        label: "구독 관리",
        href: "/tnnt/subscriptions",
        icon: <CreditCard className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "billing",
    label: "빌링",
    icon: <CreditCard className="h-4 w-4" />,
    items: [
      {
        id: "invoices",
        label: "청구서",
        href: "/bill/invoices",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        id: "payments",
        label: "결제 내역",
        href: "/bill/payments",
        icon: <CreditCard className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "infrastructure",
    label: "인프라",
    icon: <Server className="h-4 w-4" />,
    items: [
      {
        id: "servers",
        label: "서버",
        href: "/ifra/servers",
        icon: <Server className="h-5 w-5" />,
      },
      {
        id: "resources",
        label: "리소스",
        href: "/ifra/resources",
        icon: <Activity className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "monitoring",
    label: "모니터링",
    icon: <Activity className="h-4 w-4" />,
    items: [
      {
        id: "system-status",
        label: "시스템 상태",
        href: "/mntr/status",
        icon: <Activity className="h-5 w-5" />,
      },
      {
        id: "alerts",
        label: "알림",
        href: "/mntr/alerts",
        icon: <Activity className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "security",
    label: "보안",
    icon: <Shield className="h-4 w-4" />,
    items: [
      {
        id: "users",
        label: "사용자 관리",
        href: "/idam/users",
        icon: <Users className="h-5 w-5" />,
      },
      {
        id: "roles",
        label: "역할 관리",
        href: "/idam/roles",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        id: "permissions",
        label: "권한 관리",
        href: "/idam/permissions",
        icon: <KeyRound className="h-5 w-5" />,
      },
      {
        id: "access-logs",
        label: "접근 로그",
        href: "/idam/access-logs",
        icon: <Lock className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "audit",
    label: "감사",
    icon: <FileText className="h-4 w-4" />,
    items: [
      {
        id: "audit-logs",
        label: "감사 로그",
        href: "/audt/logs",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        id: "audit-reports",
        label: "감사 보고서",
        href: "/audt/reports",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "notifications",
    label: "알림",
    icon: <Bell className="h-4 w-4" />,
    items: [
      {
        id: "notifications-list",
        label: "알림 관리",
        href: "/noti/notifications",
        icon: <Bell className="h-5 w-5" />,
      },
      {
        id: "campaigns",
        label: "캠페인",
        href: "/noti/campaigns",
        icon: <Bell className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "support",
    label: "고객 지원",
    icon: <Headphones className="h-4 w-4" />,
    items: [
      {
        id: "tickets",
        label: "지원 티켓",
        href: "/supt/tickets",
        icon: <Headphones className="h-5 w-5" />,
      },
      {
        id: "knowledge",
        label: "지식 베이스",
        href: "/supt/knowledge",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "integrations",
    label: "외부 연동",
    icon: <Plug className="h-4 w-4" />,
    items: [
      {
        id: "apis",
        label: "API 연동",
        href: "/intg/apis",
        icon: <Plug className="h-5 w-5" />,
      },
      {
        id: "webhooks",
        label: "웹훅",
        href: "/intg/webhooks",
        icon: <Zap className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "configuration",
    label: "시스템 구성",
    icon: <Sliders className="h-4 w-4" />,
    items: [
      {
        id: "system-config",
        label: "시스템 설정",
        href: "/cnfg/system",
        icon: <Settings className="h-5 w-5" />,
      },
      {
        id: "feature-flags",
        label: "기능 토글",
        href: "/cnfg/features",
        icon: <Sliders className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "analytics",
    label: "분석",
    icon: <BarChart3 className="h-4 w-4" />,
    items: [
      {
        id: "analytics-dashboard",
        label: "분석 대시보드",
        href: "/stat/analytics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        id: "reports",
        label: "통계 보고서",
        href: "/stat/reports",
        icon: <FileText className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "automation",
    label: "자동화",
    icon: <Zap className="h-4 w-4" />,
    items: [
      {
        id: "workflows",
        label: "워크플로우",
        href: "/auto/workflows",
        icon: <Zap className="h-5 w-5" />,
      },
      {
        id: "schedules",
        label: "스케줄",
        href: "/auto/schedules",
        icon: <Activity className="h-5 w-5" />,
      },
    ],
  },
  {
    id: "backup",
    label: "백업",
    icon: <Database className="h-4 w-4" />,
    items: [
      {
        id: "backups",
        label: "백업 관리",
        href: "/bkup/backups",
        icon: <Database className="h-5 w-5" />,
      },
      {
        id: "recovery",
        label: "복구 관리",
        href: "/bkup/recovery",
        icon: <Server className="h-5 w-5" />,
      },
    ],
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: "settings",
    label: "시스템 설정",
    href: "/core/settings",
    icon: <Settings className="h-5 w-5" />,
  },
  {
    id: "help",
    label: "도움말",
    href: "/core/help",
    icon: <HelpCircle className="h-5 w-5" />,
  },
];

export function MainSidebar({
  collapsed,
  onCollapsedChange,
}: MainSidebarProps) {
  const pathname = usePathname();
  const { customColors, mode } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);

  // Find which group contains the current path
  const getActiveGroupId = () => {
    for (const group of navGroups) {
      if (
        group.items.some(
          (item) =>
            pathname === item.href || pathname.startsWith(item.href + "/")
        )
      ) {
        return group.id;
      }
    }
    return null;
  };

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    () => {
      const activeGroupId = getActiveGroupId();
      return {
        "tenant-management": activeGroupId === "tenant-management",
        billing: activeGroupId === "billing",
        infrastructure: activeGroupId === "infrastructure",
        monitoring: activeGroupId === "monitoring",
        security: activeGroupId === "security",
        audit: activeGroupId === "audit",
        notifications: activeGroupId === "notifications",
        support: activeGroupId === "support",
        integrations: activeGroupId === "integrations",
        configuration: activeGroupId === "configuration",
        analytics: activeGroupId === "analytics",
        automation: activeGroupId === "automation",
        backup: activeGroupId === "backup",
      };
    }
  );

  const isExpanded = !collapsed;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <>
      {/* Main sidebar - fixed position */}
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
                src="/logo/manager_logo.png"
                alt="CXG"
                width={48}
                height={48}
                style={{ width: "48px", height: "48px", objectFit: "contain" }}
                priority
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl letter-spacing-tight leading-tight">
                  ConexGrow
                </span>
                <span className="text-sm text-muted-foreground">Manager</span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center justify-center w-full">
              <Image
                src="/logo/manager_logo.png"
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
          {/* Dashboard */}
          <div className="mb-4">
            {dashboardItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  !isExpanded && "justify-center"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                {item.icon}
                {isExpanded && <span className="flex-1">{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* Menu Groups */}
          {navGroups.map((group) => (
            <div key={group.id} className="mb-2">
              {isExpanded ? (
                <>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md"
                  >
                    {group.icon}
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedGroups[group.id] && "rotate-90"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      !expandedGroups[group.id] && "max-h-0 opacity-0",
                      expandedGroups[group.id] && "max-h-[1000px] opacity-100"
                    )}
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-base transition-colors hover:bg-accent hover:text-accent-foreground pl-9",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  className={cn(
                    "w-full flex items-center justify-center px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md",
                    group.items.some((item) => pathname === item.href) &&
                      "bg-accent text-accent-foreground"
                  )}
                  title={group.label}
                >
                  {group.icon}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t p-2 space-y-1">
          {bottomNavItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                !isExpanded && "justify-center"
              )}
              title={!isExpanded ? item.label : undefined}
            >
              {item.icon}
              {isExpanded && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
}
