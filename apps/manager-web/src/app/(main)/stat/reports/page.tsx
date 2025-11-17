"use client";
import { Card, CardContent } from "@/components/ui/card";

import { Page } from "@/components/layouts/page";
import { StatsCards } from "@/components/stats/stats-cards";
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

export default function ReportsPage() {
  const stats = [
    {
      title: "전체 리포트",
      value: "0",
      description: "등록됨",
      icon: <FileText className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "완료됨",
      value: "0",
      description: "상태",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "대기 중",
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
    <Page
      title="통계 보고서"
      description="통계 보고서를 관리합니다"
      
    >
      <StatsCards cards={stats} columns={4} />
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">통계 보고서 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </Page>
  );
}
