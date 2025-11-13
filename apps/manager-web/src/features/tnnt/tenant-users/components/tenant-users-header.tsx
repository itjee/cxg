/**
 * @file tenant-users-header.tsx
 * @description 테넌트 사용자 페이지 헤더
 */

'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useTenantUsersStore } from '../stores';

interface TenantUsersHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function TenantUsersHeader({
  onRefresh,
  onExport,
}: TenantUsersHeaderProps) {
  const { openForm } = useTenantUsersStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
                label: '내보내기',
                icon: Download,
                onClick: onExport,
                variant: 'outline' as const as const,
              },
    {
          label: '사용자 추가',
          icon: Plus,
          onClick: () => openForm(),
          variant: 'default' as const,
        },
  ];


  return (
    <ListPageHeader
      title="테넌트 사용자 관리"
      description="테넌트별 사용자 계정을 관리합니다"
      actions={actions}
    />
  );
}
