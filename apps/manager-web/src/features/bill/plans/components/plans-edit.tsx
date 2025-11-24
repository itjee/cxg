/**
 * @file plans-edit.tsx
 * @description 요금제 생성/수정 Drawer 컨테이너 컴포넌트
 *
 * 요금제 생성 및 수정 Drawer를 관리하는 Container Component
 * - Drawer 상태 관리 (열기/닫기)
 * - 데이터 로딩 (수정 모드)
 * - 폼 제출 처리 (생성/수정 mutation)
 * - PlansForm (Presentational) 컴포넌트 래핑
 *
 * @component Container Component (비즈니스 로직 포함)
 * @pattern Container/Presentational
 */

'use client';

import { toast } from 'sonner';
import { FormDrawer } from '@/components/features';
import { PlansForm } from './plans-form';
import { usePlansStore } from '../stores';
import { usePlan, useCreatePlan, useUpdatePlan } from '../hooks';
import type { CreatePlanRequest, UpdatePlanRequest } from '../types';

/**
 * 요금제 생성/수정 Drawer 컴포넌트
 */
export function PlansEdit() {
  // Drawer 상태 관리
  const { isEditModalOpen, selectedPlan, closeEditModal } = usePlansStore();

  // 수정할 요금제 데이터 조회
  const { data: editingPlan } = usePlan(selectedPlan?.id);

  // 생성 Mutation
  const createMutation = useCreatePlan();

  // 수정 Mutation
  const updateMutation = useUpdatePlan();

  // 로딩 상태
  const isLoading = createMutation.isPending || updateMutation.isPending;

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (formData: CreatePlanRequest | UpdatePlanRequest) => {
    if (selectedPlan?.id) {
      // 수정 모드
      updateMutation.mutate(
        {
          id: selectedPlan.id,
          data: formData as UpdatePlanRequest,
        },
        {
          onSuccess: () => {
            toast.success('요금제가 수정되었습니다');
            closeEditModal();
          },
          onError: (error) => {
            toast.error(error.message || '요금제 수정에 실패했습니다');
            console.error('Failed to update plan:', error);
          },
        }
      );
    } else {
      // 생성 모드
      createMutation.mutate(formData as CreatePlanRequest, {
        onSuccess: () => {
          toast.success('새 요금제가 생성되었습니다');
          closeEditModal();
        },
        onError: (error) => {
          toast.error(error.message || '요금제 생성에 실패했습니다');
          console.error('Failed to create plan:', error);
        },
      });
    }
  };

  return (
    <FormDrawer
      open={isEditModalOpen}
      onOpenChange={closeEditModal}
      title={selectedPlan?.id ? '요금제 수정' : '요금제 등록'}
      description={
        selectedPlan?.id
          ? '요금제 정보를 수정하세요.'
          : '새로운 요금제 정보를 입력하세요.'
      }
      width="md"
    >
      <PlansForm
        initialData={editingPlan}
        onSubmit={handleSubmit}
        onCancel={closeEditModal}
        isLoading={isLoading}
      />
    </FormDrawer>
  );
}
