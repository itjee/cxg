'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, PieChart, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCard {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: number;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'info';
}

interface ProductPortalMetricsProps {
  performanceData: {
    totalRevenue: number;
    grossMargin: number;
    unitsSold: number;
    marketShare: number;
    revenueTrend?: number;
    marginTrend?: number;
  };
}

const colorClasses = {
  primary: 'border-primary/20 bg-primary/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-orange-500/20 bg-orange-500/5',
  info: 'border-cyan-500/20 bg-cyan-500/5',
};

const iconColorClasses = {
  primary: 'text-primary',
  success: 'text-emerald-600 dark:text-emerald-500',
  warning: 'text-orange-600 dark:text-orange-500',
  info: 'text-cyan-600 dark:text-cyan-500',
};

const gradientClasses = {
  primary: 'from-primary/10 via-primary/5 to-transparent',
  success: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  warning: 'from-orange-500/10 via-orange-500/5 to-transparent',
  info: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
};

export function ProductPortalMetrics({ performanceData }: ProductPortalMetricsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₩${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `₩${(value / 1000000).toFixed(0)}M`;
    }
    return `₩${value.toLocaleString()}`;
  };

  const metrics: MetricCard[] = [
    {
      label: '누적 매출액',
      value: formatCurrency(performanceData.totalRevenue),
      unit: '',
      trend: 'up',
      change: performanceData.revenueTrend || 12.5,
      icon: <DollarSign className="w-full h-full" />,
      color: 'primary',
    },
    {
      label: '이익률',
      value: performanceData.grossMargin,
      unit: '%',
      trend: 'up',
      change: performanceData.marginTrend || 3.2,
      icon: <PieChart className="w-full h-full" />,
      color: 'success',
    },
    {
      label: '판매 수량',
      value: performanceData.unitsSold,
      unit: '개',
      trend: 'up',
      change: 8.7,
      icon: <ShoppingCart className="w-full h-full" />,
      color: 'info',
    },
    {
      label: '시장 점유율',
      value: performanceData.marketShare,
      unit: '%',
      trend: 'stable',
      icon: <Target className="w-full h-full" />,
      color: 'warning',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">핵심 성과 지표</h2>
        <button className="text-xs text-muted-foreground hover:text-foreground">
          마지막 업데이트: 오늘 10:30
        </button>
      </div>

      {/* 메트릭 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card
            key={idx}
            className={cn(
              colorClasses[metric.color],
              'relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-32',
            )}
          >
            {/* 배경 그라디언트 */}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100',
                gradientClasses[metric.color],
              )}
            />

            {/* 배경 아이콘 */}
            {metric.icon && (
              <div
                className={cn(
                  'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                  iconColorClasses[metric.color],
                )}
              >
                <div className="w-28 h-28">
                  {React.cloneElement(metric.icon as React.ReactElement<{ className?: string }>, {
                    className: 'w-full h-full'
                  })}
                </div>
              </div>
            )}

            <CardContent className="p-6 relative h-full flex flex-col justify-center">
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {metric.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">
                    {metric.value}
                  </p>
                  {metric.unit && (
                    <span className="text-sm text-muted-foreground">{metric.unit}</span>
                  )}
                </div>
                {metric.trend && (
                  <div className="mt-3 flex items-center gap-2">
                    {metric.trend === 'up' && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                        ↑ {metric.change !== undefined ? `+${metric.change}%` : '증가'}
                      </span>
                    )}
                    {metric.trend === 'down' && (
                      <span className="text-xs font-medium text-orange-600 dark:text-orange-500">
                        ↓ {metric.change !== undefined ? `${metric.change}%` : '감소'}
                      </span>
                    )}
                    {metric.trend === 'stable' && (
                      <span className="text-xs font-medium text-muted-foreground">
                        → 유지
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">전월 대비</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
