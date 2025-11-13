# 사용자 초대 기능 구현 완료

**작성일**: 2025-01-06  
**구현 범위**: Tenants-Web 사용자 초대 시스템  
**방식**: 관리자 초대 방식 (Invitation-based)

---

## ✅ 구현 완료 항목

### 1. 백엔드 API (FastAPI)

#### 📁 파일 위치
- `/apps/backend-api/src/modules/tenants/sys/users/`

#### 📝 구현 내용

**schemas.py** - Pydantic 스키마 추가
```python
class UserInviteRequest(BaseModel):
    username: str
    email: str
    full_name: str
    phone: str | None
    department_id: UUID | None
    position: str | None
    role_id: UUID | None

class UserInviteResponse(BaseModel):
    user_id: UUID
    username: str
    email: str
    full_name: str
    temp_password: str  # 임시 비밀번호
    invited_at: datetime

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class PasswordChangeResponse(BaseModel):
    message: str
    changed_at: datetime
```

**service.py** - 비즈니스 로직 추가
```python
class UsersService:
    @staticmethod
    async def invite_user(
        db: AsyncSession, 
        data: UserInviteRequest, 
        invited_by: UUID
    ) -> UserInviteResponse:
        """
        사용자 초대 로직:
        1. username/email 중복 확인
        2. 임시 비밀번호 생성 (12자, 특수문자 포함)
        3. bcrypt 해싱
        4. 사용자 계정 생성
        5. 초대 정보 반환 (임시 비밀번호 포함)
        """
    
    @staticmethod
    async def change_password(
        db: AsyncSession, 
        user_id: UUID, 
        data: PasswordChangeRequest
    ) -> PasswordChangeResponse:
        """
        비밀번호 변경 로직:
        1. 사용자 조회
        2. 현재 비밀번호 검증
        3. 새 비밀번호 해싱
        4. 업데이트
        """
```

**router.py** - API 엔드포인트 추가
```python
@router.post("/invite")
async def invite_user(...) -> EnvelopeResponse[UserInviteResponse]:
    """POST /api/v1/tenants/sys/users/invite"""

@router.post("/change-password")
async def change_password(...) -> EnvelopeResponse[PasswordChangeResponse]:
    """POST /api/v1/tenants/sys/users/change-password"""
```

---

### 2. 프론트엔드 (Next.js + React)

#### 📁 파일 위치
- `/apps/tenants-web/src/features/sys/users/`

#### 📝 구현 내용

**types/users.types.ts** - TypeScript 타입 추가
```typescript
export interface UserInviteRequest {
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  department_id?: string;
  position?: string;
  role_id?: string;
}

export interface UserInviteResponse {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  temp_password: string;
  invited_at: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordChangeResponse {
  message: string;
  changed_at: string;
}
```

**services/users.service.ts** - API 클라이언트 추가
```typescript
export const userService = {
  async inviteUser(
    data: UserInviteRequest,
    signal?: AbortSignal
  ): Promise<UserInviteResponse> {
    // POST /api/v1/tenants/sys/users/invite
  },

  async changePassword(
    data: PasswordChangeRequest,
    signal?: AbortSignal
  ): Promise<PasswordChangeResponse> {
    // POST /api/v1/tenants/sys/users/change-password
  },
};
```

**hooks/use-invite-user.ts** - TanStack Query Hooks
```typescript
export function useInviteUser(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  // useMutation 훅으로 사용자 초대 처리
  // 성공 시 users 쿼리 캐시 무효화
}

export function useChangePassword(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}) {
  // useMutation 훅으로 비밀번호 변경 처리
}
```

**pages** - 사용자 초대 페이지
- `/apps/tenants-web/src/app/(main)/sys/users/invite/page.tsx`

```typescript
export default function InviteUserPage() {
  // React Hook Form + Zod validation
  // 초대 폼 렌더링
  // 성공 시 임시 비밀번호 표시 모달
}
```

---

## 📊 사용자 초대 플로우

```
┌─────────────────────────────────────────────────────────┐
│ 1. 관리자가 초대 페이지 접속                              │
│    URL: /sys/users/invite                                │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 초대 정보 입력                                         │
│    • 사용자명 (username)                                  │
│    • 이메일 (email)                                       │
│    • 이름 (full_name)                                     │
│    • 전화번호 (phone) - 선택                              │
│    • 직급/직책 (position) - 선택                          │
│    • 역할 (role_id) - 선택                                │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 백엔드 처리                                            │
│    ✓ username/email 중복 확인                            │
│    ✓ 임시 비밀번호 생성 (12자, 특수문자 포함)             │
│    ✓ bcrypt 해싱                                         │
│    ✓ sys.users 테이블에 INSERT                           │
│    ✓ created_by = 초대한 관리자 ID                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 초대 완료 화면 표시                                    │
│    📋 사용자 정보                                         │
│    ├─ 이름: 홍길동                                        │
│    ├─ 이메일: hong@company.com                           │
│    ├─ 사용자명: honggildong                              │
│    └─ ⚠️ 임시 비밀번호: Ab3#xY9$kL2m                     │
│                                                          │
│    📧 관리자가 사용자에게 전달                            │
│    (이메일 발송 기능은 선택적 구현)                       │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 사용자 첫 로그인                                       │
│    • 로그인 페이지에서 사용자명 + 임시 비밀번호 입력       │
│    • 로그인 성공                                          │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 비밀번호 변경 화면 (첫 로그인 시)                      │
│    ⚠️ TODO: 구현 필요                                    │
│    • force_password_change = true 체크                   │
│    • 비밀번호 변경 화면으로 리다이렉트                     │
│    • 새 비밀번호 입력 (최소 8자)                          │
│    • POST /api/v1/tenants/sys/users/change-password     │
└─────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 정상 사용 시작                                         │
│    • 메인 대시보드로 이동                                 │
│    • 할당된 역할에 따른 권한으로 업무 수행                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 보안 고려사항

### 1. 비밀번호 보안
- ✅ 임시 비밀번호 12자 이상 (영문 대소문자, 숫자, 특수문자 포함)
- ✅ bcrypt 해싱 (비밀번호 평문 저장 안 함)
- ⚠️ TODO: 첫 로그인 시 비밀번호 변경 강제 (force_password_change)

### 2. 임시 비밀번호 전달
- ✅ UI에 한 번만 표시 (새로고침 시 사라짐)
- ✅ 관리자가 직접 사용자에게 전달 (책임 소재 명확)
- ⚠️ 선택: 이메일 자동 발송 기능 (추가 구현 필요)

### 3. 중복 검증
- ✅ username 중복 확인
- ✅ email 중복 확인
- ✅ 중복 시 409 Conflict 에러 반환

---

## ⚠️ TODO: 추가 구현 필요

### 1. 첫 로그인 비밀번호 변경 강제
```sql
-- sys.users 테이블에 컬럼 추가 (이미 있을 수 있음)
ALTER TABLE sys.users ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN DEFAULT false;
```

**구현 필요:**
- 로그인 시 `force_password_change` 체크
- true이면 비밀번호 변경 페이지로 리다이렉트
- 변경 완료 후 `force_password_change = false` 업데이트

**파일 생성:**
- `/apps/tenants-web/src/app/(auth)/change-password/page.tsx`

### 2. 이메일 발송 기능 (선택적)
```typescript
// 이메일 템플릿
const sendInvitationEmail = async (
  email: string,
  username: string,
  temp_password: string
) => {
  // Email service integration
  // Subject: "[ConexGrow] 계정이 생성되었습니다"
  // Body: username, temp_password, 로그인 URL
};
```

### 3. 역할 선택 드롭다운
```typescript
// /sys/users/invite/page.tsx
// TODO: 역할 목록 조회 후 Select 컴포넌트 추가
<FormField
  control={form.control}
  name="role_id"
  render={({ field }) => (
    <FormItem>
      <FormLabel>역할</FormLabel>
      <Select onValueChange={field.onChange} value={field.value}>
        <SelectTrigger>
          <SelectValue placeholder="역할 선택" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  )}
/>
```

### 4. 사용자 목록에 "초대" 버튼 추가
```typescript
// /sys/users/page.tsx
// UsersHeader 컴포넌트에 "사용자 초대" 버튼 추가
<Button onClick={() => router.push('/sys/users/invite')}>
  <Plus className="mr-2" />
  사용자 초대
</Button>
```

---

## 📚 API 엔드포인트

### 사용자 초대
```http
POST /api/v1/tenants/sys/users/invite
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@company.com",
  "full_name": "홍길동",
  "phone": "010-1234-5678",
  "position": "사원",
  "role_id": "uuid"
}
```

**응답 (성공)**
```json
{
  "data": {
    "user_id": "uuid",
    "username": "johndoe",
    "email": "john@company.com",
    "full_name": "홍길동",
    "temp_password": "Ab3#xY9$kL2m",
    "invited_at": "2025-01-06T12:34:56Z"
  }
}
```

**응답 (실패 - 중복)**
```json
{
  "error": "사용자명 'johndoe'이 이미 사용 중입니다."
}
```

### 비밀번호 변경
```http
POST /api/v1/tenants/sys/users/change-password
Content-Type: application/json
Authorization: Bearer <token>

{
  "current_password": "Ab3#xY9$kL2m",
  "new_password": "NewPass123!"
}
```

**응답 (성공)**
```json
{
  "data": {
    "message": "비밀번호가 성공적으로 변경되었습니다.",
    "changed_at": "2025-01-06T12:35:00Z"
  }
}
```

**응답 (실패 - 현재 비밀번호 불일치)**
```json
{
  "error": "현재 비밀번호가 일치하지 않습니다."
}
```

---

## 🧪 테스트 시나리오

### 1. 정상 플로우
1. ✅ 관리자 로그인
2. ✅ `/sys/users/invite` 접속
3. ✅ 초대 정보 입력 (username, email, full_name)
4. ✅ "사용자 초대" 버튼 클릭
5. ✅ 임시 비밀번호 표시 화면 확인
6. ✅ 사용자에게 전달
7. ✅ 사용자 로그인 (username + temp_password)
8. ⚠️ TODO: 비밀번호 변경 화면으로 리다이렉트
9. ⚠️ TODO: 새 비밀번호 입력 후 메인 화면

### 2. 오류 시나리오
1. ✅ 중복된 username으로 초대 → 409 에러
2. ✅ 중복된 email으로 초대 → 409 에러
3. ✅ 잘못된 이메일 형식 → 클라이언트 validation 에러
4. ✅ 사용자명 형식 오류 → 클라이언트 validation 에러

---

## 🎉 완료된 기능

✅ **백엔드 API**
- 사용자 초대 API
- 비밀번호 변경 API
- 임시 비밀번호 생성 로직
- bcrypt 해싱
- 중복 검증

✅ **프론트엔드**
- 사용자 초대 페이지 UI
- React Hook Form + Zod validation
- TanStack Query hooks
- 임시 비밀번호 표시 모달
- TypeScript 타입 정의

✅ **데이터베이스**
- sys.users 테이블 (이미 존재)
- sys.sessions 테이블 (이미 존재)
- sys.user_roles 테이블 (이미 존재)

---

## 📖 사용 방법

### 관리자 (초대하는 사람)
1. 로그인 후 `/sys/users/invite` 접속
2. 초대할 사용자 정보 입력
3. "사용자 초대" 버튼 클릭
4. 표시된 임시 비밀번호를 사용자에게 전달

### 사용자 (초대받은 사람)
1. 로그인 페이지에서 사용자명 + 임시 비밀번호 입력
2. 로그인
3. (TODO) 비밀번호 변경 화면에서 새 비밀번호 설정
4. 정상 사용 시작

---

**구현 완료**: 2025-01-06  
**문의**: 추가 기능 필요 시 개발팀에 요청

