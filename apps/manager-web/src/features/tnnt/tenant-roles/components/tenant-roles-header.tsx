/**
 * @file tenant-roles-header.tsx
 * @description 테넌트 역할 페이지 헤더
 */

'use client';

import { Plus, RefreshCw } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useTenantRolesStore } from '../stores';

interface TenantRolesHeaderProps {
  onRefresh?: () => void;
}

export function TenantRolesHeader({ onRefresh }: TenantRolesHeaderProps) {
  const { openForm } = useTenantRolesStore();

  const actions = [
    ...(onRefresh ? [{
      label: '새로고침',
      icon: RefreshCw,
      onClick: onRefresh,
      variant: 'outline' as const,
    }] : []),
    {
      label: '역할 추가',
      icon: Plus,
      onClick: () => openForm(),
      variant: 'default' as const,
    },
  ];

  return (
    <ListPageHeader
      title="테넌트 역할 관리"
      description="테넌트별 역할 및 권한을 관리합니다"
      actions={actions}
    />
  );
}
