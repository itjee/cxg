"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatsCards } from '@/components/stats/stats-cards';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export function ThemePreview() {
  const sampleStats = [
    {
      title: "전체 사용자",
      value: "2,543",
      description: "활성 사용자",
      icon: <Users className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "월 매출",
      value: "$45,231",
      description: "+20% 증가",
      trend: { value: 20, isPositive: true },
      icon: <DollarSign className="h-5 w-5" />,
      color: "success" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">미리보기</h3>
        <p className="text-sm text-muted-foreground mb-6">
          선택한 색상이 실제 UI에 어떻게 적용되는지 확인하세요
        </p>
      </div>

      {/* 통계 카드 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          통계 카드
        </p>
        <StatsCards cards={sampleStats} columns={2} />
      </div>

      {/* 버튼 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          버튼
        </p>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      {/* 배지 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          배지
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* 입력 필드 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          입력 필드
        </p>
        <div className="grid gap-3">
          <Input placeholder="이메일을 입력하세요" />
          <Input placeholder="비활성 상태" disabled />
        </div>
      </div>

      {/* 카드 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          카드
        </p>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>샘플 카드</CardTitle>
            </div>
            <CardDescription>
              선택한 테마가 적용된 카드 컴포넌트
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-2xl font-bold text-primary">1,234</p>
                <p className="text-xs text-muted-foreground">총 방문자</p>
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold">567</p>
                <p className="text-xs text-muted-foreground">신규 사용자</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 텍스트 색상 미리보기 */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          텍스트 색상
        </p>
        <div className="space-y-2 p-4 bg-card rounded-lg border">
          <p className="text-foreground">Foreground - 기본 텍스트</p>
          <p className="text-muted-foreground">Muted Foreground - 보조 텍스트</p>
          <p className="text-primary">Primary - 주요 색상</p>
          <p className="text-secondary-foreground bg-secondary px-2 py-1 rounded inline-block">
            Secondary - 보조 색상
          </p>
        </div>
      </div>
    </div>
  );
}
