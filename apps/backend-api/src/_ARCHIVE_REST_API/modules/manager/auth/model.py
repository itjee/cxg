"""인증 모듈 ORM 모델"""

# auth 모듈에서는 manager.idam의 User 모델을 사용
from src.models.manager.idam import User


__all__ = ["User"]
