"use client";

/**
 * PermissionsEdit
 * 권한 생성/수정 Drawer
 */

import { useMemo } from "react";
import { EntityDrawer } from "@/components/features";
import { PermissionsForm } from "./permissions-form";
import { usePermissionStore } from "../stores";
import {
  usePermission,
  useCreatePermission,
  useUpdatePermission,
} from "../hooks";
import type {
  Permission,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "../types";

interface PermissionsEditProps {
  /**
   * 전체 권한 목록
   */
  permissions: Permission[];
}

export function PermissionsEdit({ permissions }: PermissionsEditProps) {
  const { formOpen, editingId, closeForm } = usePermissionStore();

  // 수정 시 권한 데이터 조회
  const { data: permissionDetail } = usePermission(editingId);
  const editingPermission = permissionDetail?.data;

  // Mutations
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission(editingId || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 폼 제출 핸들러
  const handleSubmit = (
    formData: CreatePermissionRequest | UpdatePermissionRequest
  ) => {
    if (editingId) {
      updateMutation.mutate(formData as UpdatePermissionRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    } else {
      createMutation.mutate(formData as CreatePermissionRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? "권한 수정" : "권한 등록"}
      description={
        editingId ? "권한 정보를 수정하세요." : "새로운 권한 정보를 입력하세요."
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
