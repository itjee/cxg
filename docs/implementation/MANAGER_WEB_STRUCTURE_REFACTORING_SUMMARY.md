# Manager-Web 구조 리팩토링 요약

**작업일**: 2025-01-06  
**목표**: Tenants-Web과 동일한 구조로 통일

---

## 📦 제공된 도구

### 1. 상세 가이드 문서
📄 `/docs/implementation/MANAGER_WEB_STRUCTURE_REFACTORING_GUIDE.md`

- 목표 구조 설명
- 단계별 리팩토링 가이드
- 코딩 스타일 가이드
- 파일명 규칙
- 예제 코드 (TypeScript, React, Components)

### 2. 자동화 스크립트
🔧 `/scripts/create-feature.sh`

```bash
# 사용법
./scripts/create-feature.sh {module} {entity}

# 예시
./scripts/create-feature.sh idam users
./scripts/create-feature.sh tnnt tenants
```

**생성되는 구조:**
```
features/{module}/{entity}/
├── components/
│   └── index.ts
├── hooks/
│   └── use-{entity}.ts        # ✅ 자동 생성
├── services/
│   └── {entity}.service.ts    # ✅ 자동 생성
├── types/
│   └── {entity}.types.ts      # ✅ 자동 생성
├── stores/
│   └── {entity}.store.ts      # ✅ 자동 생성
└── index.ts                   # ✅ 자동 생성
```

---

## 🎯 목표 구조

### Tenants-Web 표준 (목표)
```
features/{모듈}/{엔티티}/
├── components/          # UI 컴포넌트
│   ├── {entity}-header.tsx
│   ├── {entity}-stats.tsx
│   ├── {entity}-filters.tsx
│   ├── {entity}-table.tsx
│   ├── {entity}-edit.tsx
│   └── index.ts
├── hooks/               # React Hooks
│   └── use-{entity}.ts
├── services/            # API 서비스
│   └── {entity}.service.ts
├── types/               # TypeScript 타입
│   └── {entity}.types.ts
├── stores/              # Zustand 상태관리
│   └── {entity}.store.ts
└── index.ts             # 통합 export
```

---

## 📋 리팩토링 체크리스트

### Phase 1: 핵심 모듈 (우선순위 1)
- [ ] `idam/user` → `idam/users`
- [ ] `idam/role` → `idam/roles`
- [ ] `idam/permission` → `idam/permissions`
- [ ] `tnnt/tenant` → `tnnt/tenants`
- [ ] `tnnt/subscription` → `tnnt/subscriptions`

### Phase 2: 자주 사용하는 모듈 (우선순위 2)
- [ ] `bill/invoice` → `bill/invoices`
- [ ] `bill/payment` → `bill/payments`
- [ ] `noti/notification` → `noti/notifications`
- [ ] `noti/campaign` → `noti/campaigns`
- [ ] `supt/ticket` → `supt/tickets`

### Phase 3: 나머지 모듈
- [ ] 기타 모듈들 (20+ 모듈)

---

## 🚀 빠른 시작

### 1. 새로운 Feature 생성
```bash
cd /home/itjee/workspace/cxg

# IDAM Users 생성
./scripts/create-feature.sh idam users

# 생성 결과 확인
tree apps/manager-web/src/features/idam/users
```

### 2. 기존 Feature 마이그레이션
```bash
# 1. 새 구조 생성
./scripts/create-feature.sh idam users

# 2. 기존 파일 이동
mv apps/manager-web/src/features/idam/user/types/* \
   apps/manager-web/src/features/idam/users/types/

mv apps/manager-web/src/features/idam/user/services/* \
   apps/manager-web/src/features/idam/users/services/

# 3. 파일명 변경 (단수 → 복수)
cd apps/manager-web/src/features/idam/users/types
mv user.types.ts users.types.ts

# 4. Import 경로 수정
# (수동 또는 IDE의 refactor 기능 사용)

# 5. 구 폴더 백업
mv apps/manager-web/src/features/idam/user \
   apps/manager-web/src/features/idam/user.old
```

---

## 📝 주요 변경 사항

### 1. 폴더명 - 복수형
```diff
- features/idam/user/
+ features/idam/users/

- features/tnnt/tenant/
+ features/tnnt/tenants/
```

### 2. 파일명 - Kebab-case
```diff
- UsersTable.tsx
+ users-table.tsx

- useUsers.ts
+ use-users.ts

- user.service.ts
+ users.service.ts
```

### 3. stores 폴더 추가
```diff
  features/{module}/{entity}/
  ├── components/
  ├── hooks/
  ├── services/
  ├── types/
+ ├── stores/              # ✅ 추가
+ │   └── {entity}.store.ts
  └── index.ts
```

### 4. index.ts 통합 export
```typescript
// Before: 없음

// After: 모든 항목 통합 export
export * from "./components";
export * from "./hooks/use-users";
export { userService } from "./services/users.service";
export type * from "./types/users.types";
export { useUserStore } from "./stores/users.store";
```

---

## 🎨 코딩 스타일

### JSDoc 주석 필수
```typescript
/**
 * @file users.service.ts
 * @description 사용자 관리 서비스 레이어
 */
```

### 타입 정의 명확히
```typescript
// ❌ Bad
const data: any = await api.get('/users');

// ✅ Good
const response = await api.get<ApiResponse<UserListResponse>>('/users');
```

### 일관된 네이밍
```typescript
// Services: {entity}Service
export const userService = { ... };

// Hooks: use{Entity}
export function useUsers() { ... }

// Components: {Entity}{Component}
export function UsersTable() { ... }

// Stores: use{Entity}Store
export const useUserStore = create<UserStore>()( ... );
```

---

## ✅ 완료 기준

각 모듈이 다음 조건을 만족하면 완료:

1. **구조**
   - [x] 복수형 폴더명
   - [x] 모든 하위 폴더 존재 (components, hooks, services, types, stores)
   - [x] index.ts 통합 export

2. **파일명**
   - [x] Kebab-case 사용
   - [x] 명확한 확장자 (.types.ts, .service.ts, .store.ts)

3. **코드**
   - [x] JSDoc 주석
   - [x] TypeScript 타입 명확
   - [x] 에러 처리 표준화

4. **테스트**
   - [x] TypeScript 컴파일 성공
   - [x] Import 경로 정상
   - [x] 빌드 성공

---

## 📚 참고 문서

- **상세 가이드**: `/docs/implementation/MANAGER_WEB_STRUCTURE_REFACTORING_GUIDE.md`
- **Auth 리팩토링 예시**: `/docs/implementation/MANAGER_WEB_AUTH_REFACTORING.md`
- **Tenants-Web 참조**: `apps/tenants-web/src/features/`

---

## 💡 팁

### 1. 점진적 마이그레이션
- 한 번에 모든 모듈을 변경하지 말고, 하나씩 테스트하며 진행
- 기존 폴더는 `.old` 접미사로 백업 유지

### 2. IDE 리팩토링 도구 활용
- VSCode: F2 (Rename Symbol)
- WebStorm: Shift+F6 (Refactor > Rename)
- Import 경로 자동 수정

### 3. Git 커밋 단위
- 모듈별로 커밋 분리
- 커밋 메시지: `refactor(idam): migrate user to users structure`

### 4. 팀 공지
- 리팩토링 시작 전 팀원들에게 공지
- 충돌 최소화를 위해 작업 브랜치 분리

---

**예상 소요 시간**: 4-6주 (전체 모듈 완료 기준)  
**권장 방식**: 모듈별로 하나씩 점진적 리팩토링

---

**작성**: 2025-01-06  
**문의**: 추가 지원 필요 시 개발팀에 요청
