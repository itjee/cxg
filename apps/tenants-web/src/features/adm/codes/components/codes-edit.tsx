"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCodeStore } from "../stores/codes.store";
import { codeService } from "../services/codes.service";
import type {
  Code,
  CreateCodeRequest,
  UpdateCodeRequest,
} from "../types/codes.types";

interface CodesEditProps {
  codeGroups?: Array<{ id: string; code: string; name: string }>;
}

/**
 * Codes 수정/생성 폼
 * useCodesStore와 연동하여 폼 열기/닫기 및 데이터 관리
 */
export function CodesEdit({ codeGroups = [] }: CodesEditProps) {
  const {
    formOpen: isFormOpen,
    editingId,
    closeForm,
  } = useCodeStore();
  const mode = editingId ? "edit" : "create";

  const [formState, setFormState] = useState({
    code_group_id: "",
    code: "",
    name: "",
    value: "",
    description: "",
    display_order: 0,
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // 폼이 열릴 때 데이터 로드
  useEffect(() => {
    const loadCodeData = async () => {
      if (mode === "edit" && editingId) {
        try {
          setIsLoading(true);
          const code = await codeService.getCode(editingId);
          setFormState({
            code_group_id: code.code_group_id || "",
            code: code.code || "",
            name: code.name || "",
            value: code.value || "",
            description: code.description || "",
            display_order: code.display_order ?? 0,
            is_active: code.is_active ?? true,
          });
        } catch (err) {
          setError("코드 정보를 불러오는데 실패했습니다.");
          console.error("코드 로드 오류:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFormState({
          code_group_id: "",
          code: "",
          name: "",
          value: "",
          description: "",
          display_order: 0,
          is_active: true,
        });
      }
      setError("");
      setValidationError("");
    };

    if (isFormOpen) {
      loadCodeData();
    }
  }, [isFormOpen, mode, editingId]);

  const handleValidation = (): boolean => {
    setValidationError("");

    if (!formState.code_group_id) {
      setValidationError("코드그룹은 필수 항목입니다");
      return false;
    }

    if (!formState.code.trim()) {
      setValidationError("코드는 필수 항목입니다");
      return false;
    }

    if (!/^[A-Z0-9_]+$/.test(formState.code)) {
      setValidationError(
        "코드는 영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다"
      );
      return false;
    }

    if (!formState.name.trim()) {
      setValidationError("코드명은 필수 항목입니다");
      return false;
    }

    if (!formState.value.trim()) {
      setValidationError("코드값은 필수 항목입니다");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!handleValidation()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "edit" && editingId) {
        await codeService.updateCode(editingId, {
          code_group_id: formState.code_group_id,
          code: formState.code,
          name: formState.name,
          value: formState.value,
          description: formState.description || undefined,
          display_order: formState.display_order,
          is_active: formState.is_active,
        } as UpdateCodeRequest);
      } else {
        await codeService.createCode({
          code_group_id: formState.code_group_id,
          code: formState.code,
          name: formState.name,
          value: formState.value,
          description: formState.description || undefined,
          display_order: formState.display_order,
        } as CreateCodeRequest);
      }

      closeForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "작업 중 오류가 발생했습니다";
      setError(errorMessage);
      console.error("폼 제출 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (field === "code") {
      // 자동으로 대문자 + 언더스코어로 변환
      const formatted = value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
      setFormState((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "display_order") {
      // 숫자로 변환
      const numValue = parseInt(value) || 0;
      setFormState((prev) => ({ ...prev, [field]: numValue }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
    setValidationError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeForm();
    }
  };

  return (
    <Sheet open={isFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "코드 등록" : "코드 수정"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "새로운 코드 정보를 입력하세요."
              : "코드 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 에러 표시 */}
          {(validationError || error) && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  오류 발생
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {validationError || error}
                </p>
              </div>
            </div>
          )}

          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="code_group_id">
                코드그룹 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formState.code_group_id}
                onValueChange={(value) => handleChange("code_group_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="code_group_id">
                  <SelectValue placeholder="코드그룹을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {codeGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} ({group.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                코드가 속할 그룹을 선택하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                코드 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="예: M"
                value={formState.code}
                onChange={(e) => handleChange("code", e.target.value)}
                disabled={isLoading}
                className="uppercase font-mono"
              />
              <p className="text-xs text-muted-foreground">
                영문 대문자, 숫자, 언더스코어(_)만 사용 가능합니다
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                코드명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="예: 남성"
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                코드의 표시명을 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                코드값 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="value"
                placeholder="예: MALE"
                value={formState.value}
                onChange={(e) => handleChange("value", e.target.value)}
                disabled={isLoading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                코드의 실제 값을 입력하세요
              </p>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">추가 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="예: 남성을 나타내는 코드"
                value={formState.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                코드에 대한 설명을 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">정렬순서</Label>
              <Input
                id="display_order"
                type="number"
                placeholder="0"
                value={formState.display_order}
                onChange={(e) => handleChange("display_order", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                목록에서의 표시 순서를 입력하세요
              </p>
            </div>
          </div>

          {/* 체크박스 옵션들 */}
          <div className="space-y-3">
            {mode === "edit" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formState.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-input"
                />
                <Label
                  htmlFor="is_active"
                  className="font-normal cursor-pointer"
                >
                  활성화
                </Label>
              </div>
            )}
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {mode === "edit" ? "수정 중..." : "추가 중..."}
                </>
              ) : mode === "edit" ? (
                "수정"
              ) : (
                "등록"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
