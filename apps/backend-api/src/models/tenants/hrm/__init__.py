"""HRM 모듈 - 모든 테이블 모델 정의

9개의 테이블 모델을 포함합니다.
"""


from .absences import Absences
from .attendances import Attendances
from .department_histories import DepartmentHistories
from .departments import Departments
from .employee_histories import EmployeeHistories
from .employees import Employees
from .leave_policies import LeavePolicies
from .payroll_records import PayrollRecords
from .salary_structures import SalaryStructures

__all__ = [
    "Absences",
    "Attendances",
    "DepartmentHistories",
    "Departments",
    "EmployeeHistories",
    "Employees",
    "LeavePolicies",
    "PayrollRecords",
    "SalaryStructures",
]
