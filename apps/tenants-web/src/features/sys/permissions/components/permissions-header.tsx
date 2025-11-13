'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { usePermissionStore } from '../stores';

interface PermissionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Permissions 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function PermissionsHeader({ onRefresh, onExport }: PermissionsHeaderProps) {
  const { openForm } = usePermissionStore();

  return (
    <ListPageHeader
      title="권한 관리"
      description="시스템 권한을 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '권한 추가',
          icon: Plus,
          onClick: () => openForm(),
          variant: 'default',
        },
        {
          label: '내보내기',
          icon: Download,
          onClick: () => onExport?.(),
          variant: 'outline',
        },
      ]}
    />
  );
}
