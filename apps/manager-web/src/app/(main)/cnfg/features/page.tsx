"use client";

import { Card, CardContent } from "@/components/ui/card";
import { StatsCards } from "@/components/stats/stats-cards";
import { Sliders, ToggleLeft, ToggleRight, Settings } from "lucide-react";

export default function FeaturesPage() {
  const stats = [
    {
      title: "전체 기능",
      value: "0",
      description: "등록된 기능",
      icon: <Sliders className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "활성화",
      value: "0",
      description: "사용 중",
      icon: <ToggleRight className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "비활성화",
      value: "0",
      description: "사용 안함",
      icon: <ToggleLeft className="h-5 w-5" />,
      color: "default" as const,
    },
    {
      title: "실험 기능",
      value: "0",
      description: "테스트 중",
      icon: <Settings className="h-5 w-5" />,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">기능 토글</h1>
        <p className="mt-2 text-base text-muted-foreground">기능 플래그를 관리합니다</p>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">기능 토글 관리 기능이 곧 추가됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
