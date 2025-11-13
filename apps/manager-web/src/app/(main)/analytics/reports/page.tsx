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
import { FileText, Search, Download, Filter, RefreshCw, Plus, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function AuditReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = () => {
    console.log("Refresh data");
  };

  const handleExport = () => {
    console.log("Export data");
  };

  const handleGenerateReport = () => {
    console.log("Generate report");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">감사 보고서</h1>
          <p className="text-sm text-muted-foreground mt-1">
            감사 보고서를 생성하고 조회합니다.
          </p>
        </div>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="rounded-r-none border-r-0"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-none border-r-0"
          >
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
          <Button onClick={handleGenerateReport} className="rounded-l-none">
            <Plus className="mr-2 h-4 w-4" />
            보고서 생성
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 보고서</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">생성된 보고서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">신규 보고서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">자동 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">정기 보고서</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">수동 생성</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">요청 보고서</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">보고서 목록</CardTitle>
          <CardDescription>생성된 감사 보고서를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="보고서명으로 검색..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="ALL">
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="유형 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">모든 유형</SelectItem>
                <SelectItem value="MONTHLY">월간</SelectItem>
                <SelectItem value="QUARTERLY">분기</SelectItem>
                <SelectItem value="ANNUAL">연간</SelectItem>
                <SelectItem value="CUSTOM">사용자 정의</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead className="text-muted-foreground font-medium">보고서명</TableHead>
                  <TableHead className="text-muted-foreground font-medium">유형</TableHead>
                  <TableHead className="text-muted-foreground font-medium">기간</TableHead>
                  <TableHead className="text-muted-foreground font-medium">생성일</TableHead>
                  <TableHead className="text-muted-foreground font-medium">생성자</TableHead>
                  <TableHead className="text-muted-foreground font-medium">상태</TableHead>
                  <TableHead className="text-muted-foreground font-medium w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">2025년 1월 월간 감사 보고서</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-500/10 text-blue-600">월간</Badge>
                  </TableCell>
                  <TableCell>2025-01-01 ~ 2025-01-31</TableCell>
                  <TableCell>2025-01-16</TableCell>
                  <TableCell>System</TableCell>
                  <TableCell>
                    <Badge className="bg-[rgba(115,191,105,0.2)] text-emerald-600 dark:text-emerald-500">완료</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          다운로드
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">2024년 4분기 감사 보고서</TableCell>
                  <TableCell>
                    <Badge className="bg-purple-500/10 text-purple-600">분기</Badge>
                  </TableCell>
                  <TableCell>2024-10-01 ~ 2024-12-31</TableCell>
                  <TableCell>2025-01-05</TableCell>
                  <TableCell>admin@example.com</TableCell>
                  <TableCell>
                    <Badge className="bg-[rgba(115,191,105,0.2)] text-emerald-600 dark:text-emerald-500">완료</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          다운로드
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-accent/50">
                  <TableCell className="font-medium">보안 감사 특별 보고서</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500/10 text-orange-600">사용자 정의</Badge>
                  </TableCell>
                  <TableCell>2025-01-01 ~ 2025-01-15</TableCell>
                  <TableCell>2025-01-15</TableCell>
                  <TableCell>security@example.com</TableCell>
                  <TableCell>
                    <Badge className="bg-[rgba(115,191,105,0.2)] text-emerald-600 dark:text-emerald-500">완료</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          보기
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          다운로드
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
