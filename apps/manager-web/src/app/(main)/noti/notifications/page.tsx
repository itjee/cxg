"use client";

import { Page } from "@/components/layouts/page";
import { StatsCards } from "@/components/stats/stats-cards";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const stats = [
    {
      title: "전체 알림",
      value: "0",
      icon: <Bell className="h-5 w-5" />,
      color: "default" as const,
    },
  ];

  return (
    <Page
      title="알림 관리"
      description="시스템 알림을 관리합니다"
    >
      {/* 통계 카드 */}
      <StatsCards cards={stats} columns={4} />

      {/* 콘텐츠 */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">알림 관리 기능이 곧 추가됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
