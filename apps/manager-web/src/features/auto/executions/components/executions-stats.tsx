"use client";

/**
 * @file executions-stats.tsx
 * @description 실행 이력 통계 카드
 *
 * 역할:
 * - StatsCards 컴포넌트 사용
 * - 주요 지표 계산
 * - 트렌드 정보
 */

import { useMemo } from "react";
import { Play, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Execution } from "../types";

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

interface ExecutionsStatsProps {
  executions: Execution[];
}

export function ExecutionsStats({ executions }: ExecutionsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = executions.length;
    const running = executions.filter((e) => e.status === "RUNNING").length;
    const completed = executions.filter((e) => e.status === "COMPLETED").length;
    const failed = executions.filter((e) => e.status === "FAILED").length;
    const pending = executions.filter((e) => e.status === "PENDING").length;

    // 평균 실행 시간 계산
    const completedExecutions = executions.filter((e) => e.duration);
    const avgDuration =
      completedExecutions.length > 0
        ? Math.round(
            completedExecutions.reduce((sum, e) => sum + (e.duration || 0), 0) /
              completedExecutions.length
          )
        : 0;

    return [
      {
        title: "전체 실행",
        value: total.toString(),
        description: "총 실행 횟수",
        icon: <Play className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "완료",
        value: completed.toString(),
        description: `성공률 ${
          total > 0 ? ((completed / total) * 100).toFixed(1) : 0
        }%`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "실패",
        value: failed.toString(),
        description: `실패율 ${
          total > 0 ? ((failed / total) * 100).toFixed(1) : 0
        }%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "실행중/대기",
        value: (running + pending).toString(),
        description: `실행중 ${running} / 대기 ${pending}`,
        icon: <Clock className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "평균 실행 시간",
        value: avgDuration > 0 ? `${avgDuration}초` : "-",
        description: "완료된 실행 기준",
        icon: <RefreshCw className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [executions]);

  return <StatsCards cards={stats} columns={4} />;
}
