"use client";

/**
 * @file permissions-stats.tsx
 * @description 권한 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import { Lock, Shield, CheckCircle, XCircle } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Permission } from "../types/permissions.types";

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

interface PermissionsStatsProps {
  data: Permission[];
}

export function PermissionsStats({ data }: PermissionsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((u) => u.status === "ACTIVE").length;
    const inactive = total - active;

    // 활성 권한 비율 계산
    const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const inactivePercentage = total > 0 ? ((inactive / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 권한",
        value: total.toString(),
        description: "총 권한 수",
        icon: <Shield className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 권한",
        value: active.toString(),
        description: `전체의 ${activePercentage}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성 권한",
        value: inactive.toString(),
        description: `전체의 ${inactivePercentage}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "시스템 권한",
        value: data.filter((p) => p.isSystem).length.toString(),
        description: "시스템 관리 권한",
        icon: <Lock className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
