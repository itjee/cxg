/**
 * @file plans-header.tsx
 * @description 요금제 페이지 헤더 컴포넌트
 */

'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePlansStore } from '../stores';

export function PlansHeader() {
  const { openForm } = usePlansStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">요금제 관리</h1>
        <p className="text-gray-500 mt-2">
          서비스 요금제의 가격 정책, 사용량 제한, 포함 기능을 관리하세요
        </p>
      </div>
      <Button onClick={() => openForm()} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        새 요금제
      </Button>
    </div>
  );
}
