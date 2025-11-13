'use client';

/**
 * @file api-keys-stats.tsx
 * @description API 키 관리 통계 카드 컴포넌트
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, CheckCircle, XCircle, Ban, TrendingUp } from 'lucide-react';

interface ApiKeysStatsProps {
  total: number;
  active: number;
  inactive: number;
  revoked: number;
  totalUsage: number;
}

export function ApiKeysStats({ total, active, inactive, revoked, totalUsage }: ApiKeysStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 API 키</CardTitle>
          <Key className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">활성</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((active / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">비활성</CardTitle>
          <XCircle className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactive}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((inactive / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">취소됨</CardTitle>
          <Ban className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{revoked}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((revoked / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            평균 {total > 0 ? Math.floor(totalUsage / total).toLocaleString() : 0}회
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
