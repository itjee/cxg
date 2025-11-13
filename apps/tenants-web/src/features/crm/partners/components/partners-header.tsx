'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { usePartnerStore } from '../stores';

interface PartnersHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Partners 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function PartnersHeader({ onRefresh, onExport }: PartnersHeaderProps) {
  const { openForm } = usePartnerStore();

  return (
    <ListPageHeader
      title="거래처 관리"
      description="거래처 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '거래처 추가',
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
