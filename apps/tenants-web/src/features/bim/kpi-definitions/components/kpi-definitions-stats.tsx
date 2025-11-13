'use client';

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Activity } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';

interface KpiDefinitionsStatsProps {
  data: any[];
}

export function KpiDefinitionsStats({ data }: KpiDefinitionsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((item) => item.active || item.status === 'ACTIVE').length;
    const inactive = total - active;
    const highValue = data.filter((item) => {
      const value = item.value || item.amount || 0;
      return value > 1000000;
    }).length;

    return [
      {
        title: '전체',
        value: total,
        description: `${active}개 활성`,
        icon: <BarChart3 className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '비활성',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <Activity className="h-5 w-5" />,
        color: 'warning' as const,
      },
      {
        title: '고가치',
        value: highValue,
        description: `100만원 이상 ${total > 0 ? ((highValue / total) * 100).toFixed(0) : 0}%`,
        icon: <Target className="h-5 w-5" />,
        color: 'primary' as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
