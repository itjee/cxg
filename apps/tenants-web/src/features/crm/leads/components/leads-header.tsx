'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useLeadsStore } from '../stores';

interface LeadsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function LeadsHeader({ onRefresh, onExport }: LeadsHeaderProps) {
  const { openForm } = useLeadsStore();

  return (
    <ListPageHeader
      title="리드 관리"
      description="리드 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '리드 추가',
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
