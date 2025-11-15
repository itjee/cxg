"use client";
import { Card, CardContent } from "@/components/ui/card";

import { PageLayout } from "@/components/layouts/page-layout";
import { StatsCards } from "@/components/stats/stats-cards";
import { AlertCircle, CheckCircle, Clock, Headphones, Ticket } from "lucide-react";

export default function TicketsPage() {
  const stats = [
    {
      title: "전체 티켓",
      value: "0",
      description: "등록됨",
      icon: <Ticket className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "대기 중",
      value: "0",
      description: "상태",
      icon: <Clock className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "해결됨",
      value: "0",
      description: "상태",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "긴급",
      value: "0",
      description: "상태",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "danger" as const,
    },
  ];


  return (
    <PageLayout
      title="지원 티켓"
      description="고객 지원 티켓을 관리합니다"
      
    >
      <StatsCards cards={stats} columns={4} />
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">지원 티켓 관리 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </PageLayout>
  );
}
