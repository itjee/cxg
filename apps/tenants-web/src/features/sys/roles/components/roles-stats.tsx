'use client';

import { useMemo } from 'react';
import { Lock, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Role } from '../types';

interface RolesStatsProps {
  roles: Role[];
}

export function RolesStats({ roles }: RolesStatsProps) {
  const stats = useMemo(() => {
    const total = roles.length;
    const active = roles.filter((r) => r.active).length;
    const inactive = roles.filter((r) => !r.active).length;
    const withPermissions = roles.filter((r) => r.permissionIds && r.permissionIds.length > 0).length;

    return [
      {
        title: '전체 역할',
        value: total,
        description: `${active}개 활성`,
        icon: <Lock className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 역할',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 역할',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '권한 할당됨',
        value: withPermissions,
        description: `${total > 0 ? ((withPermissions / total) * 100).toFixed(0) : 0}% 권한 설정 완료`,
        icon: <Layers className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: withPermissions, isPositive: true, label: '개' },
      },
    ];
  }, [roles]);

  return <StatsCards cards={stats} columns={4} />;
}
