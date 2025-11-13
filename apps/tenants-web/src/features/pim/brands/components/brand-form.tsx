"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { previewNextCode, generateNextCode } from "@/lib/code-generator";

interface BrandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}

export function BrandForm({ open, onOpenChange, mode, data, onSave }: BrandFormProps) {
  const [nextCode, setNextCode] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setNextCode(previewNextCode("BRAND"));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());

    // 생성 모드일 때 자동으로 코드 생성
    if (mode === "create") {
      values.code = generateNextCode("BRAND");
    }

    onSave(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "브랜드 등록" : "브랜드 수정"}</SheetTitle>
          <SheetDescription>
            {mode === "create" ? "새로운 브랜드 정보를 입력하세요." : "브랜드 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="code">브랜드 코드</Label>
              {mode === "create" ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="code"
                    name="code"
                    value={nextCode}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    자동생성
                  </span>
                </div>
              ) : (
                <Input
                  id="code"
                  name="code"
                  defaultValue={data?.code}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                시스템에서 자동으로 부여됩니다
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">브랜드명 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data?.name}
                placeholder="삼성"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">브랜드명(영문)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                defaultValue={data?.nameEn}
                placeholder="Samsung"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">원산지</Label>
              <Input
                id="country"
                name="country"
                defaultValue={data?.country}
                placeholder="한국"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                name="website"
                type="url"
                defaultValue={data?.website}
                placeholder="https://www.samsung.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">담당자</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                defaultValue={data?.contactPerson}
                placeholder="담당자명"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">전화번호</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={data?.phoneNumber}
                placeholder="02-1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data?.email}
                placeholder="contact@brand.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태 *</Label>
              <Select name="status" defaultValue={data?.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">사용중</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">추가 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={data?.description}
                placeholder="브랜드에 대한 상세 설명을 입력하세요"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={data?.notes}
                placeholder="추가 메모 사항을 입력하세요"
                rows={2}
              />
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit">
              {mode === "create" ? "등록" : "수정"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
