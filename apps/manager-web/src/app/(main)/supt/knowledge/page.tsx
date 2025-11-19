"use client";
import { Card, CardContent } from "@/components/ui/card";

import { StatsCards } from "@/components/stats/stats-cards";
import { BookOpen, Eye, FileText, ThumbsUp } from "lucide-react";

export default function KnowledgePage() {
  const stats = [
    {
      title: "전체 문서",
      value: "0",
      description: "등록됨",
      icon: <BookOpen className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "공개 문서",
      value: "0",
      description: "상태",
      icon: <FileText className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "조회수",
      value: "0",
      description: "상태",
      icon: <Eye className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "추천",
      value: "0",
      description: "상태",
      icon: <ThumbsUp className="h-5 w-5" />,
      color: "default" as const,
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">지식 베이스</h1>
        <p className="text-muted-foreground">지식 베이스를 관리합니다</p>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <p className="text-muted-foreground">지식 베이스 관리 기능이 곧 추가됩니다.</p>
      </div>
            </CardContent>
      </Card>
    </div>
  );
}
