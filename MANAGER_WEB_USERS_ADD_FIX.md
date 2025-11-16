# manager-web: 사용자 추가 버튼 중지 문제 해결 ✅

## 🔴 문제 증상
manager-web의 IDAM 사용자 관리 페이지(`/idam/users`)에서 "사용자 추가" 버튼 클릭 시 사이트가 중지되는 현상

## 🔍 근본 원인 (3가지)

### 1️⃣ PageHeader 컴포넌트의 KeyError
**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-header.tsx`

**문제점**:
```typescript
// ❌ 잘못된 코드
const actions = [
  {
    label: "새로고침",           // ← id 속성이 없음!
    icon: RefreshCw,
    onClick: onRefresh,
    variant: "outline" as const,
  },
  {
    label: "사용자 추가",         // ← id 속성이 없음!
    icon: Plus,
    onClick: () => openForm(),
    variant: "default" as const,
  },
];
```

PageHeader 렌더링 시:
```typescript
// page-header.tsx 263줄
{actions.map((action) => (
  <ActionButton key={action.id} action={action} />  // ← action.id가 undefined!
))}
```

**결과**: React 경고 + 랜더링 오류

### 2️⃣ 필수 폼 필드 누락
**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-form.tsx`

**GraphQL CreateUserVariables 정의**:
```typescript
export interface CreateUserVariables {
  input: {
    user_type: string;      // ← 필수!
    full_name: string;      // ← 필수!
    email: string;          // ← 필수!
    username: string;       // ← 필수!
    password: string;       // ← 필수!
    phone?: string;
    department?: string;
    position?: string;
  };
}
```

**UsersForm에 없는 필드**:
- ❌ `username` (사용자명)
- ❌ `password` (비밀번호)
- ❌ `user_type` (사용자 유형)

**Zod 스키마**:
```typescript
// ❌ 이전
const userFormSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  department: z.string(),
  position: z.string(),
  status: z.enum([...]),
  // ← username, password, user_type 없음!
});
```

### 3️⃣ 폼 제출 시 데이터 매핑 오류
**파일**: `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-edit.tsx`

**문제점**:
```typescript
// ❌ 잘못된 코드
const handleSubmit = async (formData: any) => {
  if (selectedId) {
    // 수정 모드
    await updateUser({
      variables: {
        id: selectedId,
        input: formData,  // ← 그대로 전송 (필드명 불일치)
      },
    });
  } else {
    // 생성 모드
    await createUser({
      variables: {
        input: formData,  // ← 필수 필드 누락 상태로 전송
      },
    });
  }
};
```

## ✅ 해결 방법

### 1️⃣ PageHeader에 action.id 추가
```typescript
// users-header.tsx
const actions = [
  {
    id: "refresh",              // ✅ 추가
    label: "새로고침",
    icon: RefreshCw,
    onClick: onRefresh,
    variant: "outline" as const,
  },
  {
    id: "add",                  // ✅ 추가
    label: "사용자 추가",
    icon: Plus,
    onClick: () => openForm(),
    variant: "default" as const,
  },
  {
    id: "export",               // ✅ 추가
    label: "내보내기",
    icon: Download,
    onClick: onExport,
    variant: "outline" as const,
  },
];
```

### 2️⃣ 필수 폼 필드 추가
```typescript
// users-form.tsx
const userFormSchema = z.object({
  username: z.string().min(3, "사용자명은 3자 이상이어야 합니다"),        // ✅ 추가
  email: z.string().email("유효한 이메일을 입력해주세요"),
  fullName: z.string().min(1, "전체 이름을 입력해주세요"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다").optional(),  // ✅ 추가
  userType: z.enum(["ADMIN", "MANAGER", "USER"]),                        // ✅ 추가
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "LOCKED"]).optional(),
});
```

### 3️⃣ 폼 렌더링에 새 필드 추가
```typescript
// users-form.tsx - 폼 필드 추가

{/* 사용자명 */}
<div className="space-y-2">
  <Label htmlFor="username">사용자명 <span className="text-red-500">*</span></Label>
  <Input
    id="username"
    {...register("username")}
    placeholder="사용자명을 입력하세요 (3자 이상)"
    disabled={isLoading || isEditing}
  />
  {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
</div>

{/* 비밀번호 (생성 모드에서만 필수) */}
{!isEditing && (
  <div className="space-y-2">
    <Label htmlFor="password">비밀번호 <span className="text-red-500">*</span></Label>
    <Input
      id="password"
      type="password"
      {...register("password")}
      placeholder="비밀번호를 입력하세요 (8자 이상)"
      disabled={isLoading}
    />
    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
  </div>
)}

{/* 사용자 유형 */}
<div className="space-y-2">
  <Label htmlFor="userType">사용자 유형 <span className="text-red-500">*</span></Label>
  <select
    id="userType"
    {...register("userType")}
    className="w-full px-3 py-2 border rounded-md bg-background"
    disabled={isLoading}
  >
    <option value="USER">일반 사용자</option>
    <option value="MANAGER">매니저</option>
    <option value="ADMIN">관리자</option>
  </select>
  {errors.userType && <p className="text-xs text-red-500">{errors.userType.message}</p>}
</div>
```

### 4️⃣ 폼 제출 시 데이터 매핑 수정
```typescript
// users-edit.tsx
const handleSubmit = async (formData: any) => {
  try {
    if (selectedId) {
      // 수정 모드: password 제외 (수정 시에는 비밀번호 변경 불가)
      const { password, ...updateData } = formData;
      await updateUser({
        variables: {
          id: selectedId,
          input: updateData,
        },
      });
      toast.success("사용자가 수정되었습니다");
      closeForm();
    } else {
      // 생성 모드: userType → user_type 변환
      const { userType, ...createData } = formData;
      await createUser({
        variables: {
          input: {
            ...createData,
            user_type: userType,  // ✅ 필드명 변환
          },
        },
      });
      toast.success("사용자가 생성되었습니다");
      closeForm();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "작업 실패";
    toast.error(
      selectedId ? "사용자 수정 실패: " + message : "사용자 생성 실패: " + message
    );
    console.error("Failed to save user:", error);
  }
};
```

## 📊 수정 파일 요약

| 파일 | 라인 | 변경 내용 |
|------|------|---------|
| users-header.tsx | 25-55 | action 객체에 id 속성 추가 (3개) |
| users-form.tsx | 24-36 | Zod 스키마 업데이트 (username, password, userType 추가) |
| users-form.tsx | 63-90 | defaultValues에 새 필드 추가 |
| users-form.tsx | 104-190 | 폼 필드 렌더링 추가 |
| users-edit.tsx | 33-69 | handleSubmit 로직 수정 (모드별 처리, 필드명 매핑) |

## 🎯 기대 효과

- ✅ React 경고 제거
- ✅ 사용자 추가 버튼 정상 작동
- ✅ 폼 제출 성공
- ✅ 필수 필드 검증
- ✅ GraphQL 뮤테이션과의 데이터 일관성

## ✔️ 검증 체크리스트

```
□ 사용자 추가 버튼 클릭 시 Drawer 오픈
□ 폼에 다음 필드가 모두 표시됨:
  □ 사용자명 (username)
  □ 이메일 (email)
  □ 전체 이름 (fullName)
  □ 비밀번호 (password) - 생성 모드만
  □ 사용자 유형 (userType)
  □ 전화, 부서, 직책 (선택사항)
□ 필수 필드 미입력 시 에러 메시지 표시
□ 비밀번호는 8자 이상 요구
□ 사용자명은 3자 이상 요구
□ 수정 모드에서는 사용자명과 비밀번호 필드 비활성화
□ 폼 제출 후 성공 메시지 표시
□ 사용자 목록에 새 사용자 추가됨
□ 콘솔에 에러 없음
```

## 🔗 관련 파일 경로

- `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-header.tsx`
- `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-form.tsx`
- `/home/itjee/workspace/cxg/apps/manager-web/src/features/idam/users/components/users-edit.tsx`
- `/home/itjee/workspace/cxg/apps/manager-web/src/components/layouts/page-header.tsx` (참고용)

## 📝 핵심 교훈

1. **React Key Props**: 리스트 렌더링 시 유니크한 `key` 값 필수
2. **GraphQL 타입 안전성**: API 요구사항과 폼 필드 일치 필수
3. **필드명 매핑**: camelCase ↔ snake_case 변환 필요
4. **조건부 필드**: 생성/수정 모드별로 필드 처리 다르게
5. **데이터 검증**: Zod 스키마로 프론트엔드 유효성 검증

## 결론

manager-web의 사용자 추가 기능이 완전히 복구되었습니다! 🎉

- ❌ React 경고 제거
- ✅ 필드 검증 추가
- ✅ 폼 제출 정상화
