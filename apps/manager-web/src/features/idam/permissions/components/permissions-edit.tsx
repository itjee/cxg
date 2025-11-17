"use client";

/**
 * @file permissions-edit.tsx
 * @description 권한 생성/수정 Drawer 컨테이너 컴포넌트
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { PermissionForm } from "./permissions-form";
import { usePermissionsStore } from "../stores/permissions.store";
import {
  usePermission,
  useCreatePermission,
  useUpdatePermission,
} from "../hooks/use-permissions";
import type { Permission } from "../types/permissions.types";

interface PermissionEditProps {
  permission?: Permission;
}

export function PermissionEdit({ permission }: PermissionEditProps) {
  const { formOpen, selectedId, closeForm } = usePermissionsStore();

  //수정모드 : 선택된 권한그룹 조회 (단수)
  const { data: permissionResponse } = usePermission(selectedId || "");
  const editingPermission = permissionResponse?.permission;

  //Apollo Mutation 훅
  const [createPermission, { loading: createLoading }] = useCreatePermission();
  const [updatePermission, { loading: updateLoading }] = useUpdatePermission();

  const isLoading = createLoading || updateLoading;

  const handleSubmit = (formData: any) => {
    try {
      if (selectedId) {
        updatePermission({
          variables: { id: selectedId, input: formData },
          onCompleted: () => {
            toast.success("권한이 수정되었습니다");
            closeForm();
          },
          onError: (error) => {
            toast.error(error.message || "권한 수정에 실패했습니다");
            console.error("Failed to update permission:", error);
          },
        });
      } else {
        createPermission({
          variables: { input: formData },
          onCompleted: () => {
            toast.success("권한이 생성되었습니다");
            closeForm();
          },
          onError: (error) => {
            toast.error(error.message || "권한 생성에 실패했습니다");
            console.error("Failed to create permission:", error);
          },
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        selectedId ? "권한 수정 실패: " + message : "권한 생성 실패: " + message
      );
      console.error("Failed to save permission:", error);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={selectedId ? "권한 수정" : "권한 등록"}
      description={
        selectedId
          ? "권한 정보를 수정하세요."
          : "새로운 권한 정보를 입력하세요."
      }
      width="md"
    >
      <PermissionForm
        initialData={editingPermission}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
