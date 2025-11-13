'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useApprovalRequestsStore } from '../stores';

interface ApprovalRequestsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function ApprovalRequestsHeader({ onRefresh, onExport }: ApprovalRequestsHeaderProps) {
  const { openForm } = useApprovalRequestsStore();

  return (
    <ListPageHeader
      title="결재 요청 관리"
      description="결재 요청 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '결재 요청 추가',
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
