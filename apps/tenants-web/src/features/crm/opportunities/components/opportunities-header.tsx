'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useOpportunityStore } from '../stores';

interface OpportunitiesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Opportunities 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function OpportunitiesHeader({ onRefresh, onExport }: OpportunitiesHeaderProps) {
  const { openForm } = useOpportunityStore();

  return (
    <ListPageHeader
      title="영업기회 관리"
      description="영업기회 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '영업기회 추가',
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
