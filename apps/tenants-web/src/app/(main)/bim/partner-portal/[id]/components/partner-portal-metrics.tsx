'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface PartnerPortalMetricsProps {
  partner: {
    id: string;
    code: string;
    name: string;
    type: 'supplier' | 'customer' | 'both';
    tier?: string;
    industry?: string;
    address?: string;
    tel?: string;
    email?: string;
    accountOwner?: string;
    logo?: string;
    englishName?: string;
    bizNo?: string;
    website?: string;
    annualRevenue?: number;
    establishedYear?: number;
    employees?: number;
    creditLimit?: number;
  };
  onNewOpportunity?: () => void;
  onNewServiceRequest?: () => void;
  onLogActivity?: () => void;
}

interface MetricCard {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
  color?: 'success' | 'warning' | 'default' | 'primary';
}

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

export function PartnerPortalMetrics({
  partner,
}: PartnerPortalMetricsProps) {
  const metrics: MetricCard[] = [
    {
      label: '최근 12개월 매출',
      value: '₩2,450',
      unit: '만원',
      trend: 'up',
      color: 'success',
      icon: <TrendingUp className="w-full h-full" />,
    },
    {
      label: '미결채권잔액',
      value: '₩850',
      unit: '만원',
      trend: 'down',
      color: 'warning',
      icon: <TrendingDown className="w-full h-full" />,
    },
    {
      label: '진행 중인 기획',
      value: '3',
      unit: '건',
      trend: 'up',
      color: 'success',
      icon: <TrendingUp className="w-full h-full" />,
    },
  ];

  const getTrendColor = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return 'success';
    if (trend === 'down') return 'warning';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* 핵심 재무 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => {
          const color = getTrendColor(metric.trend) as 'success' | 'warning' | 'default' | 'primary';
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
              {metric.icon && (
                <div
                  className={cn(
                    'absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6',
                    iconColorClasses[color],
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
                  <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{metric.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">{metric.value}</p>
                    {metric.unit && (
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    )}
                  </div>
                  {metric.trend && (
                    <div className="mt-3 flex items-center gap-2">
                      {metric.trend === 'up' && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                          ↑ 증가
                        </span>
                      )}
                      {metric.trend === 'down' && (
                        <span className="text-xs font-medium text-destructive">
                          ↓ 감소
                        </span>
                      )}
                      {metric.trend === 'stable' && (
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
    </div>
  );
}
