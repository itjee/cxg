# 네이밍 규칙

## 백엔드 (Python)

### 디렉토리명

- **형식**: `snake_case`
- **단수형 사용**: `user/`, `role/`, `permission/`
- **복수형 금지**: `users/` ❌

```
✅ 올바른 예
user/
role/
api_key/
sales_order/

❌ 잘못된 예
users/          # 복수형
UserService/    # PascalCase
user-service/   # kebab-case
```

### 파일명

- **형식**: `snake_case.py`
- **표준 파일명**: 고정된 이름 사용

```
✅ 표준 파일명
router.py       # API 엔드포인트
schemas.py      # Pydantic 스키마
service.py      # 비즈니스 로직
model.py        # ORM 모델 import
__init__.py     # 모듈 exports

✅ 커스텀 파일명
user_utils.py
data_processor.py
email_sender.py
```

### 클래스명

- **형식**: `PascalCase`

```python
# Pydantic 스키마
class UserCreate(BaseModel):              # ✅ 서비스 레이어용
class UserCreateRequest(BaseModel):       # ✅ API 레이어용
class UserResponse(BaseModel):            # ✅ API 응답용

# 서비스 클래스
class UserService:                        # ✅
class EmailService:                       # ✅

# ORM 모델
class User(SQLModel, table=True):         # ✅
class SalesOrder(SQLModel, table=True):   # ✅
```

### 함수명

- **형식**: `snake_case`
- **동사로 시작**: 명확한 동작 표현

```python
✅ 올바른 예
def get_user_by_id(user_id: UUID) -> User:
async def create_user(data: UserCreate):
def validate_email(email: str) -> bool:
def send_welcome_email(user: User):

❌ 잘못된 예
def getUserById():          # camelCase
def User():                 # PascalCase
def user():                 # 명사형
```

### 변수명

- **형식**: `snake_case`
- **명확한 이름**: 축약 최소화

```python
✅ 올바른 예
user_id = uuid4()
total_amount = 0
is_active = True
created_at = datetime.now()

❌ 잘못된 예
userId = uuid4()            # camelCase
amt = 0                     # 불명확한 축약
x = True                    # 의미 없는 이름
```

### 상수명

- **형식**: `UPPER_SNAKE_CASE`

```python
✅ 올바른 예
MAX_RETRY_COUNT = 3
DEFAULT_PAGE_SIZE = 20
DATABASE_URL = "postgresql://..."
ACCESS_TOKEN_EXPIRE_MINUTES = 15

❌ 잘못된 예
maxRetryCount = 3           # camelCase
Max_Retry_Count = 3         # Mixed case
```

### 라우터 설정

- **prefix**: 복수형 사용
- **tags**: 명확한 카테고리 표시

```python
✅ 올바른 예
router = APIRouter(
    prefix="/users",                    # 복수형
    tags=["IDAM - 사용자 관리"]
)

router = APIRouter(
    prefix="/api-keys",                 # kebab-case 허용
    tags=["IDAM - API 키 관리"]
)

❌ 잘못된 예
router = APIRouter(
    prefix="/user",                     # 단수형
    tags=["User"]                       # 카테고리 불명확
)
```

### Private 메서드/변수

- **형식**: `_single_underscore` (내부 사용)
- **형식**: `__double_underscore` (Name Mangling)

```python
class UserService:
    def get_user(self):                 # public
        pass

    def _validate_user(self):           # private (internal)
        pass

    def __internal_method(self):        # name mangling
        pass
```

## 프론트엔드 (TypeScript/React)

### 디렉토리명

- **형식**: `kebab-case`
- **단수형 사용**: `user/`, `dashboard/`

```
✅ 올바른 예
user/
dashboard/
api-key/
sales-order/

❌ 잘못된 예
users/          # 복수형
userModule/     # camelCase
User/           # PascalCase
```

### 파일명

#### 컴포넌트

- **형식**: `kebab-case.tsx`

```
✅ 올바른 예
user-table.tsx
user-form.tsx
api-key-list.tsx

❌ 잘못된 예
UserTable.tsx       # PascalCase
userTable.tsx       # camelCase
user_table.tsx      # snake_case
```

#### 페이지 (App Router)

- **Next.js 규칙**: 고정된 파일명

```
page.tsx            # 페이지
layout.tsx          # 레이아웃
loading.tsx         # 로딩 UI
error.tsx           # 에러 UI
not-found.tsx       # 404 페이지
```

#### 훅

- **형식**: `use-resource.ts`
- **prefix**: `use-`로 시작

```
✅ 올바른 예
use-user.ts
use-auth.ts
use-user-form.ts

❌ 잘못된 예
user-hook.ts        # use- prefix 없음
useUser.ts          # camelCase
user.hook.ts        # 잘못된 suffix
```

#### 서비스

- **형식**: `resource.service.ts`

```
✅ 올바른 예
user.service.ts
auth.service.ts
api-key.service.ts

❌ 잘못된 예
userService.ts      # camelCase
user_service.ts     # snake_case
```

#### 스토어

- **형식**: `resource.store.ts`

```
✅ 올바른 예
user.store.ts
auth.store.ts
global.store.ts

❌ 잘못된 예
userStore.ts        # camelCase
user_store.ts       # snake_case
```

#### 타입

- **형식**: `resource.types.ts`

```
✅ 올바른 예
user.types.ts
api.types.ts
common.types.ts

❌ 잘못된 예
userTypes.ts        # camelCase
user_types.ts       # snake_case
types.ts            # 너무 일반적
```

### 컴포넌트명

- **형식**: `PascalCase`
- **명사 사용**: UI 요소를 나타냄

```typescript
✅ 올바른 예
export function UserTable() {}
export function UserForm() {}
export default function UserPage() {}

❌ 잘못된 예
export function userTable() {}      # camelCase
export function user_table() {}     # snake_case
export function User() {}           # 너무 일반적
```

### 함수명

- **형식**: `camelCase`
- **동사로 시작**: 명확한 동작 표현

```typescript
✅ 올바른 예
function getUserById(id: string): User {}
async function createUser(data: UserCreateRequest): Promise<User> {}
const handleSubmit = () => {}
const handleClick = () => {}

❌ 잘못된 예
function GetUserById() {}           # PascalCase
function get_user_by_id() {}        # snake_case
function user() {}                  # 명사형
```

### 변수명

- **형식**: `camelCase`
- **명확한 이름**: 축약 최소화

```typescript
✅ 올바른 예
const userId = '123'
const totalAmount = 0
const isActive = true
const createdAt = new Date()

❌ 잘못된 예
const UserID = '123'                # PascalCase
const user_id = '123'               # snake_case
const amt = 0                       # 불명확한 축약
```

### 상수명

- **형식**: `UPPER_SNAKE_CASE`

```typescript
✅ 올바른 예
const API_BASE_URL = '/api/v1'
const MAX_RETRY_COUNT = 3
const DEFAULT_TIMEOUT = 5000

❌ 잘못된 예
const apiBaseUrl = '/api/v1'        # camelCase
const MaxRetryCount = 3             # PascalCase
```

### 타입/인터페이스명

- **형식**: `PascalCase`
- **명확한 의미**: 목적이 드러나도록

```typescript
✅ 올바른 예
interface User {}
interface UserCreateRequest {}
interface UserResponse {}
type UserStatus = 'active' | 'inactive'
type ApiResponse<T> = { data: T }

❌ 잘못된 예
interface user {}                   # camelCase
interface IUser {}                  # Hungarian notation
type userStatus = 'active'          # camelCase
```

### Enum명

- **형식**: `PascalCase` (Enum), `UPPER_SNAKE_CASE` (값)

```typescript
✅ 올바른 예
enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}
enum OrderType {
SALES = 'SALES',
PURCHASE = 'PURCHASE',
}
❌ 잘못된 예
enum userStatus {}                  # camelCase
enum USER_STATUS {}                 # UPPER_SNAKE_CASE
```

### Boolean 변수명

- **prefix**: `is`, `has`, `should`, `can` 등 사용

```typescript
✅ 올바른 예
const isActive = true
const hasPermission = false
const shouldRender = true
const canEdit = false
const isLoading = true

❌ 잘못된 예
const active = true                 # prefix 없음
const permission = false            # 의미 불명확
const loading = true                # prefix 없음
```

### 이벤트 핸들러명

- **prefix**: `handle` 또는 `on` 사용

```typescript
✅ 올바른 예
const handleClick = () => {}
const handleSubmit = () => {}
const handleChange = (e: ChangeEvent) => {}
const onClick = () => {}            # props로 전달 시
const onSubmit = () => {}           # props로 전달 시

❌ 잘못된 예
const click = () => {}              # prefix 없음
const submit = () => {}             # prefix 없음
const clickHandler = () => {}       # suffix 사용
```

### 커스텀 훅명

- **prefix**: `use`로 시작
- **형식**: `camelCase`

```typescript
✅ 올바른 예
export function useUser() {}
export function useAuth() {}
export function useUserForm() {}
export function useDebounce() {}

❌ 잘못된 예
export function getUser() {}        # use prefix 없음
export function UseUser() {}        # PascalCase
export function user() {}           # prefix 없음
```

## 데이터베이스

### 스키마명

- **형식**: `lowercase`
- **축약형**: 3-4자 (모듈 식별자)

```sql
✅ 올바른 예
adm     -- 기준정보
psm     -- 구매관리
srm     -- 영업관리
idam    -- 사용자/권한
tnnt    -- 테넌트

❌ 잘못된 예
ADM                 -- 대문자
admin               -- 축약 안 함
a                   -- 너무 짧음
```

### 테이블명

- **형식**: `snake_case`
- **단수형 사용**: `user`, `customer`

```sql
✅ 올바른 예
user
customer
sales_order
sales_order_line
api_key

❌ 잘못된 예
users               -- 복수형
SalesOrder          -- PascalCase
sales-order         -- kebab-case
tbl_user            -- prefix
```

### 컬럼명

- **형식**: `snake_case`
- **명확한 의미**: 축약 최소화

```sql
✅ 올바른 예
user_id
created_at
full_name
is_active
total_amount

❌ 잘못된 예
userId              -- camelCase
CreatedAt           -- PascalCase
fname               -- 불명확한 축약
amt                 -- 불명확한 축약
```

### Primary Key 컬럼

- **자신의 ID**: `id`로 표기

```sql
✅ 올바른 예
CREATE TABLE user (
    id UUID PRIMARY KEY
);

❌ 잘못된 예
CREATE TABLE user (
    user_id UUID PRIMARY KEY    -- 테이블명 포함 금지
);
```

### Foreign Key 컬럼

- **형식**: `{참조테이블}_id`

```sql
✅ 올바른 예
customer_id UUID REFERENCES customer(id)
company_id UUID REFERENCES company(id)
created_by UUID REFERENCES user(id)

❌ 잘못된 예
customer UUID           -- _id suffix 없음
cust_id UUID            -- 축약
fk_customer UUID        -- prefix
```

### 날짜/시간 컬럼

- **suffix**: `_at` (timestamp), `_date` (date)

```sql
✅ 올바른 예
created_at              -- 생성 일시
updated_at              -- 수정 일시
deleted_at              -- 삭제 일시
doc_date                -- 문서 일자
posting_date            -- 전기 일자
due_date                -- 만기 일자

❌ 잘못된 예
create_time             -- 잘못된 suffix
creation_date           -- 너무 긴 이름
date                    -- 너무 일반적
```

### Boolean 컬럼

- **prefix**: `is_`로 시작

```sql
✅ 올바른 예
is_active
is_deleted
is_approved

❌ 잘못된 예
active                  -- prefix 없음
deleted                 -- prefix 없음
flag_active             -- 잘못된 prefix
```

### 인덱스명

- **형식**: `ix_{table}_{columns}`

```sql
✅ 올바른 예
ix_user_email
ix_user_created_at
ix_sales_order_customer_id
ix_sales_order_customer_date    -- 복합 인덱스

❌ 잘못된 예
user_email_idx          -- 순서 잘못됨
idx_user_email          -- idx prefix
index_user_email        -- index prefix
```

### Primary Key 제약조건명

- **형식**: `pk_{table}`

```sql
✅ 올바른 예
CONSTRAINT pk_user PRIMARY KEY (id)
CONSTRAINT pk_customer PRIMARY KEY (id)

❌ 잘못된 예
CONSTRAINT user_pk              -- 순서 잘못됨
CONSTRAINT pkey_user            -- 잘못된 형식
```

### Foreign Key 제약조건명

- **형식**: `fk_{table}___{ref_table}`
- **구분자**: 언더스코어 3개 사용

```sql
✅ 올바른 예
CONSTRAINT fk_sales_order___customer
    FOREIGN KEY (customer_id) REFERENCES customer(id)

CONSTRAINT fk_sales_order___company
    FOREIGN KEY (company_id) REFERENCES company(id)

❌ 잘못된 예
CONSTRAINT fk_customer          -- ref_table 없음
CONSTRAINT fk_sales_order_customer  -- 구분자 부족
CONSTRAINT customer_fk          -- 순서 잘못됨
```

### Unique 제약조건명

- **형식**: `uk_{table}___{columns}`
- **구분자**: 언더스코어 3개 사용

```sql
✅ 올바른 예
CONSTRAINT uk_user___email UNIQUE (email)
CONSTRAINT uk_user___username UNIQUE (username)
CONSTRAINT uk_customer___tenant_code UNIQUE (tenant_id, code)

❌ 잘못된 예
CONSTRAINT uq_user_email        -- 잘못된 prefix
CONSTRAINT user_email_unique    -- 순서 잘못됨
CONSTRAINT unique_user_email    -- 잘못된 prefix
```

### Check 제약조건명

- **형식**: `ck_{table}___{logic}`

```sql
✅ 올바른 예
CONSTRAINT ck_user___status
    CHECK (status IN ('ACTIVE', 'INACTIVE'))

CONSTRAINT ck_sales_order___amount
    CHECK (total_amount >= 0)

CONSTRAINT ck_sales_order___dates
    CHECK (due_date >= doc_date)

❌ 잘못된 예
CONSTRAINT chk_user_status      -- 잘못된 prefix
CONSTRAINT user_status_check    -- 순서 잘못됨
```

## Git 브랜치명

### 브랜치 네이밍

- **형식**: `{type}/{description}`

```bash
✅ 올바른 예
feature/user-management
feature/api-authentication
bugfix/user-login-error
hotfix/security-patch
refactor/database-schema
docs/api-documentation
test/user-service

❌ 잘못된 예
user_management         -- type 없음
Feature/UserManagement  -- PascalCase
feature-user            -- 구분자 잘못됨
```

### 브랜치 타입

```bash
feature/    # 새 기능
bugfix/     # 버그 수정
hotfix/     # 긴급 수정
refactor/   # 리팩토링
docs/       # 문서
test/       # 테스트
chore/      # 기타 작업
```

## 커밋 메시지

### 커밋 메시지 형식

- **형식**: `{type}: {description}`

```bash
✅ 올바른 예
feat: 사용자 관리 기능 추가
fix: 로그인 에러 수정
refactor: 데이터베이스 스키마 개선
docs: API 문서 업데이트
test: 사용자 서비스 테스트 추가

❌ 잘못된 예
added user management   -- type 없음
Fix: login error        -- 대문자
사용자 추가              -- 한글만
```

### 커밋 타입

```bash
feat:       # 새 기능
fix:        # 버그 수정
refactor:   # 리팩토링
docs:       # 문서
test:       # 테스트
chore:      # 기타 작업
style:      # 코드 스타일
perf:       # 성능 개선
```

## 환경 변수명

### 형식

- **형식**: `UPPER_SNAKE_CASE`
- **명확한 의미**: 축약 최소화

```bash
✅ 올바른 예
DATABASE_URL
REDIS_URL
SECRET_KEY
API_BASE_URL
OPENAI_API_KEY
NEXT_PUBLIC_API_URL

❌ 잘못된 예
databaseUrl             # camelCase
db_url                  # 불명확한 축약
DATABASE-URL            # kebab-case
```

### 프론트엔드 Public 변수

- **prefix**: `NEXT_PUBLIC_`로 시작

```bash
✅ 올바른 예
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_ENVIRONMENT

❌ 잘못된 예
API_URL                 # prefix 없음 (노출 안 됨)
PUBLIC_API_URL          # 잘못된 prefix
```

## 네이밍 체크리스트

### 백엔드

- [ ] 디렉토리는 snake_case, 단수형
- [ ] 파일은 snake_case.py
- [ ] 클래스는 PascalCase
- [ ] 함수/변수는 snake_case
- [ ] 상수는 UPPER_SNAKE_CASE
- [ ] Private는 \_underscore prefix
- [ ] 라우터 prefix는 복수형

### 프론트엔드

- [ ] 디렉토리는 kebab-case, 단수형
- [ ] 컴포넌트 파일은 kebab-case.tsx
- [ ] 컴포넌트명은 PascalCase
- [ ] 함수/변수는 camelCase
- [ ] 상수는 UPPER_SNAKE_CASE
- [ ] 훅은 use- prefix
- [ ] Boolean은 is/has/can prefix

### 데이터베이스

- [ ] 스키마는 lowercase 축약형
- [ ] 테이블은 snake_case, 단수형
- [ ] 컬럼은 snake_case
- [ ] 자신의 ID는 id
- [ ] 외래키는 {table}\_id
- [ ] 인덱스는 ix*{table}*{columns}
- [ ] 제약조건은 {type}\_{table}\_\_\_{target}

## 참고 사항

### 일관성 우선

- 기존 코드베이스의 패턴을 따름
- 새로운 패턴 도입 시 팀 합의 필요

### 명확성 우선

- 축약보다는 명확한 전체 이름 사용
- 의미가 명확하지 않으면 주석 추가

### 검색 가능성

- 고유한 이름 사용 (검색 시 쉽게 찾을 수 있도록)
- 너무 일반적인 이름 지양 (data, info, temp 등)

### 도메인 용어 사용

- 비즈니스 도메인의 실제 용어 사용
- 기술 용어와 비즈니스 용어 구분
