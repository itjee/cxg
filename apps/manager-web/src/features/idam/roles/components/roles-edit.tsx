"use client";

/**
 * Role Edit Dialog
 *
 * 역할 생성/수정 Dialog 컴포넌트
 * Apollo GraphQL Hooks를 사용합니다.
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { RolesForm } from "./roles-form";
import { useRolesStore } from "../stores/roles.store";
import {
  useRole,
  useCreateRole,
  useUpdateRole,
} from "../hooks/use-roles";

export function RolesEdit() {
  const { formOpen, selectedId, closeForm } = useRolesStore();

  // 수정 모드: 선택된 역할 조회
  const { data: roleResponse } = useRole(selectedId || "");
  const editingRole = roleResponse?.role;

  // Apollo GraphQL Mutation Hooks
  const [createRole, { loading: createLoading }] = useCreateRole();
  const [updateRole, { loading: updateLoading }] = useUpdateRole();

  const isLoading = createLoading || updateLoading;

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedId) {
        // 수정 모드: name, description, status, permissions 전송
        await updateRole({
          variables: {
            id: selectedId,
            input: formData,
          },
        });

        toast.success("역할이 수정되었습니다");
        closeForm();
      } else {
        // 생성 모드: 전체 데이터 전송
        await createRole({
          variables: {
            input: formData,
          },
        });

        toast.success("역할이 생성되었습니다");
        closeForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        selectedId ? "역할 수정 실패: " + message : "역할 생성 실패: " + message
      );
      console.error("Failed to save role:", error);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={selectedId ? "역할 수정" : "역할 등록"}
      description={
        selectedId
          ? "역할 정보를 수정하세요."
          : "새로운 역할 정보를 입력하세요."
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
