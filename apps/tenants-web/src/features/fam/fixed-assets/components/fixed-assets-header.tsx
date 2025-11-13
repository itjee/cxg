'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useFixedAssetsStore } from '../stores';

interface FixedAssetsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function FixedAssetsHeader({ onRefresh, onExport }: FixedAssetsHeaderProps) {
  const { openForm } = useFixedAssetsStore();

  return (
    <ListPageHeader
      title="고정자산 관리"
      description="고정자산 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '고정자산 추가',
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
