'use client';

/**
 * @file api-keys-filters.tsx
 * @description API 키 필터 컴포넌트
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiKeyStore } from '../stores';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function ApiKeysFilters() {
  const { 
    globalFilter, 
    setGlobalFilter, 
    selectedStatus, 
    setSelectedStatus,
    resetFilters 
  } = useApiKeyStore();

  const hasFilters = globalFilter || selectedStatus;

  return (
    <div className="flex gap-4 items-center">
      <Input
        placeholder="키 이름 또는 키 ID 검색..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />
      
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">전체</SelectItem>
          <SelectItem value="ACTIVE">활성</SelectItem>
          <SelectItem value="INACTIVE">비활성</SelectItem>
          <SelectItem value="REVOKED">취소됨</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="h-8 px-2 lg:px-3"
        >
          초기화
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
