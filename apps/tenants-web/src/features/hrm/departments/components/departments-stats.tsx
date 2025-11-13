'use client';

import { useMemo } from 'react';
import { Building2, CheckCircle2, XCircle, Network } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Department } from '../types';

interface DepartmentsStatsProps {
  departments: Department[];
}

export function DepartmentsStats({ departments }: DepartmentsStatsProps) {
  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter((d) => d.is_active).length;
    const inactive = departments.filter((d) => !d.is_active).length;
    const topLevel = departments.filter((d) => !d.parent_id).length;

    return [
      {
        title: '전체 부서',
        value: total,
        description: `${active}개 활성`,
        icon: <Building2 className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 부서',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 부서',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '상위 부서',
        value: topLevel,
        description: `${total > 0 ? ((topLevel / total) * 100).toFixed(0) : 0}% 최상위`,
        icon: <Network className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: topLevel, isPositive: true, label: '개' },
      },
    ];
  }, [departments]);

  return <StatsCards cards={stats} columns={4} />;
}
