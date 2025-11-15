"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Server, Search, Download, Filter, RefreshCw, Plus, CheckCircle, Cpu, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layouts/page-layout";
import { StatsCards } from "@/components/stats/stats-cards";

export default function ServersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleAddServer = () => {
    console.log("Add server");
  };

  const stats = [
    {
      title: "전체 서버",
      value: "8",
      description: "활성 서버",
      icon: <Server className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "정상 작동",
      value: "7",
      description: "87.5% uptime",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "평균 CPU",
      value: "45%",
      description: "사용률",
      icon: <Cpu className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "경고",
      value: "1",
      description: "확인 필요",
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "danger" as const,
    },
  ];

  const actions = (
    <ButtonGroup>
      <Button variant="outline" onClick={handleRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        새로고침
      </Button>
      <Button onClick={handleAddServer}>
        <Plus className="mr-2 h-4 w-4" />
        서버 추가
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        내보내기
      </Button>
    </ButtonGroup>
  );

  return (
    <PageLayout
      title="서버 관리"
      description="플랫폼 서버 인프라를 모니터링하고 관리합니다"
      actions={actions}
    >
      <StatsCards cards={stats} columns={4} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">서버 목록</CardTitle>
          <CardDescription>모든 서버의 상태를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="서버명, IP로 검색..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="ALL">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 상태</SelectItem>
                <SelectItem value="RUNNING">실행 중</SelectItem>
                <SelectItem value="STOPPED">중지</SelectItem>
                <SelectItem value="ERROR">오류</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-muted-foreground font-medium">서버명</TableHead>
                  <TableHead className="text-muted-foreground font-medium">IP 주소</TableHead>
                  <TableHead className="text-muted-foreground font-medium">지역</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CPU</TableHead>
                  <TableHead className="text-muted-foreground font-medium">메모리</TableHead>
                  <TableHead className="text-muted-foreground font-medium">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">app-server-01</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">192.168.1.10</code>
                  </TableCell>
                  <TableCell>Seoul (KR)</TableCell>
                  <TableCell>42%</TableCell>
                  <TableCell>68%</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">실행 중</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">app-server-02</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">192.168.1.11</code>
                  </TableCell>
                  <TableCell>Seoul (KR)</TableCell>
                  <TableCell>38%</TableCell>
                  <TableCell>55%</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">실행 중</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">db-server-01</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">192.168.1.20</code>
                  </TableCell>
                  <TableCell>Seoul (KR)</TableCell>
                  <TableCell>75%</TableCell>
                  <TableCell>82%</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-500">경고</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
