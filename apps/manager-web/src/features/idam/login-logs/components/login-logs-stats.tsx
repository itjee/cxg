"use client";

/**
 * @file login-logs-stats.tsx
 * @description 로그인 이력 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 지표 표시
 */

import { useMemo } from "react";
import { Activity, CheckCircle, XCircle, Lock, Shield, Users } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { LoginLog } from "../types/login-logs.types";

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

interface LoginLogsStatsProps {
  data: LoginLog[];
}

export function LoginLogsStats({ data }: LoginLogsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const successCount = data.filter((log) => log.success).length;
    const failedCount = data.filter((log) => !log.success).length;
    const mfaUsedCount = data.filter((log) => log.mfaUsed).length;
    const lockedCount = data.filter((log) => log.attemptType === "LOCKED").length;

    // 고유 사용자 수 계산
    const uniqueUserIds = new Set(
      data.filter((log) => log.userId).map((log) => log.userId)
    );
    const uniqueUsers = uniqueUserIds.size;

    // 각 항목의 비율 계산
    const successPercentage =
      total > 0 ? ((successCount / total) * 100).toFixed(1) : "0.0";
    const failedPercentage =
      total > 0 ? ((failedCount / total) * 100).toFixed(1) : "0.0";
    const mfaUsedPercentage =
      total > 0 ? ((mfaUsedCount / total) * 100).toFixed(1) : "0.0";
    const lockedPercentage =
      total > 0 ? ((lockedCount / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 이력",
        value: total.toString(),
        description: "총 로그인 이력 수",
        icon: <Activity className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "성공",
        value: successCount.toString(),
        description: `전체의 ${successPercentage}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "실패",
        value: failedCount.toString(),
        description: `전체의 ${failedPercentage}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "danger" as const,
      },
      {
        title: "계정 잠김",
        value: lockedCount.toString(),
        description: `전체의 ${lockedPercentage}%`,
        icon: <Lock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "MFA 사용",
        value: mfaUsedCount.toString(),
        description: `전체의 ${mfaUsedPercentage}%`,
        icon: <Shield className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "고유 사용자",
        value: uniqueUsers.toString(),
        description: "서로 다른 사용자 수",
        icon: <Users className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={3} />;
}
