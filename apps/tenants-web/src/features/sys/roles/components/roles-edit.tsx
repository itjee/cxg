"use client";

/**
 * RolesEdit
 * 역할 생성/수정 Drawer
 */

import { useMemo } from "react";
import { EntityDrawer } from "@/components/features";
import { RolesForm } from "./roles-form";
import { useRoleStore } from "../stores";
import { useRole, useCreateRole, useUpdateRole } from "../hooks";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "../types";

interface RolesEditProps {
  /**
   * 전체 역할 목록
   */
  roles: Role[];
}

export function RolesEdit({ roles }: RolesEditProps) {
  const { formOpen, editingId, closeForm } = useRoleStore();

  // 수정 시 역할 데이터 조회
  const { data: roleDetail } = useRole(editingId);
  const editingRole = roleDetail?.data;

  // Mutations
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole(editingId || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 폼 제출 핸들러
  const handleSubmit = (formData: CreateRoleRequest | UpdateRoleRequest) => {
    if (editingId) {
      updateMutation.mutate(formData as UpdateRoleRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    } else {
      createMutation.mutate(formData as CreateRoleRequest, {
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
      title={editingId ? "역할 수정" : "역할 등록"}
      description={
        editingId ? "역할 정보를 수정하세요." : "새로운 역할 정보를 입력하세요."
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
