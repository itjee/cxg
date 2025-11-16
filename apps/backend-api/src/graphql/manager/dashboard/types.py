"""Dashboard GraphQL Types"""

from datetime import datetime

import strawberry


@strawberry.type
class DashboardStats:
    """Dashboard 통계 데이터"""

    total_tenants: int = strawberry.field(description="전체 테넌트 수")
    total_users: int = strawberry.field(description="전체 사용자 수")
    total_sessions: int = strawberry.field(description="활성 세션 수")
    system_status: str = strawberry.field(description="시스템 상태 (HEALTHY, WARNING, CRITICAL)")
    today_activities: int = strawberry.field(description="오늘의 활동 수")


@strawberry.type
class TenantGrowthData:
    """테넌트 성장 데이터 (차트용)"""

    date: str = strawberry.field(description="날짜 (YYYY-MM-DD)")
    count: int = strawberry.field(description="누적 테넌트 수")
    new_tenants: int = strawberry.field(description="신규 테넌트 수")


@strawberry.type
class Actor:
    """활동 로그의 사용자 정보"""

    id: strawberry.ID = strawberry.field(description="사용자 ID")
    username: str = strawberry.field(description="사용자명")
    full_name: str = strawberry.field(description="전체 이름")


@strawberry.type
class Activity:
    """활동 로그"""

    id: strawberry.ID = strawberry.field(description="활동 ID")
    action: str = strawberry.field(description="작업 타입 (CREATE, UPDATE, DELETE, etc)")
    description: str = strawberry.field(description="활동 설명")
    actor: Actor = strawberry.field(description="작업 수행자")
    created_at: datetime = strawberry.field(description="생성 시간")
