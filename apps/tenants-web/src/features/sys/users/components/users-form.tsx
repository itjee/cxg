"use client";

/**
 * @file users-form.tsx
 * @description 사용자 생성/수정 폼 컴포넌트
 * 
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 사용자 생성 모드: 모든 필드 입력 + 비밀번호 필수
 * - 사용자 수정 모드: 기존 데이터 로드 + 비밀번호 선택적
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import type { User, CreateUserRequest, UpdateUserRequest } from "../types";

/**
 * 폼 유효성 검증 스키마
 * 
 * @description Zod를 사용한 폼 데이터 유효성 검증 규칙
 * - username: 필수 (최소 1자)
 * - full_name: 선택적
 * - email: 필수 (이메일 형식 검증)
 * - phone: 선택적
 * - role_id: 선택적
 * - password: 생성 시 필수 (최소 8자), 수정 시 선택적
 */
const userFormSchema = z.object({
  username: z.string().min(1, "사용자명을 입력하세요"),
  full_name: z.string().optional(),
  email: z.string().email("올바른 이메일을 입력하세요"),
  phone: z.string().optional(),
  role_id: z.string().optional(),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").optional().or(z.literal('')),
});

/**
 * 폼 데이터 타입
 * 
 * @description userFormSchema에서 추론된 TypeScript 타입
 */
type UserFormData = z.infer<typeof userFormSchema>;

/**
 * UsersForm 컴포넌트 Props 인터페이스
 */
interface UsersFormProps {
  /**
   * 수정 모드 시 초기 데이터
   * 
   * @description
   * - 값이 있으면 수정 모드 (비밀번호 선택적)
   * - 값이 없으면 생성 모드 (비밀번호 필수)
   */
  initialData?: User;

  /**
   * 사용 가능한 역할 목록 (id와 name을 포함)
   */
  roles?: Array<{ id: string; name: string }>;

  /**
   * 폼 제출 핸들러
   */
  onSubmit: (data: UserFormData) => void;

  /**
   * 취소 핸들러
   */
  onCancel: () => void;

  /**
   * 로딩 상태
   */
  isLoading?: boolean;
}

export function UsersForm({
  initialData,
  roles = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: UsersFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: initialData?.username || "",
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      role_id: initialData?.role_id || "",
      password: "",
    },
  });

  // initialData 변경 시 폼 리셋
  useEffect(() => {
    if (initialData) {
      reset({
        username: initialData.username,
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone || "",
        role_id: initialData.role_id || "",
        password: "",
      });
    }
  }, [initialData, reset]);

  const selectedRole = watch("role_id");

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
          <div className="space-y-2">
            <Label htmlFor="username">
              사용자명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              {...register("username")}
              placeholder="사용자명을 입력하세요"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              로그인에 사용되는 고유한 사용자명입니다
            </p>
          </div>

          {/* 이름 */}
          <div className="space-y-2">
            <Label htmlFor="full_name">
              이름
            </Label>
            <Input
              id="full_name"
              {...register("full_name")}
              placeholder="이름을 입력하세요"
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              사용자의 실명을 입력하세요
            </p>
          </div>

          {/* 이메일 */}
          <div className="space-y-2">
            <Label htmlFor="email">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="이메일을 입력하세요"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              알림 수신용 이메일 주소입니다
            </p>
          </div>

          {/* 전화번호 */}
          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="010-0000-0000"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              연락 가능한 전화번호를 입력하세요
            </p>
          </div>
        </div>
      </div>

      {/* 권한 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">권한 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 역할 */}
          <div className="space-y-2">
            <Label htmlFor="role_id">
              역할
            </Label>
            <Select
              value={selectedRole}
              onValueChange={(value) => setValue("role_id", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="역할을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role_id && (
              <p className="text-xs text-red-500">{errors.role_id.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              사용자에게 부여할 역할을 선택하세요
            </p>
          </div>
        </div>
      </div>

      {/* 보안 정보 (생성 시만) */}
      {!isEditing && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold whitespace-nowrap">
              보안 정보
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="비밀번호를 입력하세요"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                8자 이상의 안전한 비밀번호를 설정하세요
              </p>
            </div>
          </div>
        </div>
      )}

      <EntityFormButtons
        onCancel={onCancel}
        isLoading={isLoading}
        submitText={isEditing ? "수정" : "등록"}
      />
    </form>
  );
}
