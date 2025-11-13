"use client";

import { useMemo } from "react";
import { Ruler, CheckCircle2, XCircle, Layers } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Unit } from "../types/units.types";

interface UnitsStatsProps {
  units: Unit[];
}

export function UnitsStats({ units }: UnitsStatsProps) {
  const stats = useMemo(() => {
    const total = units.length;
    const active = units.filter((u) => u.is_active).length;
    const inactive = units.filter((u) => !u.is_active).length;

    return [
      {
        title: "전체 단위",
        value: total,
        description: `${active}개 활성`,
        icon: <Ruler className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "개" },
      },
      {
        title: "활성 단위",
        value: active,
        description: `${
          total > 0 ? ((active / total) * 100).toFixed(0) : 0
        }% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
        trend: { value: 100, isPositive: true, label: "사용중" },
      },
      {
        title: "비활성 단위",
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
      {
        title: "단위 종류",
        value: total,
        description: `${total}개 등록`,
        icon: <Layers className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "종류" },
      },
    ];
  }, [units]);

  return <StatsCards cards={stats} columns={4} />;
}
