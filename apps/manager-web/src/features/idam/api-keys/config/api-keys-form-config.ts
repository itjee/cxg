/**
 * @file api-keys-form-config.ts
 * @description API 키 폼 설정 및 검증 스키마
 *
 * API 키 생성/수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * API 키 폼 데이터 타입
 */
export type ApiKeyFormData = z.infer<typeof apiKeyFormSchema>;

/**
 * 폼 유효성 검증 스키마
 */
export const apiKeyFormSchema = z.object({
  keyName: z.string().min(1, "API 키 이름을 입력하세요"),
  userId: z.string().min(1, "사용자 ID를 입력하세요"),
  tenantContext: z.string().optional(),
  serviceAccount: z.string().optional(),
  scopes: z.string().optional(),
  allowedIps: z.string().optional(),
  rateLimitPerMinute: z.number().min(1, "분당 제한은 1 이상이어야 합니다"),
  rateLimitPerHour: z.number().min(1, "시간당 제한은 1 이상이어야 합니다"),
  rateLimitPerDay: z.number().min(1, "일일 제한은 1 이상이어야 합니다"),
  expiresAt: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "REVOKED"]).optional(),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  keyName: "API 키의 식별 가능한 이름",
  userId: "이 API 키를 소유한 사용자 ID",
  tenantContext: "테넌트 컨텍스트 (선택사항)",
  serviceAccount: "서비스 계정명 (선택사항)",
  scopes: "쉼표로 구분된 권한 범위",
  allowedIps: "쉼표로 구분된 허용 IP 주소",
  rateLimitPerMinute: "분당 요청 제한",
  rateLimitPerHour: "시간당 요청 제한",
  rateLimitPerDay: "일일 요청 제한",
  expiresAt: "API 키 만료일시 (비워두면 만료 안 함)",
  status: "API 키의 현재 상태",
};

/**
 * API 키 폼 설정
 */
export const apiKeyFormConfig: FormConfig<ApiKeyFormData> = {
  schema: apiKeyFormSchema,
  defaultValues: {
    keyName: "",
    userId: "",
    tenantContext: "",
    serviceAccount: "",
    scopes: "",
    allowedIps: "",
    rateLimitPerMinute: 1000,
    rateLimitPerHour: 10000,
    rateLimitPerDay: 100000,
    expiresAt: "",
    status: "ACTIVE",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "keyName",
          label: "API 키 이름",
          type: "text",
          placeholder: "Production API Key",
          hint: fieldHints.keyName,
          required: true,
          grid: "full",
        },
        {
          name: "userId",
          label: "사용자 ID",
          type: "text",
          placeholder: "UUID",
          hint: fieldHints.userId,
          required: true,
          disabled: true, // 생성 후 변경 불가
          grid: "half",
        },
        {
          name: "tenantContext",
          label: "테넌트 컨텍스트",
          type: "text",
          placeholder: "UUID (선택사항)",
          hint: fieldHints.tenantContext,
          required: false,
          grid: "half",
        },
        {
          name: "serviceAccount",
          label: "서비스 계정",
          type: "text",
          placeholder: "서비스 계정명",
          hint: fieldHints.serviceAccount,
          required: false,
          grid: "full",
        },
      ],
    },
    {
      id: "permissions",
      title: "권한 및 스코프",
      fields: [
        {
          name: "scopes",
          label: "스코프 (Scopes)",
          type: "textarea",
          placeholder: "read:data, write:data, admin:all",
          hint: fieldHints.scopes,
          required: false,
          grid: "full",
        },
        {
          name: "allowedIps",
          label: "허용 IP 주소",
          type: "textarea",
          placeholder: "192.168.1.1, 10.0.0.1",
          hint: fieldHints.allowedIps,
          required: false,
          grid: "full",
        },
      ],
    },
    {
      id: "rate-limits",
      title: "사용 제한",
      fields: [
        {
          name: "rateLimitPerMinute",
          label: "분당 제한",
          type: "number",
          hint: fieldHints.rateLimitPerMinute,
          required: true,
          grid: "third",
        },
        {
          name: "rateLimitPerHour",
          label: "시간당 제한",
          type: "number",
          hint: fieldHints.rateLimitPerHour,
          required: true,
          grid: "third",
        },
        {
          name: "rateLimitPerDay",
          label: "일일 제한",
          type: "number",
          hint: fieldHints.rateLimitPerDay,
          required: true,
          grid: "third",
        },
      ],
    },
    {
      id: "expiration-status",
      title: "만료 및 상태",
      fields: [
        {
          name: "expiresAt",
          label: "만료일",
          type: "text",
          placeholder: "2024-12-31T23:59:59Z",
          hint: fieldHints.expiresAt,
          required: false,
          grid: "half",
        },
        {
          name: "status",
          label: "상태",
          type: "select",
          hint: fieldHints.status,
          required: true,
          grid: "half",
          options: [
            { value: "ACTIVE", label: "활성" },
            { value: "INACTIVE", label: "비활성" },
            { value: "REVOKED", label: "취소됨" },
          ],
        },
      ],
    },
  ],
};
