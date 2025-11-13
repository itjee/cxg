# 시스템 아키텍처

## 전체 시스템 구조

### 시스템 계층

```
┌─────────────────────────────────────────┐
│   프레젠테이션 레이어 (Presentation)         │
│   - Next.js 웹 애플리케이션                 │
│   - React 컴포넌트                        │
└─────────────────────────────────────────┘
                    ↕ HTTP/REST
┌─────────────────────────────────────────┐
│   API 레이어 (API Gateway)               │
│   - FastAPI 라우터                       │
│   - 인증/권한 미들웨어                      │
│   - Rate Limiting                       │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│   비즈니스 로직 레이어 (Business Logic)      │
│   - 서비스 클래스                          │
│   - 도메인 로직                           │
│   - 비즈니스 규칙                          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│   데이터 액세스 레이어 (Data Access)      │
│   - ORM (SQLAlchemy)                    │
│   - Repository 패턴                      │
│   - 캐싱 레이어                          │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│   데이터 레이어 (Data Layer)             │
│   - PostgreSQL (관계형 DB)               │
│   - Redis (캐시/세션)                    │
│   - Pinecone (벡터 DB)                   │
└─────────────────────────────────────────┘
```

## 아키텍처 패턴

### 1. 멀티테넌시 아키텍처

- **전략**: Database Per Tenant
- **격리 수준**: 물리적 데이터베이스 분리
- **장점**: 보안성, 확장성, 독립적 백업/복구
- **구성**:
  - 관리자 DB (mgmt_db): 테넌트 메타데이터, 청구 정보
  - 테넌트 DB (tnnt_db): 각 테넌트의 업무 데이터

### 2. 모듈형 모노리스 (Modular Monolith)

- **초기**: 단일 배포 단위로 시작
- **확장**: 필요 시 마이크로서비스로 분리 가능
- **모듈 구성**: 도메인별 독립 모듈 (Co-location 패턴)
- **장점**: 개발 속도, 배포 단순성, 점진적 분리 가능

### 3. Co-location 패턴

- **개념**: 관련 코드를 같은 디렉토리에 배치
- **구조**: router, schemas, service, model을 한 곳에
- **장점**: 응집도 향상, 유지보수 용이

### 4. Repository 패턴

- **목적**: 데이터 액세스 로직 캡슐화
- **구현**: Service → Repository → ORM
- **장점**: 테스트 용이성, 의존성 역전

## 데이터 흐름

### 요청 흐름

```
Client Request
    ↓
API Gateway (FastAPI)
    ↓
Authentication Middleware
    ↓
Authorization Middleware
    ↓
Tenant Resolver
    ↓
Route Handler
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
ORM (SQLModel)
    ↓
Database
```

### 응답 흐름

```
Database
    ↓
ORM (SQLModel)
    ↓
Repository Layer
    ↓
Service Layer (Data Transformation)
    ↓
Response Schema (Pydantic)
    ↓
Envelope Response
    ↓
Client
```

## 보안 아키텍처

### 인증 (Authentication)

- **방식**: OAuth2 + JWT
- **토큰**: Access Token (15분) + Refresh Token (7일)
- **저장**: HTTP-only Cookie (Refresh Token)

### 권한 (Authorization)

- **모델**: RBAC (Role-Based Access Control)
- **구조**: User → Role → Permission
- **체크**: 각 API 엔드포인트에서 권한 검증

### 데이터 보안

- **전송**: HTTPS/TLS 1.3
- **저장**: AES-256 암호화 (민감 데이터)
- **접근**: Row Level Security (PostgreSQL)

## 확장성 전략

### 수평 확장 (Horizontal Scaling)

- **API 서버**: 상태 비저장 (Stateless) 설계
- **로드 밸런서**: ALB (Application Load Balancer)
- **세션**: Redis 클러스터로 공유

### 수직 확장 (Vertical Scaling)

- **데이터베이스**: 리소스 증설
- **캐시**: Redis 메모리 증설

### 데이터베이스 확장

- **읽기 복제**: Read Replica
- **샤딩**: 테넌트별 데이터베이스 분리
- **파티셔닝**: 대용량 테이블 시간 기반 파티셔닝

## 가용성 전략

### High Availability

- **API 서버**: Multi-AZ 배포
- **데이터베이스**: Multi-AZ RDS
- **캐시**: Redis 클러스터 모드

### Disaster Recovery

- **백업**: 일일 자동 백업
- **복구 목표**: RPO 1시간, RTO 4시간
- **백업 보관**: 30일

## 성능 최적화

### 캐싱 전략

- **레벨 1**: 브라우저 캐시 (Static Assets)
- **레벨 2**: CDN 캐시 (CloudFront)
- **레벨 3**: 애플리케이션 캐시 (Redis)
- **레벨 4**: 데이터베이스 쿼리 캐시

### 데이터베이스 최적화

- **인덱싱**: 자주 조회되는 컬럼
- **쿼리 최적화**: N+1 방지, Eager Loading
- **Connection Pooling**: pgBouncer

### API 최적화

- **페이징**: 대용량 데이터 조회
- **압축**: GZip 압축
- **비동기 처리**: async/await

## 모니터링 아키텍처

### 메트릭 수집

- **인프라**: Prometheus
- **애플리케이션**: OpenTelemetry
- **비즈니스**: 커스텀 메트릭

### 로깅

- **수집**: Fluentd
- **저장**: Elasticsearch
- **조회**: Kibana

### 추적 (Tracing)

- **도구**: OpenTelemetry
- **저장**: Jaeger
- **분석**: 요청 경로 추적

### 알림

- **도구**: Prometheus Alertmanager
- **채널**: Slack, Email, PagerDuty
- **규칙**: CPU, 메모리, 에러율, 응답 시간

## AI/ML 아키텍처

### LLM 통합

- **Provider**: OpenAI, Anthropic
- **프레임워크**: LangChain, LangGraph
- **패턴**: Agent, Chain, Tool

### 벡터 데이터베이스

- **용도**: 문서 검색, RAG (Retrieval-Augmented Generation)
- **저장**: Pinecone / Weaviate
- **임베딩**: OpenAI Embeddings

### AI 서비스 아키텍처

```
User Request
    ↓
API Gateway
    ↓
AI Service (FastAPI)
    ↓
LangChain Agent
    ↓
┌─────────┬─────────┬─────────┐
│   LLM   │ Vector  │  Tools  │
│ (GPT-4) │   DB    │ (APIs)  │
└─────────┴─────────┴─────────┘
    ↓
Response
```

## 배포 아키텍처

### 개발 환경

- **로컬**: Docker Compose
- **데이터베이스**: PostgreSQL 컨테이너
- **캐시**: Redis 컨테이너

### 스테이징 환경

- **컴퓨팅**: AWS ECS Fargate
- **데이터베이스**: RDS PostgreSQL (소형)
- **캐시**: ElastiCache Redis

### 프로덕션 환경

- **컴퓨팅**: AWS EKS (Kubernetes)
- **데이터베이스**: RDS PostgreSQL (Multi-AZ)
- **캐시**: ElastiCache Redis (클러스터)
- **스토리지**: S3
- **CDN**: CloudFront

## CI/CD 파이프라인

### CI (Continuous Integration)

```
Git Push
    ↓
GitHub Actions
    ↓
┌────────────┬────────────┬────────────┐
│   Lint     │   Test     │   Build    │
└────────────┴────────────┴────────────┘
    ↓
Container Registry (ECR)
```

### CD (Continuous Deployment)

```
Container Registry
    ↓
ArgoCD (GitOps)
    ↓
┌────────────┬────────────┐
│  Staging   │ Production │
└────────────┴────────────┘
```
