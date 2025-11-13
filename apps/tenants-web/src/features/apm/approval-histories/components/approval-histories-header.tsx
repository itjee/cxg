'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useApprovalHistoriesStore } from '../stores';

interface ApprovalHistoriesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ApprovalHistoriesHeader({ onRefresh, onExport }: ApprovalHistoriesHeaderProps) {
  const { openForm } = useApprovalHistoriesStore();

  return (
    <ListPageHeader
      title="결재 이력 관리"
      description="결재 이력 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '결재 이력 추가',
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
