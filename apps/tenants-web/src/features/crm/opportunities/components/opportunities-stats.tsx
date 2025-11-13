'use client';

import { useMemo } from 'react';
import { Target, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Opportunity } from '../types';

interface OpportunitiesStatsProps {
  opportunities: Opportunity[];
}

export function OpportunitiesStats({ opportunities }: OpportunitiesStatsProps) {
  const stats = useMemo(() => {
    const total = opportunities.length;
    const active = opportunities.filter((o) => o.active).length;
    const inactive = opportunities.filter((o) => !o.active).length;
    const highValue = opportunities.filter((o) => {
      return o.expected_revenue && o.expected_revenue > 100000000;
    }).length;

    return [
      {
        title: '전체 영업기회',
        value: total,
        description: `${active}개 활성`,
        icon: <Target className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 영업기회',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '진행중' },
      },
      {
        title: '비활성 영업기회',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <Clock className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '고액 영업기회',
        value: highValue,
        description: `1억원 이상 ${total > 0 ? ((highValue / total) * 100).toFixed(0) : 0}%`,
        icon: <DollarSign className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: highValue, isPositive: true, label: '개' },
      },
    ];
  }, [opportunities]);

  return <StatsCards cards={stats} columns={4} />;
}
