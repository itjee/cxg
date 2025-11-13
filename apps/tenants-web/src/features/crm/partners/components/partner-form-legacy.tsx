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

interface PartnerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}

export function PartnerForm({ open, onOpenChange, mode, data, onSave }: PartnerFormProps) {
  const [nextCode, setNextCode] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setNextCode(previewNextCode("PARTNER"));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    
    // 생성 모드일 때 자동으로 코드 생성
    if (mode === "create") {
      values.code = generateNextCode("PARTNER");
    }
    
    onSave(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "거래처 등록" : "거래처 수정"}</SheetTitle>
          <SheetDescription>
            {mode === "create" ? "새로운 거래처 정보를 입력하세요." : "거래처 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="code">거래처 코드</Label>
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
              <Label htmlFor="name">거래처명 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data?.name}
                placeholder="(주)협력업체"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">거래처명(영문)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                defaultValue={data?.nameEn}
                placeholder="Partner Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">거래처 구분 *</Label>
              <Select name="type" defaultValue={data?.type || "supplier"}>
                <SelectTrigger>
                  <SelectValue placeholder="거래처 구분을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">공급사</SelectItem>
                  <SelectItem value="customer">고객사</SelectItem>
                  <SelectItem value="both">공급사/고객사</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bizNo">사업자번호 *</Label>
              <Input
                id="bizNo"
                name="bizNo"
                defaultValue={data?.bizNo}
                placeholder="123-45-67890"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ceoName">대표자명 *</Label>
              <Input
                id="ceoName"
                name="ceoName"
                defaultValue={data?.ceoName}
                placeholder="박대표"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bizType">업태</Label>
              <Input
                id="bizType"
                name="bizType"
                defaultValue={data?.bizType}
                placeholder="제조업"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bizCategory">업종</Label>
              <Input
                id="bizCategory"
                name="bizCategory"
                defaultValue={data?.bizCategory}
                placeholder="전자부품 제조"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">거래등급</Label>
              <Select name="grade" defaultValue={data?.grade || "A"}>
                <SelectTrigger>
                  <SelectValue placeholder="거래등급을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S등급</SelectItem>
                  <SelectItem value="A">A등급</SelectItem>
                  <SelectItem value="B">B등급</SelectItem>
                  <SelectItem value="C">C등급</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">상태 *</Label>
              <Select name="status" defaultValue={data?.status || "active"}>
                <SelectTrigger>
                  <SelectValue placeholder="상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 연락 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">연락 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tel">전화번호 *</Label>
              <Input
                id="tel"
                name="tel"
                defaultValue={data?.tel}
                placeholder="02-1234-5678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">팩스번호</Label>
              <Input
                id="fax"
                name="fax"
                defaultValue={data?.fax}
                placeholder="02-1234-5679"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일 *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data?.email}
                placeholder="contact@partner.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homepage">홈페이지</Label>
              <Input
                id="homepage"
                name="homepage"
                type="url"
                defaultValue={data?.homepage}
                placeholder="https://partner.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">주소 *</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={data?.address}
                placeholder="서울특별시 강남구..."
                required
                rows={3}
              />
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">담당자 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="managerName">담당자명</Label>
              <Input
                id="managerName"
                name="managerName"
                defaultValue={data?.managerName}
                placeholder="홍길동"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerTel">담당자 전화</Label>
              <Input
                id="managerTel"
                name="managerTel"
                defaultValue={data?.managerTel}
                placeholder="010-1234-5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerEmail">담당자 이메일</Label>
              <Input
                id="managerEmail"
                name="managerEmail"
                type="email"
                defaultValue={data?.managerEmail}
                placeholder="manager@partner.com"
              />
            </div>
          </div>

          {/* 거래 조건 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">거래 조건</h3>
            
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">결제조건</Label>
              <Select name="paymentTerms" defaultValue={data?.paymentTerms || "monthly"}>
                <SelectTrigger>
                  <SelectValue placeholder="결제조건을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">현금</SelectItem>
                  <SelectItem value="card">카드</SelectItem>
                  <SelectItem value="monthly">월말정산</SelectItem>
                  <SelectItem value="net30">NET 30일</SelectItem>
                  <SelectItem value="net60">NET 60일</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creditLimit">여신한도</Label>
              <Input
                id="creditLimit"
                name="creditLimit"
                type="number"
                defaultValue={data?.creditLimit}
                placeholder="10000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={data?.notes}
                placeholder="추가 메모 사항을 입력하세요"
                rows={3}
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
