"use client";

/**
 * @file tenants-edit.tsx
 * @description 테넌트 생성/수정 Dialog
 *
 * 테넌트 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 생성 및 수정 기능을 처리합니다.
 */

import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { tenantFormConfig, type TenantFormData } from "../config/tenants-form-config";
import { useTenantsStore } from "../stores/tenants.store";
import { useTenant, useCreateTenant, useUpdateTenant } from "../hooks";

interface TenantsEditProps {
  onSuccess?: () => void;
}

/**
 * 테넌트 생성/수정 Dialog 컴포넌트
 *
 * 기능:
 * - 테넌트 생성: 새로운 테넌트 데이터를 입력받아 생성
 * - 테넌트 수정: 기존 테넌트 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function TenantsEdit({ onSuccess }: TenantsEditProps = {}) {
  const { formOpen, selectedId, closeForm } = useTenantsStore();

  // 테넌트 데이터 조회 (수정 모드일 때만)
  const { data: tenantResponse } = useTenant(
    formOpen && selectedId ? selectedId : ""
  );
  const editingTenant = tenantResponse?.tenant;

  // GraphQL 뮤테이션 훅
  const [createTenant, { loading: createLoading }] = useCreateTenant();
  const [updateTenant, { loading: updateLoading }] = useUpdateTenant();

  const isLoading = createLoading || updateLoading;
  const isEditing = !!selectedId;

  /**
   * 폼 제출 핸들러
   * 생성/수정 여부에 따라 적절한 뮤테이션 실행
   */
  const handleSubmit = async (formData: TenantFormData) => {
    const loadingToast = toast.loading(
      isEditing ? "테넌트 정보를 수정 중입니다..." : "테넌트를 생성 중입니다..."
    );

    try {
      // 폼 데이터를 camelCase GraphQL API 형식으로 변환
      const apiInput = {
        code: formData.code,
        name: formData.name,
        type: formData.type,
        startDate: formData.startDate,
        bizNo: formData.bizNo,
        bizName: formData.bizName,
        ceoName: formData.ceoName,
        phoneNo: formData.phone,
        address1: formData.address1,
        address2: formData.address2,
        closeDate: formData.closeDate,
        status: formData.status,
      };

      if (isEditing) {
        // 수정 모드: code 제외, 나머지 필드 전송
        const { code, ...updateInput } = apiInput;

        console.log("[DEBUG] Sending update request:", {
          id: selectedId,
          input: updateInput,
        });

        await updateTenant({
          variables: {
            id: selectedId,
            input: updateInput,
          },
        });
      } else {
        // 생성 모드: 기본 정보 전송
        console.log("[DEBUG] Sending create request:", {
          input: apiInput,
        });

        await createTenant({
          variables: {
            input: apiInput,
          },
        });
      }

      // 로딩 toast 제거 및 성공 메시지 표시
      toast.dismiss(loadingToast);
      toast.success(
        isEditing ? "테넌트가 수정되었습니다" : "테넌트가 생성되었습니다"
      );

      // 성공 콜백 호출 (목록 자동 갱신)
      onSuccess?.();
      closeForm();
    } catch (error) {
      console.error("Form submission error:", error);

      // 로딩 toast 제거
      toast.dismiss(loadingToast);

      // GraphQL 에러 추출
      const graphQLError = (error as any)?.graphQLErrors?.[0];
      const message = graphQLError?.message ||
                     (error instanceof Error ? error.message : "작업 실패");

      toast.error(
        isEditing
          ? "테넌트 수정 실패: " + message
          : "테넌트 생성 실패: " + message
      );
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isEditing ? "테넌트 수정" : "테넌트 등록"}
      description={
        isEditing
          ? "테넌트 정보를 수정하세요."
          : "새로운 테넌트 정보를 입력하세요."
      }
      width="md"
    >
      <Form
        config={tenantFormConfig}
        initialData={
          editingTenant
            ? {
                code: editingTenant.code,
                name: editingTenant.name,
                type: editingTenant.type,
                startDate: (editingTenant.startDate || editingTenant.start_date) as string,
                bizNo: (editingTenant.bizNo || editingTenant.biz_no) || "",
                bizName: (editingTenant.bizName || editingTenant.biz_name) || "",
                ceoName: (editingTenant.ceoName || editingTenant.ceo_name) || "",
                phone: (editingTenant.phoneNo || editingTenant.phone_no) || "",
                address1: editingTenant.address1 || "",
                address2: editingTenant.address2 || "",
                closeDate: (editingTenant.closeDate || editingTenant.close_date) || "",
                status: editingTenant.status,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </FormDrawer>
  );
}
