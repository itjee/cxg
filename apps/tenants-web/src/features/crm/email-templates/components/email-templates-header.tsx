'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useEmailTemplatesStore } from '../stores';

interface EmailTemplatesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

export function EmailTemplatesHeader({ onRefresh, onExport }: EmailTemplatesHeaderProps) {
  const { openForm } = useEmailTemplatesStore();

  return (
    <ListPageHeader
      title="이메일 템플릿 관리"
      description="이메일 템플릿 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '이메일 템플릿 추가',
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
