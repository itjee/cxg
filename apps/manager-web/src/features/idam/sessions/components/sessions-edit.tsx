"use client";

/**
 * @file sessions-edit.tsx
 * @description 세션 수정 Dialog
 *
 * 세션 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 수정 기능을 처리합니다.
 */

import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { sessionFormConfig, type SessionFormData } from "../config/sessions-form-config";
import { useSessionsStore } from "../stores/sessions.store";
import { useSession, useUpdateSession } from "../hooks";

/**
 * 세션 수정 Dialog 컴포넌트
 *
 * 기능:
 * - 세션 수정: 기존 세션 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function SessionsEdit() {
  const { formOpen, selectedId, closeForm } = useSessionsStore();

  // 세션 데이터 조회 (수정 모드일 때만)
  const { data: sessionResponse } = useSession(
    formOpen && selectedId ? selectedId : ""
  );
  const editingSession = sessionResponse?.session;

  // GraphQL 뮤테이션 훅
  const [updateSession, { loading: updateLoading }] = useUpdateSession();

  const isLoading = updateLoading;
  const isEditing = !!selectedId;

  /**
   * 폼 제출 핸들러
   * 세션 상태 수정
   */
  const handleSubmit = async (formData: SessionFormData) => {
    try {
      if (isEditing) {
        // 수정 모드: 상태만 전송
        const updateInput = {
          status: formData.status,
          mfaVerified: formData.mfaVerified,
        };

        console.log("[DEBUG] Sending session update request:", {
          id: selectedId,
          input: updateInput,
        });

        await updateSession({
          variables: {
            id: selectedId,
            input: updateInput,
          },
        });
        toast.success("세션이 수정되었습니다");
      }
      closeForm();
    } catch (error) {
      console.error("Form submission error:", error);

      // GraphQL 에러 추출
      const graphQLError = (error as any)?.graphQLErrors?.[0];
      const message = graphQLError?.message ||
                     (error instanceof Error ? error.message : "작업 실패");

      toast.error("세션 수정 실패: " + message);
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title="세션 수정"
      description="세션 정보를 수정하세요."
      width="md"
    >
      <Form
        config={sessionFormConfig}
        initialData={
          editingSession
            ? {
                sessionId: editingSession.sessionId,
                userId: editingSession.userId,
                ipAddress: editingSession.ipAddress,
                sessionType: editingSession.sessionType,
                status: editingSession.status,
                mfaVerified: editingSession.mfaVerified,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText="수정"
      />
    </FormDrawer>
  );
}
