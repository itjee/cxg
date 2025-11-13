"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "success" | "warning" | "error" | "info";
}

interface ActivityFeedProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    user: "Admin",
    action: "created",
    target: "new tenant: Acme Corp",
    time: "2분 전",
    type: "success",
  },
  {
    id: "2",
    user: "System",
    action: "deployed",
    target: "infrastructure update v2.1.0",
    time: "15분 전",
    type: "info",
  },
  {
    id: "3",
    user: "Admin",
    action: "suspended",
    target: "tenant: Beta Inc",
    time: "1시간 전",
    type: "warning",
  },
  {
    id: "4",
    user: "System",
    action: "detected",
    target: "anomaly in billing service",
    time: "2시간 전",
    type: "error",
  },
];

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

export function ActivityFeed({ activities = mockActivities, isLoading = false }: ActivityFeedProps) {
  return (
    <Card className="transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
        <CardDescription>시스템 및 사용자의 최근 활동 내역</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            최근 활동이 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback className="text-xs font-medium">
                    {activity.user[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <p className="text-sm leading-none">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={typeColors[activity.type]}
                >
                  {typeLabels[activity.type]}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
