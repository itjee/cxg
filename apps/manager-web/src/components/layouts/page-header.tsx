"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

/**
 * 버튼 타입 정의
 * - 'default': 일반 버튼 (라벨 + 아이콘)
 * - 'lookup': 팝업메뉴 (드롭다운)
 * - 'toggle': 토글 버튼 (활성/비활성)
 * - 'text': 텍스트 버튼 (라벨만)
 * - 'icon': 아이콘 버튼 (아이콘만)
 */
type ButtonType = "default" | "lookup" | "toggle" | "text" | "icon";

/**
 * 룩업 버튼의 메뉴 아이템
 */
export interface LookupMenuItemConfig {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
}

/**
 * 액션 버튼 설정
 */
export interface ActionButtonConfig {
  id: string;
  type?: ButtonType;
  label?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  /** 토글 버튼용: 초기 활성 상태 */
  isActive?: boolean;
  /** 토글 버튼용: 활성/비활성 변경 콜백 */
  onToggle?: (isActive: boolean) => void;
  /** 룩업 버튼용: 메뉴 아이템 */
  menuItems?: LookupMenuItemConfig[];
  /** 버튼 크기 */
  size?: "default" | "sm" | "lg";
}

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ActionButtonConfig[];
}

/**
 * 액션 버튼 렌더러 - 버튼 타입에 따라 다른 UI를 렌더링
 */
function ActionButton({ action }: { action: ActionButtonConfig }) {
  const Icon = action.icon;
  const [isActive, setIsActive] = useState(action.isActive ?? false);
  const buttonType = action.type ?? "default";

  // 1. 일반 버튼 (라벨 + 아이콘)
  if (buttonType === "default") {
    return (
      <Button
        variant={action.variant || "outline"}
        onClick={action.onClick}
        size={action.size}
        title={action.label}
      >
        {Icon && <Icon className="mr-2 h-4 w-4" />}
        {action.label}
      </Button>
    );
  }

  // 2. 룩업 버튼 (드롭다운 메뉴)
  if (buttonType === "lookup") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={action.variant || "outline"}
            size={action.size}
            title={action.label}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {action.label}
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {action.menuItems?.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <DropdownMenuItem
                key={idx}
                onClick={item.onClick}
                className={item.variant === "destructive" ? "text-red-600" : ""}
              >
                {ItemIcon && <ItemIcon className="mr-2 h-4 w-4" />}
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // 3. 토글 버튼 (활성/비활성)
  if (buttonType === "toggle") {
    return (
      <Button
        variant={isActive ? "default" : "outline"}
        onClick={() => {
          setIsActive(!isActive);
          action.onToggle?.(!isActive);
        }}
        size={action.size}
        title={action.label}
      >
        {Icon && (
          <Icon className={`mr-2 h-4 w-4 ${isActive ? "text-white" : ""}`} />
        )}
        {action.label}
        {isActive && (
          <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Button>
    );
  }

  // 4. 텍스트 버튼 (라벨만)
  if (buttonType === "text") {
    return (
      <Button
        variant="ghost"
        onClick={action.onClick}
        size={action.size}
        className="text-foreground hover:text-primary hover:bg-transparent"
        title={action.label}
      >
        {action.label}
      </Button>
    );
  }

  // 5. 아이콘 버튼 (아이콘만)
  if (buttonType === "icon") {
    return (
      <Button
        variant="ghost"
        onClick={action.onClick}
        size={action.size || "sm"}
        className="h-9 w-9 p-0"
        title={action.label}
      >
        {Icon && <Icon className="h-4 w-4" />}
      </Button>
    );
  }

  return null;
}

/**
 * 페이지 헤더 공통 컴포넌트
 * 페이지 제목, 설명, 가변적 액션 버튼을 포함
 *
 * @example
 * // 일반 버튼
 * <PageHeader
 *   title="사용자 관리"
 *   description="시스템 사용자 계정을 관리합니다"
 *   actions={[
 *     { id: '1', type: 'default', label: '새로고침', icon: RefreshCw, onClick: handleRefresh, variant: 'outline' },
 *     { id: '2', type: 'default', label: '사용자 추가', icon: Plus, onClick: handleAdd, variant: 'default' },
 *   ]}
 * />
 *
 * @example
 * // 룩업 버튼 (드롭다운)
 * <PageHeader
 *   title="사용자 관리"
 *   description="시스템 사용자 계정을 관리합니다"
 *   actions={[
 *     {
 *       id: '1',
 *       type: 'lookup',
 *       label: '더보기',
 *       icon: MoreVertical,
 *       menuItems: [
 *         { label: '편집', icon: Edit, onClick: handleEdit },
 *         { label: '삭제', icon: Trash, onClick: handleDelete, variant: 'destructive' },
 *       ]
 *     }
 *   ]}
 * />
 *
 * @example
 * // 토글 버튼
 * <PageHeader
 *   title="설정"
 *   description="시스템 설정을 관리합니다"
 *   actions={[
 *     {
 *       id: '1',
 *       type: 'toggle',
 *       label: '활성화',
 *       icon: Power,
 *       isActive: false,
 *       onToggle: (isActive) => console.log('토글됨:', isActive)
 *     }
 *   ]}
 * />
 *
 * @example
 * // 아이콘 버튼
 * <PageHeader
 *   title="사용자 관리"
 *   description="시스템 사용자 계정을 관리합니다"
 *   actions={[
 *     { id: '1', type: 'icon', icon: Bell, label: '알림', onClick: handleNotification },
 *     { id: '2', type: 'icon', icon: Settings, label: '설정', onClick: handleSettings },
 *   ]}
 * />
 */
export function PageHeader({
  title,
  description,
  actions = [],
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="text-base text-muted-foreground mt-2">{description}</p>
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <ActionButton key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}
