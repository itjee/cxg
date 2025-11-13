'use client';

/**
 * @file menus-header.tsx
 * @description 메뉴 관리 페이지 헤더 컴포넌트
 * 
 * 페이지 제목, 설명 및 주요 액션 버튼(새로고침, 메뉴 추가, 내보내기)을 표시
 * ListPageHeader 공통 컴포넌트를 래핑하여 일관된 UI 제공
 */

import { Plus, RefreshCw, Download, TreePine } from 'lucide-react';
import { ListPageHeader } from '@/components/layouts/list-page-header';
import { useMenuStore } from '../stores';

/**
 * MenusHeader 컴포넌트 Props 인터페이스
 */
interface MenusHeaderProps {
  /** 새로고침 버튼 클릭 핸들러 */
  onRefresh?: () => void;
  
  /** 내보내기 버튼 클릭 핸들러 */
  onExport?: () => void;

  /** 트리 뷰 토글 핸들러 */
  onToggleTreeView?: () => void;

  /** 트리 뷰 활성 상태 */
  isTreeView?: boolean;
}

/**
 * 메뉴 관리 페이지 헤더 컴포넌트
 * 
 * @description
 * - 페이지 제목과 설명 표시
 * - 새로고침, 메뉴 추가, 트리 뷰, 내보내기 액션 버튼 제공
 * - 메뉴 추가 버튼 클릭 시 useMenuStore의 openForm 호출하여 폼 모달 오픈
 * 
 * @example
 * ```tsx
 * <MenusHeader
 *   onRefresh={handleRefresh}
 *   onExport={handleExport}
 *   onToggleTreeView={handleToggleTreeView}
 *   isTreeView={isTreeView}
 * />
 * ```
 */
export function MenusHeader({ 
  onRefresh, 
  onExport,
  onToggleTreeView,
  isTreeView = false,
}: MenusHeaderProps) {
  // Zustand 스토어에서 폼 열기 함수 가져오기
  const { openForm } = useMenuStore();

  return (
    <ListPageHeader
      title="메뉴 관리"
      description="시스템 메뉴 구조를 관리합니다"
      actions={[
        {
          label: '새로고침',
          icon: RefreshCw,
          onClick: () => onRefresh?.(),
          variant: 'outline',
        },
        {
          label: isTreeView ? '목록 뷰' : '트리 뷰',
          icon: TreePine,
          onClick: () => onToggleTreeView?.(),
          variant: 'outline',
        },
        {
          label: '메뉴 추가',
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
