/**
 * @file sessions-form-config.ts
 * @description 사용자 폼 설정 및 검증 스키마
 *
 * 사용자 생성/수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * 사용자 폼 데이터 타입
 *
 * UI에서 사용되는 폼 데이터 (기본 정보만)
 * - password 필드 없음 (백엔드에서 생성)
 * - status는 수정 모드에서만 필요하지만, 폼에 포함 (선택 사항)
 */
export type SessionFormData = z.infer<typeof userFormSchema>;

/**
 * 폼 유효성 검증 스키마
 *
 * 주의: 비밀번호 필드 없음
 * - 생성 모드: 백엔드에서 임시 비밀번호 자동 생성 후 이메일로 전송
 * - 수정 모드: 비밀번호 변경 불가 (별도의 비밀번호 재설정 프로세스 사용)
 */
export const userFormSchema = z.object({
  username: z.string().min(3, "사용자명은 3자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  fullName: z.string().min(1, "전체 이름을 입력해주세요"),
  userType: z.string({
    message: "사용자 유형을 선택해주세요",
  }),
  phone: z.string().nullish(),
  department: z.string().nullish(),
  position: z.string().nullish(),
  status: z.enum(["ACTIVE", "INACTIVE", "LOCKED", "SUSPENDED"]).optional(),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  username: "3자 이상의 고유한 사용자명을 입력하세요",
  email:
    "유효한 이메일 주소를 입력하세요 (임시 비밀번호가 이메일로 전송됩니다)",
  fullName: "사용자의 실제 이름을 입력하세요",
  userType: "사용자의 역할에 따라 적절한 유형을 선택하세요",
  phone: "연락 가능한 전화번호를 입력하세요",
  department: "소속 부서명을 입력하세요",
  position: "사용자의 직책/직급을 입력하세요",
};

/**
 * 사용자 폼 설정
 */
export const userFormConfig: FormConfig<SessionFormData> = {
  schema: userFormSchema,
  defaultValues: {
    username: "",
    email: "",
    fullName: "",
    userType: "USER",
    phone: "",
    department: "",
    position: "",
    status: "ACTIVE",
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
          placeholder: "사용자명을 입력하세요 (3자 이상)",
          hint: fieldHints.username,
          required: true,
          disabled: true, // 생성 후 수정 불가
          grid: "half",
        },
        {
          name: "email",
          label: "이메일",
          type: "email",
          placeholder: "이메일을 입력하세요",
          hint: fieldHints.email,
          required: true,
          grid: "half",
        },
        {
          name: "fullName",
          label: "전체 이름",
          type: "text",
          placeholder: "전체 이름을 입력하세요",
          hint: fieldHints.fullName,
          required: true,
          grid: "half",
        },
        {
          name: "userType",
          label: "사용자 유형",
          type: "select",
          hint: fieldHints.userType,
          required: true,
          grid: "half",
          options: [
            { value: "MASTER", label: "최고관리자" },
            { value: "TENANT", label: "테넌트 관리자" },
            { value: "SYSTEM", label: "시스템 사용자" },
          ],
        },
        {
          name: "phone",
          label: "전화",
          type: "text",
          placeholder: "전화번호를 입력하세요",
          hint: fieldHints.phone,
          required: false,
          grid: "half",
        },
        {
          name: "department",
          label: "부서",
          type: "text",
          placeholder: "부서를 입력하세요",
          hint: fieldHints.department,
          required: false,
          grid: "half",
        },
        {
          name: "position",
          label: "직책",
          type: "text",
          placeholder: "직책을 입력하세요",
          hint: fieldHints.position,
          required: false,
          grid: "half",
        },
        {
          name: "status",
          label: "사용자 상태",
          type: "select",
          required: false,
          grid: "half",
          options: [
            { value: "ACTIVE", label: "활성" },
            { value: "INACTIVE", label: "비활성" },
            { value: "LOCKED", label: "잠금" },
            { value: "SUSPENDED", label: "일시정지" },
          ],
        },
      ],
    },
  ],
};
