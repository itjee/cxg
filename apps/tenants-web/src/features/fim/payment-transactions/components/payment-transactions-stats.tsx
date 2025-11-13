'use client';

import { useMemo } from 'react';
import { FileText, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';

interface PaymentTransactionsStatsProps {
  data: any[];
}

export function PaymentTransactionsStats({ data }: PaymentTransactionsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const totalAmount = data.reduce((sum, item) => sum + (item.amount || item.debit_amount || item.credit_amount || 0), 0);
    const completed = data.filter((item) => item.status === 'COMPLETED' || item.status === 'POSTED').length;
    const pending = data.filter((item) => item.status === 'PENDING' || item.status === 'DRAFT').length;

    return [
      {
        title: '전체',
        value: total,
        description: `${completed}개 완료`,
        icon: <FileText className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '총 금액',
        value: Math.round(totalAmount / 10000),
        description: '만원',
        icon: <DollarSign className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '완료',
        value: completed,
        description: `${total > 0 ? ((completed / total) * 100).toFixed(0) : 0}% 완료율`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '대기',
        value: pending,
        description: `${total > 0 ? ((pending / total) * 100).toFixed(0) : 0}% 대기중`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'warning' as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
