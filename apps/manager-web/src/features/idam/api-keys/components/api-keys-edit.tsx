'use client';

/**
 * @file api-keys-edit.tsx
 * @description API 키 생성/수정 Drawer 컨테이너 컴포넌트
 * 
 * API 키 생성 및 수정 Drawer를 관리하는 Container Component
 * - Drawer 상태 관리 (열기/닫기)
 * - 데이터 로딩 (수정 모드)
 * - 폼 제출 처리 (생성/수정 mutation)
 * - ApiKeysForm (Presentational) 컴포넌트 래핑
 * 
 * @component Container Component (비즈니스 로직 포함)
 * @pattern Container/Presentational
 */

import { toast } from 'sonner';
import { EntityDrawer } from '@/components/features';
import { ApiKeysForm } from './api-keys-form';
import { useApiKeyStore } from '../stores';
import { useApiKey, useCreateApiKey, useUpdateApiKey } from '../hooks';
import type { CreateApiKeyRequest, UpdateApiKeyRequest } from '../types';

/**
 * API 키 생성/수정 Drawer 컴포넌트
 */
export function ApiKeysEdit() {
  // Drawer 상태 관리
  const { formOpen, editingId, closeForm } = useApiKeyStore();
  
  // 수정할 API 키 데이터 조회
  const { data: editingApiKey } = useApiKey(editingId);

  // 생성 Mutation
  const createMutation = useCreateApiKey();

  // 수정 Mutation
  const updateMutation = useUpdateApiKey();
  
  // 로딩 상태
  const isLoading = createMutation.isPending || updateMutation.isPending;

  /**
   * 폼 제출 핸들러
   */
  const handleSubmit = (formData: CreateApiKeyRequest | UpdateApiKeyRequest) => {
    if (editingId) {
      // 수정 모드
      updateMutation.mutate(
        { id: editingId, data: formData as UpdateApiKeyRequest },
        {
          onSuccess: () => {
            toast.success('API 키가 수정되었습니다');
            closeForm();
          },
          onError: (error) => {
            toast.error(error.message || 'API 키 수정에 실패했습니다');
            console.error('Failed to update API key:', error);
          },
        }
      );
    } else {
      // 생성 모드
      createMutation.mutate(formData as CreateApiKeyRequest, {
        onSuccess: (response) => {
          toast.success('API 키가 생성되었습니다');
          // 생성 시 실제 키 값 표시 (보안상 한 번만 표시)
          if (response.data) {
            toast.info('생성된 키를 안전한 곳에 보관하세요', {
              duration: 10000,
            });
          }
          closeForm();
        },
        onError: (error) => {
          toast.error(error.message || 'API 키 생성에 실패했습니다');
          console.error('Failed to create API key:', error);
        },
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? 'API 키 수정' : 'API 키 생성'}
      description={
        editingId
          ? 'API 키 정보를 수정하세요.'
          : '새로운 API 키를 생성하세요. 생성된 키는 한 번만 표시됩니다.'
      }
      width="md"
    >
      <ApiKeysForm
        initialData={editingApiKey?.data}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
