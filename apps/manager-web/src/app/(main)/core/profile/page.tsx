"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Save, Upload, Lock, Bell, Shield, Mail } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log("Save profile");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">프로필</h1>
          <p className="text-sm text-muted-foreground mt-1">
            개인 정보 및 계정 설정을 관리합니다.
          </p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <User className="mr-2 h-4 w-4" />
            프로필 수정
          </Button>
        )}
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold">관리자</h2>
                <p className="text-sm text-muted-foreground">admin@cxg.com</p>
              </div>
              <div className="flex gap-2">
                <div className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  시스템 관리자
                </div>
                <div className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold">
                  최고 권한
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>개인 프로필 정보를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">이름</Label>
              <Input
                id="firstName"
                defaultValue="관리자"
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">성</Label>
              <Input
                id="lastName"
                defaultValue="시스템"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              defaultValue="admin@cxg.com"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">전화번호</Label>
            <Input
              id="phone"
              type="tel"
              defaultValue="+82 10-1234-5678"
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">소개</Label>
            <Textarea
              id="bio"
              placeholder="자기소개를 입력하세요"
              defaultValue="CXG 플랫폼의 시스템 관리자입니다."
              disabled={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>계정 설정</CardTitle>
              <CardDescription>로그인 및 보안 관련 설정을 관리합니다.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">사용자명</Label>
            <Input
              id="username"
              defaultValue="admin"
              disabled={!isEditing}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  비밀번호 변경
                </Label>
                <p className="text-sm text-muted-foreground">
                  마지막 변경: 30일 전
                </p>
              </div>
              <Button variant="outline" size="sm">
                변경
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>2단계 인증 (2FA)</Label>
                <p className="text-sm text-muted-foreground">
                  추가 보안을 위해 2단계 인증을 활성화합니다
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>세션 관리</Label>
                <p className="text-sm text-muted-foreground">
                  활성 세션: 3개 디바이스
                </p>
              </div>
              <Button variant="outline" size="sm">
                관리
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 수신 방법을 설정합니다.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                이메일 알림
              </Label>
              <p className="text-sm text-muted-foreground">
                중요 이벤트 발생 시 이메일로 알림을 받습니다
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>브라우저 푸시 알림</Label>
              <p className="text-sm text-muted-foreground">
                브라우저를 통해 실시간 알림을 받습니다
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>주간 리포트</Label>
              <p className="text-sm text-muted-foreground">
                매주 월요일 활동 요약을 받습니다
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="notification-frequency">알림 빈도</Label>
            <Select defaultValue="realtime">
              <SelectTrigger id="notification-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">실시간</SelectItem>
                <SelectItem value="hourly">시간별 요약</SelectItem>
                <SelectItem value="daily">일일 요약</SelectItem>
                <SelectItem value="weekly">주간 요약</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <CardTitle>개인정보 및 데이터</CardTitle>
          <CardDescription>개인정보 처리 및 데이터 관리 옵션입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>활동 로그 기록</Label>
              <p className="text-sm text-muted-foreground">
                내 활동을 기록하여 보안 분석에 사용합니다
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>데이터 다운로드</Label>
              <p className="text-sm text-muted-foreground">
                내 모든 데이터를 다운로드 받을 수 있습니다
              </p>
            </div>
            <Button variant="outline" size="sm">
              요청
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-destructive">계정 삭제</Label>
              <p className="text-sm text-muted-foreground">
                계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <Button variant="destructive" size="sm">
              삭제
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
