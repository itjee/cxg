"use client";

/**
 * @file transaction-stats.tsx
 * @description 거래 통계 카드 컴포넌트
 *
 * StatsCards 컴포넌트를 사용하여 주요 거래 지표 표시
 */

import { useMemo } from "react";
import { DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import type { Transaction } from "../types";

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

interface TransactionStatsProps {
  transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const stats: StatCardData[] = useMemo(() => {
    const total = transactions.length;
    const totalAmount = transactions.reduce(
      (sum, txn) => sum + Number(txn.amount),
      0
    );
    const successCount = transactions.filter((txn) => txn.status === "SUCCESS").length;
    const failedCount = transactions.filter((txn) => txn.status === "FAILED").length;
    const pendingCount = transactions.filter((txn) => txn.status === "PENDING").length;

    // 성공률 계산
    const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : "0.0";
    const failureRate = total > 0 ? ((failedCount / total) * 100).toFixed(1) : "0.0";

    return [
      {
        title: "총 거래액",
        value: formatCurrency(totalAmount),
        description: `${total}건 거래`,
        icon: <DollarSign className="h-5 w-5" />,
        color: "primary" as const,
      },
      {
        title: "성공",
        value: successCount.toString(),
        description: `전체의 ${successRate}%`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "success" as const,
      },
      {
        title: "실패",
        value: failedCount.toString(),
        description: `전체의 ${failureRate}%`,
        icon: <XCircle className="h-5 w-5" />,
        color: "danger" as const,
      },
      {
        title: "대기 중",
        value: pendingCount.toString(),
        description: "처리 대기 중",
        icon: <Clock className="h-5 w-5" />,
        color: "warning" as const,
      },
    ];
  }, [transactions]);

  return <StatsCards cards={stats} columns={4} />;
}
