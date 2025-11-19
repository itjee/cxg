"""
Code Help Constants & Handlers

검색 유형별 핸들러 정의 및 상수
"""

from abc import ABC, abstractmethod
from typing import List, Tuple, Optional, Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from .types import CodeHelpResult


class CodeHelpHandler(ABC):
    """코드 헬프 검색 핸들러 기본 클래스"""

    @abstractmethod
    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """검색 실행"""
        pass

    def _build_search_filter(self, model, search_query: str, search_fields: List[str]):
        """검색 쿼리 빌드 헬퍼"""
        if not search_query.strip():
            return None

        conditions = [
            getattr(model, field).ilike(f"%{search_query}%")
            for field in search_fields
        ]
        return or_(*conditions)


class CustomerSearchHandler(CodeHelpHandler):
    """거래처 검색 핸들러"""

    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """거래처 검색"""
        from ...tenants.crm.customers.models import Customer

        # 기본 쿼리
        query = select(Customer)

        # 검색어 필터
        search_filter = self._build_search_filter(
            Customer, search_query, ["customer_code", "customer_name"]
        )
        if search_filter is not None:
            query = query.where(search_filter)

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(Customer.status == filters["status"])
        else:
            query = query.where(Customer.status == "ACTIVE")

        # 전체 개수
        count_query = select(func.count(Customer.id))
        count_query = count_query.select_from(Customer)
        if search_filter is not None:
            count_query = count_query.where(search_filter)
        if filters and "status" in filters:
            count_query = count_query.where(Customer.status == filters["status"])
        else:
            count_query = count_query.where(Customer.status == "ACTIVE")

        count_result = await db.execute(count_query)
        total_count = count_result.scalar() or 0

        # 데이터 조회
        query = query.limit(limit).offset(offset).order_by(Customer.created_at.desc())
        result = await db.execute(query)
        customers = result.scalars().all()

        # 응답 변환
        items = [
            CodeHelpResult(
                id=str(c.id),
                code=c.customer_code,
                name=c.customer_name,
                description=c.description,
                metadata={
                    "phone": c.phone,
                    "address": c.address,
                    "category": c.category,
                },
                status=c.status,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in customers
        ]

        return total_count, items


class EmployeeSearchHandler(CodeHelpHandler):
    """사원 검색 핸들러"""

    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """사원 검색"""
        from ...tenants.hrm.employees.models import Employee

        # 기본 쿼리
        query = select(Employee)

        # 검색어 필터
        search_filter = self._build_search_filter(
            Employee, search_query, ["employee_code", "employee_name"]
        )
        if search_filter is not None:
            query = query.where(search_filter)

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(Employee.status == filters["status"])
        else:
            query = query.where(Employee.status == "ACTIVE")

        # 부서 필터
        if filters and "department" in filters:
            query = query.where(Employee.department == filters["department"])

        # 전체 개수
        count_query = select(func.count(Employee.id)).select_from(Employee)
        if search_filter is not None:
            count_query = count_query.where(search_filter)
        if filters and "status" in filters:
            count_query = count_query.where(Employee.status == filters["status"])
        else:
            count_query = count_query.where(Employee.status == "ACTIVE")
        if filters and "department" in filters:
            count_query = count_query.where(Employee.department == filters["department"])

        count_result = await db.execute(count_query)
        total_count = count_result.scalar() or 0

        # 데이터 조회
        query = query.limit(limit).offset(offset).order_by(Employee.created_at.desc())
        result = await db.execute(query)
        employees = result.scalars().all()

        # 응답 변환
        items = [
            CodeHelpResult(
                id=str(e.id),
                code=e.employee_code,
                name=e.employee_name,
                description=None,
                metadata={
                    "department": e.department,
                    "position": e.position,
                    "email": e.email,
                },
                status=e.status,
                created_at=e.created_at,
                updated_at=e.updated_at,
            )
            for e in employees
        ]

        return total_count, items


class UserSearchHandler(CodeHelpHandler):
    """사용자 검색 핸들러"""

    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """사용자 검색 (Manager IDAM Users)"""
        from ...manager.idam.users.models import User

        # 기본 쿼리
        query = select(User)

        # 검색어 필터
        search_filter = self._build_search_filter(
            User, search_query, ["full_name", "email", "username"]
        )
        if search_filter is not None:
            query = query.where(search_filter)

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(User.status == filters["status"])
        else:
            query = query.where(User.status == "ACTIVE")

        # 전체 개수
        count_query = select(func.count(User.id)).select_from(User)
        if search_filter is not None:
            count_query = count_query.where(search_filter)
        if filters and "status" in filters:
            count_query = count_query.where(User.status == filters["status"])
        else:
            count_query = count_query.where(User.status == "ACTIVE")

        count_result = await db.execute(count_query)
        total_count = count_result.scalar() or 0

        # 데이터 조회
        query = query.limit(limit).offset(offset).order_by(User.created_at.desc())
        result = await db.execute(query)
        users = result.scalars().all()

        # 응답 변환
        items = [
            CodeHelpResult(
                id=str(u.id),
                code=u.username,
                name=u.full_name,
                description=None,
                metadata={
                    "email": u.email,
                    "phone": u.phone,
                    "user_type": u.user_type,
                },
                status=u.status,
                created_at=u.created_at,
                updated_at=u.updated_at,
            )
            for u in users
        ]

        return total_count, items


class CommonCodeSearchHandler(CodeHelpHandler):
    """공통코드 검색 핸들러"""

    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """공통코드 검색 (부모코드 필터 가능)"""
        from ...tenants.sys.common_codes.models import CommonCode

        # 기본 쿼리
        query = select(CommonCode)

        # 검색어 필터
        search_filter = self._build_search_filter(
            CommonCode, search_query, ["code", "name"]
        )
        if search_filter is not None:
            query = query.where(search_filter)

        # 부모코드 필터 (중요)
        if filters and "parent_code" in filters:
            query = query.where(CommonCode.parent_code == filters["parent_code"])

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(CommonCode.status == filters["status"])
        else:
            query = query.where(CommonCode.status == "ACTIVE")

        # 전체 개수
        count_query = select(func.count(CommonCode.id)).select_from(CommonCode)
        if search_filter is not None:
            count_query = count_query.where(search_filter)
        if filters and "parent_code" in filters:
            count_query = count_query.where(CommonCode.parent_code == filters["parent_code"])
        if filters and "status" in filters:
            count_query = count_query.where(CommonCode.status == filters["status"])
        else:
            count_query = count_query.where(CommonCode.status == "ACTIVE")

        count_result = await db.execute(count_query)
        total_count = count_result.scalar() or 0

        # 데이터 조회
        query = query.limit(limit).offset(offset).order_by(CommonCode.sort_order, CommonCode.code)
        result = await db.execute(query)
        codes = result.scalars().all()

        # 응답 변환
        items = [
            CodeHelpResult(
                id=str(c.id),
                code=c.code,
                name=c.name,
                description=c.description,
                metadata={
                    "parent_code": c.parent_code,
                },
                status=c.status,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in codes
        ]

        return total_count, items


class ParentCodeSearchHandler(CodeHelpHandler):
    """상위코드 검색 핸들러 (공통코드의 부모만 검색)"""

    async def execute(
        self,
        db: AsyncSession,
        search_query: str,
        limit: int,
        offset: int,
        filters: Optional[Dict[str, Any]] = None,
    ) -> Tuple[int, List[CodeHelpResult]]:
        """상위코드 검색"""
        from ...tenants.sys.common_codes.models import CommonCode

        # 기본 쿼리 - parent_code가 NULL인 것들만 (부모 코드)
        query = select(CommonCode).where(CommonCode.parent_code == None)

        # 검색어 필터
        search_filter = self._build_search_filter(
            CommonCode, search_query, ["code", "name"]
        )
        if search_filter is not None:
            query = query.where(search_filter)

        # 상태 필터
        if filters and "status" in filters:
            query = query.where(CommonCode.status == filters["status"])
        else:
            query = query.where(CommonCode.status == "ACTIVE")

        # 전체 개수
        count_query = select(func.count(CommonCode.id)).select_from(CommonCode).where(CommonCode.parent_code == None)
        if search_filter is not None:
            count_query = count_query.where(search_filter)
        if filters and "status" in filters:
            count_query = count_query.where(CommonCode.status == filters["status"])
        else:
            count_query = count_query.where(CommonCode.status == "ACTIVE")

        count_result = await db.execute(count_query)
        total_count = count_result.scalar() or 0

        # 데이터 조회
        query = query.limit(limit).offset(offset).order_by(CommonCode.sort_order, CommonCode.code)
        result = await db.execute(query)
        codes = result.scalars().all()

        # 응답 변환
        items = [
            CodeHelpResult(
                id=str(c.id),
                code=c.code,
                name=c.name,
                description=c.description,
                metadata={},
                status=c.status,
                created_at=c.created_at,
                updated_at=c.updated_at,
            )
            for c in codes
        ]

        return total_count, items


# 검색 유형별 핸들러 매핑
CODE_HELP_HANDLERS = {
    "customer": CustomerSearchHandler(),
    "employee": EmployeeSearchHandler(),
    "user": UserSearchHandler(),
    "common_code": CommonCodeSearchHandler(),
    "parent_code": ParentCodeSearchHandler(),
}
