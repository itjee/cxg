/**
 * @file roles-tab.tsx
 * @description Tab for viewing tenant roles
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TenantRole } from "../../types/tenant-portal.types";

interface RolesTabProps {
  roles: TenantRole[] | undefined;
  isLoading?: boolean;
}

export function RolesTab({ roles, isLoading }: RolesTabProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-muted animate-pulse rounded"
            />
          ))}
        </div>
      </Card>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          역할이 없습니다
        </div>
      </Card>
    );
  }

  const getCategoryColor = (category: string | undefined) => {
    const colors: Record<string, string> = {
      MANAGER_ADMIN:
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      PLATFORM_SUPPORT:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      TENANT_ADMIN:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      TENANT_USER:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return colors[category || "TENANT_USER"] || colors.TENANT_USER;
  };

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <Card key={role.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{role.name}</h4>
                {role.isSystem && (
                  <Badge variant="secondary" className="text-xs">
                    시스템
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                코드: <span className="font-mono">{role.code}</span>
              </div>
              {role.description && (
                <div className="text-sm">{role.description}</div>
              )}
              <div className="text-xs text-muted-foreground">
                {role.permissionCount || 0}개의 권한
              </div>
            </div>

            <Badge className={getCategoryColor(role.category)}>
              {role.category === "MANAGER_ADMIN"
                ? "관리자"
                : role.category === "PLATFORM_SUPPORT"
                  ? "지원팀"
                  : role.category === "TENANT_ADMIN"
                    ? "테넌트 관리자"
                    : "테넌트 사용자"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
