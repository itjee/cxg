"use client";

import { useMemo } from "react";
import { DollarSign, CheckCircle2, XCircle, ArrowRightLeft } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { ExchangeRate } from "../types/exchange-rates.types";

interface ExchangeRatesStatsProps {
  exchangeRates: ExchangeRate[];
}

export function ExchangeRatesStats({ exchangeRates }: ExchangeRatesStatsProps) {
  const stats = useMemo(() => {
    const total = exchangeRates.length;
    const active = exchangeRates.filter((er) => er.is_active).length;
    const inactive = exchangeRates.filter((er) => !er.is_active).length;

    // Count unique currency pairs
    const uniquePairs = new Set(
      exchangeRates.map((er) => `${er.from_currency}-${er.to_currency}`)
    ).size;

    return [
      {
        title: "전체 환율",
        value: total,
        description: `${active}개 활성`,
        icon: <DollarSign className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "개" },
      },
      {
        title: "활성 환율",
        value: active,
        description: `${
          total > 0 ? ((active / total) * 100).toFixed(0) : 0
        }% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
        trend: { value: 100, isPositive: true, label: "사용중" },
      },
      {
        title: "비활성 환율",
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
        title: "통화쌍",
        value: uniquePairs,
        description: `${uniquePairs}개 통화쌍`,
        icon: <ArrowRightLeft className="h-5 w-5" />,
        color: "info" as const,
        trend: { value: uniquePairs, isPositive: true, label: "개" },
      },
    ];
  }, [exchangeRates]);

  return <StatsCards cards={stats} columns={4} />;
}
