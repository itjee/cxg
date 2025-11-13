/**
 * @file plans-filters.tsx
 * @description 요금제 필터 컴포넌트
 */

'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePlansStore } from '../stores';
import { BillingCycle, PlanStatus, PlanType } from '../types';

export function PlansFilters() {
  const {
    filters,
    setSearch,
    setStatus,
    setType,
    setBillingCycle,
    resetFilters,
  } = usePlansStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 검색 */}
        <div>
          <Input
            placeholder="코드 또는 이름으로 검색..."
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>

        {/* 상태 필터 */}
        <Select value={filters.status || ''} onValueChange={(value) => setStatus(value || undefined)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">모두</SelectItem>
            <SelectItem value={PlanStatus.ACTIVE}>활성</SelectItem>
            <SelectItem value={PlanStatus.INACTIVE}>비활성</SelectItem>
            <SelectItem value={PlanStatus.ARCHIVED}>보관</SelectItem>
          </SelectContent>
        </Select>

        {/* 유형 필터 */}
        <Select value={filters.type || ''} onValueChange={(value) => setType(value || undefined)}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="유형 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">모두</SelectItem>
            <SelectItem value={PlanType.TRIAL}>체험판</SelectItem>
            <SelectItem value={PlanType.STANDARD}>표준</SelectItem>
            <SelectItem value={PlanType.PREMIUM}>프리미엄</SelectItem>
            <SelectItem value={PlanType.ENTERPRISE}>엔터프라이즈</SelectItem>
          </SelectContent>
        </Select>

        {/* 청구 주기 필터 */}
        <Select
          value={filters.billing_cycle || ''}
          onValueChange={(value) => setBillingCycle(value || undefined)}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="청구 주기" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">모두</SelectItem>
            <SelectItem value={BillingCycle.MONTHLY}>월간</SelectItem>
            <SelectItem value={BillingCycle.QUARTERLY}>분기</SelectItem>
            <SelectItem value={BillingCycle.YEARLY}>연간</SelectItem>
          </SelectContent>
        </Select>

        {/* 초기화 버튼 */}
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="h-9"
        >
          <X className="mr-2 h-4 w-4" />
          초기화
        </Button>
      </div>
    </div>
  );
}
