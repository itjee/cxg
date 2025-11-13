"use client";

/**
 * @file permissions-edit.tsx
 * @description 권한 생성/수정 Drawer 컨테이너 컴포넌트
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { PermissionsForm } from "./permissions-form";
import { usePermissionsStore } from "../stores/permissions.store";
import { usePermissionsById, useCreatePermissions, useUpdatePermissions } from "../hooks/use-permissions";
import type { Permissions } from "../types/permissions.types";

interface PermissionsEditProps {
  permissions: Permissions[];
}

export function PermissionsEdit({ permissions }: PermissionsEditProps) {
  const { formOpen, selectedId, closeForm } = usePermissionsStore();
  const { data: editingPermission } = usePermissionsById(selectedId || "");
  
  const createMutation = useCreatePermissions({
    onSuccess: () => {
      toast.success('권한이 생성되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '권한 생성에 실패했습니다');
      console.error('Failed to create permission:', error);
    },
  });

  const updateMutation = useUpdatePermissions({
    onSuccess: () => {
      toast.success('권한이 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '권한 수정에 실패했습니다');
      console.error('Failed to update permission:', error);
    },
  });
  
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (formData: any) => {
    if (selectedId) {
      updateMutation.mutate({ id: selectedId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={selectedId ? '권한 수정' : '권한 등록'}
      description={
        selectedId
          ? '권한 정보를 수정하세요.'
          : '새로운 권한 정보를 입력하세요.'
      }
      width="md"
    >
      <PermissionsForm
        initialData={editingPermission}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
