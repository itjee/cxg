/**
 * Breadcrumb configuration for the application
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DynamicBreadcrumbData {
  [key: string]: string;
}

// Route to breadcrumb mapping
const routeLabels: Record<string, string> = {
  // Core
  "/core/dashboard": "대시보드",
  "/core/profile": "프로필",
  "/core/settings": "시스템 설정",
  "/core/help": "도움말",

  // Tenant Management
  "/tnnt/tenant": "테넌트 목록",
  "/tnnt/subscription": "구독 관리",

  // Billing
  "/bill/invoices": "청구서",
  "/bill/payments": "결제 내역",

  // Infrastructure
  "/ifra/servers": "서버",
  "/ifra/resources": "리소스",

  // Monitoring
  "/mntr/status": "시스템 상태",
  "/mntr/alerts": "알림",

  // Security (IDAM)
  "/idam/users": "사용자",
  "/idam/roles": "역할 관리",
  "/idam/permissions": "권한 관리",
  "/idam/access-logs": "접근 로그",

  // Audit
  "/audt/logs": "감사 로그",
  "/audt/reports": "감사 보고서",

  // Notifications
  "/noti/notifications": "알림 관리",
  "/noti/campaigns": "캠페인",

  // Support
  "/supt/tickets": "지원 티켓",
  "/supt/knowledge": "지식 베이스",

  // Integrations
  "/intg/apis": "API 연동",
  "/intg/webhooks": "웹훅",

  // Configuration
  "/cnfg/system": "시스템 설정",
  "/cnfg/features": "기능 토글",

  // Analytics
  "/stat/analytics": "분석 대시보드",
  "/stat/reports": "통계 보고서",

  // Automation
  "/auto/workflows": "워크플로우",
  "/auto/schedules": "스케줄",

  // Backup
  "/bkup/backups": "백업 관리",
  "/bkup/recovery": "복구 관리",
};

// Category labels
const categoryLabels: Record<string, string> = {
  core: "코어",
  tnnt: "테넌트 관리",
  bill: "빌링",
  ifra: "인프라",
  mntr: "모니터링",
  idam: "보안",
  audt: "감사",
  noti: "알림",
  supt: "고객 지원",
  intg: "외부 연동",
  cnfg: "시스템 구성",
  stat: "분석",
  auto: "자동화",
  bkup: "백업",
};

/**
 * Generate breadcrumbs from pathname
 */
export function generateBreadcrumbs(pathname: string, dynamicData?: DynamicBreadcrumbData): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "홈", href: "/" },
  ];

  // Handle root path
  if (pathname === "/" || pathname === "/core/dashboard") {
    breadcrumbs.push({ label: "대시보드" });
    return breadcrumbs;
  }

  // Get exact match first
  if (routeLabels[pathname]) {
    const parts = pathname.split("/").filter(Boolean);
    
    // Add category if exists
    if (parts.length >= 2) {
      const category = parts[0];
      if (categoryLabels[category]) {
        breadcrumbs.push({
          label: categoryLabels[category],
          href: undefined, // Category is not clickable
        });
      }
    }

    // Add current page
    breadcrumbs.push({
      label: routeLabels[pathname],
    });

    return breadcrumbs;
  }

  // Handle dynamic routes (e.g., /tnnt/tenant/123)
  const parts = pathname.split("/").filter(Boolean);
  let currentPath = "";

  for (let i = 0; i < parts.length; i++) {
    currentPath += "/" + parts[i];
    
    // Check if we have a label for this path
    if (routeLabels[currentPath]) {
      const isLast = i === parts.length - 1;
      breadcrumbs.push({
        label: routeLabels[currentPath],
        href: isLast ? undefined : currentPath,
      });
    } else if (i === 0 && categoryLabels[parts[i]]) {
      // Add category label
      breadcrumbs.push({
        label: categoryLabels[parts[i]],
        href: undefined,
      });
    } else if (i === parts.length - 1) {
      // Last segment without a label - check for dynamic data
      const dynamicLabel = dynamicData?.[parts[i]];
      breadcrumbs.push({
        label: dynamicLabel || parts[i],
      });
    }
  }

  return breadcrumbs;
}
