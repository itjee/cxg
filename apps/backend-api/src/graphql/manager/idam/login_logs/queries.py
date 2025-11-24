"""Manager IDAM Login Logs - Queries

Manager 시스템 로그인 이력 조회 Query 구현
보안 감사, 이상 행위 탐지, 사용자 활동 추적을 위한 조회 기능을 제공합니다.
"""

from datetime import datetime
from uuid import UUID

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import func, select

from src.graphql.common import get_by_id, get_list
from src.models.manager.idam.login_log import LoginLog as LoginLogModel

from .types import ManagerLoginLog, ManagerLoginLogsConnection


def manager_login_log_to_graphql(log: LoginLogModel) -> "ManagerLoginLog":
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


async def get_manager_login_logs_count(
    db: AsyncSession,
    search: str | None = None,
    user_id: UUID | None = None,
    attempt_type: str | None = None,
    success: bool | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
) -> int:
    """
    Manager 로그인 이력 전체 개수 조회

    다양한 필터 조건을 기반으로 전체 로그인 이력 개수를 계산합니다.

    Args:
        db: 데이터베이스 세션
        search: 검색어 (사용자명, IP 주소 등 전체 필드 검색)
        user_id: 사용자 ID 필터
        attempt_type: 시도 타입 필터
        success: 성공 여부 필터
        start_date: 시작 날짜
        end_date: 종료 날짜

    Returns:
        int: 필터 조건을 만족하는 전체 로그인 이력 개수
    """
    from sqlalchemy import or_

    query = select(func.count()).select_from(LoginLogModel)

    # 필터 조건 적용
    if user_id:
        query = query.where(LoginLogModel.user_id == user_id)
    if attempt_type:
        query = query.where(LoginLogModel.attempt_type == attempt_type)
    if success is not None:
        query = query.where(LoginLogModel.success == success)

    # 검색어 필터
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                LoginLogModel.username.ilike(search_pattern),
                LoginLogModel.ip_address.cast(str).ilike(search_pattern),
                LoginLogModel.failure_reason.ilike(search_pattern),
            )
        )

    # 날짜 범위 필터
    if start_date:
        query = query.where(LoginLogModel.created_at >= start_date)
    if end_date:
        query = query.where(LoginLogModel.created_at <= end_date)

    result = await db.execute(query)
    count = result.scalar_one()

    return count or 0


async def get_manager_login_logs(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    search: str | None = None,
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
        search: 검색어 (사용자명, IP 주소 등 전체 필드 검색)
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
    from sqlalchemy import or_

    # 1. 단순 필터 조건 구성
    filters = {}
    if user_id:
        filters["user_id"] = user_id
    if attempt_type:
        filters["attempt_type"] = attempt_type
    if success is not None:
        filters["success"] = success

    # 2. 검색어 필터 (사용자명, IP 주소, 실패 사유)
    extra_conditions = []
    if search:
        search_pattern = f"%{search}%"
        extra_conditions.append(
            or_(
                LoginLogModel.username.ilike(search_pattern),
                LoginLogModel.ip_address.cast(str).ilike(search_pattern),
                LoginLogModel.failure_reason.ilike(search_pattern),
            )
        )

    # 3. 날짜 범위 필터는 extra_conditions로 처리
    # (비교 연산자를 사용하므로 단순 딕셔너리 필터로 처리 불가)
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

    @strawberry.field(description="Manager 로그인 이력 목록 (페이지네이션 포함)")
    async def login_logs_connection(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        search: str | None = None,
        user_id: UUID | None = None,
        attempt_type: str | None = None,
        success: bool | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> "ManagerLoginLogsConnection":
        """
        로그인 이력 목록 조회 (페이징 및 필터링 지원)

        보안 감사 및 이상 행위 탐지를 위해 사용합니다.
        전체 개수와 함께 현재 페이지의 데이터를 반환합니다.

        Args:
            limit: 조회 개수 (기본값: 50)
            offset: 건너뛸 개수
            search: 검색어 (사용자명, IP 주소, 실패 사유)
            user_id: 사용자 ID 필터 (선택)
            attempt_type: 시도 타입 필터 (선택)
            success: 성공 여부 필터 (선택)
            start_date: 시작 날짜 (선택)
            end_date: 종료 날짜 (선택)

        Returns:
            ManagerLoginLogsConnection: 로그인 이력 목록과 전체 개수

        사용 예:
            # 특정 사용자의 실패한 로그인 조회 (무차별 대입 공격 탐지)
            query {
              loginLogsConnection(
                search: "username"
                success: false
                limit: 20
              ) {
                total
                items {
                  id username ip_address failure_reason created_at
                }
              }
            }

            # IP 주소로 로그인 이력 검색
            query {
              loginLogsConnection(
                search: "192.168.1.1"
                limit: 20
              ) {
                total
                items {
                  id username ip_address success created_at
                }
              }
            }
        """
        db = info.context.manager_db_session
        items = await get_manager_login_logs(
            db, limit, offset, search, user_id, attempt_type, success, start_date, end_date
        )
        total = await get_manager_login_logs_count(
            db, search, user_id, attempt_type, success, start_date, end_date
        )
        return ManagerLoginLogsConnection(items=items, total=total)

    @strawberry.field(description="Manager 로그인 이력 목록 (레거시)")
    async def login_logs(
        self,
        info,
        limit: int = 50,
        offset: int = 0,
        search: str | None = None,
        user_id: UUID | None = None,
        attempt_type: str | None = None,
        success: bool | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ) -> "list[ManagerLoginLog]":
        """
        로그인 이력 목록 조회 (페이징 및 필터링 지원)

        보안 감사 및 이상 행위 탐지를 위해 사용합니다.
        ⚠️ 이 필드는 레거시입니다. loginLogsConnection을 사용해주세요.

        Args:
            limit: 조회 개수 (기본값: 50)
            offset: 건너뛸 개수
            search: 검색어 (사용자명, IP 주소, 실패 사유)
            user_id: 사용자 ID 필터 (선택)
            attempt_type: 시도 타입 필터 (선택)
            success: 성공 여부 필터 (선택)
            start_date: 시작 날짜 (선택)
            end_date: 종료 날짜 (선택)

        Returns:
            list[ManagerLoginLog]: 로그인 이력 객체 리스트
        """
        db = info.context.manager_db_session
        return await get_manager_login_logs(
            db, limit, offset, search, user_id, attempt_type, success, start_date, end_date
        )
