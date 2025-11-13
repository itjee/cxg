'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useJournalEntriesStore } from '../stores';

interface JournalEntriesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function JournalEntriesHeader({ onRefresh, onExport }: JournalEntriesHeaderProps) {
  const { openForm } = useJournalEntriesStore();

  return (
    <ListPageHeader
      title="분개 관리"
      description="분개 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '분개 추가',
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
