# 사용자 관리 페이지 - 추가 버튼 무한루프 문제 분석 및 해결

## 문제 증상
- 사용자 관리 페이지에서 "추가" 버튼 클릭 후 폼 제출 시 화면이 무한히 로딩
- 브라우저 개발자 도구 Network 탭에서 API 요청이 반복됨

## 무한루프 발생 원인

### 1. 근본 원인: TanStack Query의 캐시 전략 오류

파일: `/home/itjee/workspace/cxg/apps/tenants-web/src/features/sys/users/hooks/use-users.ts`

```typescript
// ❌ 문제 코드 (257-296줄의 useCreateUser 함수)
onMutate: async (newUser) => {
  // ...
  // setQueriesData 사용이 문제!
  queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
    if (!old) return old;
    return {
      ...old,
      data: [
        ...(old.data || []),
        { ...newUser, id: "temp-id", createdAt: new Date().toISOString() },
      ],
    };
  });
  return { previousUsers };
},
onSuccess: (newUser) => {
  queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
  options?.onSuccess?.(newUser);
},
```

### 2. 무한루프 메커니즘

```
┌─────────────────────────────────────────────────────┐
│ 사용자 추가 버튼 클릭                                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │ createMutation.mutate() │
        │ (API 요청 시작)         │
        └────────────┬───────────┘
                     │
                     ▼
    ┌────────────────────────────┐
    │ onMutate 실행              │
    │ - cancelQueries 호출       │
    │ - setQueriesData 호출      │ ◄── 캐시 수정
    └────────────┬───────────────┘
                 │
                 ▼
      ┌───────────────────────┐
      │ 캐시 데이터 변경 감지 │
      │ (리액트 리렌더)       │
      └───────────┬───────────┘
                  │
                  ▼
   ┌──────────────────────────────┐
   │ useUsers 훅의 쿼리 재실행     │
   │ (stale 상태로 변경됨)        │
   └──────────────┬───────────────┘
                  │
                  ▼
    ┌────────────────────────┐
    │ API 다시 호출          │
    │ (listUsers 재조회)     │
    └────────┬───────────────┘
             │
             ▼
  API 응답 도착 → 캐시 업데이트 → 다시 변경 감지 → ... ♾️
```

### 3. 구체적인 문제점

#### 문제 1: `setQueriesData` vs `setQueryData`
- **`setQueriesData`**: 여러 쿼리를 일괄 업데이트 (prefix 매칭)
  - `queryKey: ['users', 'list']` 는 모든 list 쿼리를 매칭
  - 페이지 1, 2, 3, ... 의 쿼리 모두가 업데이트됨

- **`setQueryData`**: 특정 단일 쿼리만 업데이트
  - `queryKey: ['users', 'list', params]` 는 정확한 쿼리만 업데이트

#### 문제 2: 캐시 필드명 오류
```javascript
// ❌ 잘못된 필드명
data: [...(old.data || [])]  // "data" 필드?

// ✅ 올바른 필드명
items: [...(old.items || [])]  // "items" 필드
```

응답 구조:
```typescript
// UserListResponse 타입
{
  items: User[],      // ← "data" 아님
  total: number,
  page: number,
  page_size: number,
  total_pages: number
}
```

#### 문제 3: onSettled의 연쇄 invalidation
```typescript
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
},
```
- Mutation 완료 후 다시 모든 list 쿼리를 invalidate
- 이미 onSuccess에서 invalidate했으므로 중복
- stale 상태 → 백그라운드 리페치 → 캐시 변경 → 반복

## 해결 방법

### 변경사항 요약

| 항목 | 문제 | 해결 |
|------|------|------|
| **함수** | `setQueriesData` | `setQueryData` |
| **쿼리키** | `usersKeys.lists()` | `usersKeys.list()` |
| **필드명** | `data` | `items` |
| **onSettled** | 중복 invalidation | 제거 |

### 수정 코드

```typescript
export function useCreateUser(options?: {
  onSuccess?: (user: User) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onMutate: async (newUser) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      // 이전 데이터 스냅샷 (첫 번째 페이지만 취급)
      const previousUsers = queryClient.getQueryData(usersKeys.list());

      // ✅ Optimistic Update (첫 번째 페이지만 업데이트)
      queryClient.setQueryData(usersKeys.list(), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          items: [
            { ...newUser, id: "temp-id", createdAt: new Date().toISOString() },
            ...(old.items || []),
          ],
          total: (old.total || 0) + 1,
          total_pages: Math.ceil(((old.total || 0) + 1) / (old.page_size || 10)),
        };
      });

      return { previousUsers };
    },
    onSuccess: (newUser) => {
      // 모든 list 쿼리 무효화하여 서버에서 재조회
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      options?.onSuccess?.(newUser);
    },
    onError: (error, variables, context) => {
      // 롤백
      if (context?.previousUsers) {
        queryClient.setQueryData(usersKeys.list(), context.previousUsers);
      }
      options?.onError?.(error as Error);
    },
    retry: 1,
  });
}
```

### 주요 변경점

1. **`setQueriesData` → `setQueryData`**
   - 특정 쿼리만 업데이트하여 다른 쿼리의 리페치 방지

2. **`usersKeys.lists()` → `usersKeys.list()`**
   - prefix 매칭 대신 정확한 쿼리 지정

3. **필드명 수정: `data` → `items`**
   - 응답 구조에 맞는 올바른 필드명 사용

4. **메타데이터 업데이트**
   - `total`, `total_pages` 값 업데이트하여 일관성 유지

5. **`onSettled` 제거**
   - `onSuccess`에서 이미 invalidate하므로 불필요
   - 중복 invalidation 제거로 무한루프 방지

## 검증 방법

### 테스트 시나리오

1. **기본 추가 테스트**
   ```
   1. "추가" 버튼 클릭 → Drawer 오픈
   2. 폼 입력 후 "저장" 버튼 클릭
   3. 로딩 상태 표시 (3-5초)
   4. 성공 토스트 표시
   5. 목록에 새 사용자 추가됨 (첫 번째 행)
   6. Drawer 자동 닫힘
   ```

2. **캐시 확인**
   - React Query DevTools에서 쿼리 상태 모니터링
   - Mutation 중 하나의 쿼리만 업데이트되어야 함

3. **네트워크 요청 확인**
   - 브라우저 DevTools Network 탭
   - POST 요청 1회만 보내야 함
   - 반복되는 GET 요청 없어야 함

## 기대 효과

- ✅ 무한루프 해결
- ✅ API 요청 1회로 감소
- ✅ 사용자 경험 개선 (빠른 응답)
- ✅ 서버 부하 감소
- ✅ 네트워크 대역폭 절약

## 참고: TanStack Query 쿼리 키 구조

```typescript
const usersKeys = {
  all: ["users"],                    // 모든 users 쿼리
  lists: () => ["users", "list"],    // 모든 list 쿼리 (prefix)
  list: (params) => ["users", "list", params],  // 특정 list 쿼리 (정확)
  details: () => ["users", "detail"], // 모든 detail 쿼리 (prefix)
  detail: (id) => ["users", "detail", id], // 특정 detail 쿼리 (정확)
};

// invalidateQueries는 prefix 매칭 사용
queryClient.invalidateQueries({
  queryKey: ["users", "list"]  // ["users", "list", {...}]도 모두 매칭됨
});
```

## 추가 참고사항

다른 mutation 함수들도 동일한 패턴으로 수정이 필요할 수 있습니다:
- `useUpdateUser` (현재는 `setQueryData` 사용으로 OK)
- `useDeleteUser` (현재는 `setQueriesData` 사용으로 수정 필요)
- `useToggleUserActive` (현재는 `setQueriesData` 사용으로 수정 필요)

이들 함수도 검토하여 필요시 동일한 수정이 필요합니다.
