"use client";
import { Card, CardContent } from "@/components/ui/card";

import { PageLayout } from "@/components/layouts/page-layout";
import { StatsCards } from "@/components/stats/stats-cards";
import { AlertCircle, CheckCircle, Clock, RefreshCw, Server } from "lucide-react";

export default function RecoveryPage() {
  const stats = [
    {
      title: "전체 복구",
      value: "0",
      description: "등록됨",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "성공",
      value: "0",
      description: "상태",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "진행 중",
      value: "0",
      description: "상태",
      icon: <Clock className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "실패",
      value: "0",
      description: "상태",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "danger" as const,
    },
  ];


  return (
    <PageLayout
      title="복구 관리"
      description="시스템 복구를 관리합니다"
      
    >
      <StatsCards cards={stats} columns={4} />
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">복구 관리 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </PageLayout>
  );
}
