'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useCampaignMembersStore } from '../stores';

interface CampaignMembersHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function CampaignMembersHeader({ onRefresh, onExport }: CampaignMembersHeaderProps) {
  const { openForm } = useCampaignMembersStore();

  return (
    <ListPageHeader
      title="캠페인 회원 관리"
      description="캠페인 회원 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '캠페인 회원 추가',
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
