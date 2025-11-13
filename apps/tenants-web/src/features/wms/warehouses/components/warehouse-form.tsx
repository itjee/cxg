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

interface WarehouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}

export function WarehouseForm({ open, onOpenChange, mode, data, onSave }: WarehouseFormProps) {
  const [nextCode, setNextCode] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setNextCode(previewNextCode("WAREHOUSE"));
    }
  }, [mode, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    
    // 생성 모드일 때 자동으로 코드 생성
    if (mode === "create") {
      values.code = generateNextCode("WAREHOUSE");
    }
    
    onSave(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "create" ? "창고 등록" : "창고 수정"}</SheetTitle>
          <SheetDescription>
            {mode === "create" ? "새로운 창고 정보를 입력하세요." : "창고 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="code">창고 코드</Label>
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
              <Label htmlFor="name">창고명 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={data?.name}
                placeholder="중앙물류센터"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">창고명(영문)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                defaultValue={data?.nameEn}
                placeholder="Central Logistics Center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">창고 유형 *</Label>
              <Select name="type" defaultValue={data?.type || "normal"}>
                <SelectTrigger>
                  <SelectValue placeholder="창고 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">일반창고</SelectItem>
                  <SelectItem value="cold">냉장창고</SelectItem>
                  <SelectItem value="frozen">냉동창고</SelectItem>
                  <SelectItem value="hazmat">위험물창고</SelectItem>
                  <SelectItem value="external">외부창고</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">창고 구분 *</Label>
              <Select name="category" defaultValue={data?.category || "main"}>
                <SelectTrigger>
                  <SelectValue placeholder="창고 구분을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">본창고</SelectItem>
                  <SelectItem value="branch">지점창고</SelectItem>
                  <SelectItem value="consignment">위탁창고</SelectItem>
                  <SelectItem value="return">반품창고</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">담당자</Label>
              <Select name="manager" defaultValue={data?.manager || "none"}>
                <SelectTrigger>
                  <SelectValue placeholder="담당자를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">미지정</SelectItem>
                  <SelectItem value="EMP001">홍길동</SelectItem>
                  <SelectItem value="EMP002">김철수</SelectItem>
                  <SelectItem value="EMP003">이영희</SelectItem>
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
                  <SelectItem value="active">사용중</SelectItem>
                  <SelectItem value="maintenance">점검중</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">위치 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">주소 *</Label>
              <Textarea
                id="address"
                name="address"
                defaultValue={data?.address}
                placeholder="경기도 용인시 처인구..."
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">상세 위치</Label>
              <Input
                id="location"
                name="location"
                defaultValue={data?.location}
                placeholder="A동 1층"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">우편번호</Label>
              <Input
                id="zipCode"
                name="zipCode"
                defaultValue={data?.zipCode}
                placeholder="12345"
              />
            </div>
          </div>

          {/* 연락 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">연락 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tel">전화번호</Label>
              <Input
                id="tel"
                name="tel"
                defaultValue={data?.tel}
                placeholder="031-123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fax">팩스번호</Label>
              <Input
                id="fax"
                name="fax"
                defaultValue={data?.fax}
                placeholder="031-123-4568"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={data?.email}
                placeholder="warehouse@conexgrow.com"
              />
            </div>
          </div>

          {/* 창고 규모 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">창고 규모</h3>
            
            <div className="space-y-2">
              <Label htmlFor="area">면적(㎡)</Label>
              <Input
                id="area"
                name="area"
                type="number"
                step="0.01"
                defaultValue={data?.area}
                placeholder="1000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">수용능력(톤)</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                step="0.01"
                defaultValue={data?.capacity}
                placeholder="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zoneCount">구역 수</Label>
              <Input
                id="zoneCount"
                name="zoneCount"
                type="number"
                defaultValue={data?.zoneCount}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rackCount">랙 수</Label>
              <Input
                id="rackCount"
                name="rackCount"
                type="number"
                defaultValue={data?.rackCount}
                placeholder="50"
              />
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">추가 정보</h3>
            
            <div className="space-y-2">
              <Label htmlFor="temperature">온도 범위</Label>
              <Input
                id="temperature"
                name="temperature"
                defaultValue={data?.temperature}
                placeholder="-20°C ~ 25°C"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity">습도 범위</Label>
              <Input
                id="humidity"
                name="humidity"
                defaultValue={data?.humidity}
                placeholder="40% ~ 60%"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={data?.description}
                placeholder="창고에 대한 상세 설명을 입력하세요"
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
