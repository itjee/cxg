'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useJournalEntryLinesStore } from '../stores';

interface JournalEntryLinesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function JournalEntryLinesHeader({ onRefresh, onExport }: JournalEntryLinesHeaderProps) {
  const { openForm } = useJournalEntryLinesStore();

  return (
    <ListPageHeader
      title="분개 라인 관리"
      description="분개 라인 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '분개 라인 추가',
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
