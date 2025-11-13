"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, ExternalLink, Book, MessageCircle, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HelpPage() {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">도움말 센터</h1>
          <p className="text-sm text-muted-foreground mt-1">
            플랫폼 사용에 필요한 도움말과 지원을 받으세요.
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="도움이 필요한 내용을 검색하세요..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader>
            <Book className="h-8 w-8 mb-2 text-blue-600" />
            <CardTitle className="text-base">문서</CardTitle>
            <CardDescription>상세한 사용 가이드와 API 문서</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-between">
              문서 보기
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader>
            <MessageCircle className="h-8 w-8 mb-2 text-green-600" />
            <CardTitle className="text-base">커뮤니티</CardTitle>
            <CardDescription>다른 사용자들과 질문하고 답변하기</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-between">
              커뮤니티 방문
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
          <CardHeader>
            <Mail className="h-8 w-8 mb-2 text-orange-600" />
            <CardTitle className="text-base">지원팀 문의</CardTitle>
            <CardDescription>기술 지원이 필요하신가요?</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full justify-between">
              문의하기
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Popular Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">인기 주제</CardTitle>
          <CardDescription>자주 찾는 도움말 항목</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">테넌트 생성 및 관리</p>
                <p className="text-sm text-muted-foreground">새로운 테넌트를 추가하고 설정하는 방법</p>
              </div>
              <Badge variant="secondary">가이드</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">사용자 권한 설정</p>
                <p className="text-sm text-muted-foreground">역할과 권한을 관리하는 방법</p>
              </div>
              <Badge variant="secondary">가이드</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">청구 및 구독 관리</p>
                <p className="text-sm text-muted-foreground">플랜 변경 및 결제 관리</p>
              </div>
              <Badge variant="secondary">가이드</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">API 연동 가이드</p>
                <p className="text-sm text-muted-foreground">API를 사용한 외부 시스템 연동</p>
              </div>
              <Badge variant="secondary">개발</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">백업 및 복구</p>
                <p className="text-sm text-muted-foreground">데이터 백업 설정 및 복구 절차</p>
              </div>
              <Badge variant="secondary">가이드</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Tutorials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">비디오 튜토리얼</CardTitle>
          <CardDescription>동영상으로 쉽게 배우기</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4 hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-0 w-0 border-l-8 border-l-primary border-y-6 border-y-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-medium">플랫폼 시작하기</p>
              <p className="text-sm text-muted-foreground">5분</p>
            </div>

            <div className="rounded-lg border p-4 hover:bg-accent/50 cursor-pointer transition-colors">
              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-0 w-0 border-l-8 border-l-primary border-y-6 border-y-transparent ml-1"></div>
                </div>
              </div>
              <p className="font-medium">대시보드 둘러보기</p>
              <p className="text-sm text-muted-foreground">8분</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">지원 연락처</CardTitle>
          <CardDescription>문제 해결이 필요하신가요?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">이메일 지원</p>
                <p className="text-sm text-muted-foreground">support@cxg.com</p>
                <p className="text-xs text-muted-foreground mt-1">평균 응답 시간: 24시간</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">라이브 채팅</p>
                <p className="text-sm text-muted-foreground">평일 09:00 - 18:00 (KST)</p>
                <Button variant="outline" size="sm" className="mt-2">
                  채팅 시작하기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
