"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Palette, Sliders, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useThemeStore } from '@/shared/stores';
import { PaletteSelector } from "@/components/theme/theme-palette-selector";
import { ThemePreviewCard } from "@/components/theme/theme-preview-card";
import { AdvancedColorSettings } from "@/components/theme/theme-advanced-color-settings";

export default function AdvancedThemePage() {
  const router = useRouter();
  const { palette, mode, setPalette, setMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState("theme");

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold">고급 테마 설정</h1>
            <p className="text-base text-muted-foreground mt-1">
              테마 색상과 개별 변수를 세밀하게 조정할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Theme Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("light")}
            className="gap-2"
          >
            <Sun className="h-4 w-4" />
            라이트
          </Button>
          <Button
            variant={mode === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("dark")}
            className="gap-2"
          >
            <Moon className="h-4 w-4" />
            다크
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="theme" className="gap-2">
            <Palette className="h-4 w-4" />
            테마 설정
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-2">
            <Sliders className="h-4 w-4" />
            고급 설정
          </TabsTrigger>
        </TabsList>

        {/* Theme Tab */}
        <TabsContent value="theme" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Palette Selector (2/3) */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>색상 팔레트 선택</CardTitle>
                  <CardDescription>
                    원하는 색상 팔레트를 선택하세요. 선택한 팔레트가 사이트 전체에 적용됩니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaletteSelector value={palette} onChange={setPalette} />
                </CardContent>
              </Card>
            </div>

            {/* Right: Preview (1/3) */}
            <div className="lg:col-span-1">
              <ThemePreviewCard />
            </div>
          </div>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <AdvancedColorSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
