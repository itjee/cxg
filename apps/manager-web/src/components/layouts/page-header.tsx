'use client';

import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export interface ActionButtonConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
}

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ActionButtonConfig[];
}

/**
 * 페이지 헤더 공통 컴포넌트
 * 페이지 제목, 설명, 가변적 액션 버튼을 포함
 *
 * @example
 * <PageHeader
 *   title="사용자 관리"
 *   description="시스템 사용자 계정을 관리합니다"
 *   actions={[
 *     { label: '새로고침', icon: RefreshCw, onClick: handleRefresh, variant: 'outline' },
 *     { label: '사용자 추가', icon: Plus, onClick: handleAdd, variant: 'default' },
 *     { label: '내보내기', icon: Download, onClick: handleExport, variant: 'outline' }
 *   ]}
 * />
 */
export function PageHeader({
  title,
  description,
  actions = [],
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      </div>
      {actions.length > 0 && (
        <ButtonGroup>
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                onClick={action.onClick}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            );
          })}
        </ButtonGroup>
      )}
    </div>
  );
}
