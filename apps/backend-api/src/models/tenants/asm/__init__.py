"""ASM 모듈 - 모든 테이블 모델 정의

8개의 테이블 모델을 포함합니다.
"""


from .customer_feedback import CustomerFeedback
from .faqs import Faqs
from .nps_surveys import NpsSurveys
from .service_parts import ServiceParts
from .service_requests import ServiceRequests
from .service_works import ServiceWorks
from .support_tickets import SupportTickets
from .ticket_comments import TicketComments

__all__ = [
    "CustomerFeedback",
    "Faqs",
    "NpsSurveys",
    "ServiceParts",
    "ServiceRequests",
    "ServiceWorks",
    "SupportTickets",
    "TicketComments",
]
