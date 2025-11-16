"use client";

/**
 * @file api-keys-stats.tsx
 * @description API 키 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import {
  Key,
  CheckCircle,
  XCircle,
  Ban,
  TrendingUp,
} from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { ApiKey } from "../types/api_keys.types";

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

interface ApiKeysStatsProps {
  data: ApiKey[];
}

export function ApiKeysStats({ data }: ApiKeysStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((k) => k.status === "ACTIVE").length;
    const inactive = data.filter((k) => k.status === "INACTIVE").length;
    const revoked = data.filter((k) => k.status === "REVOKED").length;
    const totalUsage = data.reduce((sum, k) => sum + k.usageCount, 0);

    const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const inactivePercentage = total > 0 ? ((inactive / total) * 100).toFixed(1) : "0.0";
    const revokedPercentage = total > 0 ? ((revoked / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 API 키",
        value: total.toString(),
        description: "총 API 키 수",
        icon: <Key className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성",
        value: active.toString(),
        description: `전체의 ${activePercentage}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성",
        value: inactive.toString(),
        description: `전체의 ${inactivePercentage}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "취소됨",
        value: revoked.toString(),
        description: `전체의 ${revokedPercentage}%`,
        icon: <Ban className="h-5 w-5" />,
        color: "danger" as const,
      },
      {
        title: "총 사용 횟수",
        value: totalUsage.toLocaleString(),
        description: `평균 ${total > 0 ? Math.floor(totalUsage / total).toLocaleString() : 0}회`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={5} />;
}
