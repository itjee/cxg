"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPalettePicker } from './color-palette-picker';
import { ThemePreview } from './theme-preview';
import { useTheme } from '@/shared/hooks';
import { Moon, Sun, RotateCcw, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColorPalette } from '@/lib/constants/colors';

export function ThemeSettings() {
  const { palette, mode, setPalette, toggleMode, resetTheme } = useTheme();
  const [tempPalette, setTempPalette] = useState<ColorPalette>(palette);

  const handleApply = () => {
    setPalette(tempPalette);
  };

  const handleReset = () => {
    resetTheme();
    setTempPalette('violet');
  };

  const hasChanges = tempPalette !== palette;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">테마 설정</h2>
            <p className="text-sm text-muted-foreground">
              애플리케이션의 색상 테마를 변경하세요
            </p>
          </div>
        </div>

        {/* 다크 모드 토글 */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMode}
          className="h-10 w-10"
        >
          {mode === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 색상 팔레트 선택 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Primary 색상 선택</CardTitle>
              <CardDescription>
                원하는 색상 팔레트를 선택하세요 (총 21개)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorPalettePicker
                selected={tempPalette}
                onSelect={setTempPalette}
              />

              {/* 변경 사항 알림 */}
              {hasChanges && (
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    색상이 변경되었습니다. '적용' 버튼을 클릭하여 저장하세요.
                  </p>
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  기본값으로 초기화
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setTempPalette(palette)}
                    disabled={!hasChanges}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!hasChanges}
                    className="gap-2"
                  >
                    <Palette className="h-4 w-4" />
                    적용
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 미리보기 */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <ThemePreview />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 추가 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">테마 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">현재 팔레트</p>
              <p className="font-semibold capitalize">{palette}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">색상 모드</p>
              <p className="font-semibold capitalize flex items-center gap-2">
                {mode === 'dark' ? (
                  <>
                    <Moon className="h-4 w-4" /> 다크 모드
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" /> 라이트 모드
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">색상 시스템</p>
              <p className="font-semibold">OKLCH</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
