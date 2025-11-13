"""로깅 설정"""

import logging
import sys

from .config import settings


# 로거 설정
logger = logging.getLogger("cxg")
logger.setLevel(getattr(logging, settings.log_level.upper()))

# 핸들러 설정
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(getattr(logging, settings.log_level.upper()))

# 포맷 설정
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
handler.setFormatter(formatter)

logger.addHandler(handler)


def get_logger(name: str) -> logging.Logger:
    """로거 가져오기"""
    return logging.getLogger(f"cxg.{name}")
