'use client';

/**
 * @file sessions-filters.tsx
 * @description 세션 필터 컴포넌트
 */

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSessionStore } from '../stores';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';

export function SessionsFilters() {
  const { 
    globalFilter, 
    setGlobalFilter, 
    selectedStatus, 
    setSelectedStatus,
    selectedSessionType,
    setSelectedSessionType,
    resetFilters 
  } = useSessionStore();

  const hasFilters = globalFilter || selectedStatus || selectedSessionType;

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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">검색</Label>
            <Input
              id="search"
              placeholder="IP 주소, 세션 ID, 사용자 ID..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="전체 상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="EXPIRED">만료됨</SelectItem>
                <SelectItem value="REVOKED">취소됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionType">세션 타입</Label>
            <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
              <SelectTrigger id="sessionType">
                <SelectValue placeholder="전체 타입" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="WEB">웹</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="MOBILE">모바일</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
