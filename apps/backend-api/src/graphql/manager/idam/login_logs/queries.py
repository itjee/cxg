"""Manager IDAM Login Logs - Queries

Manager 시스템 로그인 이력 조회 Query 구현
보안 감사, 이상 행위 탐지, 사용자 활동 추적을 위한 조회 기능을 제공합니다.
"""

from datetime import datetime
from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.login_log import LoginLog as LoginLogModel

from .types import ManagerLoginLog


def manager_login_log_to_graphql(log: LoginLogModel) -> ManagerLoginLog:
    """
    LoginLogModel(DB 모델)을 ManagerLoginLog(GraphQL 타입)으로 변환

    Args:
        log: 데이터베이스 로그인 이력 모델

    Returns:
        ManagerLoginLog: GraphQL 타입

    Note:
        ip_address는 IP 객체를 문자열로 변환합니다.
    """
    return ManagerLoginLog(
        id=strawberry.ID(str(log.id)),
        user_id=log.user_id,
        user_type=log.user_type,
        tenant_context=log.tenant_context,
        username=log.username,
        attempt_type=log.attempt_type,
        success=log.success,
        failure_reason=log.failure_reason,
        session_id=log.session_id,
        ip_address=str(log.ip_address),  # IP 객체 -> 문자열 변환
        user_agent=log.user_agent,
        country_code=log.country_code,
        city=log.city,
        mfa_used=log.mfa_used,
        mfa_method=log.mfa_method,
        created_at=log.created_at,
    )


async def get_manager_login_log_by_id(db: AsyncSession, log_id: UUID) -> "ManagerLoginLog | None":
    """
    ID로 Manager 로그인 이력 단건 조회

    Args:
        db: 데이터베이스 세션
        log_id: 조회할 로그인 이력 ID

    Returns:
        ManagerLoginLog: 로그인 이력 객체 또는 None
    """
    return await get_by_id(
        db=db,
        model_class=LoginLogModel,
        id_=log_id,
        to_graphql=manager_login_log_to_graphql,
    )


async def get_manager_login_logs(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    user_id: UUID | None = None,
    attempt_type: str | None = None,
    success: bool | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
) -> "list[ManagerLoginLog]":
    """
    Manager 로그인 이력 목록 조회

    다양한 필터 조건으로 로그인 이력을 조회합니다.
    보안 감사, 이상 탐지, 사용자 활동 분석에 활용됩니다.

    Args:
        db: 데이터베이스 세션
        limit: 조회 개수 제한 (기본값: 50)
        offset: 건너뛸 개수 (페이징용)
        user_id: 사용자 ID 필터 (특정 사용자의 이력만 조회)
        attempt_type: 시도 타입 필터 (LOGIN, LOGOUT, FAILED_LOGIN 등)
        success: 성공 여부 필터 (True: 성공만, False: 실패만, None: 전체)
        start_date: 시작 날짜 (이 날짜 이후의 이력)
        end_date: 종료 날짜 (이 날짜 이전의 이력)

    Returns:
        list[ManagerLoginLog]: 로그인 이력 객체 리스트

    Note:
        최신 순으로 정렬됩니다 (created_at DESC).

    사용 예:
        # 특정 사용자의 실패한 로그인 조회
        logs = await get_manager_login_logs(
            db, user_id=user_id, success=False
        )

        # 특정 기간의 로그인 이력 조회
        logs = await get_manager_login_logs(
            db, start_date=datetime(2024, 1, 1), end_date=datetime(2024, 12, 31)
        )
    """
    # 1. 단순 필터 조건 구성
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if attempt_type:
        filters["attempt_type"] = attempt_type
    if success is not None:
        filters["success"] = success

    # 2. 날짜 범위 필터는 extra_conditions로 처리
    # (비교 연산자를 사용하므로 단순 딕셔너리 필터로 처리 불가)
    extra_conditions = []
    if start_date:
        extra_conditions.append(LoginLogModel.created_at >= start_date)
    if end_date:
        extra_conditions.append(LoginLogModel.created_at <= end_date)

    return await get_list(
        db=db,
        model_class=LoginLogModel,
        to_graphql=manager_login_log_to_graphql,
        limit=limit,
        offset=offset,
        order_by=LoginLogModel.created_at.desc(),  # 최신 순
        extra_conditions=extra_conditions if extra_conditions else None,
        **filters,
    )


@strawberry.type
class ManagerLoginLogQueries:
    """
    Manager IDAM Login Logs Query

    Manager 시스템의 로그인 이력 조회 관련 GraphQL Query들을 제공합니다.
    """

    @strawberry.field(description="Manager 로그인 이력 조회 (ID)")
    async def login_log(self, info, id: strawberry.ID) -> "ManagerLoginLog | None":
        """
        ID로 로그인 이력 단건 조회

        Args:
            id: 로그인 이력 ID

        Returns:
            ManagerLoginLog: 로그인 이력 객체 또는 None
        """
        db = info.context.manager_db_session
        return await get_manager_login_log_by_id(db, UUID(id))

    @strawberry.field(description="Manager 로그인 이력 목록")
    async def login_logs(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        user_id: UUID | None = None,
        attempt_type: str | None = None,
        success: bool | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> "list[ManagerLoginLog]":
        """
        로그인 이력 목록 조회 (페이징 및 필터링 지원)

        보안 감사 및 이상 행위 탐지를 위해 사용합니다.

        Args:
            limit: 조회 개수 (기본값: 50)
            offset: 건너뛸 개수
            user_id: 사용자 ID 필터 (선택)
            attempt_type: 시도 타입 필터 (선택)
            success: 성공 여부 필터 (선택)
            start_date: 시작 날짜 (선택)
            end_date: 종료 날짜 (선택)

        Returns:
            list[ManagerLoginLog]: 로그인 이력 객체 리스트

        사용 예:
            # 특정 사용자의 실패한 로그인 조회 (무차별 대입 공격 탐지)
            query {
              managerLoginLogs(
                user_id: "xxx"
                success: false
                limit: 100
              ) {
                id username ip_address failure_reason created_at
              }
            }

            # 최근 24시간 내 모든 로그인 시도
            query {
              managerLoginLogs(
                start_date: "2024-01-15T00:00:00Z"
                limit: 100
              ) {
                id username success ip_address created_at
              }
            }
        """
        db = info.context.manager_db_session
        return await get_manager_login_logs(
            db, limit, offset, user_id, attempt_type, success, start_date, end_date
        )
