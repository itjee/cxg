'use client';

import { useMemo } from 'react';
import { FolderOpen, CheckCircle, Package } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { StatCardData } from '@/components/stats/stats-cards';
import type { Category } from './categories-table';

interface CategoriesStatsProps {
  categories: Category[];
}

export function CategoriesStats({ categories }: CategoriesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.is_active).length;
    const totalProducts = categories.reduce((sum, c) => sum + c.product_count, 0);

    return [
      {
        title: '전체 카테고리',
        value: total,
        description: '등록된 카테고리',
        icon: <FolderOpen className="h-5 w-5" />,
        color: 'primary' as const,
      },
      {
        title: '활성 카테고리',
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
  }, [categories]);

  return <StatsCards cards={stats} columns={3} />;
}
