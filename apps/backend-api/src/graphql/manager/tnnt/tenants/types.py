"""Manager TNNT Tenants - GraphQL Types

테넌트(Tenant) 관련 GraphQL 타입 정의
"""

from datetime import date, datetime

import strawberry

from src.graphql.common import Node
from src.graphql.common.scalars import JSONScalar


@strawberry.type(description="삭제 결과")
class DeleteResult:
    """삭제 작업 결과"""

    success: bool = strawberry.field(description="삭제 성공 여부")
    message: str = strawberry.field(description="삭제 결과 메시지")


@strawberry.type(name="ManagerTenant", description="Manager 테넌트")
class ManagerTenant(Node):
    """
    Manager 시스템 테넌트

    Manager 앱에서 서비스 이용사(고객)를 나타내는 테넌트입니다.
    각 테넌트는 독립적인 데이터 스키마를 가지며,
    멀티테넌트 아키텍처 하에서 데이터 격리를 보장합니다.
    """

    id: strawberry.ID

    # 기본 정보
    code: str = strawberry.field(description="테넌트 식별 코드 (스키마명으로 사용, 고유해야 함)")
    name: str = strawberry.field(description="테넌트명 (회사명)")
    type: str = strawberry.field(
        description="테넌트 유형 (TRIAL: 체험판, STANDARD: 표준, PREMIUM: 프리미엄, ENTERPRISE: 기업)"
    )

    # 사업자 등록 정보
    biz_no: str | None = strawberry.field(default=None, description="사업자등록번호 (국세청 발급)")
    biz_name: str | None = strawberry.field(default=None, description="상호(법인명)")
    biz_type: str | None = strawberry.field(
        default=None, description="사업자구분 (C: 법인, S: 개인)"
    )
    ceo_name: str | None = strawberry.field(default=None, description="대표자명")
    biz_kind: str | None = strawberry.field(default=None, description="업태 (사업의 형태나 성격)")
    biz_item: str | None = strawberry.field(default=None, description="종목 (구체적인 사업 품목)")

    # 주소 정보
    postcode: str | None = strawberry.field(default=None, description="우편번호 (사업장 소재지)")
    address1: str | None = strawberry.field(default=None, description="주소1 (기본주소)")
    address2: str | None = strawberry.field(default=None, description="주소2 (상세주소)")
    phone_no: str | None = strawberry.field(default=None, description="대표 전화번호")
    employee_count: int | None = strawberry.field(
        default=None, description="직원 수 (라이선스 관리용)"
    )

    # 계약 정보
    start_date: date = strawberry.field(description="계약 시작일")
    close_date: date | None = strawberry.field(
        default=None, description="계약 종료일 (NULL: 무기한)"
    )

    # 지역화 설정
    timezone: str | None = strawberry.field(
        default=None, description="시간대 (예: Asia/Seoul, America/New_York)"
    )
    locale: str | None = strawberry.field(
        default=None, description="로케일 (언어-국가, 예: ko-KR, en-US)"
    )
    currency: str | None = strawberry.field(
        default=None, description="기본 통화 (ISO 4217 코드, 예: KRW, USD)"
    )

    # 확장 가능한 메타데이터
    extra_data: JSONScalar | None = strawberry.field(
        default=None, description="추가 메타정보 (JSON 형태의 부가 정보)"
    )

    # 상태 관리
    status: str = strawberry.field(
        description="테넌트 상태 (TRIAL: 체험중, ACTIVE: 정상운영, SUSPENDED: 일시중단, TERMINATED: 계약종료)"
    )
    is_suspended: bool = strawberry.field(default=False, description="일시 중단 여부")
    suspended_reason: str | None = strawberry.field(default=None, description="중단 사유")
    suspended_date: datetime | None = strawberry.field(default=None, description="중단 일시")

    # 삭제 관리
    is_deleted: bool = strawberry.field(default=False, description="논리적 삭제 플래그")

    # 시스템 필드
    created_at: datetime = strawberry.field(description="생성일시")
    created_by: strawberry.ID | None = strawberry.field(default=None, description="생성자 ID")
    updated_at: datetime | None = strawberry.field(default=None, description="수정일시")
    updated_by: strawberry.ID | None = strawberry.field(default=None, description="수정자 ID")

    # NOTE: Field resolvers commented out due to circular import issues with Strawberry
    # These will be re-enabled after resolving the circular dependency structure
    # @strawberry.field(description="테넌트의 사용자 목록")
    # async def users(self, info, limit: int = 20, offset: int = 0) -> list["ManagerUser"]:
    #     """테넌트의 사용자 목록을 조회하는 필드 resolver"""
    #     pass


@strawberry.input(description="Manager 테넌트 생성 입력")
class ManagerTenantCreateInput:
    """
    Manager 테넌트 생성

    새로운 Manager 시스템 테넌트를 생성할 때 필요한 입력 데이터입니다.
    """

    code: str = strawberry.field(description="테넌트 식별 코드 (고유해야 함)")
    name: str = strawberry.field(description="테넌트명")
    type: str = strawberry.field(description="테넌트 유형 (TRIAL, STANDARD, PREMIUM, ENTERPRISE)")
    start_date: date = strawberry.field(description="계약 시작일")
    biz_no: str | None = None
    biz_name: str | None = None
    biz_type: str | None = None
    ceo_name: str | None = None
    biz_kind: str | None = None
    biz_item: str | None = None
    postcode: str | None = None
    address1: str | None = None
    address2: str | None = None
    phone_no: str | None = None
    employee_count: int | None = None
    close_date: date | None = None
    timezone: str | None = None
    locale: str | None = None
    currency: str | None = None
    extra_data: JSONScalar | None = None
    status: str | None = None
    is_suspended: bool | None = None
    suspended_reason: str | None = None
    suspended_date: datetime | None = None


@strawberry.input(description="Manager 테넌트 수정 입력")
class ManagerTenantUpdateInput:
    """
    Manager 테넌트 수정

    기존 테넌트의 정보를 수정할 때 사용합니다.
    모든 필드는 선택적이며, 제공된 필드만 업데이트됩니다.
    """

    code: str | None = None
    name: str | None = None
    type: str | None = None
    biz_no: str | None = None
    biz_name: str | None = None
    biz_type: str | None = None
    ceo_name: str | None = None
    biz_kind: str | None = None
    biz_item: str | None = None
    postcode: str | None = None
    address1: str | None = None
    address2: str | None = None
    phone_no: str | None = None
    employee_count: int | None = None
    start_date: date | None = None
    close_date: date | None = None
    timezone: str | None = None
    locale: str | None = None
    currency: str | None = None
    extra_data: JSONScalar | None = None
    status: str | None = None
    is_suspended: bool | None = None
    suspended_reason: str | None = None
    suspended_date: datetime | None = None
