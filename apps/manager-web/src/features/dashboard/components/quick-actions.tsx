"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 1 | 2 | 3;
  className?: string;
}

const iconColorClasses = {
  default: "text-muted-foreground group-hover:text-foreground",
  primary: "text-primary",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-orange-600 dark:text-orange-500",
  danger: "text-destructive",
};

const bgColorClasses = {
  default: "bg-muted group-hover:bg-muted/80",
  primary: "bg-primary/10 group-hover:bg-primary/20",
  success: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  warning: "bg-orange-500/10 group-hover:bg-orange-500/20",
  danger: "bg-destructive/10 group-hover:bg-destructive/20",
};

export function QuickActions({ actions, columns = 2, className }: QuickActionsProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <Card className={cn("transition-all hover:shadow-lg hover:shadow-primary/10", className)}>
      <CardHeader>
        <CardTitle>빠른 작업</CardTitle>
        <CardDescription>자주 사용하는 기능에 빠르게 접근</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-3", gridCols[columns])}>
          {actions.map((action, index) => {
            const Icon = action.icon;
            const color = action.color || "default";
            
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto justify-start gap-3 p-4 group hover:border-primary transition-all"
                onClick={action.onClick}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                  bgColorClasses[color]
                )}>
                  <Icon className={cn("h-5 w-5", iconColorClasses[color])} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-base font-semibold group-hover:text-primary transition-colors">
                    {action.label}
                  </div>
                  {action.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {action.description}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
