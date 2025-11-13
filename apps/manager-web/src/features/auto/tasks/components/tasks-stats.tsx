"use client";

/**
 * @file tasks-stats.tsx
 * @description 스케줄된 작업 통계 카드
 */

import { useMemo } from "react";
import { Calendar, CheckCircle2, XCircle, Clock, Activity } from "lucide-react";
import { StatsCards, type StatCardData } from "@/components/stats";
import type { Task } from "../types";

interface TasksStatsProps {
  tasks: Task[];
}

export function TasksStats({ tasks }: TasksStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = tasks.length;
    const enabled = tasks.filter((t) => t.enabled).length;
    const disabled = tasks.filter((t) => !t.enabled).length;

    // 전체 실행 통계 계산
    const totalRuns = tasks.reduce((sum, t) => sum + t.total_runs, 0);
    const totalSuccessful = tasks.reduce(
      (sum, t) => sum + t.successful_runs,
      0
    );
    const totalFailed = tasks.reduce((sum, t) => sum + t.failed_runs, 0);

    // 성공률 계산
    const successRate =
      totalRuns > 0 ? ((totalSuccessful / totalRuns) * 100).toFixed(1) : "0";

    // 다음 실행 예정 작업 수
    const upcomingTasks = tasks.filter(
      (t) => t.enabled && t.next_run_at
    ).length;

    return [
      {
        title: "전체 작업",
        value: total.toString(),
        description: "등록된 스케줄 작업",
        icon: <Calendar className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "활성 작업",
        value: enabled.toString(),
        description: `비활성 ${disabled}개`,
        icon: <Activity className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "총 실행 횟수",
        value: totalRuns.toLocaleString(),
        description: `성공률 ${successRate}%`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "default" as const,
      },
      {
        title: "실패 횟수",
        value: totalFailed.toLocaleString(),
        description: `성공 ${totalSuccessful.toLocaleString()}회`,
        icon: <XCircle className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "실행 예정",
        value: upcomingTasks.toString(),
        description: "다음 실행 대기중",
        icon: <Clock className="h-5 w-5" />,
        color: "default" as const,
      },
    ];
  }, [tasks]);

  return <StatsCards cards={stats} columns={4} />;
}
