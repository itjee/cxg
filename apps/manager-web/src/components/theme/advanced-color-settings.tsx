"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/theme/color-picker';
import { getGroupedThemeColors, type ThemeColorInfo } from '@/lib/constants/theme-colors';
import { useThemeStore } from '@/shared/stores';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorItemProps {
  colorInfo: ThemeColorInfo;
  useDefault: boolean;
  customColor?: string;
  onToggleDefault: (checked: boolean) => void;
  onColorChange: (color: string) => void;
}

function ColorItem({ colorInfo, useDefault, customColor, onToggleDefault, onColorChange }: ColorItemProps) {
  const isCustom = !useDefault;
  const displayColor = isCustom && customColor
    ? customColor
    : 'var(--' + colorInfo.variable + ')';

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      {/* 왼쪽: 라벨과 설명 */}
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-medium">
          {colorInfo.label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {colorInfo.description}
        </p>
      </div>

      {/* 오른쪽: 색상 선택 영역 */}
      <div className="flex items-center gap-2 shrink-0">
        {/* 색상 미리보기 (클릭하여 팔레트 열기) */}
        <ColorPicker
          value={displayColor}
          onChange={onColorChange}
          disabled={!isCustom}
        />

        {/* OKLCH 입력 필드 */}
        <Input
          type="text"
          value={customColor || ''}
          onChange={(e) => onColorChange(e.target.value)}
          disabled={!isCustom}
          placeholder="oklch(50% 0.1 180)"
          className="w-48 font-mono text-xs"
        />

        {/* Custom 체크박스 */}
        <div className="flex items-center gap-2">
          <Checkbox
            id={`custom-${colorInfo.variable}`}
            checked={isCustom}
            onCheckedChange={(checked) => onToggleDefault(!checked)}
          />
          <Label
            htmlFor={`custom-${colorInfo.variable}`}
            className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap"
          >
            Custom
          </Label>
        </div>
      </div>
    </div>
  );
}

export function AdvancedColorSettings() {
  const { customColors, mode, setCustomColor } = useThemeStore();
  const grouped = getGroupedThemeColors();

  const handleToggleDefault = (variable: string, checked: boolean) => {
    const currentSetting = customColors[variable]?.[mode];
    setCustomColor(variable, checked, currentSetting?.customColor);
  };

  const handleColorChange = (variable: string, color: string) => {
    const currentSetting = customColors[variable]?.[mode];
    setCustomColor(variable, currentSetting?.useDefault ?? true, color);
  };

  const handleResetCategory = (category: keyof typeof grouped) => {
    grouped[category].forEach((colorInfo) => {
      setCustomColor(colorInfo.variable, true, undefined);
    });
  };

  return (
    <div className="space-y-6">
      {/* 현재 편집 중인 모드 표시 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">현재 편집 중인 모드:</span>
            <span className="font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
              {mode === 'light' ? '라이트 모드' : '다크 모드'}
            </span>
            <span className="text-muted-foreground ml-2">
              (각 모드별로 별도의 커스텀 색상을 설정할 수 있습니다)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout for Color Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Background Colors */}
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                배경 색상
              </CardTitle>
              <CardDescription>
                메인 배경 및 텍스트 색상 설정
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetCategory('background')}
              className="gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {grouped.background.map((colorInfo) => {
            const setting = customColors[colorInfo.variable]?.[mode];
            return (
              <ColorItem
                key={colorInfo.variable}
                colorInfo={colorInfo}
                useDefault={setting?.useDefault ?? true}
                customColor={setting?.customColor}
                onToggleDefault={(checked) => handleToggleDefault(colorInfo.variable, checked)}
                onColorChange={(color) => handleColorChange(colorInfo.variable, color)}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* Content Colors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                콘텐츠 색상
              </CardTitle>
              <CardDescription>
                카드, 팝오버, 보조 요소 색상 설정
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetCategory('content')}
              className="gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {grouped.content.map((colorInfo) => {
            const setting = customColors[colorInfo.variable]?.[mode];
            return (
              <ColorItem
                key={colorInfo.variable}
                colorInfo={colorInfo}
                useDefault={setting?.useDefault ?? true}
                customColor={setting?.customColor}
                onToggleDefault={(checked) => handleToggleDefault(colorInfo.variable, checked)}
                onColorChange={(color) => handleColorChange(colorInfo.variable, color)}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* Interaction Colors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                인터랙션 색상
              </CardTitle>
              <CardDescription>
                호버, 포커스, 테두리 색상 설정
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetCategory('interaction')}
              className="gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {grouped.interaction.map((colorInfo) => {
            const setting = customColors[colorInfo.variable]?.[mode];
            return (
              <ColorItem
                key={colorInfo.variable}
                colorInfo={colorInfo}
                useDefault={setting?.useDefault ?? true}
                customColor={setting?.customColor}
                onToggleDefault={(checked) => handleToggleDefault(colorInfo.variable, checked)}
                onColorChange={(color) => handleColorChange(colorInfo.variable, color)}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* Sidebar Colors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                사이드바 색상
              </CardTitle>
              <CardDescription>
                사이드바 배경, 텍스트, 액센트 색상 설정
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetCategory('sidebar')}
              className="gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              초기화
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {grouped.sidebar.map((colorInfo) => {
            const setting = customColors[colorInfo.variable]?.[mode];
            return (
              <ColorItem
                key={colorInfo.variable}
                colorInfo={colorInfo}
                useDefault={setting?.useDefault ?? true}
                customColor={setting?.customColor}
                onToggleDefault={(checked) => handleToggleDefault(colorInfo.variable, checked)}
                onColorChange={(color) => handleColorChange(colorInfo.variable, color)}
              />
            );
          })}
        </CardContent>
      </Card>
      </div>

      {/* 도움말 */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium">💡 OKLCH 색상 포맷</p>
            <p className="text-muted-foreground">
              OKLCH 색상은 <code className="px-1 py-0.5 bg-muted rounded text-xs">oklch(L% C H)</code> 형식으로 입력하세요.
            </p>
            <ul className="text-muted-foreground list-disc list-inside space-y-1 ml-2">
              <li><strong>L (Lightness)</strong>: 명도 0-100%</li>
              <li><strong>C (Chroma)</strong>: 채도 0-0.4</li>
              <li><strong>H (Hue)</strong>: 색조 0-360도</li>
            </ul>
            <p className="text-muted-foreground text-xs mt-3">
              예시: <code className="px-1 py-0.5 bg-muted rounded">oklch(50% 0.15 180)</code> = 중간 명도의 청록색
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
