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
import { useUnitStore } from "../stores";
import type { Unit } from "../types/units.types";

interface UnitsEditProps {
  units: Unit[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function UnitsEdit({ units, onSubmit }: UnitsEditProps) {
  const { formOpen, editingId, closeForm } = useUnitStore();

  const formData = editingId ? units.find(u => u.id === editingId) : undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataObj = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formDataObj.entries());
    onSubmit(values);
    closeForm();
  };

  return (
    <Sheet
      open={formOpen}
      onOpenChange={(open) => !open && closeForm()}
    >
      <SheetContent className="overflow-y-auto w-[600px]">
        <SheetHeader>
          <SheetTitle>{formData ? "단위 수정" : "단위 등록"}</SheetTitle>
          <SheetDescription>
            {formData
              ? "단위 정보를 수정하세요."
              : "새로운 단위 정보를 입력하세요."}
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
              {/* 코드 */}
              <div className="space-y-2">
                <Label htmlFor="code">
                  코드 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={formData?.code || ""}
                  placeholder="예: KG, M, L"
                  required
                  className="uppercase font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  단위를 나타내는 고유한 코드입니다
                </p>
              </div>

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formData?.name || ""}
                  placeholder="예: 킬로그램, 미터, 리터"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  단위의 표시명을 입력하세요
                </p>
              </div>

              {/* 설명 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={formData?.description || ""}
                  placeholder="단위에 대한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              {/* 상태 */}
              <div className="col-span-2 space-y-2">
                <Label htmlFor="is_active">상태</Label>
                <Select
                  name="is_active"
                  defaultValue={formData?.is_active ? "true" : "false"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">활성</SelectItem>
                    <SelectItem value="false">비활성</SelectItem>
                  </SelectContent>
                </Select>
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
