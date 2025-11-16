"use client";

/**
 * @file roles-stats.tsx
 * @description 역할 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import { Shield, Lock, CheckCircle, XCircle } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Role } from "../types/roles.types";

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

interface RolesStatsProps {
  data: Role[];
}

export function RolesStats({ data }: RolesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((u) => u.status === "ACTIVE").length;
    const inactive = total - active;

    // 활성 역할 비율 계산
    const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const inactivePercentage = total > 0 ? ((inactive / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 역할",
        value: total.toString(),
        description: "총 역할 수",
        icon: <Shield className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 역할",
        value: active.toString(),
        description: `전체의 ${activePercentage}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성 역할",
        value: inactive.toString(),
        description: `전체의 ${inactivePercentage}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "권한 관리",
        value: data.filter((r) => r.name?.toLowerCase().includes("admin")).length.toString(),
        description: "관리자 관련 역할",
        icon: <Lock className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
