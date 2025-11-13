/**
 * @file tenant-users-stats.tsx
 * @description 테넌트 사용자 통계 카드
 */

'use client';

import { useMemo } from 'react';
import { Users, UserCheck, UserX, Crown, Activity } from 'lucide-react';
import { StatsCards, type StatCardData } from '@/components/stats';
import type { TenantUser } from '../types';

interface TenantUsersStatsProps {
  data: TenantUser[];
}

export function TenantUsersStats({ data }: TenantUsersStatsProps) {
  const stats: StatCardData[] = useMemo(() => {
    const total = data.length;
    const active = data.filter((user) => user.status === 'ACTIVE').length;
    const inactive = data.filter((user) => user.status === 'INACTIVE').length;
    const suspended = data.filter((user) => user.status === 'SUSPENDED').length;
    const primary = data.filter((user) => user.is_primary).length;
    
    const totalLogins = data.reduce((sum, user) => sum + user.login_count, 0);
    const avgLogins = total > 0 ? Math.round(totalLogins / total) : 0;

    const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : '0';

    return [
      {
        title: '전체 사용자',
        value: total.toString(),
        description: '총 사용자 수',
        icon: <Users className="h-5 w-5" />,
        color: 'primary',
      },
      {
        title: '활성 사용자',
        value: active.toString(),
        description: `활성률 ${activeRate}%`,
        icon: <UserCheck className="h-5 w-5" />,
        color: 'success',
        trend: {
          value: 12,
          isPositive: true,
          label: '전월 대비',
        },
      },
      {
        title: '주 사용자',
        value: primary.toString(),
        description: '테넌트 주 사용자',
        icon: <Crown className="h-5 w-5" />,
        color: 'primary',
      },
      {
        title: '평균 로그인',
        value: `${avgLogins}회`,
        description: `총 ${totalLogins.toLocaleString()}회`,
        icon: <Activity className="h-5 w-5" />,
        color: 'success',
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
