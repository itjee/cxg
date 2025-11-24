"use client";

/**
 * @file tenants-stats.tsx
 * @description 테넌트 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import {
  Building2,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Tenant } from "../types/tenants.types";

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

interface TenantsStatsProps {
  data: Tenant[];
}

export function TenantsStats({ data }: TenantsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((t) => t.status === "ACTIVE").length;
    const suspended = data.filter((t) => t.is_suspended).length;
    const trial = data.filter((t) => t.type === "TRIAL").length;

    // 활성 테넌트 비율 계산
    const activePercentage =
      total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const suspendedPercentage =
      total > 0 ? ((suspended / total) * 100).toFixed(1) : "0.0";
    const trialPercentage =
      total > 0 ? ((trial / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 테넌트",
        value: total.toString(),
        description: "총 테넌트 수",
        icon: <Building2 className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 테넌트",
        value: active.toString(),
        description: `전체의 ${activePercentage}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "일시중단",
        value: suspended.toString(),
        description: `전체의 ${suspendedPercentage}%`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "평가판",
        value: trial.toString(),
        description: `전체의 ${trialPercentage}%`,
        icon: <Zap className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
