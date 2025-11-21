/**
 * @file roles-form-config.ts
 * @description 역할 폼 설정
 *
 * DynamicForm으로 사용할 역할 폼의 설정 스키마
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features";

/**
 * 역할 폼 유효성 검증 스키마
 */
export const roleFormSchema = z.object({
  code: z.string().min(1, "역할 코드를 입력해주세요"),
  name: z.string().min(1, "역할명을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  level: z.number().min(0, "레벨은 0 이상이어야 합니다"),
  scope: z.string().min(1, "범위를 선택해주세요"),
  isDefault: z.boolean().optional(),
  priority: z.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    message: "상태를 선택해주세요",
  }),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

/**
 * 역할 폼 설정
 */
export const roleFormConfig: FormConfig<RoleFormData> = {
  schema: roleFormSchema,
  defaultValues: {
    code: "",
    name: "",
    description: "",
    category: "",
    level: 0,
    scope: "GLOBAL",
    isDefault: false,
    priority: 0,
    status: "ACTIVE",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "code",
          label: "역할 코드",
          type: "text",
          placeholder: "역할 코드를 입력하세요",
          hint: "역할의 고유한 코드를 입력하세요 (수정 후 변경 불가)",
          required: true,
          grid: "half",
        },
        {
          name: "name",
          label: "역할명",
          type: "text",
          placeholder: "역할명을 입력하세요",
          hint: "역할의 표시 이름을 입력하세요",
          required: true,
          grid: "half",
        },
        {
          name: "category",
          label: "카테고리",
          type: "select",
          hint: "역할이 속한 카테고리를 선택하세요",
          required: true,
          grid: "half",
          options: [
            { value: "MANAGER_ADMIN", label: "관리자" },
            { value: "PLATFORM_SUPPORT", label: "플랫폼 지원" },
            { value: "TENANT_ADMIN", label: "테넌트 관리자" },
            { value: "TENANT_USER", label: "테넌트 사용자" },
          ],
        },
        {
          name: "scope",
          label: "범위",
          type: "select",
          hint: "역할의 범위를 선택하세요 (GLOBAL: 전체, TENANT: 테넌트)",
          required: true,
          grid: "half",
          options: [
            { value: "GLOBAL", label: "전체" },
            { value: "TENANT", label: "테넌트" },
          ],
        },
        {
          name: "level",
          label: "레벨",
          type: "number",
          placeholder: "0",
          hint: "역할의 레벨을 설정하세요",
          grid: "half",
        },
        {
          name: "priority",
          label: "우선순위",
          type: "number",
          placeholder: "0",
          hint: "역할의 우선순위를 설정하세요 (숫자가 클수록 높은 우선순위)",
          grid: "half",
        },
        {
          name: "status",
          label: "상태",
          type: "select",
          hint: "역할의 활성 여부를 선택하세요",
          required: true,
          grid: "half",
          options: [
            { value: "ACTIVE", label: "활성" },
            { value: "INACTIVE", label: "비활성" },
          ],
        },
        {
          name: "isDefault",
          label: "기본 역할",
          type: "checkbox",
          hint: "기본 역할 여부를 설정하세요",
          grid: "half",
        },
      ],
    },
    {
      id: "description",
      title: "설명",
      fields: [
        {
          name: "description",
          label: "설명",
          type: "textarea",
          placeholder: "역할에 대한 설명을 입력하세요",
          hint: "역할의 목적과 권한을 설명하세요",
          grid: "full",
        },
      ],
    },
  ],
};
