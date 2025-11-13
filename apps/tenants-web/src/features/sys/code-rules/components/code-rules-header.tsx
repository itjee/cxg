'use client';

import { Plus, RefreshCw, Download } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useCodeRuleStore } from '../stores';

interface CodeRulesHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * CodeRules 페이지 헤더
 * ListPageHeader 공통 컴포넌트 래핑
 */
export function CodeRulesHeader({ onRefresh, onExport }: CodeRulesHeaderProps) {
  const { openForm } = useCodeRuleStore();

  return (
    <ListPageHeader
      title="코드 규칙 관리"
      description="엔티티별 코드 생성 규칙을 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: '규칙 추가',
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
