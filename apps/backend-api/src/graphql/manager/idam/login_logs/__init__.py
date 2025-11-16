"""Manager IDAM Login Logs"""

from .resolvers import resolve_manager_login_log_user
from .types import ManagerLoginLog


__all__ = ["ManagerLoginLog", "resolve_manager_login_log_user"]
