# GraphQL 엔티티 구현 계획

> 2025년 11월 11일
> 전체 models 기반 GraphQL 엔티티 순차 구현

---

## 📋 구현 순서

### Manager 시스템 (14개 스키마)

#### 1. ✅ IDAM (Identity & Access Management) - 8개 엔티티
- [x] Users ✅
- [ ] Roles
- [ ] Permissions
- [ ] Role_Permissions
- [ ] User_Roles
- [ ] API_Keys
- [ ] Sessions
- [ ] Login_Logs

#### 2. TNNT (Tenant Management) - 2개 엔티티
- [ ] Tenants
- [ ] Subscriptions

#### 3. BILL (Billing) - 3개 엔티티
- [ ] Plans
- [ ] Invoices
- [ ] Transactions

#### 4. CNFG (Configuration) - 4개 엔티티
- [ ] Configurations
- [ ] Feature_Flags
- [ ] Service_Quotas
- [ ] Tenant_Features

#### 5. AUDT (Audit) - 3개 엔티티
- [ ] Audit_Logs
- [ ] Policies
- [ ] Compliances

#### 6. MNTR (Monitoring) - 3개 엔티티
- [ ] System_Metrics
- [ ] Health_Checks
- [ ] Incidents

#### 7. NOTI (Notification) - 3개 엔티티
- [ ] Notifications
- [ ] Templates
- [ ] Campaigns

#### 8. SUPT (Support) - 3개 엔티티
- [ ] Tickets
- [ ] Ticket_Comments
- [ ] Feedbacks

#### 9. STAT (Statistics) - 2개 엔티티
- [ ] Tenant_Stats
- [ ] Usage_Stats

#### 10. IFRA (Infrastructure) - 2개 엔티티
- [ ] Resources
- [ ] Resource_Usages

#### 11. INTG (Integration) - 3개 엔티티
- [ ] APIs
- [ ] Webhooks
- [ ] Rate_Limits

#### 12. AUTO (Automation) - 3개 엔티티
- [ ] Workflows
- [ ] Tasks
- [ ] Executions

#### 13. BKUP (Backup) - 3개 엔티티
- [ ] Schedules
- [ ] Executions
- [ ] Recovery_Plans

---

### Tenants 시스템 (16개 스키마)

#### 1. ✅ SYS (System) - 9개 엔티티
- [x] Users ✅
- [ ] Roles
- [ ] Permissions
- [ ] Role_Permissions
- [ ] User_Roles
- [ ] Menus
- [ ] Sessions
- [ ] Code_Rules
- [ ] Permission_Conflict_Resolution

#### 2. CRM (Customer Relationship Management) - 19개 엔티티
- [ ] Partners (고객/공급사)
- [ ] Partner_Contacts
- [ ] Partner_Addresses
- [ ] Partner_Banks
- [ ] Partner_Managers
- [ ] Leads
- [ ] Opportunities
- [ ] Campaigns
- [ ] Campaign_Members
- [ ] Activities
- [ ] Interactions
- [ ] Contracts
- [ ] Customer_Segments
- [ ] Customer_Segment_Members
- [ ] Customer_Surveys
- [ ] Email_Templates
- [ ] RFQs (견적요청)
- [ ] RFQ_Items
- [ ] Sales_Targets

#### 3. HRM (Human Resource Management) - 9개 엔티티
- [ ] Employees
- [ ] Employee_Histories
- [ ] Departments
- [ ] Department_Histories
- [ ] Attendances
- [ ] Absences
- [ ] Leave_Policies
- [ ] Salary_Structures
- [ ] Payroll_Records

#### 4. PIM (Product Information Management) - 19개 엔티티
- [ ] Products
- [ ] Product_Variants
- [ ] Categories
- [ ] Category_Managers
- [ ] Brands
- [ ] Makers
- [ ] Product_Images
- [ ] Product_Tags
- [ ] Product_Options
- [ ] Product_Option_Values
- [ ] Product_Relations
- [ ] Product_Suppliers
- [ ] Product_Managers
- [ ] Product_Units
- [ ] Product_Unit_Conversions
- [ ] Product_Price_History

#### 5. IVM (Inventory Management) - 10개 엔티티
- [ ] Inventory_Balances
- [ ] Inventory_Movements
- [ ] Inventory_Adjustments
- [ ] Inventory_Transfers
- [ ] Inventory_Lots
- [ ] Inventory_Serial_Numbers
- [ ] Inventory_Reservations
- [ ] Inventory_Counts
- [ ] Inventory_Count_Items
- [ ] Inventory_Cycle_Counts

#### 6. SRM (Sales & Revenue Management) - 11개 엔티티
- [ ] Quotations
- [ ] Quotation_Items
- [ ] Sales_Orders
- [ ] Sales_Order_Items
- [ ] Sales_Deliveries
- [ ] Sales_Delivery_Items
- [ ] Sales_Invoices
- [ ] Sales_Invoice_Items
- [ ] Sales_Returns
- [ ] Sales_Return_Items
- [ ] Promotions
- [ ] Promotion_Usage

#### 7. PSM (Procurement & Supplier Management) - 11개 엔티티
- [ ] Purchase_Requisitions
- [ ] Purchase_Requisition_Items
- [ ] Purchase_Quotations
- [ ] Purchase_Quotation_Items
- [ ] Purchase_Orders
- [ ] Purchase_Order_Items
- [ ] Purchase_Order_Receipts
- [ ] Purchase_Order_Receipt_Items
- [ ] Purchase_Order_PR_Links
- [ ] Purchase_Price_Agreements

#### 8. FIM (Financial Management) - 9개 엔티티
- [ ] Accounts
- [ ] Journal_Entries
- [ ] Journal_Entry_Lines
- [ ] Accounts_Receivable
- [ ] Accounts_Payable
- [ ] Tax_Invoices
- [ ] Tax_Invoice_Lines
- [ ] Payment_Transactions
- [ ] Business_Documents

#### 9. WMS (Warehouse Management System) - 8개 엔티티
- [ ] Warehouses
- [ ] Warehouse_Locations
- [ ] Warehouse_Employees
- [ ] Inventory (WMS)
- [ ] Receiving
- [ ] Receiving_Items
- [ ] Shipping
- [ ] Shipping_Items

#### 10. FAM (Fixed Asset Management) - 3개 엔티티
- [ ] Fixed_Assets
- [ ] Asset_Depreciation
- [ ] Asset_Disposals

#### 11. ADM (Admin/Master Data) - 8개 엔티티
- [ ] Settings
- [ ] Code_Groups
- [ ] Codes
- [ ] Units
- [ ] Currencies
- [ ] Exchange_Rates
- [ ] Payment_Terms
- [ ] Glossary

#### 12. ASM (After-Sales Management) - 8개 엔티티
- [ ] Service_Requests
- [ ] Service_Works
- [ ] Service_Parts
- [ ] Support_Tickets
- [ ] Ticket_Comments
- [ ] FAQs
- [ ] NPS_Surveys
- [ ] Customer_Feedback

#### 13. APM (Approval Management) - 4개 엔티티
- [ ] Approval_Lines
- [ ] Approval_Line_Items
- [ ] Approval_Requests
- [ ] Approval_Histories

#### 14. LWM (Low-code Workflow Management) - 3개 엔티티
- [ ] Workflows
- [ ] Steps
- [ ] Tasks

#### 15. BIM (Business Intelligence & Metrics) - 4개 엔티티
- [ ] KPI_Definitions
- [ ] KPI_Targets
- [ ] Sales_Analytics
- [ ] Purchase_Analytics

---

## 📊 구현 통계

### Manager 시스템
- 총 스키마: 13개
- 총 엔티티: 51개
- 완료: 2개 (Users: Manager IDAM, Tenants SYS)
- 남은 작업: 49개

### Tenants 시스템
- 총 스키마: 15개
- 총 엔티티: 130개
- 완료: 1개 (SYS Users)
- 남은 작업: 129개

### 전체
- **총 181개 엔티티**
- **완료: 2개**
- **남은 작업: 179개**

---

## 🎯 1단계 구현 목표 (핵심 기능)

### Manager (우선순위 높음)
1. IDAM (완료율: 1/8)
   - [x] Users ✅
   - [ ] Roles
   - [ ] Permissions
   - [ ] User_Roles
   - [ ] Role_Permissions

2. TNNT (완료율: 0/2)
   - [ ] Tenants
   - [ ] Subscriptions

3. BILL (완료율: 0/3)
   - [ ] Plans
   - [ ] Invoices

### Tenants (우선순위 높음)
1. SYS (완료율: 1/9)
   - [x] Users ✅
   - [ ] Roles
   - [ ] Permissions
   - [ ] User_Roles
   - [ ] Role_Permissions
   - [ ] Menus

2. CRM (완료율: 0/19)
   - [ ] Partners
   - [ ] Partner_Contacts
   - [ ] Leads
   - [ ] Opportunities

3. PIM (완료율: 0/19)
   - [ ] Products
   - [ ] Product_Variants
   - [ ] Categories

4. HRM (완료율: 0/9)
   - [ ] Employees
   - [ ] Departments
   - [ ] Attendances

---

## 🚀 구현 순서 (제안)

### Phase 1: 기본 인증/권한 (1-2주)
1. Manager IDAM (Roles, Permissions, User_Roles, Role_Permissions)
2. Tenants SYS (Roles, Permissions, User_Roles, Role_Permissions, Menus)

### Phase 2: 테넌트 관리 (1주)
3. Manager TNNT (Tenants, Subscriptions)
4. Manager BILL (Plans, Invoices)

### Phase 3: 마스터 데이터 (1-2주)
5. Tenants ADM (Settings, Code_Groups, Codes, Units, Currencies)
6. Tenants PIM (Products, Categories, Brands)

### Phase 4: 핵심 업무 (2-3주)
7. Tenants CRM (Partners, Leads, Opportunities)
8. Tenants HRM (Employees, Departments, Attendances)
9. Tenants IVM (Inventory_Balances, Inventory_Movements)

### Phase 5: 영업/구매 (2-3주)
10. Tenants SRM (Sales_Orders, Sales_Invoices)
11. Tenants PSM (Purchase_Orders, Purchase_Receipts)

### Phase 6: 재무/창고 (2주)
12. Tenants FIM (Accounts, Journal_Entries)
13. Tenants WMS (Warehouses, Shipping, Receiving)

### Phase 7: 기타 기능 (2주)
14. Tenants ASM, APM, LWM, BIM
15. Manager MNTR, NOTI, SUPT, STAT

---

**작성일**: 2025년 11월 11일  
**예상 완료 기간**: 12-16주 (전체)  
**1단계 목표**: 4-6주

