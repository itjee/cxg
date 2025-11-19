"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useRecentActivities } from "../hooks";
import type { Activity } from "../types";
import { getTimeAgo } from "@/lib/utils";

interface ActivityFeedProps {
  limit?: number;
}

// 액션 타입별 색상 매핑
const getActivityType = (action: string): "success" | "warning" | "error" | "info" => {
  if (action.toLowerCase().includes("created") || action.toLowerCase().includes("added")) {
    return "success";
  }
  if (action.toLowerCase().includes("deleted") || action.toLowerCase().includes("removed")) {
    return "error";
  }
  if (action.toLowerCase().includes("updated") || action.toLowerCase().includes("modified")) {
    return "info";
  }
  if (action.toLowerCase().includes("suspended") || action.toLowerCase().includes("disabled")) {
    return "warning";
  }
  return "info";
};

const typeColors = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  info: "bg-primary/10 text-primary border-primary/20",
};

const typeLabels = {
  success: "성공",
  warning: "경고",
  error: "오류",
  info: "정보",
};

export function ActivityFeed({ limit = 10 }: ActivityFeedProps) {
  // GraphQL로 최근 활동 조회
  const { data, loading, error } = useRecentActivities({ limit });
  const activities = data?.activities ?? [];

  return (
    <Card className="transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>시스템 및 사용자의 최근 활동 내역</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive text-base">
            활동 데이터를 로드할 수 없습니다
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            최근 활동이 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const type = getActivityType(activity.action);
              const userName = activity.actor.fullName || activity.actor.username;
              const userInitial = userName.charAt(0).toUpperCase();

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="text-sm font-medium">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="text-base leading-none">
                      <span className="font-semibold">{userName}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.description}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getTimeAgo(new Date(activity.createdAt))}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={typeColors[type]}
                  >
                    {typeLabels[type]}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
