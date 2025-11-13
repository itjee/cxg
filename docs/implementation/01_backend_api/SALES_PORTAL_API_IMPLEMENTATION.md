# Sales Portal Backend API 구현 계획

**작성일**: 2025-11-01
**상태**: API 설계 단계

---

## 📋 목차

1. [API 개요](#api-개요)
2. [프로젝트 구조](#프로젝트-구조)
3. [엔드포인트 상세](#엔드포인트-상세)
4. [인증 및 권한](#인증-및-권한)
5. [데이터 검증](#데이터-검증)
6. [에러 처리](#에러-처리)
7. [테스트 전략](#테스트-전략)

---

## API 개요

### 기술 스택
- **프레임워크**: FastAPI (Python)
- **서버**: Uvicorn
- **데이터베이스**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **인증**: JWT + RBAC
- **검증**: Pydantic v2
- **API 문서**: OpenAPI/Swagger

### API 기본 정보
```
Base URL: https://api.conexgrow.com/api
Version: v1
Content-Type: application/json
Authentication: Bearer {JWT_TOKEN}
Rate Limit: 100 requests/minute
```

---

## 프로젝트 구조

### Backend 디렉토리 구조

```
apps/backend-api/
├── src/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI 앱 생성
│   │   ├── dependencies.py            # 공통 의존성
│   │   │
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   └── routers/
│   │   │       ├── __init__.py
│   │   │       ├── sales/
│   │   │       │   ├── __init__.py
│   │   │       │   ├── dashboard.py   # 대시보드 라우터
│   │   │       │   ├── accounts.py    # 거래처 라우터
│   │   │       │   ├── opportunities.py # 기회 라우터
│   │   │       │   ├── activities.py  # 활동 라우터
│   │   │       │   ├── resources.py   # 자료실 라우터
│   │   │       │   ├── forecasts.py   # 예측 라우터
│   │   │       │   └── targets.py     # 목표 라우터
│   │   │       └── collaboration/
│   │   │           ├── __init__.py
│   │   │           ├── feeds.py       # 피드 라우터
│   │   │           └── approvals.py   # 승인 라우터
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── sales/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── dashboard.py
│   │   │   │   ├── account.py
│   │   │   │   ├── opportunity.py
│   │   │   │   ├── activity.py
│   │   │   │   ├── resource.py
│   │   │   │   ├── target.py
│   │   │   │   └── forecast.py
│   │   │   └── collaboration/
│   │   │       ├── __init__.py
│   │   │       ├── feed.py
│   │   │       ├── comment.py
│   │   │       └── approval.py
│   │   │
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── sales/
│   │       │   ├── __init__.py
│   │       │   ├── dashboard_service.py
│   │       │   ├── account_service.py
│   │       │   ├── opportunity_service.py
│   │       │   ├── activity_service.py
│   │       │   ├── resource_service.py
│   │       │   ├── target_service.py
│   │       │   └── forecast_service.py
│   │       └── collaboration/
│   │           ├── __init__.py
│   │           ├── feed_service.py
│   │           ├── comment_service.py
│   │           └── approval_service.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── sales/
│   │   │   ├── __init__.py
│   │   │   ├── sales_target.py
│   │   │   ├── sales_activity.py
│   │   │   ├── sales_forecast.py
│   │   │   ├── sales_metrics.py
│   │   │   ├── sales_leaderboard.py
│   │   │   └── sales_documents.py
│   │   └── collaboration/
│   │       ├── __init__.py
│   │       ├── feed.py
│   │       ├── comment.py
│   │       └── approval.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # 설정
│   │   ├── database.py            # DB 연결
│   │   ├── security.py            # JWT, RBAC
│   │   └── logging.py             # 로깅
│   │
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── pagination.py          # 페이징
│   │   ├── filters.py             # 필터링
│   │   └── exceptions.py          # 커스텀 예외
│   │
│   └── tests/
│       ├── __init__.py
│       ├── conftest.py
│       ├── integration/
│       │   ├── test_sales_dashboard.py
│       │   ├── test_accounts.py
│       │   ├── test_opportunities.py
│       │   └── test_collaboration.py
│       └── unit/
│           ├── test_services.py
│           └── test_validators.py
│
├── requirements.txt
├── pyproject.toml
└── alembic/
    └── versions/
        ├── 001_create_sales_schema.py
        ├── 002_initialize_sales_data.py
        └── 003_create_views.py
```

---

## 엔드포인트 상세

### 1. Dashboard API (`/api/v1/sales/dashboard`)

#### 1-1. 메트릭 조회
```python
@router.get("/metrics")
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    date_range: Optional[str] = Query(None, description="month, quarter, year"),
    period: Optional[str] = Query(None, description="fiscal period")
) -> DashboardMetricsResponse:
    """
    현재 판매자의 성과 지표 조회

    Returns:
        {
            "pipeline_total": 2450000,
            "quota_achievement": 85.5,
            "avg_deal_size": 125000,
            "win_rate": 68.0,
            "days_to_close": 28,
            "call_count": 15,
            "email_count": 42,
            "meeting_count": 3
        }
    """
    service = DashboardService(session)
    return await service.get_metrics(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        period=period
    )
```

#### 1-2. 파이프라인 요약
```python
@router.get("/pipeline")
async def get_pipeline_summary(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> PipelineSummaryResponse:
    """
    파이프라인 단계별 분포 및 추이 조회

    Returns:
        {
            "funnel": [
                {"stage": "lead", "count": 50, "value": 6250000},
                {"stage": "proposal", "count": 35, "value": 5250000},
                ...
            ],
            "upcoming_closures": [...],
            "trend": [...]
        }
    """
    service = DashboardService(session)
    return await service.get_pipeline_summary(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id
    )
```

#### 1-3. 활동 요약
```python
@router.get("/activities")
async def get_activity_summary(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    days: int = Query(7, description="Last N days")
) -> ActivitySummaryResponse:
    """
    최근 활동 요약 (Task, Meeting, Overdue)
    """
    service = DashboardService(session)
    return await service.get_activity_summary(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        days=days
    )
```

#### 1-4. 거래처 및 기회 요약
```python
@router.get("/accounts-summary")
async def get_accounts_summary(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> AccountsSummaryResponse:
    """
    위험한 거래처 및 주요 거래처 조회
    """
    service = DashboardService(session)
    return await service.get_accounts_summary(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id
    )
```

#### 1-5. 순위표
```python
@router.get("/leaderboard")
async def get_leaderboard(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    period: str = Query("quarter", description="month, quarter, year"),
    limit: int = Query(50, ge=1, le=100)
) -> LeaderboardResponse:
    """
    영업 순위표 및 성과 비교
    """
    service = DashboardService(session)
    return await service.get_leaderboard(
        tenant_id=tenant_id,
        period=period,
        limit=limit
    )
```

---

### 2. Accounts API (`/api/v1/sales/accounts`)

#### 2-1. 거래처 목록
```python
@router.get("/")
async def list_accounts(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    tier: Optional[str] = Query(None, description="gold, silver, bronze"),
    industry: Optional[str] = Query(None),
    status: Optional[str] = Query(None, description="active, inactive"),
    sort_by: str = Query("name", description="name, revenue, last_activity"),
    order: str = Query("asc", description="asc, desc")
) -> PaginatedAccountsResponse:
    """
    판매자가 담당하는 거래처 목록 조회

    Query Parameters:
        - tier: 거래처 등급 필터링
        - industry: 산업 필터링
        - status: 상태 필터링
        - sort_by: 정렬 기준
        - order: 정렬 순서
    """
    service = AccountService(session)
    return await service.list_accounts(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        skip=skip,
        limit=limit,
        filters={
            "tier": tier,
            "industry": industry,
            "status": status
        },
        sort_by=sort_by,
        order=order
    )
```

#### 2-2. 거래처 상세
```python
@router.get("/{account_id}")
async def get_account_detail(
    account_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> AccountDetailResponse:
    """
    특정 거래처의 상세 정보 조회

    Returns:
        {
            "account": {...},
            "contacts": [...],
            "opportunities": [...],
            "activities": [...],
            "statistics": {...}
        }
    """
    service = AccountService(session)
    return await service.get_account_detail(
        tenant_id=tenant_id,
        account_id=account_id,
        sales_person_id=current_user.employee_id
    )
```

#### 2-3. 거래처 수정
```python
@router.put("/{account_id}")
async def update_account(
    account_id: int,
    payload: UpdateAccountRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> AccountDetailResponse:
    """거래처 정보 업데이트"""
    service = AccountService(session)
    return await service.update_account(
        tenant_id=tenant_id,
        account_id=account_id,
        sales_person_id=current_user.employee_id,
        data=payload.dict()
    )
```

#### 2-4. 거래처 할당
```python
@router.post("/{account_id}/assign")
async def assign_account(
    account_id: int,
    payload: AssignAccountRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> SuccessResponse:
    """거래처를 다른 판매자에게 할당"""
    service = AccountService(session)
    return await service.assign_account(
        tenant_id=tenant_id,
        account_id=account_id,
        new_employee_id=payload.employee_id,
        assigned_by=current_user.employee_id
    )
```

#### 2-5. 거래처 연락처
```python
@router.get("/{account_id}/contacts")
async def list_account_contacts(
    account_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ContactsResponse:
    """거래처의 모든 연락처 조회"""
    service = AccountService(session)
    return await service.get_account_contacts(
        tenant_id=tenant_id,
        account_id=account_id
    )
```

---

### 3. Opportunities API (`/api/v1/sales/opportunities`)

#### 3-1. 기회 목록
```python
@router.get("/")
async def list_opportunities(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    stage: Optional[str] = Query(None, description="lead, proposal, negotiation, closing, won, lost"),
    status: Optional[str] = Query(None),
    sort_by: str = Query("close_date", description="amount, probability, close_date"),
    order: str = Query("asc"),
    view: str = Query("list", description="list, kanban, analytics")
) -> OpportunitiesResponse:
    """
    기회 목록 조회 (다양한 뷰 지원)

    Query Parameters:
        - stage: 단계별 필터링
        - view: 표시 형식 (list, kanban, analytics)
    """
    service = OpportunityService(session)
    return await service.list_opportunities(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        skip=skip,
        limit=limit,
        filters={"stage": stage, "status": status},
        sort_by=sort_by,
        order=order,
        view=view
    )
```

#### 3-2. 기회 상세
```python
@router.get("/{opportunity_id}")
async def get_opportunity_detail(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> OpportunityDetailResponse:
    """기회의 상세 정보 조회"""
    service = OpportunityService(session)
    return await service.get_opportunity_detail(
        tenant_id=tenant_id,
        opportunity_id=opportunity_id
    )
```

#### 3-3. 기회 생성
```python
@router.post("/")
async def create_opportunity(
    payload: CreateOpportunityRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> OpportunityDetailResponse:
    """새로운 기회 생성"""
    service = OpportunityService(session)
    return await service.create_opportunity(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        data=payload.dict()
    )
```

#### 3-4. 기회 업데이트
```python
@router.put("/{opportunity_id}")
async def update_opportunity(
    opportunity_id: int,
    payload: UpdateOpportunityRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> OpportunityDetailResponse:
    """기회 정보 업데이트"""
    service = OpportunityService(session)
    return await service.update_opportunity(
        tenant_id=tenant_id,
        opportunity_id=opportunity_id,
        data=payload.dict()
    )
```

#### 3-5. 기회 단계 변경
```python
@router.patch("/{opportunity_id}/stage")
async def update_opportunity_stage(
    opportunity_id: int,
    payload: UpdateStageRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> OpportunityDetailResponse:
    """기회의 단계 변경 (Kanban에서 사용)"""
    service = OpportunityService(session)
    return await service.update_stage(
        tenant_id=tenant_id,
        opportunity_id=opportunity_id,
        new_stage=payload.stage,
        updated_by=current_user.employee_id
    )
```

#### 3-6. 기회 삭제
```python
@router.delete("/{opportunity_id}")
async def delete_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> SuccessResponse:
    """기회 삭제 (논리적 삭제)"""
    service = OpportunityService(session)
    return await service.delete_opportunity(
        tenant_id=tenant_id,
        opportunity_id=opportunity_id
    )
```

---

### 4. Activities API (`/api/v1/sales/activities`)

#### 4-1. 활동 목록
```python
@router.get("/")
async def list_activities(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    activity_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None)
) -> PaginatedActivitiesResponse:
    """활동 목록 조회"""
    service = ActivityService(session)
    return await service.list_activities(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        skip=skip,
        limit=limit,
        filters={
            "activity_type": activity_type,
            "status": status,
            "date_from": date_from,
            "date_to": date_to
        }
    )
```

#### 4-2. 활동 생성
```python
@router.post("/")
async def create_activity(
    payload: CreateActivityRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ActivityResponse:
    """새로운 활동 기록"""
    service = ActivityService(session)
    return await service.create_activity(
        tenant_id=tenant_id,
        sales_person_id=current_user.employee_id,
        data=payload.dict()
    )
```

#### 4-3. 활동 완료
```python
@router.post("/{activity_id}/complete")
async def complete_activity(
    activity_id: int,
    payload: CompleteActivityRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ActivityResponse:
    """활동을 완료로 표시"""
    service = ActivityService(session)
    return await service.complete_activity(
        tenant_id=tenant_id,
        activity_id=activity_id,
        outcome=payload.outcome,
        notes=payload.notes
    )
```

---

### 5. Resources API (`/api/v1/sales/resources`)

#### 5-1. 자료 목록
```python
@router.get("/")
async def list_resources(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    doc_type: Optional[str] = Query(None),
    product_line: Optional[str] = Query(None),
    industry: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
) -> PaginatedResourcesResponse:
    """영업 자료 목록 조회"""
    service = ResourceService(session)
    return await service.list_resources(
        tenant_id=tenant_id,
        skip=skip,
        limit=limit,
        filters={
            "doc_type": doc_type,
            "product_line": product_line,
            "industry": industry,
            "search": search
        }
    )
```

#### 5-2. 자료 다운로드
```python
@router.post("/{document_id}/download")
async def download_resource(
    document_id: int,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> DownloadResponse:
    """자료 다운로드 (다운로드 횟수 집계)"""
    service = ResourceService(session)
    return await service.get_download_url(
        tenant_id=tenant_id,
        document_id=document_id,
        user_id=current_user.user_id
    )
```

---

### 6. Collaboration API (`/api/v1/sales/collaboration`)

#### 6-1. 피드 목록
```python
@router.get("/feeds")
async def list_feeds(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    feed_type: Optional[str] = Query(None)
) -> PaginatedFeedsResponse:
    """팀 피드 조회"""
    service = FeedService(session)
    return await service.list_feeds(
        tenant_id=tenant_id,
        user_id=current_user.user_id,
        skip=skip,
        limit=limit,
        feed_type=feed_type
    )
```

#### 6-2. 피드 생성
```python
@router.post("/feeds")
async def create_feed(
    payload: CreateFeedRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> FeedResponse:
    """새로운 피드 생성"""
    service = FeedService(session)
    return await service.create_feed(
        tenant_id=tenant_id,
        created_by=current_user.user_id,
        data=payload.dict()
    )
```

#### 6-3. 피드 댓글
```python
@router.post("/feeds/{feed_id}/comments")
async def add_comment(
    feed_id: int,
    payload: CreateCommentRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> CommentResponse:
    """피드에 댓글 추가"""
    service = FeedService(session)
    return await service.add_comment(
        tenant_id=tenant_id,
        feed_id=feed_id,
        created_by=current_user.user_id,
        content=payload.content,
        mentions=payload.mentions
    )
```

#### 6-4. 승인 요청 목록
```python
@router.get("/approvals")
async def list_approvals(
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id),
    status: Optional[str] = Query(None, description="pending, approved, rejected"),
    approval_type: Optional[str] = Query(None)
) -> ApprovalsResponse:
    """승인 대기 중인 요청 목록"""
    service = ApprovalService(session)
    return await service.list_approvals(
        tenant_id=tenant_id,
        approver_id=current_user.user_id,
        status=status,
        approval_type=approval_type
    )
```

#### 6-5. 승인 요청 생성
```python
@router.post("/approvals")
async def create_approval_request(
    payload: CreateApprovalRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ApprovalResponse:
    """새로운 승인 요청 생성 (예: 할인 승인)"""
    service = ApprovalService(session)
    return await service.create_approval(
        tenant_id=tenant_id,
        created_by=current_user.user_id,
        data=payload.dict()
    )
```

#### 6-6. 승인 처리
```python
@router.post("/approvals/{approval_id}/approve")
async def approve_request(
    approval_id: int,
    payload: ApproveApprovalRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ApprovalResponse:
    """승인 요청 승인"""
    service = ApprovalService(session)
    return await service.approve(
        tenant_id=tenant_id,
        approval_id=approval_id,
        approver_id=current_user.user_id,
        comments=payload.comments
    )

@router.post("/approvals/{approval_id}/reject")
async def reject_request(
    approval_id: int,
    payload: RejectApprovalRequest,
    current_user: User = Depends(get_current_user),
    tenant_id: int = Depends(get_tenant_id)
) -> ApprovalResponse:
    """승인 요청 거부"""
    service = ApprovalService(session)
    return await service.reject(
        tenant_id=tenant_id,
        approval_id=approval_id,
        approver_id=current_user.user_id,
        comments=payload.comments
    )
```

---

## 인증 및 권한

### JWT 인증

```python
# core/security.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security)
) -> User:
    """현재 로그인한 사용자 정보 추출"""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # DB에서 사용자 조회
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### RBAC (Role-Based Access Control)

```python
# dependencies.py
from typing import List

async def require_permission(
    required_permissions: List[str] = []
):
    """권한 검증 의존성"""
    async def check_permission(
        current_user: User = Depends(get_current_user)
    ):
        user_permissions = await get_user_permissions(current_user.user_id)
        for perm in required_permissions:
            if perm not in user_permissions:
                raise HTTPException(
                    status_code=403,
                    detail="Insufficient permissions"
                )
        return current_user

    return check_permission
```

### 사용 예시

```python
@router.post("/opportunities",
             dependencies=[Depends(require_permission(["sales.opportunity.create"]))])
async def create_opportunity(...):
    """기회 생성 (필요한 권한: sales.opportunity.create)"""
    pass
```

---

## 데이터 검증

### Pydantic 스키마

```python
# schemas/sales/opportunity.py
from pydantic import BaseModel, Field, validator
from typing import Optional
from decimal import Decimal
from datetime import datetime

class CreateOpportunityRequest(BaseModel):
    account_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1, max_length=255)
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    probability: int = Field(..., ge=0, le=100)
    close_date: datetime
    stage: str = Field(..., regex="^(lead|proposal|negotiation|closing|won|lost)$")
    description: Optional[str] = None

    @validator('close_date')
    def validate_close_date(cls, v):
        if v < datetime.now():
            raise ValueError('close_date must be in the future')
        return v

class UpdateOpportunityRequest(BaseModel):
    name: Optional[str] = None
    amount: Optional[Decimal] = None
    probability: Optional[int] = None
    close_date: Optional[datetime] = None
    stage: Optional[str] = None
    description: Optional[str] = None

class OpportunityDetailResponse(BaseModel):
    opportunity_id: int
    account_id: int
    name: str
    amount: Decimal
    probability: int
    close_date: datetime
    stage: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

---

## 에러 처리

### Custom Exceptions

```python
# utils/exceptions.py
from fastapi import HTTPException
from enum import Enum

class ErrorCode(str, Enum):
    INVALID_REQUEST = "INVALID_REQUEST"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    UNPROCESSABLE_ENTITY = "UNPROCESSABLE_ENTITY"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"

class APIException(HTTPException):
    def __init__(
        self,
        status_code: int,
        error_code: ErrorCode,
        message: str,
        details: dict = None
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "error_code": error_code,
                "message": message,
                "details": details or {}
            }
        )

# 사용 예시
raise APIException(
    status_code=404,
    error_code=ErrorCode.NOT_FOUND,
    message="Opportunity not found",
    details={"opportunity_id": 123}
)
```

### Global Exception Handler

```python
# main.py
from fastapi import FastAPI
from fastapi.exception_handlers import HTTPException

@app.exception_handler(APIException)
async def api_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    # 로깅
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    return JSONResponse(
        status_code=500,
        content={
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred"
        }
    )
```

---

## 테스트 전략

### Unit Tests

```python
# tests/unit/test_services.py
import pytest
from unittest.mock import Mock, AsyncMock, patch

@pytest.fixture
def mock_session():
    return AsyncMock()

@pytest.fixture
def dashboard_service(mock_session):
    return DashboardService(mock_session)

@pytest.mark.asyncio
async def test_get_metrics(dashboard_service, mock_session):
    """메트릭 조회 테스트"""
    # Arrange
    mock_session.execute.return_value.scalar_one_or_none.return_value = {
        "pipeline_total": 2450000,
        "quota_achievement": 85.5
    }

    # Act
    result = await dashboard_service.get_metrics(
        tenant_id=1,
        sales_person_id=1,
        period="Q1"
    )

    # Assert
    assert result["pipeline_total"] == 2450000
    assert result["quota_achievement"] == 85.5
    mock_session.execute.assert_called_once()
```

### Integration Tests

```python
# tests/integration/test_sales_dashboard.py
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_token():
    return create_test_token(user_id=1)

def test_dashboard_metrics_endpoint(client, auth_token):
    """대시보드 메트릭 엔드포인트 통합 테스트"""
    response = client.get(
        "/api/v1/sales/dashboard/metrics",
        headers={"Authorization": f"Bearer {auth_token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert "pipeline_total" in data
    assert "quota_achievement" in data
    assert isinstance(data["pipeline_total"], (int, float))
```

---

## 배포 체크리스트

- [ ] 모든 엔드포인트 구현
- [ ] Pydantic 스키마 검증
- [ ] RBAC 권한 관리
- [ ] 에러 처리 구현
- [ ] 로깅 설정
- [ ] Unit 테스트 (>80% coverage)
- [ ] Integration 테스트
- [ ] API 문서화 (Swagger)
- [ ] 성능 테스트
- [ ] 보안 검토
- [ ] 프로덕션 배포

---

**문서 작성자**: Claude Code
**버전**: 1.0.0
**마지막 수정**: 2025-11-01
