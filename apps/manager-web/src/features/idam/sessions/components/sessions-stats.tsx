'use client';

/**
 * @file sessions-stats.tsx
 * @description 세션 관리 통계 카드 컴포넌트
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, Clock, XCircle, Shield } from 'lucide-react';

interface SessionsStatsProps {
  total: number;
  active: number;
  expired: number;
  revoked: number;
  mfaVerified: number;
}

export function SessionsStats({ total, active, expired, revoked, mfaVerified }: SessionsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 세션</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
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
          <CardTitle className="text-sm font-medium">만료됨</CardTitle>
          <Clock className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expired}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((expired / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">취소됨</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
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
          <CardTitle className="text-sm font-medium">MFA 인증</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mfaVerified}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((mfaVerified / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
