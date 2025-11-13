"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ListPageLayout } from "@/components/layouts/list-page-layout";
import { StatsCards } from "@/components/stats/stats-cards";
import { Activity, RefreshCw, Download, Server, Database, Zap, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MonitoringStatusPage() {
  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const stats = [
    {
      title: "전체 시스템",
      value: "정상",
      description: "모든 서비스 작동 중",
      icon: <Activity className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "API 응답 시간",
      value: "45ms",
      description: "평균 응답 시간",
      icon: <Server className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "DB 연결",
      value: "245/500",
      description: "활성 연결 수",
      icon: <Database className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "캐시 히트율",
      value: "94.2%",
      description: "캐시 효율성",
      icon: <Zap className="h-5 w-5" />,
      color: "success" as const,
    },
  ];

  const actions = (
    <ButtonGroup>
      <Button variant="outline" onClick={handleRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        새로고침
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        내보내기
      </Button>
    </ButtonGroup>
  );

  return (
    <ListPageLayout
      title="시스템 상태"
      description="실시간 시스템 상태를 모니터링합니다"
      actions={actions}
    >
      <StatsCards cards={stats} columns={4} />

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle>전체 시스템 상태</CardTitle>
          <CardDescription>모든 서비스가 정상 작동 중입니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-500">모든 시스템 정상</span>
          </div>
        </CardContent>
      </Card>

      {/* Service Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">API 서비스</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">응답 시간</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">45ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">가동률</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">99.98%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">초당 요청</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">1,250</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">데이터베이스</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">쿼리 응답 시간</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">12ms</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">연결 수</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">245/500</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">복제 지연</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">0.5s</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">캐시 서버</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">히트율</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">94.2%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">메모리 사용</span>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">72%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">초당 작업</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">8,500</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">스토리지</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">사용량</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">6.5 TB / 10 TB</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">읽기 속도</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">450 MB/s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">쓰기 속도</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">320 MB/s</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">최근 이벤트</CardTitle>
          <CardDescription>지난 24시간 동안의 시스템 이벤트</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
              <div className="flex-1">
                <p className="font-medium">모든 서비스 정상 작동</p>
                <p className="text-xs text-muted-foreground">2분 전</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
              <div className="flex-1">
                <p className="font-medium">캐시 서버 메모리 사용률 70% 초과</p>
                <p className="text-xs text-muted-foreground">15분 전</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5"></div>
              <div className="flex-1">
                <p className="font-medium">데이터베이스 백업 완료</p>
                <p className="text-xs text-muted-foreground">2시간 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ListPageLayout>
  );
}
