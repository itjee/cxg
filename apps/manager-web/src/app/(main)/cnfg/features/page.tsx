"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ListPageLayout } from "@/components/layouts/list-page-layout";
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
    <ListPageLayout
      title="기능 토글"
      description="기능 플래그를 관리합니다"
    >
      <StatsCards cards={stats} columns={4} />
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
            <p className="text-muted-foreground">기능 토글 관리 기능이 곧 추가됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </ListPageLayout>
  );
}
