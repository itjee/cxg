"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsStore } from "../stores";
import type { Setting, SettingValueType } from "../types/settings.types";

interface SettingsEditProps {
  settings: Setting[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function SettingsEdit({ settings, onSubmit }: SettingsEditProps) {
  const { formOpen, editingId, closeForm } = useSettingsStore();

  const formData = editingId ? settings.find(s => s.id === editingId) : undefined;

  const uniqueCategories = useMemo(() => {
    return Array.from(
      new Set(settings.map((s) => s.category).filter(Boolean))
    ) as string[];
  }, [settings]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formDataObj.entries());
    onSubmit(values);
    closeForm();
  };

  const valueTypes: SettingValueType[] = [
    "STRING",
    "NUMBER",
    "BOOLEAN",
    "JSON",
  ];

  return (
    <Sheet
      open={formOpen}
      onOpenChange={(open) => !open && closeForm()}
    >
      <SheetContent className="overflow-y-auto w-[600px]">
        <SheetHeader>
          <SheetTitle>{formData ? "설정 수정" : "설정 등록"}</SheetTitle>
          <SheetDescription>
            {formData
              ? "설정 정보를 수정하세요."
              : "새로운 설정 정보를 입력하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                기본 정보
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Key */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="key">
                  Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="key"
                  name="key"
                  defaultValue={formData?.key || ""}
                  placeholder="설정 키를 입력하세요"
                  required
                  disabled={!!formData?.is_system}
                />
                <p className="text-xs text-muted-foreground">
                  고유한 설정 키입니다 (예: app.name, mail.smtp.host)
                </p>
              </div>

              {/* Value Type */}
              <div className="space-y-2">
                <Label htmlFor="value_type">
                  값 타입 <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="value_type"
                  defaultValue={formData?.value_type || "STRING"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="타입 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {valueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select
                  name="category"
                  defaultValue={formData?.category || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__">새 카테고리...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Value */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="value">
                  값 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="value"
                  name="value"
                  defaultValue={formData?.value || ""}
                  placeholder="설정 값을 입력하세요"
                  required
                  rows={3}
                />
              </div>

              {/* Default Value */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="default_value">기본값</Label>
                <Input
                  id="default_value"
                  name="default_value"
                  defaultValue={formData?.default_value || ""}
                  placeholder="기본값을 입력하세요"
                />
              </div>

              {/* Description */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={formData?.description || ""}
                  placeholder="설정에 대한 설명을 입력하세요"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 추가 옵션 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                추가 옵션
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="space-y-3">
              {/* Active */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={formData?.is_active ?? true}
                  className="w-4 h-4 rounded border-input"
                />
                <Label
                  htmlFor="is_active"
                  className="font-normal cursor-pointer"
                >
                  활성 상태
                </Label>
              </div>

              {/* System */}
              {!formData && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_system"
                    name="is_system"
                    defaultChecked={false}
                    className="w-4 h-4 rounded border-input"
                  />
                  <Label
                    htmlFor="is_system"
                    className="font-normal cursor-pointer"
                  >
                    시스템 설정 (수정/삭제 불가)
                  </Label>
                </div>
              )}

              {/* Encrypted */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_encrypted"
                  name="is_encrypted"
                  defaultChecked={formData?.is_encrypted ?? false}
                  className="w-4 h-4 rounded border-input"
                />
                <Label
                  htmlFor="is_encrypted"
                  className="font-normal cursor-pointer"
                >
                  암호화된 값
                </Label>
              </div>
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => closeForm()}
            >
              취소
            </Button>
            <Button type="submit">{formData ? "수정" : "등록"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
