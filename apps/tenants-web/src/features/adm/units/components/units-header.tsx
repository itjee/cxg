'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useUnitStore } from '../stores';

interface UnitsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Units 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function UnitsHeader({ onRefresh, onExport }: UnitsHeaderProps) {
  const { openForm } = useUnitStore();

  return (
    <ListPageHeader
      title="단위 관리"
      description="측정 단위 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '단위 추가',
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
