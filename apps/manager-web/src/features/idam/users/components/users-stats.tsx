"use client";

/**
 * @file users-stats.tsx
 * @description 사용자 통계 카드 컴포넌트
 * 
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import { Users as UsersIcon, UserCheck, UserX, Shield } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { User } from "../types/users.types";

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

interface UsersStatsProps {
  data: User[];
}

export function UsersStats({ data }: UsersStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((u) => u.status === "ACTIVE").length;
    const inactive = total - active;
    
    // 활성 사용자 비율 계산
    const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const inactivePercentage = total > 0 ? ((inactive / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 사용자",
        value: total.toString(),
        description: "총 사용자 수",
        icon: <UsersIcon className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 사용자",
        value: active.toString(),
        description: `전체의 ${activePercentage}%`,
        icon: <UserCheck className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "비활성 사용자",
        value: inactive.toString(),
        description: `전체의 ${inactivePercentage}%`,
        icon: <UserX className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "관리자",
        value: active.toString(),
        description: "활성 관리자 수",
        icon: <Shield className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
