'use client';

import { useMemo } from 'react';
import { DollarSign, CheckCircle2, XCircle, Banknote } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { Currency } from '../types';

interface CurrenciesStatsProps {
  currencies: Currency[];
}

export function CurrenciesStats({ currencies }: CurrenciesStatsProps) {
  const stats = useMemo(() => {
    const total = currencies.length;
    const active = currencies.filter((c) => c.is_active).length;
    const inactive = currencies.filter((c) => !c.is_active).length;

    return [
      {
        title: '전체 통화',
        value: total,
        description: `${active}개 활성`,
        icon: <DollarSign className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 통화',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '사용중' },
      },
      {
        title: '비활성 통화',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '통화 종류',
        value: total,
        description: `${total}개 등록`,
        icon: <Banknote className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '종류' },
      },
    ];
  }, [currencies]);

  return <StatsCards cards={stats} columns={4} />;
}
