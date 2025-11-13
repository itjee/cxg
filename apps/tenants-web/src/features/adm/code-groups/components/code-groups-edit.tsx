"use client";

/**
 * CodeGroupsEdit
 * 코드그룹 생성/수정 Drawer
 */

import { EntityDrawer } from "@/components/features";
import { CodeGroupsForm } from "./code-groups-form";
import { useCodeGroupStore } from "../stores";
import { useCodeGroup, useCreateCodeGroup, useUpdateCodeGroup } from "../hooks";
import type { CreateCodeGroupRequest, UpdateCodeGroupRequest } from "../types";

export function CodeGroupsEdit() {
  const {
    isSidebarOpen: formOpen,
    selectedCodeGroup,
    closeSidebar: closeForm,
  } = useCodeGroupStore();

  // 생성 모드인지 수정 모드인지 판단
  const isCreating = !selectedCodeGroup;
  const editingId = selectedCodeGroup?.id || null;

  // 수정 모드일 때만 데이터 조회 (생성 모드에서는 쿼리 비활성화)
  const { codeGroup: editingCodeGroup } = useCodeGroup(
    isCreating ? null : editingId
  );

  // Mutations
  const { createCodeGroup, isCreating: isCreatingMutation } = useCreateCodeGroup();
  const { updateCodeGroup, isUpdating } = useUpdateCodeGroup();

  const isLoading = isCreatingMutation || isUpdating;

  // 폼 제출 핸들러
  const handleSubmit = (
    formData: CreateCodeGroupRequest | UpdateCodeGroupRequest
  ) => {
    if (editingId) {
      updateCodeGroup({
        id: editingId,
        data: formData as UpdateCodeGroupRequest,
      });
    } else {
      createCodeGroup(formData as CreateCodeGroupRequest);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isCreating ? "코드그룹 등록" : "코드그룹 수정"}
      description={
        isCreating
          ? "새로운 코드그룹 정보를 입력하세요."
          : "코드그룹 정보를 수정하세요."
      }
      width="md"
    >
      <CodeGroupsForm
        initialData={editingCodeGroup}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
