'use client';

/**
 * @file tenants-header.tsx
 * @description 테넌트 관리 페이지 헤더 컴포넌트
 */

import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useTenantsStore } from '../stores';

interface TenantsHeaderProps {
  onRefresh?: () => void;
}

export function TenantsHeader({ onRefresh }: TenantsHeaderProps) {
  const { openForm } = useTenantsStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">테넌트 관리</h1>
        <p className="text-muted-foreground mt-2">
          플랫폼 테넌트를 관리합니다
        </p>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        )}
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" />
          테넌트 추가
        </Button>
      </div>
    </div>
  );
}
