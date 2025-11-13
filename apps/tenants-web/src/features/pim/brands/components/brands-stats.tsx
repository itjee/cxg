'use client';

import { useMemo } from 'react';
import { Sparkles, CheckCircle, Package } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';
import type { Brand } from './brands-table';

interface BrandsStatsProps {
  brands: Brand[];
}

export function BrandsStats({ brands }: BrandsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = brands.length;
    const active = brands.filter((b) => b.is_active).length;
    const totalProducts = brands.reduce((sum, b) => sum + b.product_count, 0);

    return [
      {
        title: '전체 브랜드',
        value: total,
        description: '등록된 브랜드',
        icon: <Sparkles className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '활성 브랜드',
        value: active,
        description: '사용 중',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '전체 상품',
        value: totalProducts,
        description: '포함된 상품',
        icon: <Package className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [brands]);

  return <StatsCards cards={stats} columns={3} />;
}
