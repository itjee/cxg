"use client";

/**
 * @file login-logs-edit.tsx
 * @description 로그인 이력 상세 조회 Dialog
 *
 * 로그인 이력 관리를 위한 읽기 전용 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 상세 정보를 표시합니다.
 */

import React, { useEffect } from "react";
import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { loginLogFormConfig, type LoginLogFormData } from "../config/login-logs-form-config";
import { useLoginLogsStore } from "../stores/login-logs.store";
import { useLoginLog } from "../hooks";

/**
 * 로그인 이력 상세 조회 Dialog 컴포넌트
 *
 * 기능:
 * - 로그인 이력 조회: 기존 로그인 이력 데이터를 로드하여 표시
 * - 읽기 전용: 모든 필드가 disabled 상태로 편집 불가
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function LoginLogsEdit() {
  const { formOpen, selectedId, closeForm } = useLoginLogsStore();

  // 로그인 이력 데이터 조회 (조회 모드일 때만)
  const { data: loginLogResponse, loading: loginLogLoading, error: loginLogError } = useLoginLog(
    formOpen && selectedId ? selectedId : ""
  );
  const loginLog = loginLogResponse?.loginLog;

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (loginLogError) {
      const graphQLError = (loginLogError as any)?.graphQLErrors?.[0];
      const message = graphQLError?.message || "로그인 이력을 불러올 수 없습니다";
      console.error("[Login Logs Edit Error]", message, loginLogError);
      toast.error(message);
    }
  }, [loginLogError]);

  /**
   * GraphQL 데이터를 폼 형식으로 변환
   */
  const transformLoginLogToFormData = (data: any): Partial<LoginLogFormData> | undefined => {
    if (!data) return undefined;

    return {
      username: data.username,
      userType: data.userType,
      attemptType: data.attemptType,
      success: data.success,
      failureReason: data.failureReason,
      ipAddress: data.ipAddress,
      city: data.city,
      countryCode: data.countryCode,
      mfaUsed: data.mfaUsed,
      mfaMethod: data.mfaMethod,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  };

  const isLoading = loginLogLoading;

  /**
   * 폼 제출 핸들러
   * 읽기 전용이므로 실제로는 동작하지 않음
   */
  const handleSubmit = async (formData: LoginLogFormData) => {
    // 읽기 전용 폼이므로 제출 로직 없음
    toast.info("로그인 이력은 읽기 전용입니다");
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title="로그인 이력 상세"
      description="로그인 이력은 읽기 전용 감사 데이터입니다."
      width="md"
    >
      <Form
        config={loginLogFormConfig}
        initialData={transformLoginLogToFormData(loginLog)}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText="닫기"
      />
    </FormDrawer>
  );
}
