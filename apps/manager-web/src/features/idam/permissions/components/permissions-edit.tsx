"use client";

/**
 * @file permissions-edit.tsx
 * @description 권한 생성/수정 Dialog
 *
 * 권한 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 생성 및 수정 기능을 처리합니다.
 */

import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { permissionFormConfig, type PermissionFormData } from "../config/permissions-form-config";
import { usePermissionsStore } from "../stores/permissions.store";
import { usePermission, useCreatePermission, useUpdatePermission } from "../hooks";

/**
 * 권한 생성/수정 Dialog 컴포넌트
 *
 * 기능:
 * - 권한 생성: 새로운 권한 데이터를 입력받아 생성
 * - 권한 수정: 기존 권한 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function PermissionEdit() {
  const { formOpen, selectedId, closeForm } = usePermissionsStore();

  // 권한 데이터 조회 (수정 모드일 때만)
  const permissionId = formOpen && selectedId ? selectedId : "";
  const { data: permissionResponse, loading: permissionLoading } = usePermission(permissionId);
  const editingPermission = permissionResponse?.permission;

  // GraphQL 뮤테이션 훅
  const [createPermission, { loading: createLoading }] = useCreatePermission();
  const [updatePermission, { loading: updateLoading }] = useUpdatePermission();

  const isLoading = createLoading || updateLoading || permissionLoading;
  const isEditing = !!selectedId;

  /**
   * 폼 제출 핸들러
   * 생성/수정 여부에 따라 적절한 뮤테이션 실행
   */
  const handleSubmit = async (formData: PermissionFormData) => {
    try {
      if (isEditing) {
        // 수정 모드: 선택된 필드만 업데이트
        await updatePermission({
          variables: {
            id: selectedId,
            input: {
              name: formData.name,
              description: formData.description,
              category: formData.category,
              resource: formData.resource,
              action: formData.action,
              scope: formData.scope,
              appliesTo: formData.appliesTo,
              isSystem: formData.isSystem,
              status: formData.status,
            },
          },
        });
        toast.success("권한이 수정되었습니다");
      } else {
        // 생성 모드: 전체 데이터 전송
        await createPermission({
          variables: {
            input: {
              ...formData,
              status: formData.status || "ACTIVE",
            },
          },
        });
        toast.success("권한이 생성되었습니다");
      }
      closeForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        isEditing
          ? "권한 수정 실패: " + message
          : "권한 생성 실패: " + message
      );
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isEditing ? "권한 수정" : "권한 등록"}
      description={
        isEditing
          ? "권한 정보를 수정하세요."
          : "새로운 권한 정보를 입력하세요."
      }
      width="md"
    >
      <Form
        config={permissionFormConfig}
        initialData={editingPermission ? {
          code: editingPermission.code,
          name: editingPermission.name,
          description: editingPermission.description,
          category: editingPermission.category,
          resource: editingPermission.resource,
          action: editingPermission.action,
          scope: editingPermission.scope,
          appliesTo: editingPermission.appliesTo,
          isSystem: editingPermission.isSystem,
          status: editingPermission.status,
        } : undefined}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </FormDrawer>
  );
}
