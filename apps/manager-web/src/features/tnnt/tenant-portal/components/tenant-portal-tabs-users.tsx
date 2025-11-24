/**
 * @file users-tab.tsx
 * @description Tab for viewing and managing connected users
 */

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TenantUser } from "../../types/tenant-portal.types";

interface UsersTabProps {
  users: TenantUser[] | undefined;
  isLoading?: boolean;
}

export function UsersTab({ users, isLoading }: UsersTabProps) {
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

  if (!users || users.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center text-muted-foreground">
          연결된 사용자가 없습니다
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: string | undefined) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      INACTIVE:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      SUSPENDED:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      LEFT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status || "ACTIVE"] || colors.ACTIVE;
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{user.user?.fullName || user.user?.full_name || "-"}</h4>
                {user.isPrimary || user.is_primary ? (
                  <Badge variant="outline" className="text-xs">
                    주요 사용자
                  </Badge>
                ) : null}
                {user.isAdmin || user.is_admin ? (
                  <Badge variant="outline" className="text-xs">
                    관리자
                  </Badge>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.user?.email || "-"}
              </div>
              {user.department && (
                <div className="text-sm">
                  <span className="text-muted-foreground">부서:</span> {user.department}
                </div>
              )}
              {user.position && (
                <div className="text-sm">
                  <span className="text-muted-foreground">직책:</span> {user.position}
                </div>
              )}
            </div>

            <Badge
              className={getStatusColor(user.status)}
            >
              {user.status === "ACTIVE"
                ? "활성"
                : user.status === "INACTIVE"
                  ? "비활성"
                  : user.status === "SUSPENDED"
                    ? "일시중단"
                    : "퇴사"}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}
