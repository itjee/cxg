'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useInteractionsStore } from '../stores';

interface InteractionsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function InteractionsHeader({ onRefresh, onExport }: InteractionsHeaderProps) {
  const { openForm } = useInteractionsStore();

  return (
    <ListPageHeader
      title="상호작용 관리"
      description="상호작용 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '상호작용 추가',
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
