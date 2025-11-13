'use client';

/**
 * @file page.tsx
 * @description 메뉴 관리 페이지
 * 
 * 메뉴 구조 관리 페이지
 * - 메뉴 목록 조회 및 필터링
 * - 계층형 구조 표시
 * - 메뉴 생성/수정/삭제
 */

import { toast } from 'sonner';
import {
  MenusHeader,
  MenusStats,
  MenusFilters,
  MenusTable,
  MenusPaging,
  MenusEdit,
} from '@/features/sys/menus/components';
import {
  useDeleteMenu,
  useFilteredMenus,
  usePaginatedData,
} from '@/features/sys/menus/hooks';
import { useMenuStore } from '@/features/sys/menus/stores';
import { mockMenus } from '@/features/sys/menus/services';

/**
 * 메뉴 관리 페이지 컴포넌트
 * 
 * @description
 * - 메뉴 관리 기능 제공
 * - 필터링, 정렬, 페이지네이션 지원
 * - 계층형 구조 표시
 */
export default function MenusPage() {
  const {
    selectedMenuType,
    selectedModuleCode,
    selectedParentId,
    currentPage,
    itemsPerPage,
    openForm,
    isTreeView,
    setTreeView,
  } = useMenuStore();

  // 삭제 mutation
  const deleteMenuMutation = useDeleteMenu({
    onSuccess: () => {
      toast.success('메뉴가 삭제되었습니다');
      console.log('Menu deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || '메뉴 삭제에 실패했습니다');
      console.error('Failed to delete menu:', error);
    },
  });

  // 필터링된 데이터
  const filteredMenus = useFilteredMenus(mockMenus, {
    menuType: selectedMenuType,
    moduleCode: selectedModuleCode,
    parentId: selectedParentId,
  });

  // 페이지네이션 적용
  const paginatedMenus = usePaginatedData(filteredMenus, currentPage, itemsPerPage);

  // 메뉴 편집 핸들러
  const handleEditMenu = (menuId: string) => {
    openForm(menuId);
  };

  // 메뉴 삭제 핸들러
  const handleDeleteMenu = (menuId: string, menuName: string) => {
    const confirmMessage = `'${menuName}' 메뉴를 삭제하시겠습니까?`;
    if (window.confirm(confirmMessage)) {
      deleteMenuMutation.mutate(menuId);
    }
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    toast.info('데이터를 새로고침합니다');
    console.log('Refresh data');
    // TODO: API 호출로 데이터 새로고침
    // queryClient.invalidateQueries({ queryKey: ['menus'] });
  };

  // 내보내기 핸들러
  const handleExport = () => {
    toast.info('데이터를 내보냅니다');
    console.log('Export data');
    // TODO: 데이터 내보내기 처리
  };

  // 트리 뷰 토글 핸들러
  const handleToggleTreeView = () => {
    setTreeView(!isTreeView);
    toast.info(isTreeView ? '목록 뷰로 전환합니다' : '트리 뷰로 전환합니다');
    console.log(isTreeView ? '목록 뷰로 전환' : '트리 뷰로 전환');
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <MenusHeader 
        onRefresh={handleRefresh} 
        onExport={handleExport}
        onToggleTreeView={handleToggleTreeView}
        isTreeView={isTreeView}
      />

      {/* 통계 카드 - 필터링된 데이터 기반 */}
      <MenusStats menus={filteredMenus} />

      {/* 필터 섹션 - 전체 데이터에서 필터 옵션 추출 */}
      <MenusFilters menus={mockMenus} />

      {/* 데이터 테이블 - 필터링/페이지네이션 된 데이터 표시 */}
      <MenusTable
        data={paginatedMenus}
        onEdit={(menu) => handleEditMenu(menu.id)}
        onDelete={(menu) => handleDeleteMenu(menu.id, menu.name)}
      />

      {/* 페이지네이션 */}
      <MenusPaging totalItems={filteredMenus.length} />

      {/* 입력 폼 모달 */}
      <MenusEdit menus={mockMenus} />
    </div>
  );
}
