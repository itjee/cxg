"""Administration Module - ADM Module Routers"""

from src.modules.tenants.adm.code_groups.router import router as code_groups_router
from src.modules.tenants.adm.codes.router import router as codes_router
from src.modules.tenants.adm.currencies.router import router as currencies_router
from src.modules.tenants.adm.exchange_rates.router import router as exchange_rates_router
from src.modules.tenants.adm.payment_terms.router import router as payment_terms_router
from src.modules.tenants.adm.settings.router import router as settings_router
from src.modules.tenants.adm.units.router import router as units_router

__all__ = [
    "code_groups_router",
    "codes_router",
    "currencies_router",
    "exchange_rates_router",
    "payment_terms_router",
    "settings_router",
    "units_router",
]