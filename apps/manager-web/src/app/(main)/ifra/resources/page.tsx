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
import { Activity, Search, Download, Filter, RefreshCw, Cpu, HardDrive, Network, Database } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Page } from "@/components/layouts/page";
import { StatsCards } from "@/components/stats/stats-cards";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const stats = [
    {
      title: "총 CPU",
      value: "128 코어",
      description: "평균 45% 사용",
      icon: <Cpu className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "총 메모리",
      value: "512 GB",
      description: "평균 62% 사용",
      icon: <Database className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "총 스토리지",
      value: "10 TB",
      description: "6.5 TB 사용",
      icon: <HardDrive className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "네트워크",
      value: "1.2 TB",
      description: "이번 달 전송량",
      icon: <Network className="h-5 w-5" />,
      color: "default" as const,
    },
  ];

  const actions = (
    <ButtonGroup>
      <Button variant="outline" onClick={handleRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" />
        새로고침
      </Button>
      <Button variant="outline" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        내보내기
      </Button>
    </ButtonGroup>
  );

  return (
    <Page
      title="리소스 관리"
      description="시스템 리소스 사용량을 모니터링합니다"
      actions={actions}
    >
      <StatsCards cards={stats} columns={4} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">리소스 사용량</CardTitle>
          <CardDescription>테넌트별 리소스 소비량을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="테넌트명으로 검색..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="CPU">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="리소스 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPU">CPU</SelectItem>
                <SelectItem value="MEMORY">메모리</SelectItem>
                <SelectItem value="STORAGE">스토리지</SelectItem>
                <SelectItem value="BANDWIDTH">대역폭</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-muted-foreground font-medium">테넌트</TableHead>
                  <TableHead className="text-muted-foreground font-medium">CPU 사용</TableHead>
                  <TableHead className="text-muted-foreground font-medium">메모리 사용</TableHead>
                  <TableHead className="text-muted-foreground font-medium">스토리지</TableHead>
                  <TableHead className="text-muted-foreground font-medium">대역폭</TableHead>
                  <TableHead className="text-muted-foreground font-medium">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">Acme Corporation</TableCell>
                  <TableCell>28 코어</TableCell>
                  <TableCell>128 GB</TableCell>
                  <TableCell>2.5 TB</TableCell>
                  <TableCell>450 GB</TableCell>
                  <TableCell>
                    <Badge className="bg-[rgba(115,191,105,0.2)] text-chart-1">정상</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">Tech Solutions Inc.</TableCell>
                  <TableCell>16 코어</TableCell>
                  <TableCell>64 GB</TableCell>
                  <TableCell>1.2 TB</TableCell>
                  <TableCell>280 GB</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">정상</Badge>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">Global Logistics</TableCell>
                  <TableCell>4 코어</TableCell>
                  <TableCell>16 GB</TableCell>
                  <TableCell>250 GB</TableCell>
                  <TableCell>50 GB</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">정상</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
}
