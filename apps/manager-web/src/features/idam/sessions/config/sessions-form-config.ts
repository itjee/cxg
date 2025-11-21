/**
 * @file sessions-form-config.ts
 * @description 세션 폼 설정 및 검증 스키마
 *
 * 세션 수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * 세션 폼 데이터 타입
 *
 * UI에서 사용되는 폼 데이터 (수정 모드에서만 사용)
 * - 세션은 보통 자동으로 생성되므로 생성 폼은 없음
 * - 상태(status)만 수정 가능
 */
export type SessionFormData = z.infer<typeof sessionFormSchema>;

/**
 * 폼 유효성 검증 스키마
 *
 * 세션은 읽기 전용 정보가 많고, 수정 시에는 주로 상태만 변경됨
 */
export const sessionFormSchema = z.object({
  sessionId: z.string().min(1, "세션 ID를 입력하세요"),
  userId: z.string().min(1, "사용자 ID를 입력하세요"),
  ipAddress: z.string().min(1, "IP 주소를 입력하세요"),
  sessionType: z.enum(["WEB", "API", "MOBILE"]),
  status: z.enum(["ACTIVE", "EXPIRED", "REVOKED"]),
  mfaVerified: z.boolean().optional(),
  lastActivityAt: z.string().optional(),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  sessionId: "세션 고유 식별자",
  userId: "세션을 소유한 사용자 ID",
  ipAddress: "세션이 생성된 클라이언트 IP 주소",
  sessionType: "세션 타입",
  status: "세션의 현재 상태",
  mfaVerified: "다중 인증 여부",
};

/**
 * 세션 폼 설정
 */
export const sessionFormConfig: FormConfig<SessionFormData> = {
  schema: sessionFormSchema,
  defaultValues: {
    sessionId: "",
    userId: "",
    ipAddress: "",
    sessionType: "WEB",
    status: "ACTIVE",
    mfaVerified: false,
    lastActivityAt: "",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "sessionId",
          label: "세션 ID",
          type: "text",
          placeholder: "세션 ID",
          hint: fieldHints.sessionId,
          required: true,
          disabled: true, // 읽기 전용
          grid: "full",
        },
        {
          name: "userId",
          label: "사용자 ID",
          type: "text",
          placeholder: "사용자 ID",
          hint: fieldHints.userId,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "ipAddress",
          label: "IP 주소",
          type: "text",
          placeholder: "IP 주소",
          hint: fieldHints.ipAddress,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "sessionType",
          label: "세션 타입",
          type: "select",
          hint: fieldHints.sessionType,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
          options: [
            { value: "WEB", label: "웹" },
            { value: "API", label: "API" },
            { value: "MOBILE", label: "모바일" },
          ],
        },
        {
          name: "mfaVerified",
          label: "다중 인증",
          type: "checkbox",
          hint: fieldHints.mfaVerified,
          required: false,
          grid: "half",
        },
      ],
    },
    {
      id: "status-info",
      title: "상태",
      fields: [
        {
          name: "status",
          label: "세션 상태",
          type: "select",
          hint: fieldHints.status,
          required: true,
          grid: "half",
          options: [
            { value: "ACTIVE", label: "활성" },
            { value: "EXPIRED", label: "만료됨" },
            { value: "REVOKED", label: "취소됨" },
          ],
        },
      ],
    },
  ],
};
