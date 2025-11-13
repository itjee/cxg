"use client";

/**
 * CodeRulesEdit
 * 코드 규칙 생성/수정 Drawer
 */

import { useMemo } from "react";
import { EntityDrawer } from "@/components/features";
import { CodeRulesForm } from "./code-rules-form";
import { useCodeRuleStore } from "../stores";
import { useCodeRule, useCreateCodeRule, useUpdateCodeRule } from "../hooks";
import type {
  CodeRule,
  CreateCodeRuleRequest,
  UpdateCodeRuleRequest,
} from "../types";

interface CodeRulesEditProps {
  /**
   * 전체 코드 규칙 목록
   */
  codeRules: CodeRule[];
}

export function CodeRulesEdit({ codeRules }: CodeRulesEditProps) {
  const { formOpen, editingId, closeForm } = useCodeRuleStore();

  // 수정 시 코드 규칙 데이터 조회
  const { data: editingCodeRule } = useCodeRule(editingId);

  // Mutations
  const createMutation = useCreateCodeRule();
  const updateMutation = useUpdateCodeRule(editingId || "");

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // 폼 제출 핸들러
  const handleSubmit = (formData: Record<string, any>) => {
    if (editingId) {
      updateMutation.mutate(formData as UpdateCodeRuleRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    } else {
      createMutation.mutate(formData as CreateCodeRuleRequest, {
        onSuccess: () => {
          closeForm();
        },
      });
    }
  };

  return (
    <EntityDrawer
      open={formOpen}
      onOpenChange={closeForm}
      title={editingId ? "코드 규칙 수정" : "코드 규칙 등록"}
      description={
        editingId
          ? "코드 규칙 정보를 수정하세요."
          : "새로운 코드 규칙 정보를 입력하세요."
      }
      width="md"
    >
      <CodeRulesForm
        initialData={editingCodeRule}
        onSubmit={handleSubmit}
        onCancel={closeForm}
        isLoading={isLoading}
      />
    </EntityDrawer>
  );
}
