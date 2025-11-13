'use client';

import { useMemo } from 'react';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';

interface RfqItemsStatsProps {
  data: any[];
}

export function RfqItemsStats({ data }: RfqItemsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((item) => item.active || item.status === 'ACTIVE').length;
    const inactive = total - active;

    return [
      {
        title: '전체',
        value: total,
        description: \`\${active}개 활성\`,
        icon: <Activity className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성',
        value: active,
        description: \`\${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률\`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: 'success' as const,
      },
      {
        title: '비활성',
        value: inactive,
        description: \`\${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률\`,
        icon: <XCircle className="h-5 w-5" />,
        color: 'warning' as const,
      },
      {
        title: '최근 활동',
        value: data.filter(item => {
          if (!item.created_at) return false;
          const days = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return days <= 7;
        }).length,
        description: '7일 이내',
        icon: <Clock className="h-5 w-5" />,
        color: 'primary' as const,
      },
    ];
  }, [data]);

  return <StatsCards cards={stats} columns={4} />;
}
