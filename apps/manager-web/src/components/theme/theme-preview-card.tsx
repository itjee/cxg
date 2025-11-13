"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Settings, TrendingUp, Users, DollarSign } from "lucide-react";

export function ThemePreviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>미리보기</CardTitle>
        <CardDescription>선택한 테마가 어떻게 적용되는지 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              사용자
            </div>
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              수익
            </div>
            <div className="text-2xl font-bold">₩5.6M</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.2%
            </div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Bell className="h-4 w-4" />
              알림
            </div>
            <div className="text-2xl font-bold">23</div>
            <Badge variant="secondary" className="mt-1">신규</Badge>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="destructive" size="sm">Destructive</Button>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="검색..." className="pl-9" />
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>

        {/* Card Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">카드 예시</CardTitle>
            <CardDescription>카드 컴포넌트가 이렇게 보입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              선택한 테마의 배경색과 텍스트 색상이 적용됩니다.
            </p>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <div className="space-y-2 p-4 rounded-lg bg-muted">
          <p className="text-sm font-medium">텍스트 색상</p>
          <p className="text-sm text-foreground">기본 텍스트 (Foreground)</p>
          <p className="text-sm text-muted-foreground">보조 텍스트 (Muted Foreground)</p>
          <p className="text-sm text-primary">강조 텍스트 (Primary)</p>
        </div>
      </CardContent>
    </Card>
  );
}
