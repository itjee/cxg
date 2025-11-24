/**
 * @file tenants-form-config.ts
 * @description 테넌트 폼 설정 및 검증 스키마
 *
 * 테넌트 생성/수정 폼의 필드 구성, 검증 규칙, 기본값을 정의합니다.
 */

import * as z from "zod";
import type { FormConfig } from "@/components/features/form-field-config";

/**
 * 테넌트 폼 데이터 타입
 */
export type TenantFormData = z.infer<typeof tenantFormSchema>;

/**
 * 폼 유효성 검증 스키마
 */
export const tenantFormSchema = z.object({
  code: z.string().min(1, "테넌트 코드를 입력해주세요"),
  name: z.string().min(1, "테넌트명을 입력해주세요"),
  type: z.enum(["TRIAL", "STANDARD", "PREMIUM", "ENTERPRISE"]),
  startDate: z.string().min(1, "계약 시작일을 입력해주세요"),
  bizNo: z.string().optional(),
  bizName: z.string().optional(),
  ceoName: z.string().optional(),
  phone: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  closeDate: z.string().optional(),
  status: z.enum(["TRIAL", "ACTIVE", "SUSPENDED", "TERMINATED"]).optional(),
});

/**
 * 필드별 힌트 설명
 */
const fieldHints = {
  code: "테넌트를 식별하는 고유 코드를 입력하세요 (영문+숫자)",
  name: "테넌트(회사)명을 입력하세요",
  type: "테넌트 요금제 유형을 선택하세요",
  startDate: "계약 시작일을 입력하세요",
  bizNo: "사업자등록번호를 입력하세요",
  bizName: "상호(법인명)를 입력하세요",
  ceoName: "대표자명을 입력하세요",
  phone: "대표 전화번호를 입력하세요",
  address1: "기본 주소를 입력하세요",
  address2: "상세 주소를 입력하세요",
  closeDate: "계약 종료일을 입력하세요 (선택)",
  status: "테넌트의 현재 상태를 선택하세요",
};

/**
 * 테넌트 폼 설정
 */
export const tenantFormConfig: FormConfig<TenantFormData> = {
  schema: tenantFormSchema,
  defaultValues: {
    code: "",
    name: "",
    type: "STANDARD",
    startDate: "",
    bizNo: "",
    bizName: "",
    ceoName: "",
    phone: "",
    address1: "",
    address2: "",
    closeDate: "",
    status: "ACTIVE",
  },
  sections: [
    {
      id: "basic-info",
      title: "기본 정보",
      fields: [
        {
          name: "code",
          label: "테넌트 코드",
          type: "text",
          placeholder: "테넌트 코드를 입력하세요",
          hint: fieldHints.code,
          required: true,
          disabled: true, // 생성 후 수정 불가
          grid: "half",
        },
        {
          name: "name",
          label: "테넌트명",
          type: "text",
          placeholder: "테넌트명을 입력하세요",
          hint: fieldHints.name,
          required: true,
          grid: "half",
        },
        {
          name: "type",
          label: "요금제 유형",
          type: "select",
          hint: fieldHints.type,
          required: true,
          grid: "half",
          options: [
            { value: "TRIAL", label: "평가판" },
            { value: "STANDARD", label: "표준" },
            { value: "PREMIUM", label: "프리미엄" },
            { value: "ENTERPRISE", label: "엔터프라이즈" },
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
            { value: "TRIAL", label: "평가판" },
            { value: "ACTIVE", label: "활성" },
            { value: "SUSPENDED", label: "일시중단" },
            { value: "TERMINATED", label: "종료" },
          ],
        },
        {
          name: "startDate",
          label: "계약 시작일",
          type: "date",
          placeholder: "YYYY-MM-DD",
          hint: fieldHints.startDate,
          required: true,
          grid: "half",
        },
        {
          name: "closeDate",
          label: "계약 종료일",
          type: "date",
          placeholder: "YYYY-MM-DD",
          hint: fieldHints.closeDate,
          required: false,
          grid: "half",
        },
      ],
    },
    {
      id: "business-info",
      title: "사업자 정보",
      fields: [
        {
          name: "bizNo",
          label: "사업자등록번호",
          type: "text",
          placeholder: "사업자등록번호를 입력하세요",
          hint: fieldHints.bizNo,
          required: false,
          grid: "half",
        },
        {
          name: "bizName",
          label: "상호(법인명)",
          type: "text",
          placeholder: "상호명을 입력하세요",
          hint: fieldHints.bizName,
          required: false,
          grid: "half",
        },
        {
          name: "ceoName",
          label: "대표자명",
          type: "text",
          placeholder: "대표자명을 입력하세요",
          hint: fieldHints.ceoName,
          required: false,
          grid: "half",
        },
        {
          name: "phone",
          label: "전화번호",
          type: "text",
          placeholder: "전화번호를 입력하세요",
          hint: fieldHints.phone,
          required: false,
          grid: "half",
        },
      ],
    },
    {
      id: "address-info",
      title: "주소 정보",
      fields: [
        {
          name: "address1",
          label: "주소",
          type: "text",
          placeholder: "주소를 입력하세요",
          hint: fieldHints.address1,
          required: false,
          grid: "full",
        },
        {
          name: "address2",
          label: "상세주소",
          type: "text",
          placeholder: "상세주소를 입력하세요",
          hint: fieldHints.address2,
          required: false,
          grid: "full",
        },
      ],
    },
  ],
};
