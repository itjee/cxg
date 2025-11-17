"use client";

/**
 * @file users-form.tsx
 * @description 사용자 생성/수정 폼 컴포넌트 (Presentational)
 *
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 사용자 생성 모드: 모든 필드 입력
 * - 사용자 수정 모드: 기존 데이터 로드
 */

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EntityFormButtons } from "@/components/features";
import type { User } from "../types/users.types";

/**
 * 폼 유효성 검증 스키마
 */
const userFormSchema = z.object({
  username: z.string().min(3, "사용자명은 3자 이상이어야 합니다"),
  email: z.string().email("유효한 이메일을 입력해주세요"),
  fullName: z.string().min(1, "전체 이름을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").optional(),
  userType: z.enum(["ADMIN", "MANAGER", "USER"], {
    message: "사용자 유형을 선택해주세요",
  }),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "LOCKED"]).optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UsersForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: UserFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
      fullName: initialData?.fullName || "",
      password: "",
      userType: (initialData as any)?.userType || "USER",
      phone: initialData?.phone || "",
      department: initialData?.department || "",
      position: initialData?.position || "",
      status: (["ACTIVE", "INACTIVE", "LOCKED"].includes(
        initialData?.status as string
      )
        ? initialData?.status
        : "ACTIVE") as "ACTIVE" | "INACTIVE" | "LOCKED",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username || "",
        email: initialData.email || "",
        fullName: initialData.fullName || "",
        password: "",
        userType: (initialData as any)?.userType || "USER",
        phone: initialData?.phone || "",
        department: initialData?.department || "",
        position: initialData?.position || "",
        status: (["ACTIVE", "INACTIVE", "LOCKED"].includes(
          initialData?.status as string
        )
          ? initialData?.status
          : "ACTIVE") as "ACTIVE" | "INACTIVE" | "LOCKED",
      });
    }
  }, [initialData, reset]);

  const status = watch("status");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 사용자명 */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-[13px]">
              사용자명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="사용자명을 입력하세요 (3자 이상)"
              disabled={isLoading || isEditing}
            />
            {errors.username ? (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">3자 이상의 고유한 사용자명을 입력하세요</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px]">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
            />
            {errors.email ? (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">유효한 이메일 주소를 입력하세요</p>
            )}
          </div>

          {/* 전체 이름 */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-[13px]">
              전체 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="전체 이름을 입력하세요"
              disabled={isLoading}
            />
            {errors.fullName ? (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">사용자의 실제 이름을 입력하세요</p>
            )}
          </div>

          {/* 비밀번호 (생성 모드에서만 필수) */}
          {!isEditing && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px]">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="비밀번호를 입력하세요 (8자 이상)"
                disabled={isLoading}
              />
              {errors.password ? (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">보안을 위해 8자 이상의 복잡한 비밀번호를 설정하세요</p>
              )}
            </div>
          )}

          {/* 사용자 유형 */}
          <div className="space-y-1.5">
            <Label htmlFor="userType" className="text-[13px]">
              사용자 유형 <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="userType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger id="userType">
                    <SelectValue placeholder="사용자 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">일반 사용자</SelectItem>
                    <SelectItem value="MANAGER">매니저</SelectItem>
                    <SelectItem value="ADMIN">관리자</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.userType ? (
              <p className="text-xs text-red-500">{errors.userType.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">사용자의 역할에 따라 유형을 선택하세요</p>
            )}
          </div>

          {/* 전화 */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[13px]">전화</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="전화번호를 입력하세요"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">연락 가능한 전화번호를 입력하세요</p>
          </div>

          {/* 부서 */}
          <div className="space-y-1.5">
            <Label htmlFor="department" className="text-[13px]">부서</Label>
            <Input
              id="department"
              {...register("department")}
              placeholder="부서를 입력하세요"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">소속 부서명을 입력하세요</p>
          </div>

          {/* 직책 */}
          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-[13px]">직책</Label>
            <Input
              id="position"
              {...register("position")}
              placeholder="직책을 입력하세요"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">사용자의 직책/직급을 입력하세요</p>
          </div>

          {/* 상태 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-[13px]">사용자 상태</Label>
              <p className="text-sm text-muted-foreground">
                {status === "ACTIVE"
                  ? "활성 상태"
                  : status === "INACTIVE"
                  ? "비활성 상태"
                  : "잠금 상태"}
              </p>
            </div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">활성</SelectItem>
                    <SelectItem value="INACTIVE">비활성</SelectItem>
                    <SelectItem value="LOCKED">잠금</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </form>
  );
}
