'use client';

import { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePartnerStore } from '../stores';
import type { Partner } from '../types';

interface PartnersEditProps {
  partners: Partner[];
  onSubmit: (formData: Record<string, any>) => void;
}

export function PartnersEdit({ partners, onSubmit }: PartnersEditProps) {
  const { formOpen, editingId, closeForm } = usePartnerStore();

  const editingPartner = useMemo(
    () => partners.find((p) => p.id === editingId),
    [editingId, partners]
  );

  const uniqueTypes = useMemo(() => {
    return Array.from(
      new Set(partners.map((p) => p.type).filter(Boolean))
    ) as string[];
  }, [partners]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    onSubmit(values);
  };

  return (
    <Sheet open={formOpen} onOpenChange={(open) => !open && closeForm()}>
      <SheetContent className="overflow-y-auto w-[600px]">
        <SheetHeader>
          <SheetTitle>
            {editingId ? '거래처 수정' : '거래처 등록'}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? '거래처 정보를 수정하세요.'
              : '새로운 거래처 정보를 입력하세요.'}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 mt-6"
        >
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                기본 정보
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 거래처코드 */}
              <div className="space-y-2">
                <Label htmlFor="code">
                  거래처코드 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingPartner?.code || ''}
                  placeholder="거래처코드를 입력하세요"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  고유한 거래처 식별 코드입니다
                </p>
              </div>

              {/* 거래처명 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  거래처명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPartner?.name || ''}
                  placeholder="거래처명을 입력하세요"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  거래처의 정식 명칭을 입력하세요
                </p>
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingPartner?.email || ''}
                  placeholder="이메일을 입력하세요"
                />
                <p className="text-xs text-muted-foreground">
                  대표 이메일 주소입니다
                </p>
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={editingPartner?.phone || ''}
                  placeholder="02-0000-0000"
                />
                <p className="text-xs text-muted-foreground">
                  대표 전화번호를 입력하세요
                </p>
              </div>
            </div>
          </div>

          {/* 거래처 유형 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold whitespace-nowrap">
                거래처 유형
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 유형 */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  유형 <span className="text-red-500">*</span>
                </Label>
                <Select
                  name="type"
                  defaultValue={editingPartner?.type || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">고객</SelectItem>
                    <SelectItem value="SUPPLIER">공급업체</SelectItem>
                    <SelectItem value="BOTH">고객/공급업체</SelectItem>
                    <SelectItem value="OTHER">기타</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  거래처 유형을 선택하세요
                </p>
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
            <Button type="submit">
              {editingId ? '수정' : '등록'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
