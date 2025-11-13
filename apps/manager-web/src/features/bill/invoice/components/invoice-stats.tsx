"use client";

/**
 * @file invoice-stats.tsx
 * @description 청구서 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 청구서 지표 표시
 */

import { useMemo } from "react";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Invoice } from "../types";

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

interface InvoiceStatsProps {
  invoices: Invoice[];
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((inv) => inv.status === "PAID").length;
    const pending = invoices.filter((inv) => inv.status === "PENDING").length;
    const overdue = invoices.filter((inv) => inv.status === "OVERDUE").length;

    // 결제율 계산
    const paidRate = total > 0 ? ((paid / total) * 100).toFixed(1) : "0.0";
    const pendingRate = total > 0 ? ((pending / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "전체 청구서",
        value: total.toString(),
        description: "총 청구서 수",
        icon: <FileText className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "결제 완료",
        value: paid.toString(),
        description: `전체의 ${paidRate}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "결제 대기",
        value: pending.toString(),
        description: `전체의 ${pendingRate}%`,
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
      {
        title: "연체",
        value: overdue.toString(),
        description: "즉시 확인 필요",
        icon: <AlertCircle className="h-5 w-5" />,
        color: "danger" as const,
      },
    ];
  }, [invoices]);

  return <StatsCards cards={stats} columns={4} />;
}
