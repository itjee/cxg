"""Tenants SYS Users - DataLoaders"""

from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tenants.sys.users import Users as UserModel


class TenantUserLoader:
    """Tenant 사용자 DataLoader (N+1 쿼리 최적화)"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def load_many(self, user_ids: list[str]) -> list[Optional[UserModel]]:
        """
        여러 사용자를 한 번의 쿼리로 조회
        
        N+1 문제 해결: 여러 ID를 배치로 조회
        """
        if not user_ids:
            return []
        
        uuids = [UUID(uid) for uid in user_ids]
        
        stmt = select(UserModel).where(
            UserModel.id.in_(uuids),
            UserModel.is_deleted == False
        )
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        # ID 순서 보장
        user_map = {str(user.id): user for user in users}
        return [user_map.get(uid) for uid in user_ids]
    
    async def load(self, user_id: str) -> Optional[UserModel]:
        """단일 사용자 조회"""
        result = await self.load_many([user_id])
        return result[0] if result else None


class TenantUserByUsernameLoader:
    """Username으로 사용자 조회 DataLoader"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def load_many(self, usernames: list[str]) -> list[Optional[UserModel]]:
        """여러 username을 한 번의 쿼리로 조회"""
        if not usernames:
            return []
        
        stmt = select(UserModel).where(
            UserModel.username.in_(usernames),
            UserModel.is_deleted == False
        )
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        user_map = {user.username: user for user in users}
        return [user_map.get(username) for username in usernames]
    
    async def load(self, username: str) -> Optional[UserModel]:
        """단일 사용자 조회"""
        result = await self.load_many([username])
        return result[0] if result else None


class TenantUserByEmailLoader:
    """Email로 사용자 조회 DataLoader"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def load_many(self, emails: list[str]) -> list[Optional[UserModel]]:
        """여러 email을 한 번의 쿼리로 조회"""
        if not emails:
            return []
        
        stmt = select(UserModel).where(
            UserModel.email.in_(emails),
            UserModel.is_deleted == False
        )
        result = await self.db.execute(stmt)
        users = result.scalars().all()
        
        user_map = {user.email: user for user in users}
        return [user_map.get(email) for email in emails]
    
    async def load(self, email: str) -> Optional[UserModel]:
        """단일 사용자 조회"""
        result = await self.load_many([email])
        return result[0] if result else None
