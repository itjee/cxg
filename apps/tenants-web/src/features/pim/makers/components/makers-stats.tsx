'use client';

import { useMemo } from 'react';
import { Factory, CheckCircle, Package } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';
import type { Maker } from './makers-table';

interface MakersStatsProps {
  makers: Maker[];
}

export function MakersStats({ makers }: MakersStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = makers.length;
    const active = makers.filter((m) => m.is_active).length;
    const totalProducts = makers.reduce((sum, m) => sum + m.product_count, 0);

    return [
      {
        title: '전체 제조사',
        value: total,
        description: '등록된 제조사',
        icon: <Factory className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '활성 제조사',
        value: active,
        description: '거래 중',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '전체 상품',
        value: totalProducts,
        description: '공급 상품',
        icon: <Package className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [makers]);

  return <StatsCards cards={stats} columns={3} />;
}
