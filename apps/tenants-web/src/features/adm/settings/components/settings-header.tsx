'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useSettingsStore } from '../stores';

interface SettingsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Settings 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function SettingsHeader({ onRefresh, onExport }: SettingsHeaderProps) {
  const { openForm } = useSettingsStore();

  return (
    <ListPageHeader
      title="설정 관리"
      description="시스템 설정 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '설정 추가',
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
