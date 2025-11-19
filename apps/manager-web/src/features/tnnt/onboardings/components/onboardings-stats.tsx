/**
 * @file onboardings-stats.tsx
 * @description 온보딩 프로세스 통계 카드
 */

'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  SkipForward,
  TrendingUp,
} from 'lucide-react';
import type { Onboarding } from '../types';

interface OnboardingsStatsProps {
  data: Onboarding[];
}

export function OnboardingsStats({ data }: OnboardingsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((item) => item.step_status === 'PENDING').length;
    const inProgress = data.filter((item) => item.step_status === 'IN_PROGRESS').length;
    const completed = data.filter((item) => item.step_status === 'COMPLETED').length;
    const failed = data.filter((item) => item.step_status === 'FAILED').length;
    const skipped = data.filter((item) => item.step_status === 'SKIPPED').length;

    // 재시도가 있는 항목
    const withRetries = data.filter((item) => item.retry_count > 0).length;

    // 평균 재시도 횟수
    const avgRetries = withRetries > 0
      ? (data.reduce((sum, item) => sum + item.retry_count, 0) / withRetries).toFixed(1)
      : '0';

    // 완료율
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';
    
    // 실패율
    const failureRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0';

    return {
      total,
      pending,
      inProgress,
      completed,
      failed,
      skipped,
      withRetries,
      avgRetries,
      completionRate,
      failureRate,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">전체</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-sm text-muted-foreground">
            총 프로세스 수
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">완료</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completed}</div>
          <p className="text-sm text-muted-foreground">
            완료율 {stats.completionRate}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">진행 중</CardTitle>
          <Loader2 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.inProgress}</div>
          <p className="text-sm text-muted-foreground">
            대기: {stats.pending}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">실패</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.failed}</div>
          <p className="text-sm text-muted-foreground">
            실패율 {stats.failureRate}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">재시도</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.withRetries}</div>
          <p className="text-sm text-muted-foreground">
            평균 {stats.avgRetries}회
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">건너뜀</CardTitle>
          <SkipForward className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.skipped}</div>
          <p className="text-sm text-muted-foreground">
            {stats.total > 0 ? ((stats.skipped / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
