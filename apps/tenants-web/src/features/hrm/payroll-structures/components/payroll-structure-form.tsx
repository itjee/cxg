"use client";

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

interface PayrollStructureFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  data?: any;
  onSave: (data: any) => void;
}

export function PayrollStructureForm({
  open,
  onOpenChange,
  mode,
  data,
  onSave,
}: PayrollStructureFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    onSave(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "급여구조 등록" : "급여구조 수정"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "새로운 급여 구조 정보를 입력하세요."
              : "급여 구조 정보를 수정하세요."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">기본 정보</h3>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="code">구조코드 *</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={data?.code}
                  placeholder="PS-001"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="name">구조명 *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={data?.name}
                  placeholder="개발팀 정직원 기본 급여"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="department">부서</Label>
                <Select name="department" defaultValue={data?.department || "none"}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="부서를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">선택 안함</SelectItem>
                    <SelectItem value="개발팀">개발팀</SelectItem>
                    <SelectItem value="영업팀">영업팀</SelectItem>
                    <SelectItem value="마케팅팀">마케팅팀</SelectItem>
                    <SelectItem value="인사팀">인사팀</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employment_type">고용형태 *</Label>
                <Select
                  name="employment_type"
                  defaultValue={data?.employment_type || "FULL_TIME"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="고용형태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">정직원</SelectItem>
                    <SelectItem value="PART_TIME">파트타임</SelectItem>
                    <SelectItem value="CONTRACT">계약직</SelectItem>
                    <SelectItem value="INTERN">인턴</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="base_pay">기본급 *</Label>
                <Input
                  id="base_pay"
                  name="base_pay"
                  type="number"
                  defaultValue={data?.base_pay}
                  placeholder="3500000"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currency_code">통화 *</Label>
                <Select
                  name="currency_code"
                  defaultValue={data?.currency_code || "KRW"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="통화를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KRW">KRW (원)</SelectItem>
                    <SelectItem value="USD">USD (달러)</SelectItem>
                    <SelectItem value="EUR">EUR (유로)</SelectItem>
                    <SelectItem value="JPY">JPY (엔)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="payment_cycle">지급주기 *</Label>
                <Select
                  name="payment_cycle"
                  defaultValue={data?.payment_cycle || "MONTHLY"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="지급주기를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DAILY">일급</SelectItem>
                    <SelectItem value="WEEKLY">주급</SelectItem>
                    <SelectItem value="BIWEEKLY">14일급</SelectItem>
                    <SelectItem value="MONTHLY">월급</SelectItem>
                    <SelectItem value="ANNUAL">연봉</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="valid_from">유효시작일 *</Label>
                <Input
                  id="valid_from"
                  name="valid_from"
                  type="date"
                  defaultValue={data?.valid_from}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="valid_to">유효종료일</Label>
                <Input
                  id="valid_to"
                  name="valid_to"
                  type="date"
                  defaultValue={data?.valid_to}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="is_active">상태 *</Label>
                <Select
                  name="is_active"
                  defaultValue={data?.is_active ? "true" : "false"}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="상태를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">활성</SelectItem>
                    <SelectItem value="false">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 설명 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">상세 정보</h3>

            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={data?.description}
                placeholder="급여 구조에 대한 설명을 입력하세요"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
