"use client";

/**
 * @file sessions-stats.tsx
 * @description 세션 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import { Activity, CheckCircle, Clock, XCircle, Shield } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Session } from "../types/sessions.types";

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

interface SessionsStatsProps {
  data: Session[];
}

export function SessionsStats({ data }: SessionsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((s) => s.status === "ACTIVE").length;
    const expired = data.filter((s) => s.status === "EXPIRED").length;
    const revoked = data.filter((s) => s.status === "REVOKED").length;
    const mfaVerified = data.filter((s) => s.mfaVerified).length;

    // 각 상태의 비율 계산
    const activePercentage =
      total > 0 ? ((active / total) * 100).toFixed(1) : "0.0";
    const expiredPercentage =
      total > 0 ? ((expired / total) * 100).toFixed(1) : "0.0";
    const mfaVerifiedPercentage =
      total > 0 ? ((mfaVerified / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 세션",
        value: total.toString(),
        description: "총 세션 수",
        icon: <Activity className="h-5 w-5" />,
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
        title: "만료됨",
        value: expired.toString(),
        description: `전체의 ${expiredPercentage}%`,
        icon: <Clock className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "MFA 인증",
        value: mfaVerified.toString(),
        description: `전체의 ${mfaVerifiedPercentage}%`,
        icon: <Shield className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
