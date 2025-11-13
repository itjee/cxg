'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useApprovalLinesStore } from '../stores';

interface ApprovalLinesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ApprovalLinesHeader({ onRefresh, onExport }: ApprovalLinesHeaderProps) {
  const { openForm } = useApprovalLinesStore();

  return (
    <ListPageHeader
      title="결재 라인 관리"
      description="결재 라인 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '결재 라인 추가',
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
