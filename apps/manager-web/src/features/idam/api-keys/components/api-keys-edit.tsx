"use client";

/**
 * @file api-keys-edit.tsx
 * @description API 키 생성/수정 Dialog
 *
 * API 키 관리를 위한 통합 Dialog 컴포넌트
 * 공통 Form 컴포넌트를 사용하여 생성 및 수정 기능을 처리합니다.
 */

import React, { useEffect } from "react";
import { toast } from "sonner";
import { Form, FormDrawer } from "@/components/features";
import { apiKeyFormConfig, type ApiKeyFormData } from "../config/api-keys-form-config";
import { useApiKeysStore } from "../stores/api-keys.store";
import { useApiKey, useCreateApiKey, useUpdateApiKey } from "../hooks";

/**
 * API 키 생성/수정 Dialog 컴포넌트
 *
 * 기능:
 * - API 키 생성: 새로운 API 키 생성
 * - API 키 수정: 기존 API 키 데이터를 로드하여 수정
 * - 폼 유효성 검증: Zod 스키마 기반 자동 검증
 * - 에러 처리: GraphQL 에러 메시지 표시
 */
export function ApiKeysEdit() {
  const { formOpen, selectedId, closeForm } = useApiKeysStore();

  // API 키 데이터 조회 (수정 모드일 때만)
  const { data: apiKeyResponse, loading: apiKeyLoading, error: apiKeyError } = useApiKey(
    formOpen && selectedId ? selectedId : ""
  );
  const editingApiKey = apiKeyResponse?.apiKey;

  // 에러 발생 시 토스트 표시
  useEffect(() => {
    if (apiKeyError) {
      const graphQLError = (apiKeyError as any)?.graphQLErrors?.[0];
      const message = graphQLError?.message || "API 키 정보를 불러올 수 없습니다";
      console.error("[API Keys Edit Error]", message, apiKeyError);
      toast.error(message);
    }
  }, [apiKeyError]);

  // GraphQL 뮤테이션 훅
  const [createApiKey, { loading: createLoading }] = useCreateApiKey();
  const [updateApiKey, { loading: updateLoading }] = useUpdateApiKey();

  const isLoading = createLoading || updateLoading || apiKeyLoading;
  const isEditing = !!selectedId;

  /**
   * GraphQL 데이터를 폼 형식으로 변환
   * - scopes, allowedIps: 배열 → 쉼표로 구분된 문자열로 변환
   */
  const transformApiKeyToFormData = (apiKey: any): Partial<ApiKeyFormData> | undefined => {
    if (!apiKey) return undefined;

    return {
      keyName: apiKey.keyName,
      userId: apiKey.userId,
      tenantContext: apiKey.tenantContext,
      serviceAccount: apiKey.serviceAccount,
      scopes: apiKey.scopes?.join(", "),
      allowedIps: apiKey.allowedIps?.join(", "),
      rateLimitPerMinute: apiKey.rateLimitPerMinute,
      rateLimitPerHour: apiKey.rateLimitPerHour,
      rateLimitPerDay: apiKey.rateLimitPerDay,
      expiresAt: apiKey.expiresAt,
      status: apiKey.status,
    };
  };

  /**
   * 폼 데이터를 GraphQL Input 형식으로 변환
   * - scopes, allowedIps: 쉼표로 구분된 문자열 → 배열로 변환
   */
  const transformFormDataToGraphQL = (data: ApiKeyFormData) => {
    return {
      ...data,
      scopes: data.scopes ? data.scopes.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      allowedIps: data.allowedIps
        ? data.allowedIps.split(",").map((ip) => ip.trim()).filter(Boolean)
        : undefined,
    };
  };

  /**
   * 폼 제출 핸들러
   * API 키 생성 또는 수정
   */
  const handleSubmit = async (formData: ApiKeyFormData) => {
    try {
      const graphQLInput = transformFormDataToGraphQL(formData);

      if (isEditing) {
        // 수정 모드: 입력된 데이터 전송
        console.log("[DEBUG] Sending API key update request:", {
          id: selectedId,
          input: graphQLInput,
        });

        await updateApiKey({
          variables: {
            id: selectedId,
            input: graphQLInput,
          },
        });

        toast.success("API 키가 수정되었습니다");
      } else {
        // 생성 모드: 새 API 키 생성
        console.log("[DEBUG] Sending API key create request:", {
          input: graphQLInput,
        });

        await createApiKey({
          variables: {
            input: graphQLInput,
          },
        });

        toast.success("API 키가 생성되었습니다");
        toast.info("생성된 키를 안전한 곳에 보관하세요", {
          duration: 10000,
        });
      }

      closeForm();
    } catch (error) {
      console.error("Form submission error:", error);

      // GraphQL 에러 추출
      const graphQLError = (error as any)?.graphQLErrors?.[0];
      const message =
        graphQLError?.message || (error instanceof Error ? error.message : "작업 실패");

      toast.error(
        isEditing ? "API 키 수정 실패: " + message : "API 키 생성 실패: " + message
      );
    }
  };

  return (
    <FormDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={isEditing ? "API 키 수정" : "API 키 생성"}
      description={
        isEditing
          ? "API 키 정보를 수정하세요."
          : "새로운 API 키를 생성하세요. 생성된 키는 한 번만 표시됩니다."
      }
      width="md"
    >
      <Form
        config={apiKeyFormConfig}
        initialData={transformApiKeyToFormData(editingApiKey)}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "생성"}
      />
    </FormDrawer>
  );
}
