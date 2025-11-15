# Manager Web - GraphQL Migration (Apollo Client)

## 개요

manager-web 애플리케이션이 REST API에서 **Apollo Client 기반 GraphQL**로 마이그레이션되었습니다.

## Apollo Client를 선택한 이유

1. **React와의 완벽한 통합**: React Hooks를 통한 자연스러운 데이터 관리
2. **강력한 캐싱**: 자동 캐시 관리로 네트워크 요청 최소화
3. **DevTools 지원**: Apollo Client DevTools로 쉬운 디버깅
4. **옵티미스틱 UI**: 빠른 사용자 경험 제공
5. **에러 처리**: Link 시스템을 통한 체계적인 에러 관리

## 변경 사항

### 새로 추가된 파일

1. **Apollo Client 설정**

   - `src/lib/apollo-client.ts` - Apollo Client 인스턴스 및 설정
   - `src/lib/apollo-provider.tsx` - Apollo Provider 컴포넌트

2. **GraphQL 쿼리/뮤테이션** (Apollo Client용)

   - `src/lib/graphql/users.graphql.ts` - Users 쿼리 및 뮤테이션
   - `src/lib/graphql/roles.graphql.ts` - Roles 쿼리 및 뮤테이션
   - `src/lib/graphql/sessions.graphql.ts` - Sessions 쿼리 및 뮤테이션
   - `src/lib/graphql/permissions.graphql.ts` - Permissions 쿼리

3. **Apollo Hooks**

   - `src/features/idam/users/hooks/use-users.hooks.ts` - Users React Hooks

4. **GraphQL 서비스** (하위 호환용)
   - `src/features/idam/users/services/users.service.graphql.ts` - Apollo 기반 서비스

### 수정된 파일

1. **패키지**

   - `package.json` - Apollo Client 의존성 추가:
     - `@apollo/client` ^3.11.8
     - `graphql` ^16.9.0
   - `graphql-request` 제거됨

2. **환경 변수**
   - `.env.local` - `NEXT_PUBLIC_GRAPHQL_URL` 사용
   - `.env.example` - 예제 환경 변수 파일

## 설치

```bash
# 루트 디렉토리에서
cd /home/itjee/workspace/cxg
pnpm install

# 또는 manager-web 디렉토리에서
cd apps/manager-web
pnpm install
```

## 환경 변수 설정

`.env.local` 파일:

```env
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8100/graphql
NEXT_PUBLIC_APP_NAME=CXG Platform Manager
```

## 사용 방법

### 1. Apollo Provider 설정 (App 최상위)

```typescript
// app/layout.tsx
import { ApolloProvider } from "@/lib/apollo-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ApolloProvider>{children}</ApolloProvider>
      </body>
    </html>
  );
}
```

### 2. React Hooks 사용 (권장)

```typescript
import {
  useUsers,
  useCreateUser,
} from "@/features/idam/users/hooks/use-users.hooks";

function UsersPage() {
  // 목록 조회
  const { data, loading, error, refetch } = useUsers({
    limit: 20,
    offset: 0,
    status: "ACTIVE",
  });

  // 생성
  const [createUser, { loading: creating }] = useCreateUser();

  const handleCreate = async () => {
    const result = await createUser({
      variables: {
        input: {
          userType: "TENANT",
          fullName: "홍길동",
          email: "hong@example.com",
          username: "hong",
          password: "password123",
        },
      },
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.users.map((user) => (
        <div key={user.id}>{user.fullName}</div>
      ))}
    </div>
  );
}
```

### 3. 서비스 레이어 사용 (기존 코드 호환)

```typescript
import { usersService } from "@/features/idam/users/services";

// 기존 코드 그대로 사용 가능
const result = await usersService.listUsers({
  page: 1,
  pageSize: 20,
  active: true,
});
```

### 4. Apollo Client 직접 사용

```typescript
import { apolloClient } from "@/lib/apollo-client";
import { GET_USERS } from "@/lib/graphql";

const { data } = await apolloClient.query({
  query: GET_USERS,
  variables: { limit: 20 },
});
```

## Apollo Client 주요 기능

### 1. 자동 캐싱

Apollo Client가 자동으로 데이터를 캐싱합니다:

```typescript
// 첫 번째 호출 - 서버에서 데이터 가져옴
const { data } = useUser("user-id");

// 두 번째 호출 - 캐시에서 즉시 반환
const { data } = useUser("user-id");
```

### 2. 옵티미스틱 UI

사용자 경험 향상을 위한 낙관적 업데이트:

```typescript
const [updateUser] = useUpdateUser({
  optimisticResponse: {
    updateUser: {
      __typename: "User",
      id: userId,
      fullName: newName,
      // ... 나머지 필드
    },
  },
});
```

### 3. 폴링 (실시간 데이터)

주기적으로 데이터 갱신:

```typescript
const { data } = useUsers(
  { status: "ACTIVE" },
  { pollInterval: 5000 } // 5초마다 갱신
);
```

### 4. 캐시 업데이트

Mutation 후 캐시 자동 업데이트:

```typescript
const [createUser] = useCreateUser({
  update(cache, { data }) {
    cache.modify({
      fields: {
        Users(existingUsers = []) {
          const newUserRef = cache.writeFragment({
            data: data.createUser,
            fragment: gql`
              fragment NewUser on User {
                id
                fullName
              }
            `,
          });
          return [newUserRef, ...existingUsers];
        },
      },
    });
  },
});
```

## GraphQL 스키마

- GraphQL Endpoint: `http://localhost:8100/graphql`
- GraphQL Playground: `http://localhost:8100/graphql` (개발 모드)

### 주요 쿼리

#### Users

- `Users` - 사용자 목록 조회
- `User(id)` - 사용자 상세 조회

#### Roles

- `Roles` - 역할 목록 조회
- `Role(id)` - 역할 상세 조회

#### Sessions

- `Sessions` - 세션 목록 조회
- `Session(id)` - 세션 상세 조회

#### Permissions

- `Permissions` - 권한 목록 조회
- `Permission(id)` - 권한 상세 조회

### 주요 뮤테이션

#### Users

- `createUser` - 사용자 생성
- `updateUser` - 사용자 수정

#### Roles

- `createRole` - 역할 생성
- `updateRole` - 역할 수정

#### Sessions

- `revokeSession` - 세션 폐기
- `deleteSession` - 세션 삭제

## Apollo Client DevTools

Chrome 확장 프로그램 설치:
https://chrome.google.com/webstore/detail/apollo-client-devtools

기능:

- GraphQL 쿼리 실행
- 캐시 상태 확인
- Mutation 실행
- 성능 모니터링

## 마이그레이션 가이드

다른 모듈을 Apollo Client로 마이그레이션:

### 1. GraphQL 쿼리 정의

```typescript
// src/lib/graphql/[module].graphql.ts
import { gql } from "@apollo/client";

export const GET_ITEMS = gql`
  query GetItems($limit: Int) {
    items(limit: $limit) {
      id
      name
    }
  }
`;
```

### 2. React Hooks 생성

```typescript
// src/features/[module]/hooks/use-[module].hooks.ts
import { useQuery } from "@apollo/client";
import { GET_ITEMS } from "@/lib/graphql/[module].graphql";

export function useItems(limit?: number) {
  return useQuery(GET_ITEMS, {
    variables: { limit },
  });
}
```

### 3. 컴포넌트에서 사용

```typescript
function ItemsPage() {
  const { data, loading, error } = useItems(20);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return <ItemsList items={data.items} />;
}
```

## 주의사항

1. **인증 토큰**

   - Apollo Client가 자동으로 JWT 토큰을 헤더에 추가
   - localStorage 또는 쿠키에서 `access_token`을 가져옴

2. **에러 처리**

   - `onError` Link를 통한 전역 에러 처리
   - 401 에러 시 자동 로그인 페이지 리다이렉트

3. **캐싱 정책**

   - `cache-and-network`: 캐시 먼저 보여주고 서버 데이터로 업데이트
   - `network-only`: 항상 서버에서 최신 데이터 가져오기
   - `cache-first`: 캐시 우선, 없으면 서버 요청

4. **SSR 지원**
   - `initializeApollo` 함수로 SSR/SSG 지원
   - Next.js getServerSideProps에서 사용 가능

## 성능 최적화

### 1. Fragment 사용

```typescript
const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    fullName
    email
  }
`;

const GET_USERS = gql`
  query GetUsers {
    Users {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;
```

### 2. Batch 요청

```typescript
import { ApolloLink } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";

const batchLink = new BatchHttpLink({
  uri: GRAPHQL_ENDPOINT,
  batchMax: 10,
  batchInterval: 20,
});
```

### 3. Persisted Queries

프로덕션 환경에서 쿼리 크기 최소화

## 롤백

Apollo Client에서 graphql-request로 되돌리려면:

```bash
cd apps/manager-web
pnpm remove @apollo/client
pnpm add graphql-request
# 백업 파일 복원
```

## 참고 자료

- [Apollo Client 공식 문서](https://www.apollographql.com/docs/react/)
- [Apollo Client React Hooks](https://www.apollographql.com/docs/react/api/react/hooks/)
- [Apollo Client Caching](https://www.apollographql.com/docs/react/caching/overview/)
- [Strawberry GraphQL (Backend)](https://strawberry.rocks/)
