/**
 * @file revenue-tab.tsx
 * @description Tab for viewing revenue and sales data
 */

"use client";

import { Card } from "@/components/ui/card";

interface RevenueData {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  currency: string;
  invoiceCount: number;
  paidInvoiceCount: number;
  overdueInvoiceCount: number;
  averageInvoiceAmount: number;
  lastInvoiceDate?: string;
}

interface RevenueTabProps {
  revenueData: RevenueData | undefined;
  isLoading?: boolean;
}

export function RevenueTab({ revenueData, isLoading }: RevenueTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 h-24 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!revenueData) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          매출 데이터가 없습니다
        </div>
      </Card>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const stats = [
    {
      label: "총 매출",
      value: formatCurrency(revenueData.totalRevenue, revenueData.currency),
      color: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "결제 완료",
      value: formatCurrency(revenueData.totalPaid, revenueData.currency),
      color: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "대기 중",
      value: formatCurrency(revenueData.totalPending, revenueData.currency),
      color: "bg-yellow-50 dark:bg-yellow-950",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "연체",
      value: formatCurrency(revenueData.totalOverdue, revenueData.currency),
      color: "bg-red-50 dark:bg-red-950",
      textColor: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`p-4 ${stat.color}`}
          >
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {stat.label}
            </div>
            <div className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Invoice Statistics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">청구서 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              총 청구서
            </div>
            <div className="text-2xl font-bold">
              {revenueData.invoiceCount}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">
              결제 완료 청구서
            </div>
            <div className="text-2xl font-bold text-green-600">
              {revenueData.paidInvoiceCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              완료율:{" "}
              {revenueData.invoiceCount > 0
                ? (
                    (revenueData.paidInvoiceCount /
                      revenueData.invoiceCount) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">
              연체 청구서
            </div>
            <div className="text-2xl font-bold text-red-600">
              {revenueData.overdueInvoiceCount}
            </div>
          </div>
        </div>
      </Card>

      {/* Average Invoice Amount */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">평균 청구 금액</h3>
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {formatCurrency(
              revenueData.averageInvoiceAmount,
              revenueData.currency
            )}
          </div>
          {revenueData.lastInvoiceDate && (
            <div className="text-sm text-muted-foreground">
              마지막 청구서: {revenueData.lastInvoiceDate}
            </div>
          )}
        </div>
      </Card>

      {/* Revenue Summary */}
      <Card className="p-6 bg-gradient-to-br from-muted to-muted/50">
        <h3 className="font-semibold mb-4">매출 요약</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">수금률</span>
            <span className="font-medium">
              {revenueData.totalRevenue > 0
                ? (
                    (revenueData.totalPaid / revenueData.totalRevenue) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">미수금</span>
            <span className="font-medium">
              {formatCurrency(
                revenueData.totalPending,
                revenueData.currency
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">연체금</span>
            <span className="font-medium text-red-600">
              {formatCurrency(
                revenueData.totalOverdue,
                revenueData.currency
              )}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
