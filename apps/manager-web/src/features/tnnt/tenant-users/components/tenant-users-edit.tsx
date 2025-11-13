/**
 * @file tenant-users-edit.tsx
 * @description 테넌트 사용자 수정 모달
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTenantUsersStore } from '../stores';
import { useTenantUserById, useUpdateTenantUser } from '../hooks';
import { TenantUsersForm } from './tenant-users-form';
import { toast } from 'sonner';

export function TenantUsersEdit() {
  const { formOpen, selectedId, closeForm } = useTenantUsersStore();
  const { data: user, isLoading } = useTenantUserById(selectedId || '');

  const updateMutation = useUpdateTenantUser({
    onSuccess: () => {
      toast.success('사용자 정보가 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '수정 실패');
    },
  });

  if (!formOpen || !selectedId) return null;
  if (isLoading) return null;

  return (
    <Dialog open={formOpen} onOpenChange={closeForm}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>테넌트 사용자 수정</DialogTitle>
        </DialogHeader>
        {user && (
          <TenantUsersForm
            initialData={user}
            onSubmit={(data) => updateMutation.mutate({ id: selectedId, data })}
            onCancel={closeForm}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
