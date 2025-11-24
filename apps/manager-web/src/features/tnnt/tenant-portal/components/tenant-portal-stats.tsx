"use client";

/**
 * @file tenant-portal-stats.tsx
 * @description 테넌트 포털 통계 카드 컴포넌트
 *
 * 계약기간, 직원수, 요금제, 등록일 등의 테넌트 주요 정보를
 * StatCard를 사용하여 표시합니다.
 */

import { useMemo } from "react";
import { Calendar, Users, Package, Clock } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Tenant } from "@/features/tnnt/tenants";

interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

interface TenantPortalStatsProps {
  tenant: Tenant | null | undefined;
  isLoading?: boolean;
}

export function TenantPortalStats({
  tenant,
  isLoading,
}: TenantPortalStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!tenant) {
    return null;
  }

  const stats: StatCardData[] = useMemo(() => {
    return [
      {
        title: "계약기간",
        value:
          tenant.startDate || tenant.start_date
            ? `${tenant.startDate || tenant.start_date}${
                tenant.closeDate || tenant.close_date
                  ? ` ~ ${tenant.closeDate || tenant.close_date || "무기한"}`
                  : ""
              }`
            : "미등록",
        icon: <Calendar className="h-5 w-5" />,
        color: "primary" as const,
        valueSize: "sm" as const,
      },
      {
        title: "직원수",
        value:
          tenant.employeeCount || tenant.employee_count
            ? `${tenant.employeeCount || tenant.employee_count}명`
            : "미등록",
        icon: <Users className="h-5 w-5" />,
        color: "primary" as const,
        valueSize: "sm" as const,
      },
      {
        title: "요금제",
        value:
          tenant.type === "TRIAL"
            ? "평가판"
            : tenant.type === "STANDARD"
            ? "표준"
            : tenant.type === "PREMIUM"
            ? "프리미엄"
            : tenant.type === "ENTERPRISE"
            ? "엔터프라이즈"
            : "미등록",
        icon: <Package className="h-5 w-5" />,
        color: "primary" as const,
        valueSize: "sm" as const,
      },
      {
        title: "등록일",
        value:
          tenant.createdAt || tenant.created_at
            ? new Date(
                tenant.createdAt || tenant.created_at || ""
              ).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "미등록",
        icon: <Clock className="h-5 w-5" />,
        color: "primary" as const,
        valueSize: "sm" as const,
      },
    ];
  }, [tenant]);

  return <StatsCards cards={stats} columns={4} />;
}
