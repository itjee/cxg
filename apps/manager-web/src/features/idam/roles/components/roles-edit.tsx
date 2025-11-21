"use client";

/**
 * @file roles-edit.tsx
 * @description 역할 생성/수정 Dialog
 *
 * 역할 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 생성 및 수정 기능을 처리합니다.
 */

import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { roleFormConfig, type RoleFormData } from "../config/roles-form-config";
import { useRolesStore } from "../stores/roles.store";
import { useRole, useCreateRole, useUpdateRole } from "../hooks";

/**
 * 역할 생성/수정 Dialog 컴포넌트
 *
 * 기능:
 * - 역할 생성: 새로운 역할 데이터를 입력받아 생성
 * - 역할 수정: 기존 역할 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function RolesEdit() {
  const { formOpen, selectedId, closeForm } = useRolesStore();

  // 역할 데이터 조회 (수정 모드일 때만)
  const { data: roleResponse } = useRole(
    formOpen && selectedId ? selectedId : ""
  );
  const editingRole = roleResponse?.role;

  // GraphQL 뮤테이션 훅
  const [createRole, { loading: createLoading }] = useCreateRole();
  const [updateRole, { loading: updateLoading }] = useUpdateRole();

  const isLoading = createLoading || updateLoading;
  const isEditing = !!selectedId;

  /**
   * 폼 제출 핸들러
   * 생성/수정 여부에 따라 적절한 뮤테이션 실행
   */
  const handleSubmit = async (formData: RoleFormData) => {
    try {
      if (isEditing) {
        // 수정 모드
        await updateRole({
          variables: {
            id: selectedId,
            input: formData,
          },
        });
        toast.success("역할이 수정되었습니다");
      } else {
        // 생성 모드
        await createRole({
          variables: {
            input: formData,
          },
        });
        toast.success("역할이 생성되었습니다");
      }
      closeForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        isEditing
          ? "역할 수정 실패: " + message
          : "역할 생성 실패: " + message
      );
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isEditing ? "역할 수정" : "역할 등록"}
      description={
        isEditing
          ? "역할 정보를 수정하세요."
          : "새로운 역할 정보를 입력하세요."
      }
      width="md"
    >
      <Form
        config={roleFormConfig}
        initialData={editingRole}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </FormDrawer>
  );
}
