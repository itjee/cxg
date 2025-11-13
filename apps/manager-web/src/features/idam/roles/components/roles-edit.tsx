"use client";

/**
 * @file roles-edit.tsx
 * @description 역할 생성/수정 Drawer 컨테이너 컴포넌트
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { RolesForm } from "./roles-form";
import { useRolesStore } from "../stores/roles.store";
import { useRolesById, useCreateRoles, useUpdateRoles } from "../hooks/use-roles";
import type { Roles } from "../types/roles.types";

interface RolesEditProps {
  roles: Roles[];
}

export function RolesEdit({ roles }: RolesEditProps) {
  const { formOpen, selectedId, closeForm } = useRolesStore();
  const { data: editingRole } = useRolesById(selectedId || "");
  
  const createMutation = useCreateRoles({
    onSuccess: () => {
      toast.success('역할이 생성되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '역할 생성에 실패했습니다');
      console.error('Failed to create role:', error);
    },
  });

  const updateMutation = useUpdateRoles({
    onSuccess: () => {
      toast.success('역할이 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '역할 수정에 실패했습니다');
      console.error('Failed to update role:', error);
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
      title={selectedId ? '역할 수정' : '역할 등록'}
      description={
        selectedId
          ? '역할 정보를 수정하세요.'
          : '새로운 역할 정보를 입력하세요.'
      }
      width="md"
    >
      <RolesForm
        initialData={editingRole}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
