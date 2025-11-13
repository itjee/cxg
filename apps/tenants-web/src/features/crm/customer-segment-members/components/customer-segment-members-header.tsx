'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useCustomerSegmentMembersStore } from '../stores';

interface CustomerSegmentMembersHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function CustomerSegmentMembersHeader({ onRefresh, onExport }: CustomerSegmentMembersHeaderProps) {
  const { openForm } = useCustomerSegmentMembersStore();

  return (
    <ListPageHeader
      title="고객 세그먼트 회원 관리"
      description="고객 세그먼트 회원 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '고객 세그먼트 회원 추가',
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
