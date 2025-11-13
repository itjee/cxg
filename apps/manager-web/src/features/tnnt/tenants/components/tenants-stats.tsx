'use client';

/**
 * @file tenants-stats.tsx
 * @description 테넌트 관리 통계 카드 컴포넌트
 *
 * 테넌트 관리 페이지에서 표시할 주요 통계
 * - 전체 테넌트 수
 * - 활성(ACTIVE) 테넌트 수
 * - 일시중단(SUSPENDED) 테넌트 수
 * - 평가판(TRIAL) 테넌트 수
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import type { Tenant } from '../types';

interface TenantsStatsProps {
  data: Tenant[];
}

export function TenantsStats({ data }: TenantsStatsProps) {
  // 전체 테넌트 수
  const total = data.length;

  // 상태별 집계
  const activeCount = data.filter((t) => t.status === 'ACTIVE').length;
  const suspendedCount = data.filter((t) => t.is_suspended).length;
  const trialCount = data.filter((t) => t.type === 'TRIAL').length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* 전체 테넌트 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 테넌트</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {total === 0 ? '테넌트 없음' : `${total}개`}
          </p>
        </CardContent>
      </Card>

      {/* 활성 테넌트 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">활성</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {total > 0
              ? `${((activeCount / total) * 100).toFixed(0)}%`
              : '0%'}
          </p>
        </CardContent>
      </Card>

      {/* 일시중단 테넌트 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">일시중단</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{suspendedCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {total > 0
              ? `${((suspendedCount / total) * 100).toFixed(0)}%`
              : '0%'}
          </p>
        </CardContent>
      </Card>

      {/* 평가판 테넌트 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">평가판</CardTitle>
          <Zap className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{trialCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {total > 0
              ? `${((trialCount / total) * 100).toFixed(0)}%`
              : '0%'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
