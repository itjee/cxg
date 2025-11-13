/**
 * @file tenant-roles-edit.tsx
 * @description 테넌트 역할 수정 모달
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTenantRolesStore } from '../stores';
import { useTenantRoleById, useUpdateTenantRole } from '../hooks';
import { TenantRolesForm } from './tenant-roles-form';
import { toast } from 'sonner';

export function TenantRolesEdit() {
  const { formOpen, selectedId, closeForm } = useTenantRolesStore();
  const { data: role, isLoading } = useTenantRoleById(selectedId || '');

  const updateMutation = useUpdateTenantRole({
    onSuccess: () => {
      toast.success('역할 정보가 수정되었습니다');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>테넌트 역할 수정</DialogTitle>
        </DialogHeader>
        {role && (
          <TenantRolesForm
            initialData={role}
            onSubmit={(data) => updateMutation.mutate({ id: selectedId, data })}
            onCancel={closeForm}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
