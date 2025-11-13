/**
 * @file tenant-roles-stats.tsx
 * @description 테넌트 역할 통계 카드
 */

'use client';

import { useMemo } from 'react';
import { Shield, ShieldCheck, ShieldOff, Users } from 'lucide-react';
import { StatsCards, type StatCardData } from '@/components/stats';
import type { TenantRole } from '../types';

interface TenantRolesStatsProps {
  data: TenantRole[];
}

export function TenantRolesStats({ data }: TenantRolesStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((role) => role.status === 'ACTIVE').length;
    const inactive = data.filter((role) => role.status === 'INACTIVE').length;
    const systemRoles = data.filter((role) => role.is_system_role).length;
    const customRoles = total - systemRoles;

    const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : '0';

    return [
      {
        title: '전체 역할',
        value: total.toString(),
        description: '총 역할 수',
        icon: <Shield className="h-5 w-5" />,
        color: 'primary',
      },
      {
        title: '활성 역할',
        value: active.toString(),
        description: `활성률 ${activeRate}%`,
        icon: <ShieldCheck className="h-5 w-5" />,
        color: 'success',
        trend: {
          value: 8,
          isPositive: true,
          label: '전월 대비',
        },
      },
      {
        title: '시스템 역할',
        value: systemRoles.toString(),
        description: `커스텀: ${customRoles}개`,
        icon: <Shield className="h-5 w-5" />,
        color: 'primary',
      },
      {
        title: '비활성 역할',
        value: inactive.toString(),
        description: `전체의 ${total > 0 ? ((inactive / total) * 100).toFixed(1) : '0'}%`,
        icon: <ShieldOff className="h-5 w-5" />,
        color: 'warning',
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
