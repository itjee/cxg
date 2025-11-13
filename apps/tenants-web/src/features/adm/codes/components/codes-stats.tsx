"use client";

import { useMemo } from "react";
import { Code2, CheckCircle2, XCircle } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Code } from "../types/codes.types";

interface CodesStatsProps {
  codes: Code[];
}

export function CodesStats({ codes }: CodesStatsProps) {
  const stats = useMemo(() => {
    const total = codes.length;
    const active = codes.filter((c) => c.is_active).length;
    const inactive = codes.filter((c) => !c.is_active).length;

    return [
      {
        title: "전체 코드",
        value: total,
        description: `${active}개 활성`,
        icon: <Code2 className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "개" },
      },
      {
        title: "활성 코드",
        value: active,
        description: `${
          total > 0 ? ((active / total) * 100).toFixed(0) : 0
        }% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
        trend: { value: 100, isPositive: true, label: "사용중" },
      },
      {
        title: "비활성 코드",
        value: inactive,
        description: `${
          total > 0 ? ((inactive / total) * 100).toFixed(0) : 0
        }% 비활성률`,
        icon: <XCircle className="h-5 w-5" />,
        color: "warning" as const,
        trend: {
          value: inactive > 0 ? inactive : 0,
          isPositive: inactive === 0,
        },
      },
    ];
  }, [codes]);

  return <StatsCards cards={stats} columns={3} />;
}
