/**
 * @file page.tsx
 * @description 사용자 초대 페이지
 * 
 * 관리자가 새로운 사용자를 초대하는 페이지입니다.
 * 초대된 사용자는 이메일로 임시 비밀번호를 받아 첫 로그인 시 변경합니다.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Mail, User, Briefcase, Phone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useInviteUser } from '@/features/sys/users/hooks';
import type { UserInviteRequest } from '@/features/sys/users/types';

/**
 * 사용자 초대 폼 스키마
 */
const inviteUserSchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 최소 3자 이상이어야 합니다')
    .max(100, '사용자명은 최대 100자까지 가능합니다')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다'),
  email: z
    .string()
    .email('올바른 이메일 주소를 입력해주세요')
    .max(255, '이메일은 최대 255자까지 가능합니다'),
  full_name: z
    .string()
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(100, '이름은 최대 100자까지 가능합니다'),
  phone: z
    .string()
    .regex(/^[0-9-+() ]{8,20}$/, '올바른 전화번호를 입력해주세요')
    .optional()
    .or(z.literal('')),
  position: z
    .string()
    .max(100, '직급/직책은 최대 100자까지 가능합니다')
    .optional()
    .or(z.literal('')),
  role_id: z
    .string()
    .uuid('올바른 역할을 선택해주세요')
    .optional()
    .or(z.literal('')),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

/**
 * 사용자 초대 페이지 컴포넌트
 */
export default function InviteUserPage() {
  const router = useRouter();
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [invitedUser, setInvitedUser] = useState<any>(null);

  // 폼 초기화
  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      username: '',
      email: '',
      full_name: '',
      phone: '',
      position: '',
      role_id: '',
    },
  });

  // 사용자 초대 mutation
  const inviteUser = useInviteUser({
    onSuccess: (data) => {
      setInvitedUser(data);
      setShowTempPassword(true);
      toast.success(`${data.full_name}님을 초대했습니다`);
    },
    onError: (error) => {
      toast.error(error.message || '사용자 초대에 실패했습니다');
    },
  });

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: InviteUserFormData) => {
    // 빈 문자열을 undefined로 변환
    const inviteData: UserInviteRequest = {
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone || undefined,
      position: data.position || undefined,
      role_id: data.role_id || undefined,
    };

    inviteUser.mutate(inviteData);
  };

  /**
   * 임시 비밀번호 표시 모달
   */
  if (showTempPassword && invitedUser) {
    return (
      <div className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">
              ✅ 사용자 초대 완료
            </CardTitle>
            <CardDescription>
              아래 정보를 사용자에게 전달해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 사용자 정보 */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">이름</p>
                  <p className="font-medium">{invitedUser.full_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <Mail className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">이메일</p>
                  <p className="font-medium">{invitedUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <User className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-sm text-slate-500">사용자명</p>
                  <p className="font-medium">{invitedUser.username}</p>
                </div>
              </div>

              {/* 임시 비밀번호 */}
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                <Shield className="h-5 w-5 text-amber-600" />
                <div className="flex-1">
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                    임시 비밀번호
                  </p>
                  <p className="text-lg font-mono font-bold text-amber-900 dark:text-amber-200">
                    {invitedUser.temp_password}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    ⚠️ 첫 로그인 시 비밀번호를 변경해야 합니다
                  </p>
                </div>
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📧 <strong>다음 단계:</strong>
              </p>
              <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 ml-6 list-decimal">
                <li>위의 사용자명과 임시 비밀번호를 사용자에게 전달</li>
                <li>사용자가 로그인 페이지에서 로그인</li>
                <li>첫 로그인 시 비밀번호 변경 화면으로 자동 이동</li>
                <li>새로운 비밀번호 설정 후 정상 사용</li>
              </ol>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowTempPassword(false);
                  setInvitedUser(null);
                  form.reset();
                }}
              >
                다른 사용자 초대
              </Button>
              <Button
                className="flex-1"
                onClick={() => router.push('/sys/users')}
              >
                사용자 목록으로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * 초대 폼 렌더링
   */
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">사용자 초대</CardTitle>
            <CardDescription>
              새로운 사용자를 초대합니다. 임시 비밀번호가 자동 생성되며, 첫 로그인 시 변경해야 합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 사용자명 */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사용자명 *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="johndoe"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        로그인 시 사용할 사용자명 (영문, 숫자, 언더스코어만 가능)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 이메일 */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이메일 *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            type="email"
                            placeholder="john@company.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        초대 정보를 받을 이메일 주소
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 이름 */}
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름 *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="홍길동"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        실명을 입력해주세요
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 전화번호 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>전화번호</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="010-1234-5678"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        연락 가능한 전화번호 (선택사항)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 직급/직책 */}
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>직급/직책</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="사원, 대리, 과장 등"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        직급 또는 직책 (선택사항)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TODO: 역할 선택 드롭다운 추가 */}
                {/* <FormField control={form.control} name="role_id" ... /> */}

                {/* 제출 버튼 */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={inviteUser.isPending}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={inviteUser.isPending}
                  >
                    {inviteUser.isPending ? '초대 중...' : '사용자 초대'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
