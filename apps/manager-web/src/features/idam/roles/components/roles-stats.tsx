"use client";

import { Roles as RolesIcon, UserCheck, UserX, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Roles } from "../types/roles.types";

interface RolesStatsProps {
  roles: Roles[];
}

export function RolesStats({ roles }: RolesStatsProps) {
  const total = roles.length;
  const active = roles.filter((u) => u.is_active).length;
  const inactive = total - active;
  const admins = roles.filter((u) => u.is_active).length;

  const stats = [
    { label: "전체 role", value: total, icon: RolesIcon, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "활성", value: active, icon: UserCheck, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "비활성", value: inactive, icon: UserX, color: "text-gray-600", bgColor: "bg-gray-100" },
    { label: "관리자", value: admins, icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
