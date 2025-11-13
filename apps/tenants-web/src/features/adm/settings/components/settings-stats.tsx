"use client";

import { useMemo } from "react";
import { Settings, CheckCircle2, XCircle, Layers } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Setting } from "../types/settings.types";

interface SettingsStatsProps {
  settings: Setting[];
}

export function SettingsStats({ settings }: SettingsStatsProps) {
  const stats = useMemo(() => {
    const total = settings.length;
    const active = settings.filter((s) => s.is_active).length;
    const inactive = settings.filter((s) => !s.is_active).length;
    const systemSettings = settings.filter((s) => s.is_system).length;

    return [
      {
        title: "전체 설정",
        value: total,
        description: `${active}개 활성`,
        icon: <Settings className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "개" },
      },
      {
        title: "활성 설정",
        value: active,
        description: `${
          total > 0 ? ((active / total) * 100).toFixed(0) : 0
        }% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
        trend: { value: 100, isPositive: true, label: "가동중" },
      },
      {
        title: "비활성 설정",
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
        title: "시스템 설정",
        value: systemSettings,
        description: `${
          total > 0 ? ((systemSettings / total) * 100).toFixed(0) : 0
        }% 시스템`,
        icon: <Layers className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: systemSettings, isPositive: true, label: "개" },
      },
    ];
  }, [settings]);

  return <StatsCards cards={stats} columns={4} />;
}
