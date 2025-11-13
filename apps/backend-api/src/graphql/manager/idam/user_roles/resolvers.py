"""Manager IDAM UserRoles - Field Resolvers

Type 필드의 복잡한 resolver 로직 구현
"""

from uuid import UUID


async def resolve_user_role_user(user_id: UUID, info):
    """사용자 정보 조회"""
    from ..users.loaders import ManagerUserLoader
    from ..users.queries import user_to_graphql

    db = info.context.manager_db_session
    loader = ManagerUserLoader(db)
    user_model = await loader.load(str(user_id))
    return user_to_graphql(user_model) if user_model else None


async def resolve_user_role_role(role_id: UUID, info):
    """역할 정보 조회"""
    from ..roles.loaders import ManagerRoleLoader
    from ..roles.queries import role_to_graphql

    db = info.context.manager_db_session
    loader = ManagerRoleLoader(db)
    role_model = await loader.load(str(role_id))
    return role_to_graphql(role_model) if role_model else None
