'use client';

import { useMemo } from 'react';
import { FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';

interface ApprovalLinesStatsProps {
  data: any[];
}

export function ApprovalLinesStats({ data }: ApprovalLinesStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const approved = data.filter((item) => item.status === 'APPROVED').length;
    const pending = data.filter((item) => item.status === 'PENDING').length;
    const rejected = data.filter((item) => item.status === 'REJECTED').length;

    return [
      {
        title: '전체',
        value: total,
        description: `${approved}개 승인`,
        icon: <FileText className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '승인',
        value: approved,
        description: `${total > 0 ? ((approved / total) * 100).toFixed(0) : 0}% 승인률`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '대기',
        value: pending,
        description: `${total > 0 ? ((pending / total) * 100).toFixed(0) : 0}% 대기중`,
        icon: <Clock className="h-5 w-5" />,
        color: 'warning' as const,
      },
      {
        title: '반려',
        value: rejected,
        description: `${total > 0 ? ((rejected / total) * 100).toFixed(0) : 0}% 반려`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'default' as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
