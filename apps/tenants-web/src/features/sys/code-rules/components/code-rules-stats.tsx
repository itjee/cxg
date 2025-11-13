'use client';

import { useMemo } from 'react';
import { Code, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { StatsCards } from '@/components/stats/stats-cards';
import type { CodeRule } from '../types';

interface CodeRulesStatsProps {
  codeRules: CodeRule[];
}

export function CodeRulesStats({ codeRules }: CodeRulesStatsProps) {
  const stats = useMemo(() => {
    const total = codeRules.length;
    const active = codeRules.filter((r) => r.active).length;
    const inactive = codeRules.filter((r) => !r.active).length;

    // 전체 발급된 코드 수
    const totalCodesIssued = codeRules.reduce((sum, r) => sum + r.currentNumber - 1, 0);

    return [
      {
        title: '총 규칙 수',
        value: total,
        description: `${active}개 활성`,
        icon: <Code className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: total, isPositive: true, label: '개' },
      },
      {
        title: '활성 규칙',
        value: active,
        description: `${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% 활성률`,
        icon: <CheckCircle className="h-5 w-5" />,
        color: 'success' as const,
        trend: { value: 100, isPositive: true, label: '가동중' },
      },
      {
        title: '비활성 규칙',
        value: inactive,
        description: `${total > 0 ? ((inactive / total) * 100).toFixed(0) : 0}% 비활성률`,
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'warning' as const,
        trend: { value: inactive > 0 ? inactive : 0, isPositive: inactive === 0 },
      },
      {
        title: '발급된 코드',
        value: totalCodesIssued,
        description: `전체 규칙의 누적 발급`,
        icon: <Zap className="h-5 w-5" />,
        color: 'primary' as const,
        trend: { value: totalCodesIssued, isPositive: true, label: '개' },
      },
    ];
  }, [codeRules]);

  return <StatsCards cards={stats} columns={4} />;
}
