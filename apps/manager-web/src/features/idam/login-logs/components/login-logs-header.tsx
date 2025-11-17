'use client';

/**
 * @file login-logs-header.tsx
 * @description 로그인 이력 페이지 헤더 컴포넌트
 */

import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';

interface LoginLogsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function LoginLogsHeader({ onRefresh, onExport }: LoginLogsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">로그인 이력</h1>
        <p className="text-muted-foreground mt-2">
          사용자 로그인/로그아웃 이력을 조회하고 관리합니다
        </p>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        )}
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
        )}
      </div>
    </div>
  );
}
