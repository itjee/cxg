/**
 * @file permissions-form-config.ts
 * @description 권한 폼 설정 및 검증 스키마
 *
 * 권한 생성/수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * 권한 폼 데이터 타입
 *
 * UI에서 사용되는 폼 데이터
 */
export type PermissionFormData = z.infer<typeof permissionFormSchema>;

/**
 * 폼 유효성 검증 스키마
 */
export const permissionFormSchema = z.object({
  code: z.string().min(1, "권한 코드를 입력해주세요"),
  name: z.string().min(1, "권한명을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  resource: z.string().min(1, "리소스를 선택해주세요"),
  action: z.string().min(1, "작업을 선택해주세요"),
  scope: z.string().optional(),
  appliesTo: z.string().optional(),
  isSystem: z.boolean().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  code: "권한의 고유한 코드를 입력하세요 (예: users.create, tenants.manage)",
  name: "권한의 표시 이름을 입력하세요",
  description: "권한에 대한 설명을 입력하세요",
  category: "권한이 속한 카테고리를 선택하세요",
  resource: "권한이 적용될 리소스를 선택하세요",
  action: "권한의 작업 유형을 선택하세요",
  scope: "권한의 범위를 선택하세요 (GLOBAL: 전체, TENANT: 테넌트)",
  appliesToAppliesTo: "권한이 적용될 대상을 선택하세요",
  isSystem: "시스템 권한 여부를 설정하세요",
  status: "권한의 활성 여부를 선택하세요",
};

/**
 * 권한 폼 설정
 */
export const permissionFormConfig: FormConfig<PermissionFormData> = {
  schema: permissionFormSchema,
  defaultValues: {
    code: "",
    name: "",
    description: "",
    category: "",
    resource: "",
    action: "",
    scope: "GLOBAL",
    appliesTo: "ALL",
    isSystem: false,
    status: "ACTIVE",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "code",
          label: "권한 코드",
          type: "text",
          placeholder: "권한 코드를 입력하세요",
          hint: fieldHints.code,
          required: true,
          grid: "half",
        },
        {
          name: "name",
          label: "권한명",
          type: "text",
          placeholder: "권한명을 입력하세요",
          hint: fieldHints.name,
          required: true,
          grid: "half",
        },
        {
          name: "category",
          label: "카테고리",
          type: "select",
          hint: fieldHints.category,
          required: true,
          grid: "half",
          options: [
            { value: "USER_MANAGEMENT", label: "사용자 관리" },
            { value: "ROLE_MANAGEMENT", label: "역할 관리" },
            { value: "PERMISSION_MANAGEMENT", label: "권한 관리" },
            { value: "SYSTEM_SETTINGS", label: "시스템 설정" },
            { value: "TENANT_MANAGEMENT", label: "테넌트 관리" },
          ],
        },
        {
          name: "resource",
          label: "리소스",
          type: "select",
          hint: fieldHints.resource,
          required: true,
          grid: "half",
          options: [
            { value: "users", label: "사용자" },
            { value: "roles", label: "역할" },
            { value: "permissions", label: "권한" },
            { value: "tenants", label: "테넌트" },
            { value: "system", label: "시스템" },
          ],
        },
        {
          name: "action",
          label: "작업",
          type: "select",
          hint: fieldHints.action,
          required: true,
          grid: "half",
          options: [
            { value: "CREATE", label: "생성 (CREATE)" },
            { value: "READ", label: "조회 (READ)" },
            { value: "UPDATE", label: "수정 (UPDATE)" },
            { value: "DELETE", label: "삭제 (DELETE)" },
            { value: "LIST", label: "목록 (LIST)" },
            { value: "MANAGE", label: "관리 (MANAGE)" },
          ],
        },
        {
          name: "scope",
          label: "범위",
          type: "select",
          hint: fieldHints.scope,
          required: false,
          grid: "half",
          options: [
            { value: "GLOBAL", label: "전체 (GLOBAL)" },
            { value: "TENANT", label: "테넌트 (TENANT)" },
          ],
        },
        {
          name: "appliesTo",
          label: "적용 대상",
          type: "select",
          hint: fieldHints.appliesToAppliesTo,
          required: false,
          grid: "half",
          options: [
            { value: "ALL", label: "모두" },
            { value: "MASTER", label: "마스터" },
            { value: "TENANT", label: "테넌트" },
            { value: "SYSTEM", label: "시스템" },
          ],
        },
        {
          name: "status",
          label: "상태",
          type: "select",
          hint: fieldHints.status,
          required: false,
          grid: "half",
          options: [
            { value: "ACTIVE", label: "활성" },
            { value: "INACTIVE", label: "비활성" },
          ],
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
          placeholder: "권한에 대한 설명을 입력하세요",
          hint: fieldHints.description,
          grid: "full",
        },
      ],
    },
  ],
};
