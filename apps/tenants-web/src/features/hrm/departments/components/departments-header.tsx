'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useDepartmentsStore } from '../stores';

interface DepartmentsHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * Departments 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function DepartmentsHeader({ onRefresh, onExport }: DepartmentsHeaderProps) {
  const { openForm } = useDepartmentsStore();

  return (
    <ListPageHeader
      title="부서 관리"
      description="조직 부서 정보를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '부서 추가',
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
