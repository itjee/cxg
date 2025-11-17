'use client';

/**
 * @file login-logs-stats.tsx
 * @description 로그인 이력 통계 카드 컴포넌트
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, XCircle, Shield, Users, Lock } from 'lucide-react';

interface LoginLogsStatsProps {
  total: number;
  successCount: number;
  failedCount: number;
  mfaUsedCount: number;
  lockedCount: number;
  uniqueUsers: number;
}

export function LoginLogsStats({ 
  total, 
  successCount, 
  failedCount, 
  mfaUsedCount,
  lockedCount,
  uniqueUsers,
}: LoginLogsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전체 이력</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">성공</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{successCount}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((successCount / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">실패</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{failedCount}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((failedCount / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">MFA 사용</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{mfaUsedCount}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((mfaUsedCount / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">계정 잠김</CardTitle>
          <Lock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{lockedCount}</div>
          <p className="text-xs text-muted-foreground">
            {total > 0 ? ((lockedCount / total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">사용자 수</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{uniqueUsers}</div>
          <p className="text-xs text-muted-foreground">
            고유 사용자
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
