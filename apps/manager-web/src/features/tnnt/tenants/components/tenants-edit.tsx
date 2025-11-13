'use client';

/**
 * @file tenants-edit.tsx
 * @description 테넌트 생성/수정 Drawer 컨테이너 컴포넌트
 *
 * 테넌트 생성 및 수정 Drawer를 관리하는 Container Component
 * - Drawer 상태 관리 (열기/닫기)
 * - 데이터 로딩 (수정 모드)
 * - 폼 제출 처리 (생성/수정 mutation)
 * - TenantsForm (Presentational) 컴포넌트 래핑
 *
 * @component Container Component (비즈니스 로직 포함)
 * @pattern Container/Presentational
 */

import { toast } from 'sonner';
import { EntityDrawer } from '@/components/features';
import { TenantsForm } from './tenants-form';
import { useTenantsStore } from '../stores';
import { useTenant, useCreateTenant, useUpdateTenant } from '../hooks';
import type { CreateTenantRequest, UpdateTenantRequest } from '../types';

/**
 * 테넌트 생성/수정 Drawer 컴포넌트
 */
export function TenantsEdit() {
  // Drawer 상태 관리
  const { formOpen, editingId, closeForm } = useTenantsStore();

  // 수정할 테넌트 데이터 조회
  const { data: editingTenant } = useTenant(editingId);

  // 생성 Mutation
  const createMutation = useCreateTenant();

  // 수정 Mutation
  const updateMutation = useUpdateTenant(editingId || '');
  
  // 로딩 상태
  const isLoading = createMutation.isPending || updateMutation.isPending;

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (formData: CreateTenantRequest | UpdateTenantRequest) => {
    if (editingId) {
      // 수정 모드
      updateMutation.mutate(formData as UpdateTenantRequest, {
        onSuccess: () => {
          toast.success('테넌트가 수정되었습니다');
          closeForm();
        },
        onError: (error) => {
          toast.error(error.message || '테넌트 수정에 실패했습니다');
          console.error('Failed to update tenant:', error);
        },
      });
    } else {
      // 생성 모드
      createMutation.mutate(formData as CreateTenantRequest, {
        onSuccess: () => {
          toast.success('테넌트가 생성되었습니다');
          closeForm();
        },
        onError: (error) => {
          toast.error(error.message || '테넌트 생성에 실패했습니다');
          console.error('Failed to create tenant:', error);
        },
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? '테넌트 수정' : '테넌트 등록'}
      description={
        editingId
          ? '테넌트 정보를 수정하세요.'
          : '새로운 테넌트 정보를 입력하세요.'
      }
      width="md"
    >
      <TenantsForm
        initialData={editingTenant?.data}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
