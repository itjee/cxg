"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Save, Palette, ChevronRight, Moon, Sun, Monitor } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useThemeStore } from '@/shared/stores';
import { COLOR_PALETTES } from "@/lib/constants/colors";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { palette, mode, setPalette, setMode } = useThemeStore();

  const handleSave = () => {
    console.log("Save settings");
  };

  const handleAdvancedTheme = () => {
    router.push("/core/settings/theme/advanced");
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">시스템 설정</h1>
          <p className="text-sm text-muted-foreground mt-1">
            플랫폼 전역 설정을 관리합니다.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          변경사항 저장
        </Button>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Theme Settings */}
        <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                테마 설정
              </CardTitle>
              <CardDescription>인터페이스 테마와 색상을 설정합니다.</CardDescription>
            </div>
            <Button variant="outline" onClick={handleAdvancedTheme}>
              고급 설정
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode */}
          <div className="space-y-3">
            <Label>테마 모드</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={mode === "light" ? "default" : "outline"}
                onClick={() => setMode("light")}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                라이트
              </Button>
              <Button
                variant={mode === "dark" ? "default" : "outline"}
                onClick={() => setMode("dark")}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                다크
              </Button>
              <Button
                variant={false ? "default" : "outline"}
                onClick={() => setMode("system" as any)}
                className="flex items-center gap-2"
                disabled
              >
                <Monitor className="h-4 w-4" />
                시스템
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              시스템 설정은 추후 지원 예정입니다.
            </p>
          </div>

          <Separator />

          {/* Color Palette */}
          <div className="space-y-3">
            <Label htmlFor="color-palette">색상 팔레트</Label>
            <Select value={palette} onValueChange={(value: any) => setPalette(value)}>
              <SelectTrigger id="color-palette">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slate">Slate (회색)</SelectItem>
                <SelectItem value="gray">Gray (그레이)</SelectItem>
                <SelectItem value="zinc">Zinc (징크)</SelectItem>
                <SelectItem value="neutral">Neutral (중성)</SelectItem>
                <SelectItem value="stone">Stone (스톤)</SelectItem>
                <SelectItem value="red">Red (빨강)</SelectItem>
                <SelectItem value="orange">Orange (오렌지)</SelectItem>
                <SelectItem value="amber">Amber (호박)</SelectItem>
                <SelectItem value="yellow">Yellow (노랑)</SelectItem>
                <SelectItem value="lime">Lime (라임)</SelectItem>
                <SelectItem value="green">Green (초록)</SelectItem>
                <SelectItem value="emerald">Emerald (에메랄드)</SelectItem>
                <SelectItem value="teal">Teal (청록)</SelectItem>
                <SelectItem value="cyan">Cyan (시안)</SelectItem>
                <SelectItem value="sky">Sky (하늘)</SelectItem>
                <SelectItem value="blue">Blue (파랑)</SelectItem>
                <SelectItem value="indigo">Indigo (남색)</SelectItem>
                <SelectItem value="violet">Violet (보라)</SelectItem>
                <SelectItem value="purple">Purple (자주)</SelectItem>
                <SelectItem value="fuchsia">Fuchsia (자홍)</SelectItem>
                <SelectItem value="pink">Pink (분홍)</SelectItem>
                <SelectItem value="rose">Rose (장미)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              선택한 색상이 사이트 전체에 적용됩니다. 더 세밀한 조정은 고급 설정에서 가능합니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>일반 설정</CardTitle>
          <CardDescription>플랫폼의 기본 설정을 구성합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="platform-name">플랫폼 이름</Label>
            <Input id="platform-name" defaultValue="CXG Platform" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="support-email">지원 이메일</Label>
            <Input id="support-email" type="email" defaultValue="support@cxg.com" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timezone">시간대</Label>
            <Select defaultValue="Asia/Seoul">
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Seoul">서울 (UTC+9)</SelectItem>
                <SelectItem value="Asia/Tokyo">도쿄 (UTC+9)</SelectItem>
                <SelectItem value="America/New_York">뉴욕 (UTC-5)</SelectItem>
                <SelectItem value="Europe/London">런던 (UTC+0)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="language">기본 언어</Label>
            <Select defaultValue="ko">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ko">한국어</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>보안 설정</CardTitle>
          <CardDescription>시스템 보안 정책을 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>2단계 인증 강제</Label>
              <p className="text-sm text-muted-foreground">
                모든 사용자에게 2FA를 요구합니다
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>세션 타임아웃</Label>
              <p className="text-sm text-muted-foreground">
                비활성 시 자동 로그아웃 시간
              </p>
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15분</SelectItem>
                <SelectItem value="30">30분</SelectItem>
                <SelectItem value="60">1시간</SelectItem>
                <SelectItem value="120">2시간</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IP 화이트리스트</Label>
              <p className="text-sm text-muted-foreground">
                특정 IP에서만 접근 허용
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="password-policy">비밀번호 정책</Label>
            <Select defaultValue="strong">
              <SelectTrigger id="password-policy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">기본 (8자 이상)</SelectItem>
                <SelectItem value="strong">강력 (12자, 특수문자 포함)</SelectItem>
                <SelectItem value="very-strong">매우 강력 (16자, 모든 문자 유형)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
          <CardDescription>시스템 알림 정책을 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>이메일 알림</Label>
              <p className="text-sm text-muted-foreground">
                중요 이벤트 발생 시 이메일 발송
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack 통합</Label>
              <p className="text-sm text-muted-foreground">
                Slack으로 알림 전송
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>시스템 상태 알림</Label>
              <p className="text-sm text-muted-foreground">
                서버 상태 변경 시 알림
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>백업 설정</CardTitle>
          <CardDescription>자동 백업 정책을 설정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>자동 백업</Label>
              <p className="text-sm text-muted-foreground">
                정기적으로 데이터 백업
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>백업 주기</Label>
              <p className="text-sm text-muted-foreground">
                백업 실행 간격
              </p>
            </div>
            <Select defaultValue="daily">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">매시간</SelectItem>
                <SelectItem value="daily">매일</SelectItem>
                <SelectItem value="weekly">매주</SelectItem>
                <SelectItem value="monthly">매월</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="retention">백업 보관 기간</Label>
            <Select defaultValue="30">
              <SelectTrigger id="retention">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7일</SelectItem>
                <SelectItem value="30">30일</SelectItem>
                <SelectItem value="90">90일</SelectItem>
                <SelectItem value="365">1년</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
