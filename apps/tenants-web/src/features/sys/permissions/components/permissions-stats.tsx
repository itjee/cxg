'use client';

import { useMemo } from 'react';
import { Lock, CheckCircle, AlertCircle, Code } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Permission } from '../types';

interface PermissionsStatsProps {
  permissions: Permission[];
}

export function PermissionsStats({ permissions }: PermissionsStatsProps) {
  const stats = useMemo(() => {
    const total = permissions.length;
    const active = permissions.filter((p) => p.active).length;
    const inactive = permissions.filter((p) => !p.active).length;

    // 고유 모듈 수
    const uniqueModules = new Set(permissions.map((p) => p.module)).size;

    return [
      {
        title: '전체 권한',
        value: total,
        description: `${active}개 활성`,
        icon: <Lock className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 권한',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 권한',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '모듈 수',
        value: uniqueModules,
        description: `${total}개 권한 할당`,
        icon: <Code className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: uniqueModules, isPositive: true, label: '개' },
      },
    ];
  }, [permissions]);

  return <StatsCards cards={stats} columns={4} />;
}
