"""SUPT 모델"""

from .feedbacks import Feedbacks
from .ticket_comments import TicketComments
from .tickets import Tickets


__all__ = [
    "Tickets",
    "TicketComments",
    "Feedbacks",
]
