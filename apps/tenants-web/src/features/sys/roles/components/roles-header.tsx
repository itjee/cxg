'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useRoleStore } from '../stores';

interface RolesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Roles 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function RolesHeader({ onRefresh, onExport }: RolesHeaderProps) {
  const { openForm } = useRoleStore();

  return (
    <ListPageHeader
      title="역할 관리"
      description="시스템 역할 및 권한을 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '역할 추가',
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
