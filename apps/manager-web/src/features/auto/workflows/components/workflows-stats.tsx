"use client";

/**
 * @file workflows-stats.tsx
 * @description 워크플로우 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 워크플로우 지표 표시
 */

import { useMemo } from "react";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Workflows } from "../types/workflows.types";

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

interface WorkflowsStatsProps {
  workflows: Workflows[];
}

/**
 * 워크플로우 통계 카드 컴포넌트
 */
export function WorkflowsStats({ workflows }: WorkflowsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((w) => w.is_active).length;
    const inactive = total - active;

    // 활성율 계산
    const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 워크플로우",
        value: total.toString(),
        description: "등록된 워크플로우",
        icon: <Activity className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성",
        value: active.toString(),
        description: `전체의 ${activeRate}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성",
        value: inactive.toString(),
        description: "비활성 워크플로우",
        icon: <XCircle className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "실행 중",
        value: active.toString(),
        description: "활성 워크플로우",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [workflows]);

  return <StatsCards cards={stats} columns={4} />;
}
