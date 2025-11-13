'use client';

/**
 * @file sessions-header.tsx
 * @description 세션 관리 페이지 헤더 컴포넌트
 */

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface SessionsHeaderProps {
  onRefresh?: () => void;
}

export function SessionsHeader({ onRefresh }: SessionsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">세션 관리</h1>
        <p className="text-muted-foreground mt-2">
          사용자 세션을 조회하고 관리합니다
        </p>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        )}
      </div>
    </div>
  );
}
