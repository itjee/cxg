'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useBusinessDocumentsStore } from '../stores';

interface BusinessDocumentsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function BusinessDocumentsHeader({ onRefresh, onExport }: BusinessDocumentsHeaderProps) {
  const { openForm } = useBusinessDocumentsStore();

  return (
    <ListPageHeader
      title="증빙서류 관리"
      description="증빙서류 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '증빙서류 추가',
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
