"""NOTI 모델"""

from .campaigns import Campaigns
from .notifications import Notifications
from .templates import Templates


__all__ = [
    "Notifications",
    "Templates",
    "Campaigns",
]
