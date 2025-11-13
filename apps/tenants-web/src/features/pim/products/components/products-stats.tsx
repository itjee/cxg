'use client';

import { useMemo } from 'react';
import { Package, CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';
import type { Product } from './products-table';

interface ProductsStatsProps {
  products: Product[];
}

export function ProductsStats({ products }: ProductsStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === 'active').length;
    const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;
    const totalValue = products.reduce(
      (sum, p) => sum + ((p.price || 0) * (p.stock || 0)),
      0
    );

    return [
      {
        title: '전체 제품',
        value: total,
        description: '등록된 제품',
        icon: <Package className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '판매중',
        value: active,
        description: '활성 제품',
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '품절',
        value: outOfStock,
        description: '재고 없음',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'danger' as const,
      },
      {
        title: '재고 가치',
        value: `${(totalValue / 1000000).toFixed(1)}M`,
        description: '총 재고 금액',
        icon: <Circle className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [products]);

  return <StatsCards cards={stats} columns={4} />;
}
