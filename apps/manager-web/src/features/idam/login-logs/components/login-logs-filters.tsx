'use client';

/**
 * @file login-logs-filters.tsx
 * @description 로그인 이력 필터 컴포넌트
 */

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoginLogStore } from '../stores';
import { Button } from '@/components/ui/button';
import { X, Search, Calendar } from 'lucide-react';

export function LoginLogsFilters() {
  const { 
    globalFilter, 
    setGlobalFilter, 
    selectedAttemptType,
    setSelectedAttemptType,
    selectedSuccess,
    setSelectedSuccess,
    selectedUserType,
    setSelectedUserType,
    selectedMfaUsed,
    setSelectedMfaUsed,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    resetFilters 
  } = useLoginLogStore();

  const hasFilters = globalFilter || selectedAttemptType || selectedSuccess || 
    selectedUserType || selectedMfaUsed || startDate || endDate;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">검색 및 필터</h3>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2"
            >
              초기화
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">검색</Label>
            <Input
              id="search"
              placeholder="사용자명, IP 주소..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attemptType">시도 타입</Label>
            <Select value={selectedAttemptType} onValueChange={setSelectedAttemptType}>
              <SelectTrigger id="attemptType">
                <SelectValue placeholder="전체 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="LOGIN">로그인</SelectItem>
                <SelectItem value="LOGOUT">로그아웃</SelectItem>
                <SelectItem value="FAILED_LOGIN">로그인 실패</SelectItem>
                <SelectItem value="LOCKED">계정 잠김</SelectItem>
                <SelectItem value="PASSWORD_RESET">비밀번호 재설정</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="success">결과</Label>
            <Select value={selectedSuccess} onValueChange={setSelectedSuccess}>
              <SelectTrigger id="success">
                <SelectValue placeholder="전체 결과" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="true">성공</SelectItem>
                <SelectItem value="false">실패</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">사용자 타입</Label>
            <Select value={selectedUserType} onValueChange={setSelectedUserType}>
              <SelectTrigger id="userType">
                <SelectValue placeholder="전체 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="MASTER">마스터</SelectItem>
                <SelectItem value="TENANT">테넌트</SelectItem>
                <SelectItem value="SYSTEM">시스템</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="mfaUsed">MFA 사용</Label>
            <Select value={selectedMfaUsed} onValueChange={setSelectedMfaUsed}>
              <SelectTrigger id="mfaUsed">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="true">사용</SelectItem>
                <SelectItem value="false">미사용</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              시작일
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              종료일
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
