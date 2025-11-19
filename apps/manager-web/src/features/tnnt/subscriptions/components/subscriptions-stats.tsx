"use client";

/**
 * @file subscriptions-stats.tsx
 * @description 구독 통계 카드 컴포넌트
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  PauseCircle,
  RefreshCw,
  DollarSign
} from "lucide-react";
import type { Subscription } from "../types/subscriptions.types";

interface SubscriptionsStatsProps {
  data: Subscription[];
}

export function SubscriptionsStats({ data }: SubscriptionsStatsProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter((s) => s.status === 'ACTIVE').length;
    const suspended = data.filter((s) => s.status === 'SUSPENDED').length;
    const expired = data.filter((s) => s.status === 'EXPIRED').length;
    const canceled = data.filter((s) => s.status === 'CANCELED').length;
    const autoRenewal = data.filter((s) => s.auto_renewal && s.status === 'ACTIVE').length;
    
    // 총 수익 계산 (활성 구독만)
    const totalRevenue = data
      .filter((s) => s.status === 'ACTIVE')
      .reduce((sum, s) => sum + s.base_amount, 0);

    return {
      total,
      active,
      suspended,
      expired,
      canceled,
      autoRenewal,
      totalRevenue,
    };
  }, [data]);

  return (
    <div className="grid gap-4 md:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">전체 구독</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total}</div>
          <p className="text-sm text-muted-foreground">
            총 구독 수
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">활성</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.active}</div>
          <p className="text-sm text-muted-foreground">
            {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">일시중단</CardTitle>
          <PauseCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.suspended}</div>
          <p className="text-sm text-muted-foreground">
            {stats.total > 0 ? ((stats.suspended / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">만료</CardTitle>
          <Clock className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.expired}</div>
          <p className="text-sm text-muted-foreground">
            해지: {stats.canceled}건
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">자동 갱신</CardTitle>
          <RefreshCw className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.autoRenewal}</div>
          <p className="text-sm text-muted-foreground">
            {stats.active > 0 ? ((stats.autoRenewal / stats.active) * 100).toFixed(1) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">총 수익</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'KRW',
              minimumFractionDigits: 0,
            }).format(stats.totalRevenue)}
          </div>
          <p className="text-sm text-muted-foreground">
            활성 구독 기준
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
