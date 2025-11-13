'use client';

import { useMemo } from 'react';
import { Package, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';

interface FixedAssetsStatsProps {
  data: any[];
}

export function FixedAssetsStats({ data }: FixedAssetsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((item) => item.status === 'ACTIVE' || item.active).length;
    const totalValue = data.reduce((sum, item) => sum + (item.value || item.acquisition_cost || 0), 0);
    const depreciated = data.filter((item) => item.depreciation_value > 0 || item.accumulated_depreciation > 0).length;

    return [
      {
        title: '전체 자산',
        value: total,
        description: `${active}개 운용중`,
        icon: <Package className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '운용중',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 가동률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '총 자산가치',
        value: Math.round(totalValue / 10000),
        description: '만원',
        icon: <DollarSign className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '감가상각',
        value: depreciated,
        description: `${total > 0 ? ((depreciated / total) * 100).toFixed(0) : 0}% 감가상각`,
        icon: <TrendingDown className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
