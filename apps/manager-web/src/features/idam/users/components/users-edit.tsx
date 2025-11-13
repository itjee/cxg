"use client";

/**
 * @file users-edit.tsx
 * @description 사용자 생성/수정 Drawer 컨테이너 컴포넌트
 * 
 * EntityDrawer를 사용하여 사용자 폼을 표시하고 제출을 처리하는 컨테이너
 * - 생성 모드: selectedId === null
 * - 수정 모드: selectedId !== null
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { UsersForm } from "./users-form";
import { useUsersStore } from "../stores/users.store";
import { useUsersById, useCreateUsers, useUpdateUsers } from "../hooks/use-users";
import type { Users } from "../types/users.types";

interface UsersEditProps {
  users: Users[];
}

export function UsersEdit({ users }: UsersEditProps) {
  const { formOpen, selectedId, closeForm } = useUsersStore();
  const { data: editingUser } = useUsersById(selectedId || "");
  
  const createMutation = useCreateUsers({
    onSuccess: () => {
      toast.success('사용자가 생성되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '사용자 생성에 실패했습니다');
      console.error('Failed to create user:', error);
    },
  });

  const updateMutation = useUpdateUsers({
    onSuccess: () => {
      toast.success('사용자가 수정되었습니다');
      closeForm();
    },
    onError: (error) => {
      toast.error(error.message || '사용자 수정에 실패했습니다');
      console.error('Failed to update user:', error);
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
      title={selectedId ? '사용자 수정' : '사용자 등록'}
      description={
        selectedId
          ? '사용자 정보를 수정하세요.'
          : '새로운 사용자 정보를 입력하세요.'
      }
      width="md"
    >
      <UsersForm
        initialData={editingUser}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
