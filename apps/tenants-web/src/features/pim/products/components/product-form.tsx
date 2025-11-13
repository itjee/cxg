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

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}

export function ProductForm({ open, onOpenChange, mode, data, onSave }: ProductFormProps) {
  const [nextCode, setNextCode] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setNextCode(previewNextCode("PRODUCT"));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    
    // 생성 모드일 때 자동으로 코드 생성
    if (mode === "create") {
      values.code = generateNextCode("PRODUCT");
    }
    
    onSave(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "제품 등록" : "제품 수정"}</SheetTitle>
          <SheetDescription>
            {mode === "create" ? "새로운 제품 정보를 입력하세요." : "제품 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="code">제품 코드</Label>
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
              <Label htmlFor="name">제품명 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data?.name}
                placeholder="노트북"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">제품명(영문)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                defaultValue={data?.nameEn}
                placeholder="Laptop"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">제품 분류 *</Label>
              <Select name="category" defaultValue={data?.category || "electronics"}>
                <SelectTrigger>
                  <SelectValue placeholder="제품 분류를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">전자제품</SelectItem>
                  <SelectItem value="furniture">가구</SelectItem>
                  <SelectItem value="office">사무용품</SelectItem>
                  <SelectItem value="parts">부품</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">제품 유형 *</Label>
              <Select name="type" defaultValue={data?.type || "finished"}>
                <SelectTrigger>
                  <SelectValue placeholder="제품 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="raw">원자재</SelectItem>
                  <SelectItem value="wip">재공품</SelectItem>
                  <SelectItem value="finished">완제품</SelectItem>
                  <SelectItem value="goods">상품</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">제조사</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                defaultValue={data?.manufacturer}
                placeholder="삼성전자"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">모델명</Label>
              <Input
                id="model"
                name="model"
                defaultValue={data?.model}
                placeholder="ABC-123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">바코드</Label>
              <Input
                id="barcode"
                name="barcode"
                defaultValue={data?.barcode}
                placeholder="8801234567890"
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
                  <SelectItem value="discontinued">단종</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 규격/단위 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">규격/단위</h3>
            
            <div className="space-y-2">
              <Label htmlFor="spec">규격</Label>
              <Input
                id="spec"
                name="spec"
                defaultValue={data?.spec}
                placeholder="15.6인치, 8GB RAM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">단위 *</Label>
              <Select name="unit" defaultValue={data?.unit || "ea"}>
                <SelectTrigger>
                  <SelectValue placeholder="단위를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ea">EA</SelectItem>
                  <SelectItem value="box">BOX</SelectItem>
                  <SelectItem value="kg">KG</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="set">SET</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">중량(kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                defaultValue={data?.weight}
                placeholder="2.5"
              />
            </div>
          </div>

          {/* 가격 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">가격 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">매입가 *</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                defaultValue={data?.purchasePrice}
                placeholder="800000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salePrice">판매가 *</Label>
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                defaultValue={data?.salePrice}
                placeholder="1200000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxType">과세 구분 *</Label>
              <Select name="taxType" defaultValue={data?.taxType || "taxable"}>
                <SelectTrigger>
                  <SelectValue placeholder="과세 구분을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxable">과세</SelectItem>
                  <SelectItem value="tax_free">면세</SelectItem>
                  <SelectItem value="zero_rate">영세</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 재고 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">재고 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="safetyStock">안전재고</Label>
              <Input
                id="safetyStock"
                name="safetyStock"
                type="number"
                defaultValue={data?.safetyStock}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderQty">최소발주량</Label>
              <Input
                id="minOrderQty"
                name="minOrderQty"
                type="number"
                defaultValue={data?.minOrderQty}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadTime">리드타임(일)</Label>
              <Input
                id="leadTime"
                name="leadTime"
                type="number"
                defaultValue={data?.leadTime}
                placeholder="7"
              />
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
                placeholder="제품에 대한 상세 설명을 입력하세요"
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
