import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: "default" | "primary" | "success" | "warning" | "danger";
  className?: string;
}

const colorClasses = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  warning: "border-orange-500/20 bg-orange-500/5",
  danger: "border-destructive/20 bg-destructive/5",
};

const iconColorClasses = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-emerald-600 dark:text-emerald-500",
  warning: "text-orange-600 dark:text-orange-500",
  danger: "text-destructive",
};

const gradientClasses = {
  default: "from-muted/30 via-transparent to-transparent",
  primary: "from-primary/10 via-primary/5 to-transparent",
  success: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  warning: "from-orange-500/10 via-orange-500/5 to-transparent",
  danger: "from-destructive/10 via-destructive/5 to-transparent",
};

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn(
      colorClasses[color],
      "relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 h-24",
      className
    )}>
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br transition-opacity duration-300 group-hover:opacity-100",
        gradientClasses[color]
      )} />

      {/* Background icon */}
      {icon && (
        <div className={cn(
          "absolute -right-1 -top-1 opacity-5 rotate-12 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110 group-hover:rotate-6",
          iconColorClasses[color]
        )}>
          <div className="w-28 h-28">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
              className: "w-full h-full"
            })}
          </div>
        </div>
      )}

      <CardContent className="p-4 relative h-full flex flex-col justify-between">
        {/* Top: Title */}
        <p className="text-xs font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{title}</p>

        {/* Middle: Main value */}
        <p className="text-xl font-bold text-foreground transition-all duration-300 group-hover:scale-105">{value}</p>

        {/* Bottom: Trend and description */}
        <div className="space-y-1">
          {trend && (
            <span
              className={cn(
                "text-xs font-medium block",
                trend.isPositive
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              {trend.label && ` ${trend.label}`}
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
