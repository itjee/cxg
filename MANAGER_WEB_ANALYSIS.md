# manager-web 무한루프 문제 분석 ✅

## 📊 비교: manager-web vs tenants-web

### 1. 기술 스택 차이

| 항목 | manager-web | tenants-web |
|------|------------|-------------|
| **상태 관리** | Apollo Client (GraphQL) | TanStack Query (REST) |
| **캐시 전략** | Apollo 자동 캐싱 | TanStack Query 캐싱 |
| **API** | GraphQL (쿼리/뮤테이션) | REST (GET/POST/PUT/DELETE) |
| **Hooks** | Apollo useQuery/useMutation | TanStack useQuery/useMutation |

### 2. manager-web의 구현 방식

#### API 호출 흐름
```
UsersPage
  ├─ useUsers() → GraphQL Query (GET_USERS)
  ├─ useCreateUser() → GraphQL Mutation (CREATE_USER)
  └─ useUpdateUser() → GraphQL Mutation (UPDATE_USER)
      └─ refetchQueries: [{ query: GET_USERS }]
```

#### 뮤테이션 설정
```typescript
export function useCreateUser() {
  return useMutation<
    { createUser: User },
    CreateUserVariables
  >(CREATE_USER, {
    refetchQueries: [
      {
        query: GET_USERS,
        variables: { limit: 20, offset: 0 },
      },
    ],
  });
}
```

**key 특징:**
- ✅ `refetchQueries` 사용 (명시적 캐시 무효화)
- ✅ 정확한 쿼리 정의 (limit, offset 고정)
- ✅ Apollo 자동 캐시 관리

### 3. tenants-web의 구현 방식

#### API 호출 흐름
```
UsersPage
  ├─ useUsers() → TanStack Query (listUsers)
  ├─ useCreateUser() → TanStack Mutation
  │   ├─ onMutate: setQueriesData() ❌ 문제!
  │   ├─ onSuccess: invalidateQueries()
  │   └─ onSettled: invalidateQueries() (중복)
  └─ useDeleteUser(), useToggleUserActive() (동일 문제)
```

#### 뮤테이션 설정 (수정 전)
```typescript
export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });
      const previousUsers = queryClient.getQueryData(usersKeys.lists());

      // ❌ 문제: setQueriesData 사용 (모든 list 쿼리 영향)
      queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: [                        // ❌ 필드명 오류
            ...(old.data || []),
            { ...newUser, id: "temp-id" },
          ],
        };
      });
      return { previousUsers };
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });  // 무효화 1
      options?.onSuccess?.(newUser);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });  // 무효화 2 (중복)
    },
  });
}
```

**문제점:**
- ❌ `setQueriesData()` 오용 (모든 list 쿼리 수정)
- ❌ 필드명 오류 (`data` vs `items`)
- ❌ 중복 invalidation (`onSuccess` + `onSettled`)

## ✅ manager-web이 안전한 이유

### 1. Apollo Client의 자동 캐시 관리
```typescript
// Apollo는 뮤테이션 응답을 자동으로 캐시에 병합
mutation CreateUser {
  createUser(...) {
    id        // ← 이 필드로 기존 캐시 항목 찾음
    username
    email
    ...
  }
}
```

캐시 키: `User:${id}` (정규화된 캐시 키)
- 자동으로 관련 쿼리 업데이트됨

### 2. refetchQueries의 명시적 제어
```typescript
refetchQueries: [
  {
    query: GET_USERS,
    variables: { limit: 20, offset: 0 },  // ← 명시적 파라미터
  },
],
```

- 정확한 쿼리만 refetch
- prefix 매칭 없음
- 무한루프 없음

### 3. 단순한 에러 처리
```typescript
const handleSubmit = async (formData: any) => {
  try {
    if (selectedId) {
      await updateUser({ variables: { ... } });
      toast.success("수정 완료");
      closeForm();
    } else {
      await createUser({ variables: { ... } });
      toast.success("생성 완료");
      closeForm();
    }
  } catch (error) {
    // 에러 처리
  }
};
```

- 명확한 흐름
- 복잡한 onMutate 로직 없음

## ❌ tenants-web이 문제가 있는 이유

### 1. TanStack Query의 수동 캐시 관리
```typescript
// 개발자가 직접 캐시를 수정해야 함
queryClient.setQueriesData({ queryKey: usersKeys.lists() }, (old) => {
  // ← 부정확한 쿼리 선택
  return { ...old, data: [...] };
});
```

- 수동 관리 = 실수 가능성 높음
- prefix 매칭으로 인한 의도하지 않은 업데이트

### 2. Optimistic Update 구현의 복잡성
```typescript
onMutate: async (newUser) => {
  // 1. 쿼리 취소
  // 2. 이전 데이터 스냅샷
  // 3. 낙관적 업데이트
  // 4. 복구 로직
  // = 실수하기 쉬운 구조
}
```

### 3. 복수의 invalidation 포인트
```typescript
onSuccess: () => invalidate();
onSettled: () => invalidate();  // ← 중복!
// 또는
onMutate: () => cancelQueries();  // ← 캐시 즉시 변경
onSuccess: () => invalidate();    // ← 다시 변경
// = 변화 감지 → 리페치 반복
```

## 📋 권장사항

### manager-web (현재)
✅ **문제 없음**
- Apollo의 자동 캐시 관리 활용
- refetchQueries로 명시적 제어
- 안정적인 구현

### tenants-web (수정 완료)
✅ **이미 수정됨**
1. `setQueriesData` → `setQueryData` (정확한 쿼리 선택)
2. 필드명 수정: `data` → `items`
3. `onSettled` 제거 (중복 제거)

### 향후 개발 시
**TanStack Query 사용 시:**
```typescript
// ✅ 올바른 패턴
onMutate: (newData) => {
  const previous = queryClient.getQueryData(EXACT_KEY);  // 정확한 키
  queryClient.setQueryData(EXACT_KEY, newData);          // 정확한 키
  return { previous };
},
onError: (err, variables, context) => {
  if (context?.previous) {
    queryClient.setQueryData(EXACT_KEY, context.previous);  // 정확한 키
  }
},
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: PREFIX_KEYS });  // 무효화는 필요시만
}

// ❌ 피해야 할 패턴
onMutate: () => queryClient.setQueriesData({ queryKey: ['prefix'] }, ...);
onSettled: () => queryClient.invalidateQueries(...);  // onSuccess와 중복
```

## 🎯 최종 결론

| 상황 | 상태 | 조치 |
|------|------|------|
| **manager-web** | ✅ 안전 | 점검 완료, 수정 불필요 |
| **tenants-web** | ✅ 수정됨 | 3개 함수 수정 완료 |

### 무한루프 문제
- **manager-web**: Apollo의 자동 캐시 관리로 인해 발생 가능성 낮음
- **tenants-web**: TanStack Query 오용으로 인해 발생 → ✅ 수정 완료

### 결론
두 애플리케이션 모두 안정적입니다!
- manager-web은 처음부터 올바르게 구현됨
- tenants-web은 무한루프 문제를 수정함
