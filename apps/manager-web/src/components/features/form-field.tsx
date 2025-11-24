/**
 * @file form-field.tsx
 * @description 폼 필드 렌더러
 *
 * 필드 설정에 따라 적절한 입력 컴포넌트를 렌더링
 */

import * as React from "react";
import { Controller, Control, FieldValues, FieldPath } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { FormHintIcon } from "./form-hint-icon";
import type { FormFieldConfig } from "./form-field-config";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  config: FormFieldConfig;
  control: Control<TFieldValues>;
  name: TName;
  error?: string;
  isLoading?: boolean;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  config,
  control,
  name,
  error,
  isLoading = false,
}: FormFieldProps<TFieldValues, TName>) {
  const fieldClass = {
    full: "col-span-2",
    half: "col-span-1",
    third: "col-span-1",
  }[config.grid || "full"];

  return (
    <div className={fieldClass + " space-y-2"}>
      <div className="flex items-center justify-between">
        <Label htmlFor={config.name} className="text-base">
          {config.label}
          {config.required && <span className="text-red-500">*</span>}
        </Label>
        {config.hint && <FormHintIcon hint={config.hint} />}
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (config.type) {
            case "text":
            case "email":
            case "password":
            case "number":
              return (
                <Input
                  {...field}
                  id={config.name}
                  type={config.type}
                  placeholder={config.placeholder}
                  disabled={isLoading || config.disabled}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value =
                      config.type === "number"
                        ? e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                        : e.target.value;
                    field.onChange(value);
                  }}
                />
              );

            case "textarea":
              return (
                <textarea
                  {...field}
                  id={config.name}
                  placeholder={config.placeholder}
                  disabled={isLoading || config.disabled}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={field.value || ""}
                />
              );

            case "select":
              return (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={isLoading || config.disabled}
                >
                  <SelectTrigger id={config.name}>
                    <SelectValue placeholder={config.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {config.options?.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );

            case "checkbox":
              return (
                <input
                  {...field}
                  type="checkbox"
                  id={config.name}
                  disabled={isLoading || config.disabled}
                  className="h-4 w-4 rounded border-gray-300"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              );

            case "radio":
              return (
                <div className="space-y-2">
                  {config.options?.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`${config.name}-${option.value}`}
                        name={config.name}
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={isLoading || config.disabled}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`${config.name}-${option.value}`}
                        className="text-sm"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              );

            case "date": {
              const [popoverOpen, setPopoverOpen] = React.useState(false);

              return (
                <div className="flex gap-2">
                  <Input
                    {...field}
                    id={config.name}
                    type="text"
                    placeholder={config.placeholder || "YYYY-MM-DD"}
                    disabled={isLoading || config.disabled}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // YYYY-MM-DD 형식 검증
                      if (
                        value === "" ||
                        /^\d{4}-\d{2}-\d{2}$/.test(value)
                      ) {
                        field.onChange(value);
                      }
                    }}
                  />
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isLoading || config.disabled}
                        className="flex-shrink-0"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? typeof field.value === "string"
                              ? parse(field.value, "yyyy-MM-dd", new Date())
                              : field.value
                            : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(format(date, "yyyy-MM-dd"));
                            setPopoverOpen(false);
                          }
                        }}
                        disabled={isLoading || config.disabled}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            }

            default:
              return <></>;
          }
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
