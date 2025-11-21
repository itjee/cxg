/**
 * @file form.tsx
 * @description 폼 컴포넌트
 *
 * 폼 설정을 기반으로 자동으로 폼을 렌더링하는 공통 컴포넌트
 * React Hook Form과 Zod 스키마를 활용합니다.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormButtons } from "./form-buttons";
import { FormField } from "./form-field";
import type { DynamicFormConfig } from "./form-field-config";

interface FormProps<T extends Record<string, any> = Record<string, any>> {
  config: DynamicFormConfig<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitText?: string;
  showLabels?: boolean;
}

export function Form<T extends Record<string, any> = Record<string, any>>({
  config,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText,
  showLabels = true,
}: FormProps<T>) {
  const isEditing = !!initialData;

  const defaultFormValues = {
    ...config.defaultValues,
    ...initialData,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(config.schema as any),
    defaultValues: defaultFormValues,
  } as any);

  useEffect(() => {
    if (initialData) {
      reset({
        ...config.defaultValues,
        ...initialData,
      });
    } else {
      reset(config.defaultValues);
    }
  }, [initialData, reset, config.defaultValues]);

  return (
    <form onSubmit={handleSubmit((data: any) => onSubmit(data as T))} className="space-y-6">
      {/* 섹션별 필드 렌더링 */}
      {config.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          {showLabels && (
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold whitespace-nowrap">
                {section.title}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>
          )}
          {section.description && (
            <p className="text-sm text-muted-foreground">{section.description}</p>
          )}

          {/* 필드 그리드 */}
          <div className="grid grid-cols-12 gap-4">
            {section.fields.map((fieldConfig) => {
              // 조건부 표시 확인
              if (
                fieldConfig.visible &&
                !fieldConfig.visible(initialData || {})
              ) {
                return null;
              }

              const fieldError = (errors as any)[fieldConfig.name]?.message as string | undefined;

              // grid 속성에 따른 colspan 결정
              const colSpan = (() => {
                switch (fieldConfig.grid) {
                  case "full":
                    return "col-span-12";
                  case "third":
                    return "col-span-4";
                  case "half":
                  default:
                    return "col-span-6";
                }
              })();

              return (
                <div key={fieldConfig.name} className={colSpan}>
                  <FormField
                    config={fieldConfig}
                    control={control as any}
                    name={fieldConfig.name as any}
                    error={fieldError}
                    isLoading={isLoading}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 폼 버튼 */}
      <FormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={submitText || (isEditing ? "수정" : "등록")}
      />
    </form>
  );
}
