"use client";

/**
 * @file menus-form.tsx
 * @description 메뉴 생성/수정 폼 컴포넌트
 * 
 * React Hook Form과 Zod를 사용한 폼 유효성 검증
 * - 메뉴 생성 모드: 모든 필드 입력
 * - 메뉴 수정 모드: 기존 데이터 로드
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EntityFormButtons } from "@/components/features";
import type { Menu, CreateMenuRequest, UpdateMenuRequest, MenuType, ModuleCode } from "../types";

/**
 * 폼 유효성 검증 스키마
 */
const menuFormSchema = z.object({
  code: z.string().min(1, "메뉴 코드를 입력하세요").regex(/^[A-Z0-9_-]+$/, "대문자, 숫자, 언더스코어, 하이픈만 사용 가능"),
  name: z.string().min(1, "메뉴명을 입력하세요"),
  name_en: z.string().optional(),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  depth: z.number().min(0).max(5).default(0),
  sort_order: z.number().min(0).default(0),
  menu_type: z.enum(['MENU', 'FOLDER', 'LINK', 'DIVIDER']),
  module_code: z.string().optional(),
  route_path: z.string().optional(),
  component_path: z.string().optional(),
  external_url: z.string().url("올바른 URL을 입력하세요").optional().or(z.literal('')),
  icon: z.string().optional(),
  icon_type: z.enum(['lucide', 'fontawesome', 'material', 'custom']).optional(),
  badge_text: z.string().optional(),
  badge_color: z.string().optional(),
  permission_code: z.string().optional(),
  is_public: z.boolean().default(false),
  is_visible: z.boolean().default(true),
  is_favorite: z.boolean().default(false),
  open_in_new_tab: z.boolean().default(false),
});

type MenuFormData = z.infer<typeof menuFormSchema>;

interface MenusFormProps {
  initialData?: Menu;
  parentMenus?: Menu[];
  onSubmit: (data: MenuFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MenusForm({
  initialData,
  parentMenus = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: MenusFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      name_en: initialData?.name_en || "",
      description: initialData?.description || "",
      parent_id: initialData?.parent_id || "",
      depth: initialData?.depth || 0,
      sort_order: initialData?.sort_order || 0,
      menu_type: initialData?.menu_type || 'MENU',
      module_code: initialData?.module_code || "",
      route_path: initialData?.route_path || "",
      component_path: initialData?.component_path || "",
      external_url: initialData?.external_url || "",
      icon: initialData?.icon || "",
      icon_type: initialData?.icon_type || 'lucide',
      badge_text: initialData?.badge_text || "",
      badge_color: initialData?.badge_color || "",
      permission_code: initialData?.permission_code || "",
      is_public: initialData?.is_public || false,
      is_visible: initialData?.is_visible ?? true,
      is_favorite: initialData?.is_favorite || false,
      open_in_new_tab: initialData?.open_in_new_tab || false,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        code: initialData.code,
        name: initialData.name,
        name_en: initialData.name_en || "",
        description: initialData.description || "",
        parent_id: initialData.parent_id || "",
        depth: initialData.depth,
        sort_order: initialData.sort_order,
        menu_type: initialData.menu_type,
        module_code: initialData.module_code || "",
        route_path: initialData.route_path || "",
        component_path: initialData.component_path || "",
        external_url: initialData.external_url || "",
        icon: initialData.icon || "",
        icon_type: initialData.icon_type || 'lucide',
        badge_text: initialData.badge_text || "",
        badge_color: initialData.badge_color || "",
        permission_code: initialData.permission_code || "",
        is_public: initialData.is_public,
        is_visible: initialData.is_visible,
        is_favorite: initialData.is_favorite,
        open_in_new_tab: initialData.open_in_new_tab,
      });
    }
  }, [initialData, reset]);

  const selectedMenuType = watch("menu_type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">기본 정보</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* 메뉴 코드 */}
          <div className="space-y-2">
            <Label htmlFor="code">
              메뉴 코드 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              {...register("code")}
              placeholder="예: SYS_USERS"
              disabled={isEditing}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          {/* 메뉴명 */}
          <div className="space-y-2">
            <Label htmlFor="name">
              메뉴명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="예: 사용자 관리"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* 영문 메뉴명 */}
          <div className="space-y-2">
            <Label htmlFor="name_en">영문 메뉴명</Label>
            <Input
              id="name_en"
              {...register("name_en")}
              placeholder="예: Users"
            />
          </div>

          {/* 메뉴 타입 */}
          <div className="space-y-2">
            <Label htmlFor="menu_type">메뉴 타입</Label>
            <Select
              value={selectedMenuType}
              onValueChange={(value) => setValue("menu_type", value as MenuType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="타입 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MENU">메뉴</SelectItem>
                <SelectItem value="FOLDER">폴더</SelectItem>
                <SelectItem value="LINK">링크</SelectItem>
                <SelectItem value="DIVIDER">구분선</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="메뉴에 대한 설명을 입력하세요"
            rows={3}
          />
        </div>
      </div>

      {/* 계층 구조 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">계층 구조</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* 부모 메뉴 */}
          <div className="space-y-2">
            <Label htmlFor="parent_id">부모 메뉴</Label>
            <Select
              value={watch("parent_id")}
              onValueChange={(value) => setValue("parent_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="없음 (최상위)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">없음 (최상위)</SelectItem>
                {parentMenus.map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 깊이 */}
          <div className="space-y-2">
            <Label htmlFor="depth">깊이</Label>
            <Input
              id="depth"
              type="number"
              {...register("depth", { valueAsNumber: true })}
              min={0}
              max={5}
            />
          </div>

          {/* 정렬 순서 */}
          <div className="space-y-2">
            <Label htmlFor="sort_order">정렬 순서</Label>
            <Input
              id="sort_order"
              type="number"
              {...register("sort_order", { valueAsNumber: true })}
              min={0}
            />
          </div>
        </div>
      </div>

      {/* 라우팅 정보 */}
      {selectedMenuType === 'MENU' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold whitespace-nowrap">라우팅 정보</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 라우트 경로 */}
            <div className="space-y-2">
              <Label htmlFor="route_path">라우트 경로</Label>
              <Input
                id="route_path"
                {...register("route_path")}
                placeholder="/sys/users"
              />
            </div>

            {/* 컴포넌트 경로 */}
            <div className="space-y-2">
              <Label htmlFor="component_path">컴포넌트 경로</Label>
              <Input
                id="component_path"
                {...register("component_path")}
                placeholder="@/pages/sys/users"
              />
            </div>
          </div>
        </div>
      )}

      {/* UI 표시 정보 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold whitespace-nowrap">UI 표시</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="icon">아이콘</Label>
            <Input id="icon" {...register("icon")} placeholder="users" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module_code">모듈 코드</Label>
            <Input id="module_code" {...register("module_code")} placeholder="SYS" />
          </div>
        </div>

        {/* 옵션 스위치 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="is_visible">표시</Label>
            <Switch
              id="is_visible"
              checked={watch("is_visible")}
              onCheckedChange={(checked) => setValue("is_visible", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_public">공개</Label>
            <Switch
              id="is_public"
              checked={watch("is_public")}
              onCheckedChange={(checked) => setValue("is_public", checked)}
            />
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <EntityFormButtons
        onCancel={onCancel}
        submitLabel={isEditing ? "수정" : "생성"}
        isLoading={isLoading}
      />
    </form>
  );
}
