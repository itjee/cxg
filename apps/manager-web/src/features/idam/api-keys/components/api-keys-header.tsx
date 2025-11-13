'use client';

/**
 * @file api-keys-header.tsx
 * @description API 키 관리 페이지 헤더 컴포넌트
 */

import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useApiKeyStore } from '../stores';

interface ApiKeysHeaderProps {
  onRefresh?: () => void;
}

export function ApiKeysHeader({ onRefresh }: ApiKeysHeaderProps) {
  const { openForm } = useApiKeyStore();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">API 키 관리</h1>
        <p className="text-muted-foreground mt-2">
          API 키를 생성하고 관리합니다
        </p>
      </div>
      <div className="flex gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        )}
        <Button onClick={() => openForm()}>
          <Plus className="mr-2 h-4 w-4" />
          API 키 추가
        </Button>
      </div>
    </div>
  );
}
