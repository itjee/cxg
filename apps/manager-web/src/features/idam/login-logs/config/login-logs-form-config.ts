/**
 * @file login-logs-form-config.ts
 * @description 로그인 이력 폼 설정 및 검증 스키마
 *
 * 로그인 이력 상세 조회 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 * 로그인 이력은 읽기 전용 감사 데이터이므로 모든 필드가 disabled입니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * 로그인 이력 폼 데이터 타입
 *
 * UI에서 사용되는 폼 데이터 (조회 모드에서만 사용)
 * - 로그인 이력은 읽기 전용 감사 데이터
 */
export type LoginLogFormData = z.infer<typeof loginLogFormSchema>;

/**
 * 폼 유효성 검증 스키마
 *
 * 로그인 이력은 읽기 전용이지만, 데이터 표시를 위해 스키마를 정의합니다
 */
export const loginLogFormSchema = z.object({
  username: z.string().min(1, "사용자명을 입력하세요"),
  userType: z.string().optional(),
  attemptType: z.string(),
  success: z.boolean(),
  failureReason: z.string().optional(),
  ipAddress: z.string().min(1, "IP 주소를 입력하세요"),
  city: z.string().optional(),
  countryCode: z.string().optional(),
  mfaUsed: z.boolean(),
  mfaMethod: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  username: "로그인을 시도한 사용자명",
  userType: "사용자 유형",
  attemptType: "로그인 시도 유형",
  success: "로그인 성공 여부",
  failureReason: "로그인 실패 사유",
  ipAddress: "로그인을 시도한 클라이언트 IP 주소",
  city: "클라이언트의 지리적 위치 (도시)",
  countryCode: "클라이언트의 국가 코드",
  mfaUsed: "다중 인증 사용 여부",
  mfaMethod: "사용된 다중 인증 방식",
  createdAt: "로그인 시도 일시",
  updatedAt: "로그인 이력 수정 일시",
};

/**
 * 로그인 이력 폼 설정
 *
 * 모든 필드는 읽기 전용(disabled)입니다
 */
export const loginLogFormConfig: FormConfig<LoginLogFormData> = {
  schema: loginLogFormSchema,
  defaultValues: {
    username: "",
    userType: "",
    attemptType: "",
    success: false,
    failureReason: "",
    ipAddress: "",
    city: "",
    countryCode: "",
    mfaUsed: false,
    mfaMethod: "",
    createdAt: "",
    updatedAt: "",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "username",
          label: "사용자명",
          type: "text",
          placeholder: "사용자명",
          hint: fieldHints.username,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "userType",
          label: "사용자 유형",
          type: "text",
          placeholder: "사용자 유형",
          hint: fieldHints.userType,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
      ],
    },
    {
      id: "attempt-info",
      title: "시도 정보",
      fields: [
        {
          name: "attemptType",
          label: "시도 유형",
          type: "text",
          placeholder: "시도 유형",
          hint: fieldHints.attemptType,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "success",
          label: "결과",
          type: "checkbox",
          hint: fieldHints.success,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "failureReason",
          label: "실패 사유",
          type: "textarea",
          placeholder: "실패 사유",
          hint: fieldHints.failureReason,
          required: false,
          disabled: true, // 읽기 전용
          grid: "full",
        },
      ],
    },
    {
      id: "session-info",
      title: "세션 정보",
      fields: [
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
          name: "city",
          label: "위치 (도시)",
          type: "text",
          placeholder: "도시",
          hint: fieldHints.city,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "countryCode",
          label: "국가 코드",
          type: "text",
          placeholder: "국가 코드",
          hint: fieldHints.countryCode,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "mfaUsed",
          label: "MFA 사용",
          type: "checkbox",
          hint: fieldHints.mfaUsed,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "mfaMethod",
          label: "MFA 방식",
          type: "text",
          placeholder: "MFA 방식",
          hint: fieldHints.mfaMethod,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
      ],
    },
    {
      id: "timestamps",
      title: "타임스탬프",
      fields: [
        {
          name: "createdAt",
          label: "생성 일시",
          type: "text",
          placeholder: "생성 일시",
          hint: fieldHints.createdAt,
          required: true,
          disabled: true, // 읽기 전용
          grid: "half",
        },
        {
          name: "updatedAt",
          label: "수정 일시",
          type: "text",
          placeholder: "수정 일시",
          hint: fieldHints.updatedAt,
          required: false,
          disabled: true, // 읽기 전용
          grid: "half",
        },
      ],
    },
  ],
};
