'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useRfqsStore } from '../stores';

interface RfqsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function RfqsHeader({ onRefresh, onExport }: RfqsHeaderProps) {
  const { openForm } = useRfqsStore();

  return (
    <ListPageHeader
      title="견적요청 관리"
      description="견적요청 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '견적요청 추가',
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
