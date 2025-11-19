"use client";
import { Card, CardContent } from "@/components/ui/card";

import { StatsCards } from "@/components/stats/stats-cards";
import { CheckCircle, Clock, Database, HardDrive } from "lucide-react";

export default function BackupsPage() {
  const stats = [
    {
      title: "전체 백업",
      value: "0",
      description: "등록됨",
      icon: <Database className="h-5 w-5" />,
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
      title: "저장 용량",
      value: "0",
      description: "상태",
      icon: <HardDrive className="h-5 w-5" />,
      color: "default" as const,
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">백업 관리</h1>
        <p className="text-muted-foreground">시스템 백업을 관리합니다</p>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">백업 관리 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </div>
  );
}
