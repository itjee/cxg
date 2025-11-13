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
import { useExchangeRatesStore } from "../stores/exchange-rates.store";
import { exchangeRateService } from "../services/exchange-rates.service";
import type {
  ExchangeRate,
  CreateExchangeRateRequest,
  UpdateExchangeRateRequest,
} from "../types/exchange-rates.types";

/**
 * ExchangeRates 수정/생성 폼
 * useExchangeRatesStore와 연동하여 폼 열기/닫기 및 데이터 관리
 */
export function ExchangeRatesEdit() {
  const {
    isSidebarOpen: isFormOpen,
    selectedExchangeRate: formData,
    closeSidebar: closeForm,
  } = useExchangeRatesStore();
  const mode = formData ? "edit" : "create";

  const [formState, setFormState] = useState({
    from_currency: "",
    to_currency: "",
    rate: 0,
    effective_date: "",
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
        from_currency: formData.from_currency || "",
        to_currency: formData.to_currency || "",
        rate: formData.rate || 0,
        effective_date: formData.effective_date || "",
        description: formData.description || "",
        is_active: formData.is_active ?? true,
      });
    } else {
      setFormState({
        from_currency: "",
        to_currency: "",
        rate: 0,
        effective_date: new Date().toISOString().split('T')[0],
        description: "",
        is_active: true,
      });
    }
    setError("");
    setValidationError("");
  }, [isFormOpen, mode, formData]);

  const handleValidation = (): boolean => {
    setValidationError("");

    if (!formState.from_currency.trim()) {
      setValidationError("원본 통화는 필수 항목입니다");
      return false;
    }

    if (!/^[A-Z]{3}$/.test(formState.from_currency)) {
      setValidationError("통화 코드는 3자리 영문 대문자로 입력해주세요 (예: USD)");
      return false;
    }

    if (!formState.to_currency.trim()) {
      setValidationError("대상 통화는 필수 항목입니다");
      return false;
    }

    if (!/^[A-Z]{3}$/.test(formState.to_currency)) {
      setValidationError("통화 코드는 3자리 영문 대문자로 입력해주세요 (예: KRW)");
      return false;
    }

    if (formState.rate <= 0) {
      setValidationError("환율은 0보다 큰 값이어야 합니다");
      return false;
    }

    if (!formState.effective_date) {
      setValidationError("적용일자는 필수 항목입니다");
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
      if (mode === "edit" && formData) {
        await exchangeRateService.updateExchangeRate(formData.id, {
          from_currency: formState.from_currency,
          to_currency: formState.to_currency,
          rate: formState.rate,
          effective_date: formState.effective_date,
          description: formState.description || undefined,
          is_active: formState.is_active,
        } as UpdateExchangeRateRequest);
      } else {
        await exchangeRateService.createExchangeRate({
          from_currency: formState.from_currency,
          to_currency: formState.to_currency,
          rate: formState.rate,
          effective_date: formState.effective_date,
          description: formState.description || undefined,
        } as CreateExchangeRateRequest);
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
    if (field === "from_currency" || field === "to_currency") {
      // 자동으로 대문자로 변환
      const formatted = value.toUpperCase().replace(/[^A-Z]/g, "");
      setFormState((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "rate") {
      // 숫자로 변환
      const numValue = parseFloat(value) || 0;
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
            {mode === "create" ? "환율 등록" : "환율 수정"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "새로운 환율 정보를 입력하세요."
              : "환율 정보를 수정하세요."}
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
              <Label htmlFor="from_currency">
                원본 통화 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="from_currency"
                placeholder="예: USD"
                value={formState.from_currency}
                onChange={(e) => handleChange("from_currency", e.target.value)}
                disabled={isLoading}
                className="uppercase font-mono"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                3자리 통화 코드 (예: USD, EUR, JPY)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to_currency">
                대상 통화 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="to_currency"
                placeholder="예: KRW"
                value={formState.to_currency}
                onChange={(e) => handleChange("to_currency", e.target.value)}
                disabled={isLoading}
                className="uppercase font-mono"
                maxLength={3}
              />
              <p className="text-xs text-muted-foreground">
                3자리 통화 코드 (예: KRW, USD, EUR)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">
                환율 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.0001"
                placeholder="예: 1320.5000"
                value={formState.rate}
                onChange={(e) => handleChange("rate", e.target.value)}
                disabled={isLoading}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                환율 값을 입력하세요
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effective_date">
                적용일자 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="effective_date"
                type="date"
                value={formState.effective_date}
                onChange={(e) => handleChange("effective_date", e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                환율이 적용되는 날짜
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
                placeholder="예: 미국 달러 → 한국 원"
                value={formState.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={isLoading}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                환율에 대한 설명을 입력하세요
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
