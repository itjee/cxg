"""Dashboard GraphQL Queries

대시보드 관련 조회 기능을 제공합니다.
- 통계 데이터 (총 테넌트, 사용자, 세션 수 등)
- 테넌트 성장 데이터 (시간별 데이터)
- 최근 활동 로그
"""

from datetime import datetime, timedelta

import strawberry

from .types import Activity, DashboardStats, TenantGrowthData, User


@strawberry.type
class DashboardQueries:
    """Dashboard Query"""

    @strawberry.field(description="Dashboard 통계 데이터 조회")
    async def dashboard(self) -> DashboardStats:
        """
        대시보드 통계 데이터를 조회합니다.
        - 전체 테넌트 수
        - 전체 사용자 수
        - 활성 세션 수
        - 시스템 상태
        - 오늘의 활동 수
        """
        # TODO: 실제 데이터베이스에서 조회하도록 구현
        return DashboardStats(
            total_tenants=42,
            total_users=156,
            total_sessions=23,
            system_status="HEALTHY",
            today_activities=12,
        )

    @strawberry.field(description="테넌트 성장 데이터 조회")
    async def tenant_growth(
        self, period: str = "month"
    ) -> list[TenantGrowthData]:
        """
        테넌트 성장 데이터를 조회합니다.
        차트 렌더링에 사용됩니다.

        Args:
            period: 기간 (day, week, month, year)

        Returns:
            테넌트 성장 데이터 리스트
        """
        # TODO: 실제 데이터베이스에서 조회하도록 구현
        # 데모 데이터 반환
        data = []
        if period == "month":
            for i in range(30):
                date = (datetime.now() - timedelta(days=30 - i)).strftime("%Y-%m-%d")
                data.append(
                    TenantGrowthData(
                        date=date,
                        count=40 + i * 1,
                        new_tenants=max(0, i % 3),
                    )
                )
        return data

    @strawberry.field(description="최근 활동 로그 조회")
    async def activities(self, limit: int = 10, order_by: str = "createdAt") -> list[Activity]:
        """
        최근 활동 로그를 조회합니다.

        Args:
            limit: 조회 개수
            order_by: 정렬 기준 필드

        Returns:
            활동 로그 리스트
        """
        # TODO: 실제 데이터베이스에서 조회하도록 구현
        # 데모 데이터 반환
        activities = [
            Activity(
                id=strawberry.ID("1"),
                action="CREATE",
                description="새로운 테넌트 생성",
                actor=User(
                    id=strawberry.ID("user1"),
                    username="admin",
                    full_name="Administrator",
                ),
                created_at=datetime.now() - timedelta(hours=2),
            ),
            Activity(
                id=strawberry.ID("2"),
                action="UPDATE",
                description="사용자 정보 수정",
                actor=User(
                    id=strawberry.ID("user1"),
                    username="admin",
                    full_name="Administrator",
                ),
                created_at=datetime.now() - timedelta(hours=1),
            ),
            Activity(
                id=strawberry.ID("3"),
                action="DELETE",
                description="불활성 테넌트 삭제",
                actor=User(
                    id=strawberry.ID("user1"),
                    username="admin",
                    full_name="Administrator",
                ),
                created_at=datetime.now(),
            ),
        ]
        return activities[:limit]
