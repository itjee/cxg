'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, TrendingDown, BarChart3, AlertCircle, Award, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorClasses = {
  default: 'border-border',
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-orange-500/20 bg-orange-500/5',
};

const iconColorClasses = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-500',
  warning: 'text-orange-600 dark:text-orange-500',
};

const gradientClasses = {
  default: 'from-muted/30 via-transparent to-transparent',
  primary: 'from-primary/10 via-primary/5 to-transparent',
  success: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  warning: 'from-orange-500/10 via-orange-500/5 to-transparent',
};

interface SalesData {
  month: string;
  sales: number;
  target: number;
}

interface CategorySales {
  category: string;
  sales: number;
  percentage: number;
}

interface ReceivableData {
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  balance: number;
  daysOverdue: number;
}

interface AccountChangeHistory {
  date: string;
  previousOwner: string;
  newOwner: string;
  reason: string;
  changedBy: string;
}

interface PartnerPortalTabPerformanceProps {
  partnerId: string;
  salesData?: SalesData[];
  categorySales?: CategorySales[];
  receivables?: ReceivableData[];
  accountChanges?: AccountChangeHistory[];
}

export function PartnerPortalTabPerformance({
  partnerId,
  salesData = [],
  categorySales = [],
  receivables = [],
  accountChanges = [],
}: PartnerPortalTabPerformanceProps) {
  // 모의 매출 데이터 (최근 12개월)
  const mockSalesData: SalesData[] = salesData.length > 0 ? salesData : [
    { month: '2023-11', sales: 180, target: 200 },
    { month: '2023-12', sales: 220, target: 250 },
    { month: '2024-01', sales: 195, target: 220 },
    { month: '2024-02', sales: 240, target: 250 },
    { month: '2024-03', sales: 280, target: 300 },
    { month: '2024-04', sales: 260, target: 280 },
    { month: '2024-05', sales: 310, target: 320 },
    { month: '2024-06', sales: 350, target: 350 },
    { month: '2024-07', sales: 320, target: 330 },
    { month: '2024-08', sales: 290, target: 300 },
    { month: '2024-09', sales: 245, target: 260 },
    { month: '2024-10', sales: 245, target: 280 },
  ];

  // 모의 카테고리별 매출
  const mockCategorySales: CategorySales[] = categorySales.length > 0 ? categorySales : [
    { category: '전자부품', sales: 580, percentage: 38 },
    { category: '기계부품', sales: 420, percentage: 28 },
    { category: '소재', sales: 280, percentage: 18 },
    { category: '서비스', sales: 220, percentage: 14 },
  ];

  // 모의 미수금 데이터
  const mockReceivables: ReceivableData[] = receivables.length > 0 ? receivables : [
    {
      invoiceNo: 'INV-2024-001',
      issueDate: '2024-09-01',
      dueDate: '2024-09-30',
      amount: 15000000,
      balance: 15000000,
      daysOverdue: 31,
    },
    {
      invoiceNo: 'INV-2024-002',
      issueDate: '2024-09-15',
      dueDate: '2024-10-15',
      amount: 22000000,
      balance: 22000000,
      daysOverdue: 17,
    },
    {
      invoiceNo: 'INV-2024-003',
      issueDate: '2024-10-01',
      dueDate: '2024-10-31',
      amount: 18000000,
      balance: 18000000,
      daysOverdue: 1,
    },
  ];

  // 모의 계정 변경이력
  const mockAccountChanges: AccountChangeHistory[] = accountChanges.length > 0 ? accountChanges : [
    {
      date: '2024-08-15',
      previousOwner: '박영업',
      newOwner: '김영업',
      reason: '조직개편',
      changedBy: '이주임',
    },
    {
      date: '2024-06-01',
      previousOwner: '이영업',
      newOwner: '박영업',
      reason: '담당자 이직',
      changedBy: '이주임',
    },
    {
      date: '2024-01-20',
      previousOwner: '김영업',
      newOwner: '이영업',
      reason: '퇴직',
      changedBy: '이주임',
    },
  ];

  const totalSales = mockSalesData.reduce((sum, d) => sum + d.sales, 0);
  const avgSales = (totalSales / mockSalesData.length).toFixed(0);
  const totalReceivables = mockReceivables.reduce((sum, r) => sum + r.balance, 0);
  const creditGrade = '우수';
  const creditTrend = 'up';

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'success';
    if (trend === 'down') return 'warning';
    return 'default';
  };

  const stats = [
    {
      label: '12개월 총 매출',
      value: (totalSales / 1000).toFixed(0),
      unit: '만원',
      trend: 'up' as const,
      color: 'success' as const,
      icon: <BarChart3 className="w-full h-full" />,
    },
    {
      label: '미수금 잔액',
      value: (totalReceivables / 1000000).toFixed(1),
      unit: 'M원',
      trend: 'down' as const,
      color: 'warning' as const,
      icon: <AlertCircle className="w-full h-full" />,
    },
    {
      label: '신용등급',
      value: creditGrade,
      trend: creditTrend as 'up' | 'down',
      color: 'success' as const,
      icon: <Award className="w-full h-full" />,
    },
    {
      label: '최근 거래일',
      value: '2024-10-28',
      trend: 'stable' as const,
      color: 'default' as const,
      icon: <Calendar className="w-full h-full" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const color = stat.color as 'success' | 'warning' | 'default' | 'primary';
          return (
            <Card
              key={idx}
              className={cn(
                colorClasses[color],
                'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
              )}
            >
              {/* 배경 그라디언트 */}
              <div
                className={cn(
                  'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                  gradientClasses[color],
                )}
              />

              {/* 배경 아이콘 */}
              {stat.icon && (
                <div
                  className={cn(
                    'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                    iconColorClasses[color],
                  )}
                >
                  <div className="w-28 h-28">
                    {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, {
                      className: 'w-full h-full'
                    })}
                  </div>
                </div>
              )}

              <CardContent className="p-6 relative h-full flex flex-col justify-center">
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{stat.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">{stat.value}</p>
                    {stat.unit && (
                      <span className="text-sm text-muted-foreground">{stat.unit}</span>
                    )}
                  </div>
                  {stat.trend && (
                    <div className="mt-3 flex items-center gap-2">
                      {stat.trend === 'up' && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                          ↑ 증가
                        </span>
                      )}
                      {stat.trend === 'down' && (
                        <span className="text-xs font-medium text-destructive">
                          ↓ 감소
                        </span>
                      )}
                      {stat.trend === 'stable' && (
                        <span className="text-xs font-medium text-muted-foreground">
                          → 유지
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 매출(매입) 실적 통계 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 월별 매출 추이 */}
          <Card className={cn(
            "relative overflow-hidden",
            "border border-border",
            "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
            "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
            "transition-all duration-300 group cursor-pointer"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
              "from-primary/5 via-primary/2 to-transparent"
            )} />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">월별 매출 추이 (최근 12개월)</h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  내보내기
                </Button>
              </div>

            {/* 간단한 차트 대신 테이블 표시 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    {mockSalesData.map((data) => (
                      <td key={data.month} className="p-2 text-center border-r border-border last:border-r-0">
                        <div className="text-xs text-muted-foreground mb-2">{data.month}</div>
                        <div className="flex gap-1 justify-center items-end h-20">
                          {/* 시각적 바 표현 */}
                          <div
                            className="bg-blue-500 dark:bg-blue-400 rounded-t"
                            style={{
                              width: '12px',
                              height: `${(data.sales / 350) * 100}%`,
                            }}
                            title={`실적: ${data.sales}만원`}
                          ></div>
                          <div
                            className="bg-blue-200 dark:bg-blue-900/30 rounded-t"
                            style={{
                              width: '12px',
                              height: `${(data.target / 350) * 100}%`,
                            }}
                            title={`목표: ${data.target}만원`}
                          ></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span>실적</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900/30"></div>
                  <span>목표</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 매출 */}
          <Card className={cn(
            "relative overflow-hidden",
            "border border-border",
            "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
            "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
            "transition-all duration-300 group cursor-pointer"
          )}>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
              "from-primary/5 via-primary/2 to-transparent"
            )} />
            <CardContent className="p-6 relative z-10">
              <h3 className="text-lg font-semibold text-foreground mb-6">카테고리별 매출 비율</h3>

              <div className="space-y-4">
                {mockCategorySales.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{cat.category}</span>
                      <span className="text-sm font-semibold text-foreground">
                        {(cat.sales / 10).toFixed(0)}만원 ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 dark:bg-blue-400 h-full rounded-full transition-all"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 채권 및 신용정보 */}
        <Card className={cn(
          "relative overflow-hidden",
          "border border-border",
          "bg-gradient-to-br from-neutral-100 dark:from-neutral-700/50 to-neutral-200 dark:to-neutral-800/50",
          "shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10",
          "transition-all duration-300 group cursor-pointer"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
            "from-primary/5 via-primary/2 to-transparent"
          )} />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold text-foreground mb-6">채권 및 신용정보</h3>

            <div className="space-y-6">
              {/* 미수금 상세 */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">미수금 상세</h4>
                <div className="overflow-x-auto max-h-40 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-neutral-100 dark:bg-neutral-700/50">
                      <tr>
                        <th className="text-left p-2 font-medium">청구서</th>
                        <th className="text-right p-2 font-medium">잔액</th>
                        <th className="text-right p-2 font-medium">연체</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockReceivables.map((r) => (
                        <tr key={r.invoiceNo} className="hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
                          <td className="p-2 text-foreground">{r.invoiceNo}</td>
                          <td className="text-right p-2 font-medium text-foreground">
                            {(r.balance / 1000000).toFixed(1)}M
                          </td>
                          <td
                            className={`text-right p-2 font-medium ${
                              r.daysOverdue > 30
                                ? 'text-red-600 dark:text-red-400'
                                : r.daysOverdue > 0
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {r.daysOverdue}일
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 신용등급 변동이력 */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">신용등급 변동</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">현재등급</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{creditGrade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">지난월</span>
                    <span className="text-sm font-bold">우수</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">점수</span>
                    <span className="text-sm font-bold">92/100</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
