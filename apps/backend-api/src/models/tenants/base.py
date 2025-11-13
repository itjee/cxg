"""Tenant 모델 기본 클래스

테넌트 데이터베이스의 모든 모델이 상속하는 기본 클래스입니다.
상위 models/base.py의 TenantBaseModel을 재시보하여 사용합니다.
"""

from ..base import TenantBaseModel

__all__ = ["TenantBaseModel"]
