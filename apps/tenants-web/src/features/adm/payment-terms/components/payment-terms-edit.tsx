"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { usePaymentTermStore } from "../stores/payment-term.store";
import { paymentTermService } from "../services/payment-term.service";
import type {
  PaymentTerm,
  CreatePaymentTermRequest,
  UpdatePaymentTermRequest,
} from "../types/payment-term.types";

/**
 * PaymentTerms 수정/생성 폼
 * usePaymentTermStore와 연동하여 폼 열기/닫기 및 데이터 관리
 */
interface PaymentTermsEditProps {
  paymentTerms?: PaymentTerm[];
  onSubmit?: (formData: Record<string, any>) => void;
}

export function PaymentTermsEdit({ paymentTerms = [], onSubmit }: PaymentTermsEditProps) {
  const {
    formOpen: isFormOpen,
    editingId,
    closeForm,
  } = usePaymentTermStore();

  const formData = editingId ? paymentTerms.find(pt => pt.id === editingId) : undefined;
  const mode = editingId ? "edit" : "create";

  const [formState, setFormState] = useState({
    code: "",
    name: "",
    days: 0,
    description: "",
    is_active: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  // 폼이 열릴 때 데이터 로드
  useEffect(() => {
    if (mode === "edit" && formData) {
      setFormState({
        code: formData.code || "",
        name: formData.name || "",
        days: formData.days ?? 0,
        description: formData.description || "",
        is_active: formData.is_active ?? true,
      });
    } else {
      setFormState({
        code: "",
        name: "",
        days: 0,
        description: "",
        is_active: true,
      });
    }
    setError("");
    setValidationError("");
  }, [isFormOpen, mode, formData]);

  const handleValidation = (): boolean => {
    setValidationError("");

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
      setValidationError("이름은 필수 항목입니다");
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
      if (onSubmit) {
        // onSubmit prop이 제공된 경우 (예: 페이지에서 직접 처리)
        onSubmit(formState);
      } else {
        // API를 통한 처리 (기본 동작)
        if (mode === "edit" && formData) {
          await paymentTermService.updatePaymentTerm(formData.id, {
            code: formState.code,
            name: formState.name,
            days: formState.days,
            description: formState.description || undefined,
            is_active: formState.is_active,
          } as UpdatePaymentTermRequest);
        } else {
          await paymentTermService.createPaymentTerm({
            code: formState.code,
            name: formState.name,
            days: formState.days,
            description: formState.description || undefined,
          } as CreatePaymentTermRequest);
        }
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
    } else if (field === "days") {
      // 숫자 변환
      setFormState((prev) => ({ ...prev, [field]: Number(value) || 0 }));
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
            {mode === "create" ? "결제조건 등록" : "결제조건 수정"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "새로운 결제조건 정보를 입력하세요."
              : "결제조건 정보를 수정하세요."}
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
              <Label htmlFor="code">
                코드 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="예: NET30"
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
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="예: 30일 후 지급"
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                결제조건의 표시명을 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">
                기한(일) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="days"
                type="number"
                placeholder="예: 30"
                value={formState.days}
                onChange={(e) => handleChange("days", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                -1: 선금, 0: 현금, 양수: n일 후 지급
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
                placeholder="예: 납품 후 30일 이내 지급"
                value={formState.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                결제조건에 대한 설명을 입력하세요
              </p>
            </div>
          </div>

          {/* 체크박스 옵션들 */}
          {mode === "edit" && (
            <div className="space-y-3">
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
            </div>
          )}

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
