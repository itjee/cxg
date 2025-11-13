'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useActivityStore } from '../stores';

interface ActivitiesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Activities 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function ActivitiesHeader({ onRefresh, onExport }: ActivitiesHeaderProps) {
  const { openForm } = useActivityStore();

  return (
    <ListPageHeader
      title="활동 관리"
      description="고객 활동 기록을 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '활동 추가',
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
