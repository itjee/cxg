'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Plus, RefreshCw, Download } from 'lucide-react';

export interface PageContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  showExport?: boolean;
  showAdd?: boolean;
}

export function PageContainer({
  title,
  description,
  children,
  onRefresh,
  onAdd,
  onExport,
  showExport = true,
  showAdd = true,
}: PageContainerProps) {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>
        <ButtonGroup>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              새로고침
            </Button>
          )}
          {showAdd && onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              추가
            </Button>
          )}
          {showExport && onExport && (
            <Button variant="outline" onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
          )}
        </ButtonGroup>
      </div>

      {/* 메인 컨텐츠 */}
      {children}
    </div>
  );
}
