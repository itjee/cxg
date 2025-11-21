/**
 * @file form-field-config.ts
 * @description 폼 필드 설정 타입 정의
 *
 * 동적 폼 렌더링을 위한 필드 설정 스키마
 */

import { z } from "zod";
import {
  FieldValues,
  UseFormRegister,
  Control,
  FieldPath,
} from "react-hook-form";

/**
 * 폼 필드의 입력 타입
 */
export type FieldInputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio";

/**
 * 선택 필드의 옵션
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * 단일 폼 필드 설정
 */
export interface FormFieldConfig {
  // 기본 정보
  name: string;
  label: string;
  type: FieldInputType;
  placeholder?: string;
  hint?: string;
  required?: boolean;

  // 유효성 검증
  validation?: {
    min?: number | string;
    max?: number | string;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };

  // 선택 필드 옵션
  options?: SelectOption[];

  // UI 설정
  disabled?: boolean;
  grid?: "full" | "half" | "third";
  section?: string;

  // 조건부 표시
  visible?: (data: any) => boolean;

  // 기타
  defaultValue?: any;
}

/**
 * 폼 섹션 설정
 */
export interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
}

/**
 * 전체 폼 설정
 */
export interface FormConfig<
  T extends Record<string, any> = Record<string, any>
> {
  sections: FormSectionConfig[];
  schema: z.ZodType<T>;
  defaultValues?: Partial<T>;
}
