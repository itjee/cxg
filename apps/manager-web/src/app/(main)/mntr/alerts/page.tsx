"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Search, Download, Filter, RefreshCw, Bell, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatsCards } from "@/components/stats/stats-cards";

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const stats = [
    {
      title: "활성 알림",
      value: "3",
      description: "확인 필요",
      icon: <Bell className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "심각",
      value: "0",
      description: "문제 없음",
      icon: <XCircle className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "경고",
      value: "3",
      description: "모니터링 중",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "오늘 해결",
      value: "12",
      description: "알림 처리됨",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "default" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">알림 관리</h1>
          <p className="mt-2 text-base text-muted-foreground">시스템 알림 및 경고를 확인합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards cards={stats} columns={4} />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">알림 목록</CardTitle>
          <CardDescription>시스템 알림 및 경고를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="알림 내용으로 검색..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="ALL">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="심각도 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 심각도</SelectItem>
                <SelectItem value="CRITICAL">심각</SelectItem>
                <SelectItem value="WARNING">경고</SelectItem>
                <SelectItem value="INFO">정보</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-muted-foreground font-medium">심각도</TableHead>
                  <TableHead className="text-muted-foreground font-medium">알림 내용</TableHead>
                  <TableHead className="text-muted-foreground font-medium">서비스</TableHead>
                  <TableHead className="text-muted-foreground font-medium">발생 시간</TableHead>
                  <TableHead className="text-muted-foreground font-medium">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-accent/50">
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">경고</Badge>
                  </TableCell>
                  <TableCell className="font-medium">캐시 서버 메모리 사용률 72%</TableCell>
                  <TableCell>Redis</TableCell>
                  <TableCell>15분 전</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">활성</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">경고</Badge>
                  </TableCell>
                  <TableCell className="font-medium">데이터베이스 연결 수 245/500</TableCell>
                  <TableCell>PostgreSQL</TableCell>
                  <TableCell>1시간 전</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">활성</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell>
                    <Badge variant="outline">정보</Badge>
                  </TableCell>
                  <TableCell className="font-medium">정기 백업 완료</TableCell>
                  <TableCell>Backup Service</TableCell>
                  <TableCell>2시간 전</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">해결됨</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
