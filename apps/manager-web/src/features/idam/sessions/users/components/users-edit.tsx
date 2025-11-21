"use client";

/**
 * @file sessions-edit.tsx
 * @description 사용자 생성/수정 Dialog
 *
 * 사용자 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 생성 및 수정 기능을 처리합니다.
 */

import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { userFormConfig, type SessionFormData } from "../config/sessions-form-config";
import { useSessionsStore } from "../stores/sessions.store";
import { useSession, useCreateSession, useUpdateSession } from "../hooks";

/**
 * 사용자 생성/수정 Dialog 컴포넌트
 *
 * 기능:
 * - 사용자 생성: 새로운 사용자 데이터를 입력받아 생성
 * - 사용자 수정: 기존 사용자 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function SessionsEdit() {
  const { formOpen, selectedId, closeForm } = useSessionsStore();

  // 사용자 데이터 조회 (수정 모드일 때만)
  const { data: userResponse } = useSession(
    formOpen && selectedId ? selectedId : ""
  );
  const editingSession = userResponse?.user;

  // GraphQL 뮤테이션 훅
  const [createSession, { loading: createLoading }] = useCreateSession();
  const [updateSession, { loading: updateLoading }] = useUpdateSession();

  const isLoading = createLoading || updateLoading;
  const isEditing = !!selectedId;

  /**
   * 폼 제출 핸들러
   * 생성/수정 여부에 따라 적절한 뮤테이션 실행
   *
   * 주의: 비밀번호는 폼에서 입력받지 않음
   * - 생성 모드: 백엔드에서 임시 비밀번호 자동 생성 후 이메일로 전송
   * - 수정 모드: 비밀번호 변경 불가
   */
  const handleSubmit = async (formData: SessionFormData) => {
    try {
      if (isEditing) {
        // 수정 모드: username만 제외, 나머지 필드 전송
        // 백엔드에서 빈 문자열을 null로 변환함
        const { username, ...updateInput } = formData;

        console.log("[DEBUG] Sending update request:", {
          id: selectedId,
          input: updateInput,
        });

        await updateSession({
          variables: {
            id: selectedId,
            input: updateInput,
          },
        });
        toast.success("사용자가 수정되었습니다");
      } else {
        // 생성 모드: 기본 정보 전송 (백엔드에서 임시 비밀번호 생성)
        await createSession({
          variables: {
            input: formData,
          },
        });
        toast.success(
          "사용자가 생성되었습니다. 임시 비밀번호가 이메일로 전송되었습니다."
        );
      }
      closeForm();
    } catch (error) {
      console.error("Form submission error:", error);

      // GraphQL 에러 추출
      const graphQLError = (error as any)?.graphQLErrors?.[0];
      const message = graphQLError?.message ||
                     (error instanceof Error ? error.message : "작업 실패");

      toast.error(
        isEditing
          ? "사용자 수정 실패: " + message
          : "사용자 생성 실패: " + message
      );
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isEditing ? "사용자 수정" : "사용자 등록"}
      description={
        isEditing
          ? "사용자 정보를 수정하세요."
          : "새로운 사용자 정보를 입력하세요."
      }
      width="md"
    >
      <Form
        config={userFormConfig}
        initialData={
          editingSession
            ? {
                username: editingSession.username,
                email: editingSession.email,
                fullName: editingSession.fullName,
                userType: editingSession.userType,
                phone: editingSession.phone,
                department: editingSession.department,
                position: editingSession.position,
                status: editingSession.status,
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
