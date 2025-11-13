'use client';

import { useMemo } from 'react';
import { Building2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Partner } from '../types';

interface PartnersStatsProps {
  partners: Partner[];
}

export function PartnersStats({ partners }: PartnersStatsProps) {
  const stats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter((p) => p.status === 'ACTIVE').length;
    const inactive = partners.filter((p) => p.status === 'INACTIVE').length;
    const suspended = partners.filter((p) => p.status === 'SUSPENDED').length;

    return [
      {
        title: '전체 거래처',
        value: total,
        description: `${active}개 활성`,
        icon: <Building2 className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 거래처',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 거래처',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '중지 거래처',
        value: suspended,
        description: `${total > 0 ? ((suspended / total) * 100).toFixed(0) : 0}% 중지율`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: suspended, isPositive: false, label: '개' },
      },
    ];
  }, [partners]);

  return <StatsCards cards={stats} columns={4} />;
}
