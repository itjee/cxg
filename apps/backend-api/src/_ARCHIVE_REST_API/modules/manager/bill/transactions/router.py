"""거래(결제) 모듈 라우터 (API 엔드포인트)"""

from typing import Any
from uuid import UUID

from fastapi import Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.database import get_manager_db
from src.core.router import AuditedAPIRouter
from src.core.security import get_current_user
from src.modules.shareds.schemas import EnvelopeResponse

from .schemas import (
    TransactionCreate,
    TransactionListResponse,
    TransactionResponse,
    TransactionUpdate,
)
from .service import TransactionService

router = AuditedAPIRouter(prefix="/transactions", tags=["Transactions"])


@router.post(
    "",
    response_model=EnvelopeResponse[TransactionResponse],
    status_code=status.HTTP_201_CREATED,
    summary="거래 생성",
    description="새로운 거래를 생성합니다.",
)
async def create_transaction(
    data: TransactionCreate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TransactionResponse]:
    """거래를 생성합니다.

    요청 본문에 거래 정보를 포함하여 POST 요청을 보냅니다.

    Returns:
        생성된 거래 정보
    """
    creator_id = UUID(current_user["user_id"])
    transaction = await TransactionService.create(db, data, created_by=creator_id)
    return EnvelopeResponse.success_response(transaction)


@router.get(
    "",
    response_model=EnvelopeResponse[TransactionListResponse],
    summary="거래 목록 조회",
    description="거래 목록을 페이지네이션 및 필터링과 함께 조회합니다.",
)
async def list_transactions(
    page: int = Query(1, ge=1, description="페이지 번호 (1부터 시작)"),
    page_size: int = Query(20, ge=1, le=100, description="페이지당 항목 수"),
    search: str | None = Query(
        None,
        description="검색어 (거래 번호)",
        example="TXN-2024-001"
    ),
    status: str | None = Query(
        None,
        description="상태 필터",
        regex="^(PENDING|SUCCESS|FAILED|CANCELED)?$"
    ),
    tenant_id: UUID | None = Query(
        None,
        description="테넌트 ID 필터"
    ),
    transaction_type: str | None = Query(
        None,
        description="거래 유형 필터",
        regex="^(PAYMENT|REFUND|CHARGEBACK)?$"
    ),
    payment_gateway: str | None = Query(
        None,
        description="결제 게이트웨이 필터",
        example="STRIPE"
    ),
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TransactionListResponse]:
    """거래 목록을 조회합니다.

    페이지네이션, 검색, 필터링을 지원합니다.
    - search: 거래 번호로 부분 검색
    - status: PENDING, SUCCESS, FAILED, CANCELED 중 하나
    - tenant_id: 특정 테넌트의 거래만 조회
    - transaction_type: 거래 유형으로 필터링 (PAYMENT, REFUND, CHARGEBACK)
    - payment_gateway: 결제 게이트웨이로 필터링

    Returns:
        거래 목록 및 페이지 정보
    """
    result = await TransactionService.get_list(
        db,
        page=page,
        page_size=page_size,
        search=search,
        status=status,
        tenant_id=tenant_id,
        transaction_type=transaction_type,
        payment_gateway=payment_gateway,
    )
    return EnvelopeResponse.success_response(result)


@router.get(
    "/{transaction_id}",
    response_model=EnvelopeResponse[TransactionResponse],
    summary="거래 상세 조회",
    description="거래 상세 정보를 조회합니다.",
)
async def get_transaction(
    transaction_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TransactionResponse]:
    """거래 상세 정보를 조회합니다.

    Args:
        transaction_id: 거래 ID

    Returns:
        거래 상세 정보
    """
    transaction = await TransactionService.get_by_id(db, transaction_id)
    return EnvelopeResponse.success_response(transaction)


@router.put(
    "/{transaction_id}",
    response_model=EnvelopeResponse[TransactionResponse],
    summary="거래 수정",
    description="거래 정보를 수정합니다.",
)
async def update_transaction(
    transaction_id: UUID,
    data: TransactionUpdate,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[TransactionResponse]:
    """거래를 수정합니다.

    요청 본문에 수정할 필드만 포함하면 됩니다 (부분 업데이트).

    Args:
        transaction_id: 거래 ID
        data: 수정할 필드들

    Returns:
        수정된 거래 정보
    """
    updater_id = UUID(current_user["user_id"])
    transaction = await TransactionService.update(
        db,
        transaction_id,
        data,
        updated_by=updater_id
    )
    return EnvelopeResponse.success_response(transaction)


@router.delete(
    "/{transaction_id}",
    response_model=EnvelopeResponse[dict[str, str]],
    status_code=status.HTTP_200_OK,
    summary="거래 삭제",
    description="거래를 삭제합니다 (소프트 삭제).",
)
async def delete_transaction(
    transaction_id: UUID,
    db: AsyncSession = Depends(get_manager_db),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> EnvelopeResponse[dict[str, str]]:
    """거래를 삭제합니다 (소프트 삭제).

    실제로 데이터베이스에서 삭제되지 않으며,
    deleted 플래그만 TRUE로 변경됩니다.

    Args:
        transaction_id: 거래 ID

    Returns:
        삭제 완료 메시지
    """
    deleter_id = UUID(current_user["user_id"])
    await TransactionService.delete(db, transaction_id, deleted_by=deleter_id)
    return EnvelopeResponse.success_response(
        {"message": "거래가 삭제되었습니다"}
    )