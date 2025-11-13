'use client';

/**
 * @file menus-edit.tsx
 * @description 메뉴 생성/수정 Drawer
 */

import { useMemo } from 'react';
import { toast } from 'sonner';
import { EntityDrawer } from '@/components/features';
import { MenusForm } from './menus-form';
import { useMenuStore } from '../stores';
import { useMenu, useCreateMenu, useUpdateMenu } from '../hooks';
import type { CreateMenuRequest, UpdateMenuRequest, Menu } from '../types';

interface MenusEditProps {
  /**
   * 전체 메뉴 목록 (부모 메뉴 선택용)
   */
  menus?: Menu[];
}

export function MenusEdit({ menus = [] }: MenusEditProps) {
  const { formOpen, editingId, closeForm } = useMenuStore();
  
  // 수정 시 메뉴 데이터 조회
  const { data: editingMenu } = useMenu(editingId);

  // Mutations with callbacks
  const createMutation = useCreateMenu({
    onSuccess: () => {
      toast.success('메뉴가 생성되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '메뉴 생성에 실패했습니다');
      console.error('Failed to create menu:', error);
    },
  });

  const updateMutation = useUpdateMenu({
    onSuccess: () => {
      toast.success('메뉴가 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '메뉴 수정에 실패했습니다');
      console.error('Failed to update menu:', error);
    },
  });
  
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 부모 메뉴 목록 추출 (현재 수정 중인 메뉴와 그 하위 메뉴 제외)
  const parentMenuOptions = useMemo(() => {
    if (!menus.length) return [];
    
    // 폴더 타입만 부모로 선택 가능
    return menus
      .filter(menu => menu.menu_type === 'FOLDER' && menu.id !== editingId)
      .map(menu => ({
        id: menu.id,
        name: menu.name,
        depth: menu.depth,
      }));
  }, [menus, editingId]);

  // 폼 제출 핸들러
  const handleSubmit = (formData: CreateMenuRequest | UpdateMenuRequest) => {
    if (editingId) {
      updateMutation.mutate({ 
        id: editingId, 
        data: formData as UpdateMenuRequest 
      });
    } else {
      createMutation.mutate(formData as CreateMenuRequest);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? '메뉴 수정' : '메뉴 등록'}
      description={
        editingId
          ? '메뉴 정보를 수정하세요.'
          : '새로운 메뉴 정보를 입력하세요.'
      }
      width="md"
    >
      <MenusForm
        initialData={editingMenu}
        parentMenus={parentMenuOptions}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
