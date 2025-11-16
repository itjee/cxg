"use client";

/**
 * @file api-keys-edit.tsx
 * @description API 키 생성/수정 Drawer 컴포넌트
 *
 * Apollo GraphQL Hooks를 사용합니다.
 */

import { toast } from "sonner";
import { EntityDrawer } from "@/components/features";
import { ApiKeysForm } from "./api-keys-form";
import { useApiKeyStore } from "../stores/api_keys.store";
import {
  useApiKey,
  useCreateApiKey,
  useUpdateApiKey,
} from "../hooks/use-api-keys";

export function ApiKeysEdit() {
  const { formOpen, editingId, closeForm } = useApiKeyStore();

  // 수정 모드: 선택된 API 키 조회
  const { data: apiKeyResponse } = useApiKey(editingId || "");
  const editingApiKey = apiKeyResponse?.apiKey;

  // Apollo Mutation Hooks (tuple return pattern)
  const [createApiKey, { loading: createLoading }] = useCreateApiKey();
  const [updateApiKey, { loading: updateLoading }] = useUpdateApiKey();

  const isLoading = createLoading || updateLoading;

  const handleSubmit = async (formData: any) => {
    try {
      if (editingId) {
        // 수정 모드
        await updateApiKey({
          variables: {
            id: editingId,
            input: formData,
          },
        });

        toast.success("API 키가 수정되었습니다");
        closeForm();
      } else {
        // 생성 모드
        await createApiKey({
          variables: {
            input: formData,
          },
        });

        toast.success("API 키가 생성되었습니다");
        toast.info("생성된 키를 안전한 곳에 보관하세요", {
          duration: 10000,
        });
        closeForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "작업 실패";
      toast.error(
        editingId ? "API 키 수정 실패: " + message : "API 키 생성 실패: " + message
      );
      console.error("Failed to save API key:", error);
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? "API 키 수정" : "API 키 생성"}
      description={
        editingId
          ? "API 키 정보를 수정하세요."
          : "새로운 API 키를 생성하세요. 생성된 키는 한 번만 표시됩니다."
      }
      width="md"
    >
      <ApiKeysForm
        initialData={editingApiKey}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
