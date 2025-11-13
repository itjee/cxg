'use client';

import { useMemo } from 'react';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Activity as ActivityType } from '../types';

interface ActivitiesStatsProps {
  activities: ActivityType[];
}

export function ActivitiesStats({ activities }: ActivitiesStatsProps) {
  const stats = useMemo(() => {
    const total = activities.length;
    const completed = activities.filter((a) => a.status === 'COMPLETED').length;
    const pending = activities.filter((a) => a.status === 'PENDING').length;
    const cancelled = activities.filter((a) => a.status === 'CANCELLED').length;

    return [
      {
        title: '전체 활동',
        value: total,
        description: `${completed}개 완료`,
        icon: <Activity className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '완료된 활동',
        value: completed,
        description: `${total > 0 ? ((completed / total) * 100).toFixed(0) : 0}% 완료율`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '완료' },
      },
      {
        title: '대기 중인 활동',
        value: pending,
        description: `${total > 0 ? ((pending / total) * 100).toFixed(0) : 0}% 대기율`,
        icon: <Clock className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: pending > 0 ? pending : 0, isPositive: false },
      },
      {
        title: '취소된 활동',
        value: cancelled,
        description: `${total > 0 ? ((cancelled / total) * 100).toFixed(0) : 0}% 취소율`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'default' as const,
        trend: { value: cancelled, isPositive: false, label: '개' },
      },
    ];
  }, [activities]);

  return <StatsCards cards={stats} columns={4} />;
}
