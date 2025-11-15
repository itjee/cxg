"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Shield } from "lucide-react";

export default function SystemConfigPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <PageLayout
      title="시스템 설정"
      description="시스템 구성 및 환경을 관리합니다"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            일반
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            알림
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            보안
          </TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">일반 설정 기능이 곧 추가됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">알림 설정 기능이 곧 추가됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 설정 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">보안 설정 기능이 곧 추가됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
