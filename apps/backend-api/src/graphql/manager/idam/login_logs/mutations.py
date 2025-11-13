"""Manager IDAM Login Logs - Mutations

공통 모듈을 사용한 Mutation 구현
"""

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from src.graphql.common import create_entity
from src.models.manager.idam.login_log import LoginLog as LoginLogModel

from .queries import login_log_to_graphql
from .types import ManagerLoginLog, ManagerLoginLogCreateInput


async def create_manager_login_log(
    db: AsyncSession, input_data: ManagerLoginLogCreateInput
) -> ManagerLoginLog:
    """Manager 로그인 이력 생성"""
    return await create_entity(
        db=db,
        model_class=LoginLogModel,
        input_data=input_data,
        to_graphql=login_log_to_graphql,
    )


@strawberry.type
class ManagerLoginLogMutations:
    """Manager IDAM Login Logs Mutation"""

    @strawberry.field(description="Manager 로그인 이력 생성")
    async def create_manager_login_log(
        self, info, input: ManagerLoginLogCreateInput
    ) -> ManagerLoginLog:
        """Manager 로그인 이력 생성"""
        db = info.context.manager_db_session
        return await create_manager_login_log(db, input)
