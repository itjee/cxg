"use client";
import { Card, CardContent } from "@/components/ui/card";

import { StatsCards } from "@/components/stats/stats-cards";
import { Bell, CheckCircle, Send, Users } from "lucide-react";

export default function CampaignsPage() {
  const stats = [
    {
      title: "전체 캠페인",
      value: "0",
      description: "등록됨",
      icon: <Bell className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "발송됨",
      value: "0",
      description: "상태",
      icon: <Send className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "완료됨",
      value: "0",
      description: "상태",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "수신자",
      value: "0",
      description: "상태",
      icon: <Users className="h-5 w-5" />,
      color: "default" as const,
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">캠페인</h1>
        <p className="text-muted-foreground">알림 캠페인을 관리합니다</p>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">캠페인 관리 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </div>
  );
}
