"""CSM 모듈 - 모든 테이블 모델 정의

19개의 테이블 모델을 포함합니다.
"""

from .activities import Activities
from .campaign_members import CampaignMembers
from .campaigns import Campaigns
from .contracts import Contracts
from .customer_segment_members import CustomerSegmentMembers
from .customer_segments import CustomerSegments
from .customer_surveys import CustomerSurveys
from .email_templates import EmailTemplates
from .interactions import Interactions
from .leads import Leads
from .opportunities import Opportunities
from .partner_addresses import PartnerAddresses
from .partner_banks import PartnerBanks
from .partner_contacts import PartnerContacts
from .partner_managers import PartnerManagers
from .partners import Partners
from .rfq_items import RfqItems
from .rfqs import Rfqs
from .sales_targets import SalesTargets


__all__ = [
    "Activities",
    "CampaignMembers",
    "Campaigns",
    "Contracts",
    "CustomerSegmentMembers",
    "CustomerSegments",
    "CustomerSurveys",
    "EmailTemplates",
    "Interactions",
    "Leads",
    "Opportunities",
    "PartnerAddresses",
    "PartnerBanks",
    "PartnerContacts",
    "PartnerManagers",
    "Partners",
    "RfqItems",
    "Rfqs",
    "SalesTargets",
]
