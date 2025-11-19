"use client";
import { Card, CardContent } from "@/components/ui/card";

import { StatsCards } from "@/components/stats/stats-cards";
import { Activity, BarChart3, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    {
      title: "전체 지표",
      value: "0",
      description: "등록됨",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "증가율",
      value: "0",
      description: "상태",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "사용자",
      value: "0",
      description: "상태",
      icon: <Users className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "활동",
      value: "0",
      description: "상태",
      icon: <Activity className="h-5 w-5" />,
      color: "default" as const,
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">분석 대시보드</h1>
        <p className="text-muted-foreground">분석 대시보드를 확인합니다</p>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">분석 대시보드 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </div>
  );
}
