"use client";

import { useMemo } from "react";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { PaymentTerm } from "../types/payment-term.types";

interface PaymentTermsStatsProps {
  paymentTerms: PaymentTerm[];
}

export function PaymentTermsStats({ paymentTerms }: PaymentTermsStatsProps) {
  const stats = useMemo(() => {
    const total = paymentTerms.length;
    const active = paymentTerms.filter((pt) => pt.is_active).length;
    const inactive = paymentTerms.filter((pt) => !pt.is_active).length;

    return [
      {
        title: "전체 결제조건",
        value: total,
        description: `${active}개 활성`,
        icon: <Calendar className="h-5 w-5" />,
        color: "primary" as const,
        trend: { value: total, isPositive: true, label: "개" },
      },
      {
        title: "활성 결제조건",
        value: active,
        description: `${
          total > 0 ? ((active / total) * 100).toFixed(0) : 0
        }% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "success" as const,
        trend: { value: 100, isPositive: true, label: "사용중" },
      },
      {
        title: "비활성 결제조건",
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
  }, [paymentTerms]);

  return <StatsCards cards={stats} columns={3} />;
}
