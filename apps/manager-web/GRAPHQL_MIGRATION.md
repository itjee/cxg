# Manager Web - GraphQL Migration

## 개요

manager-web 애플리케이션이 REST API에서 GraphQL로 마이그레이션되었습니다.

## 변경 사항

### 새로 추가된 파일

1. **GraphQL 클라이언트**
   - `src/lib/graphql-client.ts` - GraphQL 클라이언트 설정 및 인증 처리

2. **GraphQL 쿼리/뮤테이션**
   - `src/lib/graphql/users.graphql.ts` - Users 쿼리 및 뮤테이션
   - `src/lib/graphql/roles.graphql.ts` - Roles 쿼리 및 뮤테이션
   - `src/lib/graphql/sessions.graphql.ts` - Sessions 쿼리 및 뮤테이션
   - `src/lib/graphql/permissions.graphql.ts` - Permissions 쿼리

3. **GraphQL 서비스**
   - `src/features/idam/users/services/users.service.graphql.ts` - GraphQL 기반 Users 서비스

### 수정된 파일

1. **서비스 레이어**
   - `src/features/idam/users/services/users.service.ts` - GraphQL 서비스를 사용하도록 변경
   - 기존 REST 버전은 `users.service.rest.ts.backup`으로 백업됨

2. **환경 변수**
   - `.env.local` - `NEXT_PUBLIC_GRAPHQL_URL` 추가
   - `.env.example` - 예제 환경 변수 파일 추가

3. **패키지**
   - `package.json` - GraphQL 관련 의존성 추가:
     - `graphql` ^16.9.0
     - `graphql-request` ^7.1.2

## 설치

```bash
# 루트 디렉토리에서
pnpm install

# 또는 manager-web 디렉토리에서
cd apps/manager-web
pnpm install
```

## 환경 변수 설정

`.env.local` 파일에 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:8100/api/v1
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8100/graphql
NEXT_PUBLIC_APP_NAME=CXG Platform Manager
```

## 사용 방법

### GraphQL 쿼리 예제

```typescript
import { graphqlClient } from '@/lib/graphql-client';
import { GET_MANAGER_USERS } from '@/lib/graphql/users.graphql';

// 사용자 목록 조회
const response = await graphqlClient.request(GET_MANAGER_USERS, {
  limit: 20,
  offset: 0,
  status: 'ACTIVE'
});
```

### 서비스 레이어 사용 (기존 코드와 호환)

```typescript
import { usersService } from '@/features/idam/users/services';

// 기존 코드 그대로 사용 가능
const result = await usersService.listUsers({
  page: 1,
  pageSize: 20,
  active: true
});
```

## GraphQL 스키마

Backend-API의 GraphQL 스키마는 다음 URL에서 확인할 수 있습니다:
- GraphQL Endpoint: `http://localhost:8100/graphql`
- GraphQL Playground: `http://localhost:8100/graphql` (개발 모드)

### 주요 쿼리

#### Users
- `managerUsers` - 사용자 목록 조회
- `managerUser(id)` - 사용자 상세 조회

#### Roles
- `managerRoles` - 역할 목록 조회
- `managerRole(id)` - 역할 상세 조회

#### Sessions
- `managerSessions` - 세션 목록 조회
- `managerSession(id)` - 세션 상세 조회

#### Permissions
- `managerPermissions` - 권한 목록 조회
- `managerPermission(id)` - 권한 상세 조회

### 주요 뮤테이션

#### Users
- `createManagerUser` - 사용자 생성
- `updateManagerUser` - 사용자 수정

#### Roles
- `createManagerRole` - 역할 생성
- `updateManagerRole` - 역할 수정

#### Sessions
- `revokeManagerSession` - 세션 폐기
- `deleteManagerSession` - 세션 삭제

## 마이그레이션 가이드

다른 모듈을 GraphQL로 마이그레이션하려면:

1. **GraphQL 쿼리 정의**
   ```typescript
   // src/lib/graphql/[module].graphql.ts
   export const GET_ITEMS = gql`
     query GetItems {
       items {
         id
         name
       }
     }
   `;
   ```

2. **GraphQL 서비스 생성**
   ```typescript
   // src/features/[module]/services/[module].service.graphql.ts
   import { graphqlClient } from '@/lib/graphql-client';
   
   export const moduleGraphQLService = {
     async listItems() {
       return await graphqlClient.request(GET_ITEMS);
     }
   };
   ```

3. **기존 서비스 업데이트**
   ```typescript
   // src/features/[module]/services/[module].service.ts
   import { moduleGraphQLService } from './[module].service.graphql';
   
   export const moduleService = {
     async listItems() {
       return await moduleGraphQLService.listItems();
     }
   };
   ```

## 주의사항

1. **인증 토큰**
   - GraphQL 클라이언트가 자동으로 JWT 토큰을 헤더에 추가합니다
   - localStorage 또는 쿠키에서 `access_token`을 가져옵니다

2. **에러 처리**
   - GraphQL 에러는 `errors` 배열로 반환됩니다
   - 401 에러 시 자동으로 로그인 페이지로 리다이렉트됩니다

3. **타입 안정성**
   - 모든 GraphQL 쿼리에 TypeScript 타입이 정의되어 있습니다
   - Variables 인터페이스를 사용하여 타입 안전성을 보장합니다

## 롤백

GraphQL에서 REST로 되돌리려면:

```bash
cd apps/manager-web/src/features/idam/users/services
cp users.service.rest.ts.backup users.service.ts
```

## 참고 자료

- [GraphQL 공식 문서](https://graphql.org/)
- [graphql-request](https://github.com/jasonkuhrt/graphql-request)
- [Strawberry GraphQL (Backend)](https://strawberry.rocks/)
