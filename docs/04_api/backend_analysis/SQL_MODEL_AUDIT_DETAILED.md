# SQL DDL vs Python Models - Comprehensive Audit Report

**Date**: 2025-10-25

## Executive Summary

- **Total Issues**: 2634
- **🔴 Critical**: 367 - Requires immediate attention
- **🟡 Important**: 2027 - Should be fixed soon
- **🟢 Minor**: 240 - Low priority


## CRITICAL Issues (367)


### Schema: ADM (20 issues)


#### Missing Critical Column in Model (20)

**1. Table: `adm.currencies`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from currencies.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `adm.currencies`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from currencies.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `adm.currencies`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 통화 고유 식별자`
- **Model**: `Missing from currencies.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `adm.code_groups`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `adm.code_groups`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `adm.code_groups`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 코드그룹 고유 식별자`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `adm.units`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from units.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `adm.units`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from units.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `adm.units`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 고유 식별자`
- **Model**: `Missing from units.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `adm.payment_terms`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from payment_terms.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**11. Table: `adm.payment_terms`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결제 조건 고유 식별자`
- **Model**: `Missing from payment_terms.py`
- **Fix**: Ensure base class includes id or add to model

---

**12. Table: `adm.exchange_rates`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시 (추가)`
- **Model**: `Missing from exchange_rates.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**13. Table: `adm.exchange_rates`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from exchange_rates.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**14. Table: `adm.exchange_rates`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 환율 고유 식별자`
- **Model**: `Missing from exchange_rates.py`
- **Fix**: Ensure base class includes id or add to model

---

**15. Table: `adm.settings`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from settings.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**16. Table: `adm.settings`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from settings.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**17. Table: `adm.settings`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 설정 고유 식별자`
- **Model**: `Missing from settings.py`
- **Fix**: Ensure base class includes id or add to model

---

**18. Table: `adm.codes`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**19. Table: `adm.codes`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**20. Table: `adm.codes`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 코드 고유 식별자`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: APM (11 issues)


#### Missing Critical Column in Model (11)

**1. Table: `apm.approval_lines`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from approval_lines.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `apm.approval_lines`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from approval_lines.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `apm.approval_lines`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재선 고유 식별자`
- **Model**: `Missing from approval_lines.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `apm.approval_histories`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from approval_histories.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**5. Table: `apm.approval_histories`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재 이력 고유 식별자`
- **Model**: `Missing from approval_histories.py`
- **Fix**: Ensure base class includes id or add to model

---

**6. Table: `apm.approval_line_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from approval_line_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**7. Table: `apm.approval_line_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from approval_line_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**8. Table: `apm.approval_line_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재선 항목 고유 식별자`
- **Model**: `Missing from approval_line_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**9. Table: `apm.approval_requests`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from approval_requests.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**10. Table: `apm.approval_requests`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from approval_requests.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**11. Table: `apm.approval_requests`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결재 요청 고유 식별자`
- **Model**: `Missing from approval_requests.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: ASM (23 issues)


#### Missing Critical Column in Model (23)

**1. Table: `asm.nps_surveys`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from nps_surveys.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**2. Table: `asm.nps_surveys`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- NPS 설문 고유 식별자`
- **Model**: `Missing from nps_surveys.py`
- **Fix**: Ensure base class includes id or add to model

---

**3. Table: `asm.ticket_comments`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from ticket_comments.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**4. Table: `asm.ticket_comments`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from ticket_comments.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**5. Table: `asm.ticket_comments`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 댓글 고유 식별자`
- **Model**: `Missing from ticket_comments.py`
- **Fix**: Ensure base class includes id or add to model

---

**6. Table: `asm.support_tickets`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at                TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from support_tickets.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**7. Table: `asm.support_tickets`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from support_tickets.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**8. Table: `asm.support_tickets`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                        UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 지원 티켓 고유 식별자`
- **Model**: `Missing from support_tickets.py`
- **Fix**: Ensure base class includes id or add to model

---

**9. Table: `asm.faqs`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from faqs.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**10. Table: `asm.faqs`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from faqs.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**11. Table: `asm.faqs`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- FAQ 고유 식별자`
- **Model**: `Missing from faqs.py`
- **Fix**: Ensure base class includes id or add to model

---

**12. Table: `asm.service_requests`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from service_requests.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**13. Table: `asm.service_requests`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from service_requests.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**14. Table: `asm.service_requests`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 서비스 요청 고유 식별자`
- **Model**: `Missing from service_requests.py`
- **Fix**: Ensure base class includes id or add to model

---

**15. Table: `asm.service_works`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from service_works.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**16. Table: `asm.service_works`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from service_works.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**17. Table: `asm.service_works`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 작업 내역 고유 식별자`
- **Model**: `Missing from service_works.py`
- **Fix**: Ensure base class includes id or add to model

---

**18. Table: `asm.service_parts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from service_parts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**19. Table: `asm.service_parts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from service_parts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**20. Table: `asm.service_parts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 부품 사용 고유 식별자`
- **Model**: `Missing from service_parts.py`
- **Fix**: Ensure base class includes id or add to model

---

**21. Table: `asm.customer_feedback`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from customer_feedback.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**22. Table: `asm.customer_feedback`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from customer_feedback.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**23. Table: `asm.customer_feedback`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 피드백 고유 식별자`
- **Model**: `Missing from customer_feedback.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: BIM (12 issues)


#### Missing Critical Column in Model (12)

**1. Table: `bim.kpi_targets`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from kpi_targets.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `bim.kpi_targets`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from kpi_targets.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `bim.kpi_targets`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- KPI 목표 고유 식별자 (UUID)`
- **Model**: `Missing from kpi_targets.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `bim.purchase_analytics`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from purchase_analytics.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `bim.purchase_analytics`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from purchase_analytics.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `bim.purchase_analytics`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 구매 분석 고유 식별자 (UUID)`
- **Model**: `Missing from purchase_analytics.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `bim.kpi_definitions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from kpi_definitions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `bim.kpi_definitions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from kpi_definitions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `bim.kpi_definitions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- KPI 정의 고유 식별자 (UUID)`
- **Model**: `Missing from kpi_definitions.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `bim.sales_analytics`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from sales_analytics.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `bim.sales_analytics`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from sales_analytics.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `bim.sales_analytics`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매출 분석 고유 식별자 (UUID)`
- **Model**: `Missing from sales_analytics.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: COM (9 issues)


#### Missing Critical Column in Model (9)

**1. Table: `com.code_groups`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `com.code_groups`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `com.code_groups`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 그룹 고유 식별자 (UUID)`
- **Model**: `Missing from code_groups.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `com.workflows`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `com.workflows`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `com.workflows`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 워크플로우 고유 식별자 (UUID)`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `com.codes`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `com.codes`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `com.codes`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 고유 식별자 (UUID)`
- **Model**: `Missing from codes.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: CRM (51 issues)


#### Missing Critical Column in Model (51)

**1. Table: `crm.customer_surveys`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from customer_surveys.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `crm.customer_surveys`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from customer_surveys.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `crm.customer_surveys`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 설문 고유 식별자`
- **Model**: `Missing from customer_surveys.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `crm.sales_targets`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_targets.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `crm.sales_targets`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_targets.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `crm.sales_targets`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 목표 고유 식별자`
- **Model**: `Missing from sales_targets.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `crm.customer_segment_members`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from customer_segment_members.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `crm.customer_segment_members`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from customer_segment_members.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `crm.customer_segment_members`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 회원 고유 식별자`
- **Model**: `Missing from customer_segment_members.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `crm.partner_banks`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from partner_banks.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `crm.partner_banks`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from partner_banks.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `crm.partner_banks`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계좌정보 고유 식별자`
- **Model**: `Missing from partner_banks.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `crm.contracts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from contracts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `crm.contracts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from contracts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `crm.contracts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계약 고유 식별자`
- **Model**: `Missing from contracts.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `crm.interactions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from interactions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `crm.interactions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from interactions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `crm.interactions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 상호작용 고유 식별자`
- **Model**: `Missing from interactions.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `crm.partner_managers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from partner_managers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**20. Table: `crm.partner_managers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from partner_managers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**21. Table: `crm.partner_managers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 배정 고유 식별자`
- **Model**: `Missing from partner_managers.py`
- **Fix**: Ensure base class includes id or add to model

---

**22. Table: `crm.customer_segments`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from customer_segments.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**23. Table: `crm.customer_segments`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from customer_segments.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**24. Table: `crm.customer_segments`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세그먼트 고유 식별자`
- **Model**: `Missing from customer_segments.py`
- **Fix**: Ensure base class includes id or add to model

---

**25. Table: `crm.partners`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from partners.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**26. Table: `crm.partners`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from partners.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**27. Table: `crm.partners`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 거래처 고유 식별자`
- **Model**: `Missing from partners.py`
- **Fix**: Ensure base class includes id or add to model

---

**28. Table: `crm.rfq_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from rfq_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**29. Table: `crm.rfq_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from rfq_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**30. Table: `crm.rfq_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 요청 품목 고유 식별자`
- **Model**: `Missing from rfq_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**31. Table: `crm.rfqs`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from rfqs.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**32. Table: `crm.rfqs`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from rfqs.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**33. Table: `crm.rfqs`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 요청서 고유 식별자`
- **Model**: `Missing from rfqs.py`
- **Fix**: Ensure base class includes id or add to model

---

**34. Table: `crm.activities`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from activities.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**35. Table: `crm.activities`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from activities.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**36. Table: `crm.activities`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 활동 고유 식별자`
- **Model**: `Missing from activities.py`
- **Fix**: Ensure base class includes id or add to model

---

**37. Table: `crm.email_templates`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from email_templates.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**38. Table: `crm.email_templates`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from email_templates.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**39. Table: `crm.email_templates`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 템플릿 고유 식별자`
- **Model**: `Missing from email_templates.py`
- **Fix**: Ensure base class includes id or add to model

---

**40. Table: `crm.leads`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from leads.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**41. Table: `crm.leads`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from leads.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**42. Table: `crm.leads`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 리드 고유 식별자`
- **Model**: `Missing from leads.py`
- **Fix**: Ensure base class includes id or add to model

---

**43. Table: `crm.opportunities`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from opportunities.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**44. Table: `crm.opportunities`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from opportunities.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**45. Table: `crm.opportunities`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 영업 기회 고유 식별자`
- **Model**: `Missing from opportunities.py`
- **Fix**: Ensure base class includes id or add to model

---

**46. Table: `crm.partner_contacts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at          TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from partner_contacts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**47. Table: `crm.partner_contacts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from partner_contacts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**48. Table: `crm.partner_contacts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 고유 식별자 (UUID)`
- **Model**: `Missing from partner_contacts.py`
- **Fix**: Ensure base class includes id or add to model

---

**49. Table: `crm.partner_addresses`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at          TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from partner_addresses.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**50. Table: `crm.partner_addresses`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from partner_addresses.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**51. Table: `crm.partner_addresses`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 주소정보 고유 식별자 (UUID)`
- **Model**: `Missing from partner_addresses.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: FAM (9 issues)


#### Missing Critical Column in Model (9)

**1. Table: `fam.fixed_assets`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from fixed_assets.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `fam.fixed_assets`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from fixed_assets.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `fam.fixed_assets`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 고정자산 고유 식별자`
- **Model**: `Missing from fixed_assets.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `fam.asset_disposals`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from asset_disposals.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `fam.asset_disposals`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from asset_disposals.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `fam.asset_disposals`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 자산 처분 고유 식별자`
- **Model**: `Missing from asset_disposals.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `fam.asset_depreciation`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from asset_depreciation.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `fam.asset_depreciation`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from asset_depreciation.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `fam.asset_depreciation`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 감가상각 고유 식별자`
- **Model**: `Missing from asset_depreciation.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: FIM (27 issues)


#### Missing Critical Column in Model (27)

**1. Table: `fim.journal_entries`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from journal_entries.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `fim.journal_entries`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from journal_entries.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `fim.journal_entries`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 분개 전표 고유 식별자`
- **Model**: `Missing from journal_entries.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `fim.payment_transactions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from payment_transactions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `fim.payment_transactions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from payment_transactions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `fim.payment_transactions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 거래 고유 식별자`
- **Model**: `Missing from payment_transactions.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `fim.business_documents`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from business_documents.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `fim.business_documents`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from business_documents.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `fim.business_documents`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 업무전표 고유 식별자`
- **Model**: `Missing from business_documents.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `fim.accounts_receivable`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from accounts_receivable.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `fim.accounts_receivable`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from accounts_receivable.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `fim.accounts_receivable`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 매출채권 고유 식별자`
- **Model**: `Missing from accounts_receivable.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `fim.journal_entry_lines`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from journal_entry_lines.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `fim.journal_entry_lines`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from journal_entry_lines.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `fim.journal_entry_lines`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 분개 라인 고유 식별자`
- **Model**: `Missing from journal_entry_lines.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `fim.tax_invoice_lines`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from tax_invoice_lines.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `fim.tax_invoice_lines`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from tax_invoice_lines.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `fim.tax_invoice_lines`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세금계산서 상세 고유 식별자`
- **Model**: `Missing from tax_invoice_lines.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `fim.accounts_payable`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from accounts_payable.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**20. Table: `fim.accounts_payable`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from accounts_payable.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**21. Table: `fim.accounts_payable`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 매입채무 고유 식별자`
- **Model**: `Missing from accounts_payable.py`
- **Fix**: Ensure base class includes id or add to model

---

**22. Table: `fim.accounts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from accounts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**23. Table: `fim.accounts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from accounts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**24. Table: `fim.accounts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 계정과목 고유 식별자`
- **Model**: `Missing from accounts.py`
- **Fix**: Ensure base class includes id or add to model

---

**25. Table: `fim.tax_invoices`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from tax_invoices.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**26. Table: `fim.tax_invoices`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from tax_invoices.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**27. Table: `fim.tax_invoices`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 세금계산서 고유 식별자`
- **Model**: `Missing from tax_invoices.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: HRM (26 issues)


#### Missing Critical Column in Model (26)

**1. Table: `hrm.payroll_records`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from payroll_records.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `hrm.payroll_records`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from payroll_records.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `hrm.payroll_records`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 급여 내역 고유 식별자`
- **Model**: `Missing from payroll_records.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `hrm.department_histories`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from department_histories.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `hrm.department_histories`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from department_histories.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `hrm.department_histories`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이력 고유 식별자`
- **Model**: `Missing from department_histories.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `hrm.salary_structures`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from salary_structures.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `hrm.salary_structures`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from salary_structures.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `hrm.salary_structures`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 급여 구조 고유 식별자`
- **Model**: `Missing from salary_structures.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `hrm.employee_histories`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from employee_histories.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `hrm.employee_histories`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from employee_histories.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `hrm.employee_histories`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이력 고유 식별자`
- **Model**: `Missing from employee_histories.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `hrm.employees`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from employees.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `hrm.employees`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from employees.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `hrm.employees`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사원 고유 식별자`
- **Model**: `Missing from employees.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `hrm.absences`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from absences.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `hrm.absences`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from absences.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `hrm.absences`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 결근 고유 식별자`
- **Model**: `Missing from absences.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `hrm.leave_policies`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from leave_policies.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**20. Table: `hrm.leave_policies`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 휴가 정책 고유 식별자`
- **Model**: `Missing from leave_policies.py`
- **Fix**: Ensure base class includes id or add to model

---

**21. Table: `hrm.departments`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from departments.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**22. Table: `hrm.departments`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from departments.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**23. Table: `hrm.departments`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 부서 고유 식별자`
- **Model**: `Missing from departments.py`
- **Fix**: Ensure base class includes id or add to model

---

**24. Table: `hrm.attendances`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from attendances.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**25. Table: `hrm.attendances`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from attendances.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**26. Table: `hrm.attendances`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 근태 고유 식별자`
- **Model**: `Missing from attendances.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: IVM (30 issues)


#### Missing Critical Column in Model (30)

**1. Table: `ivm.inventory_movements`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_movements.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `ivm.inventory_movements`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_movements.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `ivm.inventory_movements`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이동 고유 식별자`
- **Model**: `Missing from inventory_movements.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `ivm.inventory_lots`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_lots.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `ivm.inventory_lots`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_lots.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `ivm.inventory_lots`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 로트 고유 식별자`
- **Model**: `Missing from inventory_lots.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `ivm.inventory_counts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_counts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `ivm.inventory_counts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_counts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `ivm.inventory_counts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 실사 고유 식별자`
- **Model**: `Missing from inventory_counts.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_cycle_counts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_cycle_counts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 순환 조사 고유 식별자`
- **Model**: `Missing from inventory_cycle_counts.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `ivm.inventory_transfers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_transfers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `ivm.inventory_transfers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_transfers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `ivm.inventory_transfers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이동 요청 고유 식별자`
- **Model**: `Missing from inventory_transfers.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `ivm.inventory_count_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_count_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `ivm.inventory_count_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_count_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `ivm.inventory_count_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 실사 항목 고유 식별자`
- **Model**: `Missing from inventory_count_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `ivm.inventory_adjustments`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_adjustments.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**20. Table: `ivm.inventory_adjustments`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_adjustments.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**21. Table: `ivm.inventory_adjustments`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 조정 고유 식별자`
- **Model**: `Missing from inventory_adjustments.py`
- **Fix**: Ensure base class includes id or add to model

---

**22. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_serial_numbers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**23. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_serial_numbers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**24. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 시리얼 고유 식별자`
- **Model**: `Missing from inventory_serial_numbers.py`
- **Fix**: Ensure base class includes id or add to model

---

**25. Table: `ivm.inventory_reservations`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_reservations.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**26. Table: `ivm.inventory_reservations`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_reservations.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**27. Table: `ivm.inventory_reservations`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 예약 고유 식별자`
- **Model**: `Missing from inventory_reservations.py`
- **Fix**: Ensure base class includes id or add to model

---

**28. Table: `ivm.inventory_balances`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory_balances.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**29. Table: `ivm.inventory_balances`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory_balances.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**30. Table: `ivm.inventory_balances`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 재고 고유 식별자`
- **Model**: `Missing from inventory_balances.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: LWM (12 issues)


#### Missing Critical Column in Model (12)

**1. Table: `lwm.steps`**

- **Issue**: Critical field 'tenant_id' is in SQL but missing from model (should be in base class)
- **SQL**: `tenant_id: tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID`
- **Model**: `Missing from steps.py`
- **Fix**: Ensure base class includes tenant_id or add to model

---

**2. Table: `lwm.steps`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from steps.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**3. Table: `lwm.steps`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from steps.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**4. Table: `lwm.steps`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단계 고유 식별자`
- **Model**: `Missing from steps.py`
- **Fix**: Ensure base class includes id or add to model

---

**5. Table: `lwm.tasks`**

- **Issue**: Critical field 'tenant_id' is in SQL but missing from model (should be in base class)
- **SQL**: `tenant_id: tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID`
- **Model**: `Missing from tasks.py`
- **Fix**: Ensure base class includes tenant_id or add to model

---

**6. Table: `lwm.tasks`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from tasks.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**7. Table: `lwm.tasks`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from tasks.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**8. Table: `lwm.tasks`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 작업 고유 식별자`
- **Model**: `Missing from tasks.py`
- **Fix**: Ensure base class includes id or add to model

---

**9. Table: `lwm.workflows`**

- **Issue**: Critical field 'tenant_id' is in SQL but missing from model (should be in base class)
- **SQL**: `tenant_id: tenant_id               UUID                     NOT NULL,                               -- 테넌트 ID`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes tenant_id or add to model

---

**10. Table: `lwm.workflows`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `lwm.workflows`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `lwm.workflows`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 워크플로우 고유 식별자`
- **Model**: `Missing from workflows.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: PIM (48 issues)


#### Missing Critical Column in Model (48)

**1. Table: `pim.categories`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from categories.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `pim.categories`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from categories.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `pim.categories`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 카테고리 고유 식별자 (UUID)`
- **Model**: `Missing from categories.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `pim.product_option_values`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_option_values.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `pim.product_option_values`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_option_values.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `pim.product_option_values`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 옵션 값 고유 식별자 (UUID)`
- **Model**: `Missing from product_option_values.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `pim.product_units`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_units.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `pim.product_units`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_units.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `pim.product_units`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 고유 식별자 (UUID)`
- **Model**: `Missing from product_units.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `pim.category_managers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from category_managers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `pim.category_managers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from category_managers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `pim.category_managers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 이력 고유 식별자 (UUID)`
- **Model**: `Missing from category_managers.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `pim.product_suppliers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_suppliers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `pim.product_suppliers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_suppliers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `pim.product_suppliers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 공급업체 관계 고유 식별자 (UUID)`
- **Model**: `Missing from product_suppliers.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `pim.product_relations`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_relations.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `pim.product_relations`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_relations.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `pim.product_relations`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 관계 고유 식별자 (UUID)`
- **Model**: `Missing from product_relations.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `pim.product_tags`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_tags.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**20. Table: `pim.product_tags`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_tags.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**21. Table: `pim.product_tags`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 태그 관계 고유 식별자 (UUID)`
- **Model**: `Missing from product_tags.py`
- **Fix**: Ensure base class includes id or add to model

---

**22. Table: `pim.product_price_history`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_price_history.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**23. Table: `pim.product_price_history`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_price_history.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**24. Table: `pim.product_price_history`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 가격 이력 고유 식별자 (UUID)`
- **Model**: `Missing from product_price_history.py`
- **Fix**: Ensure base class includes id or add to model

---

**25. Table: `pim.product_options`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_options.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**26. Table: `pim.product_options`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_options.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**27. Table: `pim.product_options`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 옵션 그룹 고유 식별자 (UUID)`
- **Model**: `Missing from product_options.py`
- **Fix**: Ensure base class includes id or add to model

---

**28. Table: `pim.product_images`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_images.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**29. Table: `pim.product_images`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_images.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**30. Table: `pim.product_images`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 이미지 고유 식별자 (UUID)`
- **Model**: `Missing from product_images.py`
- **Fix**: Ensure base class includes id or add to model

---

**31. Table: `pim.brands`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from brands.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**32. Table: `pim.brands`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from brands.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**33. Table: `pim.brands`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 브랜드 고유 식별자 (UUID)`
- **Model**: `Missing from brands.py`
- **Fix**: Ensure base class includes id or add to model

---

**34. Table: `pim.product_unit_conversions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_unit_conversions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**35. Table: `pim.product_unit_conversions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_unit_conversions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**36. Table: `pim.product_unit_conversions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 단위 변환 고유 식별자 (UUID)`
- **Model**: `Missing from product_unit_conversions.py`
- **Fix**: Ensure base class includes id or add to model

---

**37. Table: `pim.product_managers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_managers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**38. Table: `pim.product_managers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_managers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**39. Table: `pim.product_managers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 담당자 이력 고유 식별자 (UUID)`
- **Model**: `Missing from product_managers.py`
- **Fix**: Ensure base class includes id or add to model

---

**40. Table: `pim.makers`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from makers.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**41. Table: `pim.makers`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from makers.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**42. Table: `pim.makers`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 제조사 고유 식별자 (UUID)`
- **Model**: `Missing from makers.py`
- **Fix**: Ensure base class includes id or add to model

---

**43. Table: `pim.products`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from products.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**44. Table: `pim.products`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from products.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**45. Table: `pim.products`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 제품 고유 식별자 (UUID)`
- **Model**: `Missing from products.py`
- **Fix**: Ensure base class includes id or add to model

---

**46. Table: `pim.product_variants`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from product_variants.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**47. Table: `pim.product_variants`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from product_variants.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**48. Table: `pim.product_variants`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 변형 고유 식별자 (UUID)`
- **Model**: `Missing from product_variants.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: PSM (29 issues)


#### Missing Critical Column in Model (29)

**1. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_order_receipt_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_order_receipt_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 입고 품목 고유 식별자`
- **Model**: `Missing from purchase_order_receipt_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `psm.purchase_order_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_order_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `psm.purchase_order_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_order_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `psm.purchase_order_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 라인 고유 식별자`
- **Model**: `Missing from purchase_order_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `psm.purchase_requisition_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_requisition_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `psm.purchase_requisition_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_requisition_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `psm.purchase_requisition_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 라인 고유 식별자`
- **Model**: `Missing from purchase_requisition_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `psm.purchase_quotations`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_quotations.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `psm.purchase_quotations`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_quotations.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `psm.purchase_quotations`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 고유 식별자`
- **Model**: `Missing from purchase_quotations.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `psm.purchase_price_agreements`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_price_agreements.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `psm.purchase_price_agreements`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_price_agreements.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `psm.purchase_price_agreements`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 가격 계약 고유 식별자`
- **Model**: `Missing from purchase_price_agreements.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `psm.purchase_order_pr_links`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_order_pr_links.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**17. Table: `psm.purchase_order_pr_links`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 연결 고유 식별자`
- **Model**: `Missing from purchase_order_pr_links.py`
- **Fix**: Ensure base class includes id or add to model

---

**18. Table: `psm.purchase_order_receipts`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_order_receipts.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**19. Table: `psm.purchase_order_receipts`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_order_receipts.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**20. Table: `psm.purchase_order_receipts`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 입고 고유 식별자`
- **Model**: `Missing from purchase_order_receipts.py`
- **Fix**: Ensure base class includes id or add to model

---

**21. Table: `psm.purchase_quotation_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_quotation_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**22. Table: `psm.purchase_quotation_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_quotation_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**23. Table: `psm.purchase_quotation_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적 품목 고유 식별자`
- **Model**: `Missing from purchase_quotation_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**24. Table: `psm.purchase_orders`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_orders.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**25. Table: `psm.purchase_orders`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_orders.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**26. Table: `psm.purchase_orders`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매발주 고유 식별자`
- **Model**: `Missing from purchase_orders.py`
- **Fix**: Ensure base class includes id or add to model

---

**27. Table: `psm.purchase_requisitions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from purchase_requisitions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**28. Table: `psm.purchase_requisitions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from purchase_requisitions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**29. Table: `psm.purchase_requisitions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 구매요청 고유 식별자`
- **Model**: `Missing from purchase_requisitions.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: SRM (33 issues)


#### Missing Critical Column in Model (32)

**1. Table: `srm.sales_returns`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_returns.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `srm.sales_returns`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_returns.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `srm.sales_returns`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 반품 고유 식별자`
- **Model**: `Missing from sales_returns.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `srm.sales_delivery_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_delivery_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `srm.sales_delivery_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_delivery_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `srm.sales_delivery_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 출고 품목 고유 식별자`
- **Model**: `Missing from sales_delivery_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `srm.sales_deliveries`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_deliveries.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `srm.sales_deliveries`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_deliveries.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `srm.sales_deliveries`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 출고 고유 식별자`
- **Model**: `Missing from sales_deliveries.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `srm.sales_invoice_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_invoice_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `srm.sales_invoice_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_invoice_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `srm.sales_invoice_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 송장 품목 고유 식별자`
- **Model**: `Missing from sales_invoice_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `srm.sales_return_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_return_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `srm.sales_return_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_return_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `srm.sales_return_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 반품 품목 고유 식별자`
- **Model**: `Missing from sales_return_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**16. Table: `srm.quotation_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from quotation_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**17. Table: `srm.quotation_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from quotation_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**18. Table: `srm.quotation_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 품목 고유 식별자`
- **Model**: `Missing from quotation_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**19. Table: `srm.promotions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from promotions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**20. Table: `srm.promotions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from promotions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**21. Table: `srm.promotions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 프로모션 고유 식별자`
- **Model**: `Missing from promotions.py`
- **Fix**: Ensure base class includes id or add to model

---

**22. Table: `srm.quotations`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from quotations.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**23. Table: `srm.quotations`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from quotations.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**24. Table: `srm.quotations`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 견적서 고유 식별자`
- **Model**: `Missing from quotations.py`
- **Fix**: Ensure base class includes id or add to model

---

**25. Table: `srm.sales_order_items`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_order_items.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**26. Table: `srm.sales_order_items`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_order_items.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**27. Table: `srm.sales_order_items`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 품목 고유 식별자`
- **Model**: `Missing from sales_order_items.py`
- **Fix**: Ensure base class includes id or add to model

---

**28. Table: `srm.sales_orders`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from sales_orders.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**29. Table: `srm.sales_orders`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from sales_orders.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**30. Table: `srm.sales_orders`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 판매주문 고유 식별자`
- **Model**: `Missing from sales_orders.py`
- **Fix**: Ensure base class includes id or add to model

---

**31. Table: `srm.promotion_usage`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from promotion_usage.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**32. Table: `srm.promotion_usage`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 사용 이력 고유 식별자`
- **Model**: `Missing from promotion_usage.py`
- **Fix**: Ensure base class includes id or add to model

---


#### Missing SQL Table (1)

**1. Table: `srm.sales_invoices`**

- **Issue**: Model sales_invoices exists but has no SQL table definition
- **SQL**: `N/A`
- **Model**: `Model defined in sales_invoices.py`
- **Fix**: Create SQL DDL for table srm.sales_invoices

---


### Schema: SYS (15 issues)


#### Missing Critical Column in Model (15)

**1. Table: `sys.role_permissions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from role_permissions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `sys.role_permissions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from role_permissions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `sys.role_permissions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 매핑 고유 식별자 (UUID)`
- **Model**: `Missing from role_permissions.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `sys.users`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from users.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `sys.users`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from users.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `sys.users`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 사용자 고유 식별자 (UUID)`
- **Model**: `Missing from users.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `sys.code_rules`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from code_rules.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `sys.code_rules`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from code_rules.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `sys.code_rules`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 코드 규칙 고유 식별자 (UUID)`
- **Model**: `Missing from code_rules.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `sys.roles`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from roles.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `sys.roles`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from roles.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `sys.roles`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 역할 고유 식별자 (UUID)`
- **Model**: `Missing from roles.py`
- **Fix**: Ensure base class includes id or add to model

---

**13. Table: `sys.permissions`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP                WITH TIME ZONE,                                     -- 수정 일시`
- **Model**: `Missing from permissions.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**14. Table: `sys.permissions`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP                WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 등록 일시`
- **Model**: `Missing from permissions.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**15. Table: `sys.permissions`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),              -- 권한 고유 식별자 (UUID)`
- **Model**: `Missing from permissions.py`
- **Fix**: Ensure base class includes id or add to model

---


### Schema: WMS (12 issues)


#### Missing Critical Column in Model (12)

**1. Table: `wms.warehouses`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시`
- **Model**: `Missing from warehouses.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**2. Table: `wms.warehouses`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시`
- **Model**: `Missing from warehouses.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**3. Table: `wms.warehouses`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 창고 고유 식별자 (UUID)`
- **Model**: `Missing from warehouses.py`
- **Fix**: Ensure base class includes id or add to model

---

**4. Table: `wms.inventory`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at              TIMESTAMP WITH TIME ZONE,                                        -- 수정 일시`
- **Model**: `Missing from inventory.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**5. Table: `wms.inventory`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,     -- 등록 일시`
- **Model**: `Missing from inventory.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**6. Table: `wms.inventory`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                      UUID                     PRIMARY KEY DEFAULT gen_random_uuid(),  -- 재고 고유 식별자 (UUID)`
- **Model**: `Missing from inventory.py`
- **Fix**: Ensure base class includes id or add to model

---

**7. Table: `wms.warehouse_locations`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시`
- **Model**: `Missing from warehouse_locations.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**8. Table: `wms.warehouse_locations`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시`
- **Model**: `Missing from warehouse_locations.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**9. Table: `wms.warehouse_locations`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 로케이션 고유 식별자 (UUID)`
- **Model**: `Missing from warehouse_locations.py`
- **Fix**: Ensure base class includes id or add to model

---

**10. Table: `wms.warehouse_employees`**

- **Issue**: Critical field 'updated_at' is in SQL but missing from model (should be in base class)
- **SQL**: `updated_at: updated_at          TIMESTAMP WITH TIME ZONE,                                       -- 수정 일시`
- **Model**: `Missing from warehouse_employees.py`
- **Fix**: Ensure base class includes updated_at or add to model

---

**11. Table: `wms.warehouse_employees`**

- **Issue**: Critical field 'created_at' is in SQL but missing from model (should be in base class)
- **SQL**: `created_at: created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 등록 일시`
- **Model**: `Missing from warehouse_employees.py`
- **Fix**: Ensure base class includes created_at or add to model

---

**12. Table: `wms.warehouse_employees`**

- **Issue**: Critical field 'id' is in SQL but missing from model (should be in base class)
- **SQL**: `id: id                  UUID                     PRIMARY KEY DEFAULT gen_random_uuid(), -- 창고사원 고유 식별자 (UUID)`
- **Model**: `Missing from warehouse_employees.py`
- **Fix**: Ensure base class includes id or add to model

---


## IMPORTANT Issues (2027)


### Schema: ADM (58 issues)


#### Extra SQL Column (58)

**1. Table: `adm.currencies`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 통화명 (한글명)`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**2. Table: `adm.currencies`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**3. Table: `adm.currencies`**

- **Issue**: Column 'symbol' exists in SQL but not in model
- **SQL**: `symbol                  VARCHAR(10),                                                     -- 심볼 (¥, $, € 등)`
- **Model**: `N/A`
- **Fix**: Remove column symbol from SQL or add to model

---

**4. Table: `adm.currencies`**

- **Issue**: Column 'decimal_places' exists in SQL but not in model
- **SQL**: `decimal_places          INTEGER                  DEFAULT 2,                              -- 소수점 자릿수 (추가 - 통화별 자릿수)`
- **Model**: `N/A`
- **Fix**: Remove column decimal_places from SQL or add to model

---

**5. Table: `adm.currencies`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 통화명 (영문명) (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**6. Table: `adm.currencies`**

- **Issue**: Column 'is_base_currency' exists in SQL but not in model
- **SQL**: `is_base_currency        BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 통화 여부 (추가 - 환율 기준)`
- **Model**: `N/A`
- **Fix**: Remove column is_base_currency from SQL or add to model

---

**7. Table: `adm.currencies`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(3)               NOT NULL,                               -- 통화 코드 (ISO 4217 - 3자리 영대문자)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**8. Table: `adm.code_groups`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**9. Table: `adm.code_groups`**

- **Issue**: Column 'parent_group_id' exists in SQL but not in model
- **SQL**: `parent_group_id         UUID,                                                            -- 상위 그룹 식별자 (추가 - 계층구조 지원)`
- **Model**: `N/A`
- **Fix**: Remove column parent_group_id from SQL or add to model

---

**10. Table: `adm.code_groups`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 그룹명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**11. Table: `adm.code_groups`**

- **Issue**: Column 'sort_order' exists in SQL but not in model
- **SQL**: `sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column sort_order from SQL or add to model

---

**12. Table: `adm.code_groups`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**13. Table: `adm.code_groups`**

- **Issue**: Column 'level' exists in SQL but not in model
- **SQL**: `level                   INTEGER                  DEFAULT 1,                              -- 그룹 레벨 (추가 - 계층 레벨)`
- **Model**: `N/A`
- **Fix**: Remove column level from SQL or add to model

---

**14. Table: `adm.code_groups`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**15. Table: `adm.code_groups`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 그룹 코드 (영대문자, 숫자, 언더스코어)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**16. Table: `adm.units`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 단위명 (한글명)`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**17. Table: `adm.units`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**18. Table: `adm.units`**

- **Issue**: Column 'symbol' exists in SQL but not in model
- **SQL**: `symbol                  VARCHAR(10),                                                     -- 단위 심볼 (추가 - kg, m, L 등)`
- **Model**: `N/A`
- **Fix**: Remove column symbol from SQL or add to model

---

**19. Table: `adm.units`**

- **Issue**: Column 'unit_type' exists in SQL but not in model
- **SQL**: `unit_type               VARCHAR(20),                                                     -- 단위 유형 (QUANTITY/WEIGHT/LENGTH/VOLUME/AREA 등)`
- **Model**: `N/A`
- **Fix**: Remove column unit_type from SQL or add to model

---

**20. Table: `adm.units`**

- **Issue**: Column 'is_base_unit' exists in SQL but not in model
- **SQL**: `is_base_unit            BOOLEAN                  NOT NULL DEFAULT false,                 -- 기준 단위 여부 (추가 - 유형별 기준)`
- **Model**: `N/A`
- **Fix**: Remove column is_base_unit from SQL or add to model

---

**21. Table: `adm.units`**

- **Issue**: Column 'conversion_rate' exists in SQL but not in model
- **SQL**: `conversion_rate         NUMERIC(18,6),                                                   -- 기준 단위 환산율 (추가 - 예: 1kg = 1000g)`
- **Model**: `N/A`
- **Fix**: Remove column conversion_rate from SQL or add to model

---

**22. Table: `adm.units`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 단위명 (영문명) (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**23. Table: `adm.units`**

- **Issue**: Column 'base_unit_id' exists in SQL but not in model
- **SQL**: `base_unit_id            UUID,                                                            -- 기준 단위 식별자 (추가 - 단위 환산용)`
- **Model**: `N/A`
- **Fix**: Remove column base_unit_id from SQL or add to model

---

**24. Table: `adm.units`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 단위 코드 (영대문자, 숫자)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**25. Table: `adm.payment_terms`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**26. Table: `adm.payment_terms`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 결제 조건명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**27. Table: `adm.payment_terms`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**28. Table: `adm.payment_terms`**

- **Issue**: Column 'days_to_pay' exists in SQL but not in model
- **SQL**: `days_to_pay             INTEGER,                                                         -- 결제 기간 (일수, NULL이면 즉시 또는 조건 없음)`
- **Model**: `N/A`
- **Fix**: Remove column days_to_pay from SQL or add to model

---

**29. Table: `adm.payment_terms`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**30. Table: `adm.payment_terms`**

- **Issue**: Column 'is_cash_on_delivery' exists in SQL but not in model
- **SQL**: `is_cash_on_delivery     BOOLEAN                  DEFAULT false,                          -- 착불 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_cash_on_delivery from SQL or add to model

---

**31. Table: `adm.payment_terms`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL UNIQUE,                        -- 결제 조건 코드 (COD, NET7, NET15, NET30, NET45, NET60, NET90, PREPAID)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**32. Table: `adm.exchange_rates`**

- **Issue**: Column 'rate_type' exists in SQL but not in model
- **SQL**: `rate_type               VARCHAR(20)              DEFAULT 'SPOT',                         -- 환율 유형 (추가 - SPOT/FORWARD/BUYING/SELLING)`
- **Model**: `N/A`
- **Fix**: Remove column rate_type from SQL or add to model

---

**33. Table: `adm.exchange_rates`**

- **Issue**: Column 'from_currency' exists in SQL but not in model
- **SQL**: `from_currency           VARCHAR(3)               NOT NULL,                               -- 기준 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column from_currency from SQL or add to model

---

**34. Table: `adm.exchange_rates`**

- **Issue**: Column 'rate_date' exists in SQL but not in model
- **SQL**: `rate_date               DATE                     NOT NULL,                               -- 환율 적용일`
- **Model**: `N/A`
- **Fix**: Remove column rate_date from SQL or add to model

---

**35. Table: `adm.exchange_rates`**

- **Issue**: Column 'source' exists in SQL but not in model
- **SQL**: `source                  VARCHAR(50),                                                     -- 환율 출처 (추가 - 중앙은행, API 등)`
- **Model**: `N/A`
- **Fix**: Remove column source from SQL or add to model

---

**36. Table: `adm.exchange_rates`**

- **Issue**: Column 'rate' exists in SQL but not in model
- **SQL**: `rate                    NUMERIC(18,6)            NOT NULL,                               -- 환율 (소수점 6자리까지)`
- **Model**: `N/A`
- **Fix**: Remove column rate from SQL or add to model

---

**37. Table: `adm.exchange_rates`**

- **Issue**: Column 'to_currency' exists in SQL but not in model
- **SQL**: `to_currency             VARCHAR(3)               NOT NULL,                               -- 대상 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column to_currency from SQL or add to model

---

**38. Table: `adm.settings`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**39. Table: `adm.settings`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**40. Table: `adm.settings`**

- **Issue**: Column 'value' exists in SQL but not in model
- **SQL**: `value                   TEXT,                                                            -- 설정 값`
- **Model**: `N/A`
- **Fix**: Remove column value from SQL or add to model

---

**41. Table: `adm.settings`**

- **Issue**: Column 'is_system' exists in SQL but not in model
- **SQL**: `is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 설정 여부 (추가 - 수정 제한)`
- **Model**: `N/A`
- **Fix**: Remove column is_system from SQL or add to model

---

**42. Table: `adm.settings`**

- **Issue**: Column 'key' exists in SQL but not in model
- **SQL**: `key                     VARCHAR(100)             NOT NULL,                               -- 설정 키 (도메인.기능.속성 형태 권장)`
- **Model**: `N/A`
- **Fix**: Remove column key from SQL or add to model

---

**43. Table: `adm.settings`**

- **Issue**: Column 'value_type' exists in SQL but not in model
- **SQL**: `value_type              VARCHAR(20)              NOT NULL DEFAULT 'STRING',              -- 값 타입 (STRING/NUMBER/BOOLEAN/JSON)`
- **Model**: `N/A`
- **Fix**: Remove column value_type from SQL or add to model

---

**44. Table: `adm.settings`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                     -- 카테고리 (system/tenant/feature 등)`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**45. Table: `adm.settings`**

- **Issue**: Column 'is_encrypted' exists in SQL but not in model
- **SQL**: `is_encrypted            BOOLEAN                  NOT NULL DEFAULT false,                 -- 암호화 여부 (추가 - 민감정보 표시)`
- **Model**: `N/A`
- **Fix**: Remove column is_encrypted from SQL or add to model

---

**46. Table: `adm.settings`**

- **Issue**: Column 'default_value' exists in SQL but not in model
- **SQL**: `default_value           TEXT,                                                            -- 기본값 (추가 - 설정 초기화용)`
- **Model**: `N/A`
- **Fix**: Remove column default_value from SQL or add to model

---

**47. Table: `adm.codes`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**48. Table: `adm.codes`**

- **Issue**: Column 'attribute2' exists in SQL but not in model
- **SQL**: `attribute2              VARCHAR(100),                                                    -- 추가 속성2 (추가 - 확장 속성)`
- **Model**: `N/A`
- **Fix**: Remove column attribute2 from SQL or add to model

---

**49. Table: `adm.codes`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 코드명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**50. Table: `adm.codes`**

- **Issue**: Column 'sort_order' exists in SQL but not in model
- **SQL**: `sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column sort_order from SQL or add to model

---

**51. Table: `adm.codes`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**52. Table: `adm.codes`**

- **Issue**: Column 'is_system' exists in SQL but not in model
- **SQL**: `is_system               BOOLEAN                  NOT NULL DEFAULT false,                 -- 시스템 코드 여부 (추가 - 수정/삭제 제한)`
- **Model**: `N/A`
- **Fix**: Remove column is_system from SQL or add to model

---

**53. Table: `adm.codes`**

- **Issue**: Column 'attribute1' exists in SQL but not in model
- **SQL**: `attribute1              VARCHAR(100),                                                    -- 추가 속성1 (추가 - 확장 속성)`
- **Model**: `N/A`
- **Fix**: Remove column attribute1 from SQL or add to model

---

**54. Table: `adm.codes`**

- **Issue**: Column 'attribute3' exists in SQL but not in model
- **SQL**: `attribute3              VARCHAR(100),                                                    -- 추가 속성3 (추가 - 확장 속성)`
- **Model**: `N/A`
- **Fix**: Remove column attribute3 from SQL or add to model

---

**55. Table: `adm.codes`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(200),                                                    -- 영문 코드명 (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**56. Table: `adm.codes`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**57. Table: `adm.codes`**

- **Issue**: Column 'group_id' exists in SQL but not in model
- **SQL**: `group_id                UUID                     NOT NULL,                               -- 코드그룹 식별자`
- **Model**: `N/A`
- **Fix**: Remove column group_id from SQL or add to model

---

**58. Table: `adm.codes`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 코드값 (영대문자, 숫자, 언더스코어)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---


### Schema: APM (35 issues)


#### Extra SQL Column (35)

**1. Table: `apm.approval_lines`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**2. Table: `apm.approval_lines`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**3. Table: `apm.approval_lines`**

- **Issue**: Column 'line_code' exists in SQL but not in model
- **SQL**: `line_code               VARCHAR(50)              NOT NULL,                               -- 결재선 코드`
- **Model**: `N/A`
- **Fix**: Remove column line_code from SQL or add to model

---

**4. Table: `apm.approval_lines`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 적용 부서`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**5. Table: `apm.approval_lines`**

- **Issue**: Column 'document_type' exists in SQL but not in model
- **SQL**: `document_type           VARCHAR(50)              NOT NULL,                               -- 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column document_type from SQL or add to model

---

**6. Table: `apm.approval_lines`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**7. Table: `apm.approval_lines`**

- **Issue**: Column 'line_name' exists in SQL but not in model
- **SQL**: `line_name               VARCHAR(200)             NOT NULL,                               -- 결재선명`
- **Model**: `N/A`
- **Fix**: Remove column line_name from SQL or add to model

---

**8. Table: `apm.approval_histories`**

- **Issue**: Column 'step_no' exists in SQL but not in model
- **SQL**: `step_no                 INTEGER                  NOT NULL,                               -- 결재 단계`
- **Model**: `N/A`
- **Fix**: Remove column step_no from SQL or add to model

---

**9. Table: `apm.approval_histories`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE CASCADE`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**10. Table: `apm.approval_histories`**

- **Issue**: Column 'comment' exists in SQL but not in model
- **SQL**: `comment                 TEXT,                                                            -- 의견`
- **Model**: `N/A`
- **Fix**: Remove column comment from SQL or add to model

---

**11. Table: `apm.approval_histories`**

- **Issue**: Column 'request_id' exists in SQL but not in model
- **SQL**: `request_id              UUID                     NOT NULL,                               -- 결재 요청 식별자`
- **Model**: `N/A`
- **Fix**: Remove column request_id from SQL or add to model

---

**12. Table: `apm.approval_histories`**

- **Issue**: Column 'approver_id' exists in SQL but not in model
- **SQL**: `approver_id             UUID                     NOT NULL,                               -- 결재자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column approver_id from SQL or add to model

---

**13. Table: `apm.approval_histories`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,              -- 결재 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**14. Table: `apm.approval_histories`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES apm.approval_requests(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**15. Table: `apm.approval_histories`**

- **Issue**: Column 'action' exists in SQL but not in model
- **SQL**: `action                  VARCHAR(20)              NOT NULL,                               -- 결재 행동`
- **Model**: `N/A`
- **Fix**: Remove column action from SQL or add to model

---

**16. Table: `apm.approval_line_items`**

- **Issue**: Column 'step_no' exists in SQL but not in model
- **SQL**: `step_no                 INTEGER                  NOT NULL,                               -- 결재 단계 번호`
- **Model**: `N/A`
- **Fix**: Remove column step_no from SQL or add to model

---

**17. Table: `apm.approval_line_items`**

- **Issue**: Column 'approver_type' exists in SQL but not in model
- **SQL**: `approver_type           VARCHAR(20)              DEFAULT 'EMPLOYEE',                     -- 결재자 유형`
- **Model**: `N/A`
- **Fix**: Remove column approver_type from SQL or add to model

---

**18. Table: `apm.approval_line_items`**

- **Issue**: Column 'is_required' exists in SQL but not in model
- **SQL**: `is_required             BOOLEAN                  DEFAULT true,                           -- 필수 결재 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_required from SQL or add to model

---

**19. Table: `apm.approval_line_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE CASCADE`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**20. Table: `apm.approval_line_items`**

- **Issue**: Column 'approver_id' exists in SQL but not in model
- **SQL**: `approver_id             UUID                     NOT NULL,                               -- 결재자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column approver_id from SQL or add to model

---

**21. Table: `apm.approval_line_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES apm.approval_lines(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**22. Table: `apm.approval_line_items`**

- **Issue**: Column 'line_id' exists in SQL but not in model
- **SQL**: `line_id                 UUID                     NOT NULL,                               -- 결재선 식별자`
- **Model**: `N/A`
- **Fix**: Remove column line_id from SQL or add to model

---

**23. Table: `apm.approval_requests`**

- **Issue**: Column 'current_step' exists in SQL but not in model
- **SQL**: `current_step            INTEGER                  DEFAULT 1,                              -- 현재 결재 단계`
- **Model**: `N/A`
- **Fix**: Remove column current_step from SQL or add to model

---

**24. Table: `apm.approval_requests`**

- **Issue**: Column 'requester_id' exists in SQL but not in model
- **SQL**: `requester_id            UUID                     NOT NULL,                               -- 요청자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column requester_id from SQL or add to model

---

**25. Table: `apm.approval_requests`**

- **Issue**: Column 'content' exists in SQL but not in model
- **SQL**: `content                 TEXT,                                                            -- 내용`
- **Model**: `N/A`
- **Fix**: Remove column content from SQL or add to model

---

**26. Table: `apm.approval_requests`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**27. Table: `apm.approval_requests`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**28. Table: `apm.approval_requests`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 요청 부서`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**29. Table: `apm.approval_requests`**

- **Issue**: Column 'document_id' exists in SQL but not in model
- **SQL**: `document_id             UUID                     NOT NULL,                               -- 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column document_id from SQL or add to model

---

**30. Table: `apm.approval_requests`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 결재 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**31. Table: `apm.approval_requests`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES apm.approval_lines(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**32. Table: `apm.approval_requests`**

- **Issue**: Column 'subject' exists in SQL but not in model
- **SQL**: `subject                 VARCHAR(500)             NOT NULL,                               -- 제목`
- **Model**: `N/A`
- **Fix**: Remove column subject from SQL or add to model

---

**33. Table: `apm.approval_requests`**

- **Issue**: Column 'document_type' exists in SQL but not in model
- **SQL**: `document_type           VARCHAR(50)              NOT NULL,                               -- 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column document_type from SQL or add to model

---

**34. Table: `apm.approval_requests`**

- **Issue**: Column 'request_code' exists in SQL but not in model
- **SQL**: `request_code            VARCHAR(50)              NOT NULL,                               -- 결재 요청 코드`
- **Model**: `N/A`
- **Fix**: Remove column request_code from SQL or add to model

---

**35. Table: `apm.approval_requests`**

- **Issue**: Column 'line_id' exists in SQL but not in model
- **SQL**: `line_id                 UUID,                                                            -- 사용된 결재선`
- **Model**: `N/A`
- **Fix**: Remove column line_id from SQL or add to model

---


### Schema: ASM (112 issues)


#### Extra SQL Column (112)

**1. Table: `asm.nps_surveys`**

- **Issue**: Column 'nps_score' exists in SQL but not in model
- **SQL**: `nps_score               INTEGER                  NOT NULL,                               -- NPS 점수 (0-10)`
- **Model**: `N/A`
- **Fix**: Remove column nps_score from SQL or add to model

---

**2. Table: `asm.nps_surveys`**

- **Issue**: Column 'response_time_days' exists in SQL but not in model
- **SQL**: `response_time_days      INTEGER,                                                         -- 응답까지 소요 일수`
- **Model**: `N/A`
- **Fix**: Remove column response_time_days from SQL or add to model

---

**3. Table: `asm.nps_surveys`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**4. Table: `asm.nps_surveys`**

- **Issue**: Column 'response_date' exists in SQL but not in model
- **SQL**: `response_date           DATE,                                                            -- 응답일`
- **Model**: `N/A`
- **Fix**: Remove column response_date from SQL or add to model

---

**5. Table: `asm.nps_surveys`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**6. Table: `asm.nps_surveys`**

- **Issue**: Column 'sent_date' exists in SQL but not in model
- **SQL**: `sent_date               DATE,                                                            -- 설문 발송일`
- **Model**: `N/A`
- **Fix**: Remove column sent_date from SQL or add to model

---

**7. Table: `asm.nps_surveys`**

- **Issue**: Column 'recommendation_reason' exists in SQL but not in model
- **SQL**: `recommendation_reason   VARCHAR(20),                                                     -- 추천 의향 (PROMOTER, PASSIVE, DETRACTOR)`
- **Model**: `N/A`
- **Fix**: Remove column recommendation_reason from SQL or add to model

---

**8. Table: `asm.nps_surveys`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**9. Table: `asm.nps_surveys`**

- **Issue**: Column 'recommendation_text' exists in SQL but not in model
- **SQL**: `recommendation_text     TEXT,                                                            -- 추천 사유/개선점`
- **Model**: `N/A`
- **Fix**: Remove column recommendation_text from SQL or add to model

---

**10. Table: `asm.ticket_comments`**

- **Issue**: Column 'comment_type' exists in SQL but not in model
- **SQL**: `comment_type            VARCHAR(20)              DEFAULT 'COMMENT',                      -- 댓글 유형 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column comment_type from SQL or add to model

---

**11. Table: `asm.ticket_comments`**

- **Issue**: Column 'ticket_id' exists in SQL but not in model
- **SQL**: `ticket_id               UUID                     NOT NULL,                               -- 티켓 식별자`
- **Model**: `N/A`
- **Fix**: Remove column ticket_id from SQL or add to model

---

**12. Table: `asm.ticket_comments`**

- **Issue**: Column 'comment_text' exists in SQL but not in model
- **SQL**: `comment_text            TEXT                     NOT NULL,                               -- 댓글 내용`
- **Model**: `N/A`
- **Fix**: Remove column comment_text from SQL or add to model

---

**13. Table: `asm.ticket_comments`**

- **Issue**: Column 'attachments' exists in SQL but not in model
- **SQL**: `attachments             JSONB,                                                           -- 첨부파일 정보 (JSON 배열) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column attachments from SQL or add to model

---

**14. Table: `asm.ticket_comments`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**15. Table: `asm.ticket_comments`**

- **Issue**: Column 'is_internal' exists in SQL but not in model
- **SQL**: `is_internal             BOOLEAN                  DEFAULT false,                          -- 내부 메모 여부 (true: 내부용, false: 고객 공개)`
- **Model**: `N/A`
- **Fix**: Remove column is_internal from SQL or add to model

---

**16. Table: `asm.support_tickets`**

- **Issue**: Column 'contact_phone' exists in SQL but not in model
- **SQL**: `contact_phone             VARCHAR(50),                                                     -- 문의자 연락처`
- **Model**: `N/A`
- **Fix**: Remove column contact_phone from SQL or add to model

---

**17. Table: `asm.support_tickets`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description               TEXT,                                                            -- 문의 상세 내용`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**18. Table: `asm.support_tickets`**

- **Issue**: Column 'resolution' exists in SQL but not in model
- **SQL**: `resolution                TEXT,                                                            -- 해결 내용`
- **Model**: `N/A`
- **Fix**: Remove column resolution from SQL or add to model

---

**19. Table: `asm.support_tickets`**

- **Issue**: Column 'contact_email' exists in SQL but not in model
- **SQL**: `contact_email             VARCHAR(255),                                                    -- 문의자 이메일`
- **Model**: `N/A`
- **Fix**: Remove column contact_email from SQL or add to model

---

**20. Table: `asm.support_tickets`**

- **Issue**: Column 'closed_at' exists in SQL but not in model
- **SQL**: `closed_at                 TIMESTAMP WITH TIME ZONE,                                        -- 종료 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column closed_at from SQL or add to model

---

**21. Table: `asm.support_tickets`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                    VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**22. Table: `asm.support_tickets`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                  VARCHAR(50),                                                     -- 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**23. Table: `asm.support_tickets`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted                BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**24. Table: `asm.support_tickets`**

- **Issue**: Column 'contact_name' exists in SQL but not in model
- **SQL**: `contact_name              VARCHAR(100),                                                    -- 문의자 이름`
- **Model**: `N/A`
- **Fix**: Remove column contact_name from SQL or add to model

---

**25. Table: `asm.support_tickets`**

- **Issue**: Column 'resolution_time_minutes' exists in SQL but not in model
- **SQL**: `resolution_time_minutes   INTEGER,                                                         -- 해결 소요 시간 (분) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column resolution_time_minutes from SQL or add to model

---

**26. Table: `asm.support_tickets`**

- **Issue**: Column 'satisfaction_rating' exists in SQL but not in model
- **SQL**: `satisfaction_rating       INTEGER,                                                         -- 만족도 평가 (1-5점)`
- **Model**: `N/A`
- **Fix**: Remove column satisfaction_rating from SQL or add to model

---

**27. Table: `asm.support_tickets`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                  VARCHAR(20)              DEFAULT 'MEDIUM',                       -- 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**28. Table: `asm.support_tickets`**

- **Issue**: Column 'assigned_to' exists in SQL but not in model
- **SQL**: `assigned_to               UUID,                                                            -- 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column assigned_to from SQL or add to model

---

**29. Table: `asm.support_tickets`**

- **Issue**: Column 'satisfaction_comment' exists in SQL but not in model
- **SQL**: `satisfaction_comment      TEXT,                                                            -- 만족도 평가 코멘트 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column satisfaction_comment from SQL or add to model

---

**30. Table: `asm.support_tickets`**

- **Issue**: Column 'linked_service_request_id' exists in SQL but not in model
- **SQL**: `linked_service_request_id UUID,                                                            -- 연계된 A/S 요청 식별자`
- **Model**: `N/A`
- **Fix**: Remove column linked_service_request_id from SQL or add to model

---

**31. Table: `asm.support_tickets`**

- **Issue**: Column 'sub_category' exists in SQL but not in model
- **SQL**: `sub_category              VARCHAR(50),                                                     -- 하위 카테고리 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column sub_category from SQL or add to model

---

**32. Table: `asm.support_tickets`**

- **Issue**: Column 'subject' exists in SQL but not in model
- **SQL**: `subject                   VARCHAR(255)             NOT NULL,                               -- 문의 제목`
- **Model**: `N/A`
- **Fix**: Remove column subject from SQL or add to model

---

**33. Table: `asm.support_tickets`**

- **Issue**: Column 'resolved_at' exists in SQL but not in model
- **SQL**: `resolved_at               TIMESTAMP WITH TIME ZONE,                                        -- 해결 일시`
- **Model**: `N/A`
- **Fix**: Remove column resolved_at from SQL or add to model

---

**34. Table: `asm.support_tickets`**

- **Issue**: Column 'ticket_code' exists in SQL but not in model
- **SQL**: `ticket_code               VARCHAR(50)              NOT NULL,                               -- 티켓 코드`
- **Model**: `N/A`
- **Fix**: Remove column ticket_code from SQL or add to model

---

**35. Table: `asm.support_tickets`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id               UUID,                                                            -- 고객 식별자 (NULL 가능: 비회원 문의)`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**36. Table: `asm.faqs`**

- **Issue**: Column 'answer_summary' exists in SQL but not in model
- **SQL**: `answer_summary          VARCHAR(500),                                                    -- 답변 요약`
- **Model**: `N/A`
- **Fix**: Remove column answer_summary from SQL or add to model

---

**37. Table: `asm.faqs`**

- **Issue**: Column 'question_en' exists in SQL but not in model
- **SQL**: `question_en             TEXT,                                                            -- 질문 (영문)`
- **Model**: `N/A`
- **Fix**: Remove column question_en from SQL or add to model

---

**38. Table: `asm.faqs`**

- **Issue**: Column 'is_published' exists in SQL but not in model
- **SQL**: `is_published            BOOLEAN                  DEFAULT true,                           -- 공개 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_published from SQL or add to model

---

**39. Table: `asm.faqs`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                     -- 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**40. Table: `asm.faqs`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**41. Table: `asm.faqs`**

- **Issue**: Column 'video_url' exists in SQL but not in model
- **SQL**: `video_url               VARCHAR(500),                                                    -- 동영상 URL`
- **Model**: `N/A`
- **Fix**: Remove column video_url from SQL or add to model

---

**42. Table: `asm.faqs`**

- **Issue**: Column 'view_count' exists in SQL but not in model
- **SQL**: `view_count              INTEGER                  DEFAULT 0,                              -- 조회수`
- **Model**: `N/A`
- **Fix**: Remove column view_count from SQL or add to model

---

**43. Table: `asm.faqs`**

- **Issue**: Column 'not_helpful_count' exists in SQL but not in model
- **SQL**: `not_helpful_count       INTEGER                  DEFAULT 0,                              -- 도움안됨 카운트`
- **Model**: `N/A`
- **Fix**: Remove column not_helpful_count from SQL or add to model

---

**44. Table: `asm.faqs`**

- **Issue**: Column 'answer_en' exists in SQL but not in model
- **SQL**: `answer_en               TEXT,                                                            -- 답변 (영문)`
- **Model**: `N/A`
- **Fix**: Remove column answer_en from SQL or add to model

---

**45. Table: `asm.faqs`**

- **Issue**: Column 'related_articles' exists in SQL but not in model
- **SQL**: `related_articles        JSONB,                                                           -- 관련 문서 (JSON 배열)`
- **Model**: `N/A`
- **Fix**: Remove column related_articles from SQL or add to model

---

**46. Table: `asm.faqs`**

- **Issue**: Column 'is_featured' exists in SQL but not in model
- **SQL**: `is_featured             BOOLEAN                  DEFAULT false,                          -- 추천 FAQ 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_featured from SQL or add to model

---

**47. Table: `asm.faqs`**

- **Issue**: Column 'answer' exists in SQL but not in model
- **SQL**: `answer                  TEXT                     NOT NULL,                               -- 답변`
- **Model**: `N/A`
- **Fix**: Remove column answer from SQL or add to model

---

**48. Table: `asm.faqs`**

- **Issue**: Column 'sub_category' exists in SQL but not in model
- **SQL**: `sub_category            VARCHAR(50),                                                     -- 하위 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column sub_category from SQL or add to model

---

**49. Table: `asm.faqs`**

- **Issue**: Column 'tags' exists in SQL but not in model
- **SQL**: `tags                    VARCHAR(200),                                                    -- 태그 (쉼표 구분)`
- **Model**: `N/A`
- **Fix**: Remove column tags from SQL or add to model

---

**50. Table: `asm.faqs`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**51. Table: `asm.faqs`**

- **Issue**: Column 'question' exists in SQL but not in model
- **SQL**: `question                TEXT                     NOT NULL,                               -- 질문`
- **Model**: `N/A`
- **Fix**: Remove column question from SQL or add to model

---

**52. Table: `asm.faqs`**

- **Issue**: Column 'helpful_count' exists in SQL but not in model
- **SQL**: `helpful_count           INTEGER                  DEFAULT 0,                              -- 도움됨 카운트`
- **Model**: `N/A`
- **Fix**: Remove column helpful_count from SQL or add to model

---

**53. Table: `asm.service_requests`**

- **Issue**: Column 'scheduled_date' exists in SQL but not in model
- **SQL**: `scheduled_date          DATE,                                                            -- 예약 작업일`
- **Model**: `N/A`
- **Fix**: Remove column scheduled_date from SQL or add to model

---

**54. Table: `asm.service_requests`**

- **Issue**: Column 'warranty_end_date' exists in SQL but not in model
- **SQL**: `warranty_end_date       DATE,                                                            -- 보증 종료일`
- **Model**: `N/A`
- **Fix**: Remove column warranty_end_date from SQL or add to model

---

**55. Table: `asm.service_requests`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 코드`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**56. Table: `asm.service_requests`**

- **Issue**: Column 'is_warranty' exists in SQL but not in model
- **SQL**: `is_warranty             BOOLEAN                  DEFAULT false,                          -- 보증기간 내 A/S 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_warranty from SQL or add to model

---

**57. Table: `asm.service_requests`**

- **Issue**: Column 'estimated_cost' exists in SQL but not in model
- **SQL**: `estimated_cost          NUMERIC(18,4)            DEFAULT 0,                              -- 예상 비용`
- **Model**: `N/A`
- **Fix**: Remove column estimated_cost from SQL or add to model

---

**58. Table: `asm.service_requests`**

- **Issue**: Column 'issue_description' exists in SQL but not in model
- **SQL**: `issue_description       TEXT                     NOT NULL,                               -- 문제 및 고장 내용 설명`
- **Model**: `N/A`
- **Fix**: Remove column issue_description from SQL or add to model

---

**59. Table: `asm.service_requests`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 실제 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**60. Table: `asm.service_requests`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'RECEIVED',                     -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**61. Table: `asm.service_requests`**

- **Issue**: Column 'actual_cost' exists in SQL but not in model
- **SQL**: `actual_cost             NUMERIC(18,4)            DEFAULT 0,                              -- 실제 비용`
- **Model**: `N/A`
- **Fix**: Remove column actual_cost from SQL or add to model

---

**62. Table: `asm.service_requests`**

- **Issue**: Column 'sr_code' exists in SQL but not in model
- **SQL**: `sr_code                 VARCHAR(50)              NOT NULL,                               -- A/S 요청 코드`
- **Model**: `N/A`
- **Fix**: Remove column sr_code from SQL or add to model

---

**63. Table: `asm.service_requests`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**64. Table: `asm.service_requests`**

- **Issue**: Column 'assigned_technician_id' exists in SQL but not in model
- **SQL**: `assigned_technician_id  UUID,                                                            -- 배정된 기술자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column assigned_technician_id from SQL or add to model

---

**65. Table: `asm.service_requests`**

- **Issue**: Column 'service_type' exists in SQL but not in model
- **SQL**: `service_type            VARCHAR(20)              DEFAULT 'REPAIR',                       -- A/S 유형`
- **Model**: `N/A`
- **Fix**: Remove column service_type from SQL or add to model

---

**66. Table: `asm.service_requests`**

- **Issue**: Column 'purchase_date' exists in SQL but not in model
- **SQL**: `purchase_date           DATE,                                                            -- 제품 구매 일자`
- **Model**: `N/A`
- **Fix**: Remove column purchase_date from SQL or add to model

---

**67. Table: `asm.service_requests`**

- **Issue**: Column 'technician_notes' exists in SQL but not in model
- **SQL**: `technician_notes        TEXT,                                                            -- 기술자 메모`
- **Model**: `N/A`
- **Fix**: Remove column technician_notes from SQL or add to model

---

**68. Table: `asm.service_requests`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                VARCHAR(20)              DEFAULT 'MEDIUM',                       -- 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**69. Table: `asm.service_requests`**

- **Issue**: Column 'issue_category' exists in SQL but not in model
- **SQL**: `issue_category          VARCHAR(50),                                                     -- 문제 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column issue_category from SQL or add to model

---

**70. Table: `asm.service_requests`**

- **Issue**: Column 'customer_notes' exists in SQL but not in model
- **SQL**: `customer_notes          TEXT,                                                            -- 고객 요청사항`
- **Model**: `N/A`
- **Fix**: Remove column customer_notes from SQL or add to model

---

**71. Table: `asm.service_requests`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 제품 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**72. Table: `asm.service_requests`**

- **Issue**: Column 'expected_completion_date' exists in SQL but not in model
- **SQL**: `expected_completion_date DATE,                                                           -- 예상 완료일`
- **Model**: `N/A`
- **Fix**: Remove column expected_completion_date from SQL or add to model

---

**73. Table: `asm.service_requests`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID,                                                            -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**74. Table: `asm.service_requests`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**75. Table: `asm.service_works`**

- **Issue**: Column 'labor_cost' exists in SQL but not in model
- **SQL**: `labor_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 인건비`
- **Model**: `N/A`
- **Fix**: Remove column labor_cost from SQL or add to model

---

**76. Table: `asm.service_works`**

- **Issue**: Column 'labor_hours' exists in SQL but not in model
- **SQL**: `labor_hours             NUMERIC(5,2)             DEFAULT 0,                              -- 작업 소요 시간 (시간 단위)`
- **Model**: `N/A`
- **Fix**: Remove column labor_hours from SQL or add to model

---

**77. Table: `asm.service_works`**

- **Issue**: Column 'work_start_time' exists in SQL but not in model
- **SQL**: `work_start_time         TIME,                                                            -- 작업 시작 시간 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column work_start_time from SQL or add to model

---

**78. Table: `asm.service_works`**

- **Issue**: Column 'total_cost' exists in SQL but not in model
- **SQL**: `total_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 총 비용 (인건비 + 부품비 + 기타)`
- **Model**: `N/A`
- **Fix**: Remove column total_cost from SQL or add to model

---

**79. Table: `asm.service_works`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'COMPLETED',                    -- 작업 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**80. Table: `asm.service_works`**

- **Issue**: Column 'service_request_id' exists in SQL but not in model
- **SQL**: `service_request_id      UUID                     NOT NULL,                               -- A/S 요청 식별자`
- **Model**: `N/A`
- **Fix**: Remove column service_request_id from SQL or add to model

---

**81. Table: `asm.service_works`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**82. Table: `asm.service_works`**

- **Issue**: Column 'result_notes' exists in SQL but not in model
- **SQL**: `result_notes            TEXT,                                                            -- 작업 결과 메모 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column result_notes from SQL or add to model

---

**83. Table: `asm.service_works`**

- **Issue**: Column 'other_cost' exists in SQL but not in model
- **SQL**: `other_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 기타 비용 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column other_cost from SQL or add to model

---

**84. Table: `asm.service_works`**

- **Issue**: Column 'work_result' exists in SQL but not in model
- **SQL**: `work_result             VARCHAR(20),                                                     -- 작업 결과 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column work_result from SQL or add to model

---

**85. Table: `asm.service_works`**

- **Issue**: Column 'technician_id' exists in SQL but not in model
- **SQL**: `technician_id           UUID                     NOT NULL,                               -- 작업 기술자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column technician_id from SQL or add to model

---

**86. Table: `asm.service_works`**

- **Issue**: Column 'work_date' exists in SQL but not in model
- **SQL**: `work_date               DATE                     NOT NULL,                               -- 작업 실시 일자`
- **Model**: `N/A`
- **Fix**: Remove column work_date from SQL or add to model

---

**87. Table: `asm.service_works`**

- **Issue**: Column 'work_description' exists in SQL but not in model
- **SQL**: `work_description        TEXT                     NOT NULL,                               -- 작업 내용 상세 설명`
- **Model**: `N/A`
- **Fix**: Remove column work_description from SQL or add to model

---

**88. Table: `asm.service_works`**

- **Issue**: Column 'work_end_time' exists in SQL but not in model
- **SQL**: `work_end_time           TIME,                                                            -- 작업 종료 시간 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column work_end_time from SQL or add to model

---

**89. Table: `asm.service_works`**

- **Issue**: Column 'parts_cost' exists in SQL but not in model
- **SQL**: `parts_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 부품비`
- **Model**: `N/A`
- **Fix**: Remove column parts_cost from SQL or add to model

---

**90. Table: `asm.service_parts`**

- **Issue**: Column 'part_name' exists in SQL but not in model
- **SQL**: `part_name               VARCHAR(200),                                                    -- 부품명`
- **Model**: `N/A`
- **Fix**: Remove column part_name from SQL or add to model

---

**91. Table: `asm.service_parts`**

- **Issue**: Column 'part_condition' exists in SQL but not in model
- **SQL**: `part_condition          VARCHAR(20),                                                     -- 부품 상태`
- **Model**: `N/A`
- **Fix**: Remove column part_condition from SQL or add to model

---

**92. Table: `asm.service_parts`**

- **Issue**: Column 'total_cost' exists in SQL but not in model
- **SQL**: `total_cost              NUMERIC(18,4)            NOT NULL,                               -- 총 비용 (단가 × 수량)`
- **Model**: `N/A`
- **Fix**: Remove column total_cost from SQL or add to model

---

**93. Table: `asm.service_parts`**

- **Issue**: Column 'warranty_months' exists in SQL but not in model
- **SQL**: `warranty_months         INTEGER,                                                         -- 부품 보증 개월수`
- **Model**: `N/A`
- **Fix**: Remove column warranty_months from SQL or add to model

---

**94. Table: `asm.service_parts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**95. Table: `asm.service_parts`**

- **Issue**: Column 'service_request_id' exists in SQL but not in model
- **SQL**: `service_request_id      UUID                     NOT NULL,                               -- A/S 요청 식별자`
- **Model**: `N/A`
- **Fix**: Remove column service_request_id from SQL or add to model

---

**96. Table: `asm.service_parts`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 부품 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**97. Table: `asm.service_parts`**

- **Issue**: Column 'part_code' exists in SQL but not in model
- **SQL**: `part_code               VARCHAR(50),                                                     -- 부품 코드`
- **Model**: `N/A`
- **Fix**: Remove column part_code from SQL or add to model

---

**98. Table: `asm.service_parts`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**99. Table: `asm.service_parts`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 사용 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**100. Table: `asm.service_parts`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 부품(제품) 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**101. Table: `asm.service_parts`**

- **Issue**: Column 'unit_cost' exists in SQL but not in model
- **SQL**: `unit_cost               NUMERIC(18,4)            NOT NULL,                               -- 부품 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_cost from SQL or add to model

---

**102. Table: `asm.customer_feedback`**

- **Issue**: Column 'feedback_categories' exists in SQL but not in model
- **SQL**: `feedback_categories     VARCHAR(100)[],                                                  -- 피드백 카테고리 배열 (품질, 배송, 고객서비스, 가격 등)`
- **Model**: `N/A`
- **Fix**: Remove column feedback_categories from SQL or add to model

---

**103. Table: `asm.customer_feedback`**

- **Issue**: Column 'response_text' exists in SQL but not in model
- **SQL**: `response_text           TEXT,                                                            -- 회신 내용`
- **Model**: `N/A`
- **Fix**: Remove column response_text from SQL or add to model

---

**104. Table: `asm.customer_feedback`**

- **Issue**: Column 'response_by' exists in SQL but not in model
- **SQL**: `response_by             UUID,                                                            -- 회신자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column response_by from SQL or add to model

---

**105. Table: `asm.customer_feedback`**

- **Issue**: Column 'transaction_type' exists in SQL but not in model
- **SQL**: `transaction_type        VARCHAR(20)              NOT NULL,                               -- 거래 유형 (SALE, SERVICE, SUPPORT)`
- **Model**: `N/A`
- **Fix**: Remove column transaction_type from SQL or add to model

---

**106. Table: `asm.customer_feedback`**

- **Issue**: Column 'comment' exists in SQL but not in model
- **SQL**: `comment                 TEXT,                                                            -- 피드백 의견`
- **Model**: `N/A`
- **Fix**: Remove column comment from SQL or add to model

---

**107. Table: `asm.customer_feedback`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'NEW',                 -- 상태 (NEW, REVIEWED, RESPONDED, CLOSED)`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**108. Table: `asm.customer_feedback`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**109. Table: `asm.customer_feedback`**

- **Issue**: Column 'rating' exists in SQL but not in model
- **SQL**: `rating                  INTEGER                  NOT NULL,                               -- 별점 (1-5)`
- **Model**: `N/A`
- **Fix**: Remove column rating from SQL or add to model

---

**110. Table: `asm.customer_feedback`**

- **Issue**: Column 'response_date' exists in SQL but not in model
- **SQL**: `response_date           TIMESTAMP WITH TIME ZONE,                                        -- 회신 일시`
- **Model**: `N/A`
- **Fix**: Remove column response_date from SQL or add to model

---

**111. Table: `asm.customer_feedback`**

- **Issue**: Column 'transaction_id' exists in SQL but not in model
- **SQL**: `transaction_id          UUID,                                                            -- 거래 식별자 (주문, 서비스, 티켓)`
- **Model**: `N/A`
- **Fix**: Remove column transaction_id from SQL or add to model

---

**112. Table: `asm.customer_feedback`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---


### Schema: BIM (96 issues)


#### Extra SQL Column (96)

**1. Table: `bim.kpi_targets`**

- **Issue**: Column 'target_period' exists in SQL but not in model
- **SQL**: `target_period           VARCHAR(7)               NOT NULL,                                           -- 목표 기간 (YYYY-MM)`
- **Model**: `N/A`
- **Fix**: Remove column target_period from SQL or add to model

---

**2. Table: `bim.kpi_targets`**

- **Issue**: Column 'performance_grade' exists in SQL but not in model
- **SQL**: `performance_grade       VARCHAR(10),                                                                 -- 성과 등급 (S/A/B/C/D) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column performance_grade from SQL or add to model

---

**3. Table: `bim.kpi_targets`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                                        -- 부서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**4. Table: `bim.kpi_targets`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'IN_PROGRESS',                              -- 상태 (NOT_STARTED/IN_PROGRESS/ACHIEVED/NOT_ACHIEVED/EXCEEDED) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**5. Table: `bim.kpi_targets`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE,                                                                        -- 시작일 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**6. Table: `bim.kpi_targets`**

- **Issue**: Column 'fiscal_year' exists in SQL but not in model
- **SQL**: `fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_year from SQL or add to model

---

**7. Table: `bim.kpi_targets`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**8. Table: `bim.kpi_targets`**

- **Issue**: Column 'actual_value' exists in SQL but not in model
- **SQL**: `actual_value            NUMERIC(18,4),                                                               -- 실적값`
- **Model**: `N/A`
- **Fix**: Remove column actual_value from SQL or add to model

---

**9. Table: `bim.kpi_targets`**

- **Issue**: Column 'user_id' exists in SQL but not in model
- **SQL**: `user_id                 UUID,                                                                        -- 사용자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column user_id from SQL or add to model

---

**10. Table: `bim.kpi_targets`**

- **Issue**: Column 'variance_rate' exists in SQL but not in model
- **SQL**: `variance_rate           NUMERIC(5,2),                                                                -- 편차율 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column variance_rate from SQL or add to model

---

**11. Table: `bim.kpi_targets`**

- **Issue**: Column 'variance_value' exists in SQL but not in model
- **SQL**: `variance_value          NUMERIC(18,4),                                                               -- 편차값 (실적-목표) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column variance_value from SQL or add to model

---

**12. Table: `bim.kpi_targets`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                                        -- 종료일 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**13. Table: `bim.kpi_targets`**

- **Issue**: Column 'last_measured_at' exists in SQL but not in model
- **SQL**: `last_measured_at        TIMESTAMP                WITH TIME ZONE,                                     -- 최종 측정 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column last_measured_at from SQL or add to model

---

**14. Table: `bim.kpi_targets`**

- **Issue**: Column 'kpi_id' exists in SQL but not in model
- **SQL**: `kpi_id                  UUID                     NOT NULL,                                           -- KPI 정의 식별자`
- **Model**: `N/A`
- **Fix**: Remove column kpi_id from SQL or add to model

---

**15. Table: `bim.kpi_targets`**

- **Issue**: Column 'quarter' exists in SQL but not in model
- **SQL**: `quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column quarter from SQL or add to model

---

**16. Table: `bim.kpi_targets`**

- **Issue**: Column 'action_plan' exists in SQL but not in model
- **SQL**: `action_plan             TEXT,                                                                        -- 실행 계획 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column action_plan from SQL or add to model

---

**17. Table: `bim.kpi_targets`**

- **Issue**: Column 'target_value' exists in SQL but not in model
- **SQL**: `target_value            NUMERIC(18,4)            NOT NULL,                                           -- 목표값`
- **Model**: `N/A`
- **Fix**: Remove column target_value from SQL or add to model

---

**18. Table: `bim.kpi_targets`**

- **Issue**: Column 'team_id' exists in SQL but not in model
- **SQL**: `team_id                 UUID,                                                                        -- 팀 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column team_id from SQL or add to model

---

**19. Table: `bim.kpi_targets`**

- **Issue**: Column 'achievement_rate' exists in SQL but not in model
- **SQL**: `achievement_rate        NUMERIC(5,2),                                                                -- 달성률 (%)`
- **Model**: `N/A`
- **Fix**: Remove column achievement_rate from SQL or add to model

---

**20. Table: `bim.kpi_targets`**

- **Issue**: Column 'comments' exists in SQL but not in model
- **SQL**: `comments                TEXT,                                                                        -- 코멘트/메모 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column comments from SQL or add to model

---

**21. Table: `bim.purchase_analytics`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**22. Table: `bim.purchase_analytics`**

- **Issue**: Column 'yoy_growth_rate' exists in SQL but not in model
- **SQL**: `yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column yoy_growth_rate from SQL or add to model

---

**23. Table: `bim.purchase_analytics`**

- **Issue**: Column 'purchase_qty' exists in SQL but not in model
- **SQL**: `purchase_qty            INTEGER                  DEFAULT 0,                                          -- 구매 수량`
- **Model**: `N/A`
- **Fix**: Remove column purchase_qty from SQL or add to model

---

**24. Table: `bim.purchase_analytics`**

- **Issue**: Column 'item_category_id' exists in SQL but not in model
- **SQL**: `item_category_id        UUID,                                                                        -- 품목 카테고리 식별자`
- **Model**: `N/A`
- **Fix**: Remove column item_category_id from SQL or add to model

---

**25. Table: `bim.purchase_analytics`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                                        -- 부서 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**26. Table: `bim.purchase_analytics`**

- **Issue**: Column 'return_qty' exists in SQL but not in model
- **SQL**: `return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column return_qty from SQL or add to model

---

**27. Table: `bim.purchase_analytics`**

- **Issue**: Column 'mom_growth_rate' exists in SQL but not in model
- **SQL**: `mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column mom_growth_rate from SQL or add to model

---

**28. Table: `bim.purchase_analytics`**

- **Issue**: Column 'vendor_id' exists in SQL but not in model
- **SQL**: `vendor_id               UUID,                                                                        -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column vendor_id from SQL or add to model

---

**29. Table: `bim.purchase_analytics`**

- **Issue**: Column 'exchange_rate' exists in SQL but not in model
- **SQL**: `exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column exchange_rate from SQL or add to model

---

**30. Table: `bim.purchase_analytics`**

- **Issue**: Column 'fiscal_year' exists in SQL but not in model
- **SQL**: `fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_year from SQL or add to model

---

**31. Table: `bim.purchase_analytics`**

- **Issue**: Column 'return_amount' exists in SQL but not in model
- **SQL**: `return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column return_amount from SQL or add to model

---

**32. Table: `bim.purchase_analytics`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**33. Table: `bim.purchase_analytics`**

- **Issue**: Column 'defect_qty' exists in SQL but not in model
- **SQL**: `defect_qty              INTEGER                  DEFAULT 0,                                          -- 불량 수량 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column defect_qty from SQL or add to model

---

**34. Table: `bim.purchase_analytics`**

- **Issue**: Column 'purchase_amount' exists in SQL but not in model
- **SQL**: `purchase_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 구매액`
- **Model**: `N/A`
- **Fix**: Remove column purchase_amount from SQL or add to model

---

**35. Table: `bim.purchase_analytics`**

- **Issue**: Column 'on_time_delivery_rate' exists in SQL but not in model
- **SQL**: `on_time_delivery_rate   NUMERIC(5,2),                                                                -- 정시 납품률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column on_time_delivery_rate from SQL or add to model

---

**36. Table: `bim.purchase_analytics`**

- **Issue**: Column 'avg_unit_price' exists in SQL but not in model
- **SQL**: `avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column avg_unit_price from SQL or add to model

---

**37. Table: `bim.purchase_analytics`**

- **Issue**: Column 'buyer_id' exists in SQL but not in model
- **SQL**: `buyer_id                UUID,                                                                        -- 구매 담당자 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column buyer_id from SQL or add to model

---

**38. Table: `bim.purchase_analytics`**

- **Issue**: Column 'quarter' exists in SQL but not in model
- **SQL**: `quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column quarter from SQL or add to model

---

**39. Table: `bim.purchase_analytics`**

- **Issue**: Column 'order_count' exists in SQL but not in model
- **SQL**: `order_count             INTEGER                  DEFAULT 0,                                          -- 발주 건수 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column order_count from SQL or add to model

---

**40. Table: `bim.purchase_analytics`**

- **Issue**: Column 'avg_lead_time_days' exists in SQL but not in model
- **SQL**: `avg_lead_time_days      NUMERIC(5,1),                                                                -- 평균 리드타임 (일) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column avg_lead_time_days from SQL or add to model

---

**41. Table: `bim.purchase_analytics`**

- **Issue**: Column 'avg_order_value' exists in SQL but not in model
- **SQL**: `avg_order_value         NUMERIC(18,4),                                                               -- 평균 발주 금액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column avg_order_value from SQL or add to model

---

**42. Table: `bim.purchase_analytics`**

- **Issue**: Column 'item_id' exists in SQL but not in model
- **SQL**: `item_id                 UUID,                                                                        -- 품목 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column item_id from SQL or add to model

---

**43. Table: `bim.purchase_analytics`**

- **Issue**: Column 'vendor_category' exists in SQL but not in model
- **SQL**: `vendor_category         VARCHAR(50),                                                                 -- 공급업체 분류 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column vendor_category from SQL or add to model

---

**44. Table: `bim.purchase_analytics`**

- **Issue**: Column 'defect_rate' exists in SQL but not in model
- **SQL**: `defect_rate             NUMERIC(5,2),                                                                -- 불량률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column defect_rate from SQL or add to model

---

**45. Table: `bim.purchase_analytics`**

- **Issue**: Column 'period' exists in SQL but not in model
- **SQL**: `period                  VARCHAR(7)               NOT NULL,                                           -- 분석 기간 (YYYY-MM)`
- **Model**: `N/A`
- **Fix**: Remove column period from SQL or add to model

---

**46. Table: `bim.purchase_analytics`**

- **Issue**: Column 'discount_amount' exists in SQL but not in model
- **SQL**: `discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column discount_amount from SQL or add to model

---

**47. Table: `bim.kpi_definitions`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- KPI 상세 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**48. Table: `bim.kpi_definitions`**

- **Issue**: Column 'data_source' exists in SQL but not in model
- **SQL**: `data_source             TEXT,                                                                        -- 데이터 출처 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column data_source from SQL or add to model

---

**49. Table: `bim.kpi_definitions`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성화 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**50. Table: `bim.kpi_definitions`**

- **Issue**: Column 'threshold_warning' exists in SQL but not in model
- **SQL**: `threshold_warning       NUMERIC(18,4),                                                               -- 경고 임계값 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column threshold_warning from SQL or add to model

---

**51. Table: `bim.kpi_definitions`**

- **Issue**: Column 'owner_department_id' exists in SQL but not in model
- **SQL**: `owner_department_id     UUID,                                                                        -- KPI 책임 부서 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column owner_department_id from SQL or add to model

---

**52. Table: `bim.kpi_definitions`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                                        -- 비고 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**53. Table: `bim.kpi_definitions`**

- **Issue**: Column 'kpi_name_en' exists in SQL but not in model
- **SQL**: `kpi_name_en             VARCHAR(200),                                                                -- KPI 영문명 (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column kpi_name_en from SQL or add to model

---

**54. Table: `bim.kpi_definitions`**

- **Issue**: Column 'target_type' exists in SQL but not in model
- **SQL**: `target_type             VARCHAR(20)              DEFAULT 'HIGHER_BETTER',                            -- 목표 유형 (HIGHER_BETTER/LOWER_BETTER/TARGET_VALUE/RANGE)`
- **Model**: `N/A`
- **Fix**: Remove column target_type from SQL or add to model

---

**55. Table: `bim.kpi_definitions`**

- **Issue**: Column 'owner_user_id' exists in SQL but not in model
- **SQL**: `owner_user_id           UUID,                                                                        -- KPI 담당자 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column owner_user_id from SQL or add to model

---

**56. Table: `bim.kpi_definitions`**

- **Issue**: Column 'calculation_formula' exists in SQL but not in model
- **SQL**: `calculation_formula     TEXT,                                                                        -- 계산 방법 (수식/집계 방법)`
- **Model**: `N/A`
- **Fix**: Remove column calculation_formula from SQL or add to model

---

**57. Table: `bim.kpi_definitions`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                                 -- KPI 카테고리 (매출/수익성/효율성/품질/고객만족)`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**58. Table: `bim.kpi_definitions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**59. Table: `bim.kpi_definitions`**

- **Issue**: Column 'chart_type' exists in SQL but not in model
- **SQL**: `chart_type              VARCHAR(20),                                                                 -- 차트 유형 (LINE/BAR/PIE/GAUGE) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column chart_type from SQL or add to model

---

**60. Table: `bim.kpi_definitions`**

- **Issue**: Column 'color_code' exists in SQL but not in model
- **SQL**: `color_code              VARCHAR(7),                                                                  -- 색상 코드 (#RRGGBB) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column color_code from SQL or add to model

---

**61. Table: `bim.kpi_definitions`**

- **Issue**: Column 'business_area' exists in SQL but not in model
- **SQL**: `business_area           VARCHAR(50),                                                                 -- 사업 영역 (영업/생산/재무/인사 등) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column business_area from SQL or add to model

---

**62. Table: `bim.kpi_definitions`**

- **Issue**: Column 'measurement_frequency' exists in SQL but not in model
- **SQL**: `measurement_frequency   VARCHAR(20)              DEFAULT 'MONTHLY',                                  -- 측정 주기 (DAILY/WEEKLY/MONTHLY/QUARTERLY/YEARLY) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column measurement_frequency from SQL or add to model

---

**63. Table: `bim.kpi_definitions`**

- **Issue**: Column 'icon_name' exists in SQL but not in model
- **SQL**: `icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column icon_name from SQL or add to model

---

**64. Table: `bim.kpi_definitions`**

- **Issue**: Column 'sub_category' exists in SQL but not in model
- **SQL**: `sub_category            VARCHAR(50),                                                                 -- 하위 카테고리 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column sub_category from SQL or add to model

---

**65. Table: `bim.kpi_definitions`**

- **Issue**: Column 'threshold_critical' exists in SQL but not in model
- **SQL**: `threshold_critical      NUMERIC(18,4),                                                               -- 위험 임계값 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column threshold_critical from SQL or add to model

---

**66. Table: `bim.kpi_definitions`**

- **Issue**: Column 'measurement_unit' exists in SQL but not in model
- **SQL**: `measurement_unit        VARCHAR(20),                                                                 -- 측정 단위 (원/%/건수/시간 등)`
- **Model**: `N/A`
- **Fix**: Remove column measurement_unit from SQL or add to model

---

**67. Table: `bim.kpi_definitions`**

- **Issue**: Column 'kpi_code' exists in SQL but not in model
- **SQL**: `kpi_code                VARCHAR(50)              NOT NULL,                                           -- KPI 코드`
- **Model**: `N/A`
- **Fix**: Remove column kpi_code from SQL or add to model

---

**68. Table: `bim.kpi_definitions`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**69. Table: `bim.kpi_definitions`**

- **Issue**: Column 'kpi_name' exists in SQL but not in model
- **SQL**: `kpi_name                VARCHAR(200)             NOT NULL,                                           -- KPI 명칭`
- **Model**: `N/A`
- **Fix**: Remove column kpi_name from SQL or add to model

---

**70. Table: `bim.kpi_definitions`**

- **Issue**: Column 'default_target_value' exists in SQL but not in model
- **SQL**: `default_target_value    NUMERIC(18,4),                                                               -- 기본 목표값 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column default_target_value from SQL or add to model

---

**71. Table: `bim.sales_analytics`**

- **Issue**: Column 'gross_profit_rate' exists in SQL but not in model
- **SQL**: `gross_profit_rate       NUMERIC(5,2),                                                                -- 매출 총이익률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column gross_profit_rate from SQL or add to model

---

**72. Table: `bim.sales_analytics`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                                      -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**73. Table: `bim.sales_analytics`**

- **Issue**: Column 'yoy_growth_rate' exists in SQL but not in model
- **SQL**: `yoy_growth_rate         NUMERIC(5,2),                                                                -- 전년 대비 성장률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column yoy_growth_rate from SQL or add to model

---

**74. Table: `bim.sales_analytics`**

- **Issue**: Column 'item_category_id' exists in SQL but not in model
- **SQL**: `item_category_id        UUID,                                                                        -- 품목 카테고리 식별자`
- **Model**: `N/A`
- **Fix**: Remove column item_category_id from SQL or add to model

---

**75. Table: `bim.sales_analytics`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                                        -- 부서 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**76. Table: `bim.sales_analytics`**

- **Issue**: Column 'region_code' exists in SQL but not in model
- **SQL**: `region_code             VARCHAR(50),                                                                 -- 지역 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column region_code from SQL or add to model

---

**77. Table: `bim.sales_analytics`**

- **Issue**: Column 'cost_amount' exists in SQL but not in model
- **SQL**: `cost_amount             NUMERIC(18,4)            DEFAULT 0,                                          -- 원가`
- **Model**: `N/A`
- **Fix**: Remove column cost_amount from SQL or add to model

---

**78. Table: `bim.sales_analytics`**

- **Issue**: Column 'mom_growth_rate' exists in SQL but not in model
- **SQL**: `mom_growth_rate         NUMERIC(5,2),                                                                -- 전월 대비 성장률 (%) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column mom_growth_rate from SQL or add to model

---

**79. Table: `bim.sales_analytics`**

- **Issue**: Column 'exchange_rate' exists in SQL but not in model
- **SQL**: `exchange_rate           NUMERIC(15,6)            DEFAULT 1,                                          -- 환율 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column exchange_rate from SQL or add to model

---

**80. Table: `bim.sales_analytics`**

- **Issue**: Column 'fiscal_year' exists in SQL but not in model
- **SQL**: `fiscal_year             VARCHAR(4),                                                                  -- 회계 연도 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_year from SQL or add to model

---

**81. Table: `bim.sales_analytics`**

- **Issue**: Column 'return_amount' exists in SQL but not in model
- **SQL**: `return_amount           NUMERIC(18,4)            DEFAULT 0,                                          -- 반품액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column return_amount from SQL or add to model

---

**82. Table: `bim.sales_analytics`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**83. Table: `bim.sales_analytics`**

- **Issue**: Column 'avg_unit_price' exists in SQL but not in model
- **SQL**: `avg_unit_price          NUMERIC(18,4),                                                               -- 평균 단가 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column avg_unit_price from SQL or add to model

---

**84. Table: `bim.sales_analytics`**

- **Issue**: Column 'sales_qty' exists in SQL but not in model
- **SQL**: `sales_qty               INTEGER                  DEFAULT 0,                                          -- 매출 수량`
- **Model**: `N/A`
- **Fix**: Remove column sales_qty from SQL or add to model

---

**85. Table: `bim.sales_analytics`**

- **Issue**: Column 'customer_segment' exists in SQL but not in model
- **SQL**: `customer_segment        VARCHAR(50),                                                                 -- 고객 세그먼트 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column customer_segment from SQL or add to model

---

**86. Table: `bim.sales_analytics`**

- **Issue**: Column 'quarter' exists in SQL but not in model
- **SQL**: `quarter                 VARCHAR(2),                                                                  -- 분기 (Q1/Q2/Q3/Q4) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column quarter from SQL or add to model

---

**87. Table: `bim.sales_analytics`**

- **Issue**: Column 'order_count' exists in SQL but not in model
- **SQL**: `order_count             INTEGER                  DEFAULT 0,                                          -- 주문 건수 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column order_count from SQL or add to model

---

**88. Table: `bim.sales_analytics`**

- **Issue**: Column 'period' exists in SQL but not in model
- **SQL**: `period                  VARCHAR(7)               NOT NULL,                                           -- 분석 기간 (YYYY-MM)`
- **Model**: `N/A`
- **Fix**: Remove column period from SQL or add to model

---

**89. Table: `bim.sales_analytics`**

- **Issue**: Column 'gross_profit' exists in SQL but not in model
- **SQL**: `gross_profit            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출 총이익`
- **Model**: `N/A`
- **Fix**: Remove column gross_profit from SQL or add to model

---

**90. Table: `bim.sales_analytics`**

- **Issue**: Column 'sales_amount' exists in SQL but not in model
- **SQL**: `sales_amount            NUMERIC(18,4)            DEFAULT 0,                                          -- 매출액`
- **Model**: `N/A`
- **Fix**: Remove column sales_amount from SQL or add to model

---

**91. Table: `bim.sales_analytics`**

- **Issue**: Column 'avg_order_value' exists in SQL but not in model
- **SQL**: `avg_order_value         NUMERIC(18,4),                                                               -- 평균 주문 금액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column avg_order_value from SQL or add to model

---

**92. Table: `bim.sales_analytics`**

- **Issue**: Column 'item_id' exists in SQL but not in model
- **SQL**: `item_id                 UUID,                                                                        -- 품목 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column item_id from SQL or add to model

---

**93. Table: `bim.sales_analytics`**

- **Issue**: Column 'sales_person_id' exists in SQL but not in model
- **SQL**: `sales_person_id         UUID,                                                                        -- 영업 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_person_id from SQL or add to model

---

**94. Table: `bim.sales_analytics`**

- **Issue**: Column 'return_qty' exists in SQL but not in model
- **SQL**: `return_qty              INTEGER                  DEFAULT 0,                                          -- 반품 수량 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column return_qty from SQL or add to model

---

**95. Table: `bim.sales_analytics`**

- **Issue**: Column 'discount_amount' exists in SQL but not in model
- **SQL**: `discount_amount         NUMERIC(18,4)            DEFAULT 0,                                          -- 할인액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column discount_amount from SQL or add to model

---

**96. Table: `bim.sales_analytics`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID,                                                                        -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---


### Schema: COM (46 issues)


#### Extra SQL Column (46)

**1. Table: `com.code_groups`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 그룹 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**2. Table: `com.code_groups`**

- **Issue**: Column 'color_code' exists in SQL but not in model
- **SQL**: `color_code              VARCHAR(7),                                                                  -- 색상 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column color_code from SQL or add to model

---

**3. Table: `com.code_groups`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**4. Table: `com.code_groups`**

- **Issue**: Column 'icon_name' exists in SQL but not in model
- **SQL**: `icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column icon_name from SQL or add to model

---

**5. Table: `com.code_groups`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                                        -- 비고 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**6. Table: `com.code_groups`**

- **Issue**: Column 'group_name_en' exists in SQL but not in model
- **SQL**: `group_name_en           VARCHAR(100),                                                                -- 그룹 영문명 (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column group_name_en from SQL or add to model

---

**7. Table: `com.code_groups`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**8. Table: `com.code_groups`**

- **Issue**: Column 'is_system_group' exists in SQL but not in model
- **SQL**: `is_system_group         BOOLEAN                  DEFAULT false,                                      -- 시스템 기본 그룹 여부 (삭제 불가)`
- **Model**: `N/A`
- **Fix**: Remove column is_system_group from SQL or add to model

---

**9. Table: `com.code_groups`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                                          -- 표시 순서 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**10. Table: `com.code_groups`**

- **Issue**: Column 'group_code' exists in SQL but not in model
- **SQL**: `group_code              VARCHAR(50)              NOT NULL,                                           -- 그룹 코드 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column group_code from SQL or add to model

---

**11. Table: `com.code_groups`**

- **Issue**: Column 'group_name' exists in SQL but not in model
- **SQL**: `group_name              VARCHAR(100)             NOT NULL,                                           -- 그룹명`
- **Model**: `N/A`
- **Fix**: Remove column group_name from SQL or add to model

---

**12. Table: `com.workflows`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 워크플로우 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**13. Table: `com.workflows`**

- **Issue**: Column 'module_code' exists in SQL but not in model
- **SQL**: `module_code             VARCHAR(50)              NOT NULL,                                           -- 모듈 코드 (PSM, SRM 등)`
- **Model**: `N/A`
- **Fix**: Remove column module_code from SQL or add to model

---

**14. Table: `com.workflows`**

- **Issue**: Column 'is_default' exists in SQL but not in model
- **SQL**: `is_default              BOOLEAN                  DEFAULT false,                                      -- 기본 워크플로우 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column is_default from SQL or add to model

---

**15. Table: `com.workflows`**

- **Issue**: Column 'escalation_enabled' exists in SQL but not in model
- **SQL**: `escalation_enabled      BOOLEAN                  DEFAULT false,                                      -- 에스컬레이션 활성화 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column escalation_enabled from SQL or add to model

---

**16. Table: `com.workflows`**

- **Issue**: Column 'escalation_hours' exists in SQL but not in model
- **SQL**: `escalation_hours        INTEGER,                                                                     -- 에스컬레이션 시간 (시간) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column escalation_hours from SQL or add to model

---

**17. Table: `com.workflows`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**18. Table: `com.workflows`**

- **Issue**: Column 'workflow_name_en' exists in SQL but not in model
- **SQL**: `workflow_name_en        VARCHAR(100),                                                                -- 워크플로우 영문명 (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column workflow_name_en from SQL or add to model

---

**19. Table: `com.workflows`**

- **Issue**: Column 'max_amount' exists in SQL but not in model
- **SQL**: `max_amount              NUMERIC(18,4),                                                               -- 최대 금액 (조건) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column max_amount from SQL or add to model

---

**20. Table: `com.workflows`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                                        -- 비고 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**21. Table: `com.workflows`**

- **Issue**: Column 'is_notification_enabled' exists in SQL but not in model
- **SQL**: `is_notification_enabled BOOLEAN                  DEFAULT true,                                       -- 알림 활성화 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column is_notification_enabled from SQL or add to model

---

**22. Table: `com.workflows`**

- **Issue**: Column 'document_type' exists in SQL but not in model
- **SQL**: `document_type           VARCHAR(50)              NOT NULL,                                           -- 문서 유형 (PURCHASE_ORDER, SALES_ORDER 등)`
- **Model**: `N/A`
- **Fix**: Remove column document_type from SQL or add to model

---

**23. Table: `com.workflows`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**24. Table: `com.workflows`**

- **Issue**: Column 'workflow_code' exists in SQL but not in model
- **SQL**: `workflow_code           VARCHAR(50)              NOT NULL,                                           -- 워크플로우 코드 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column workflow_code from SQL or add to model

---

**25. Table: `com.workflows`**

- **Issue**: Column 'version' exists in SQL but not in model
- **SQL**: `version                 INTEGER                  DEFAULT 1,                                          -- 버전 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column version from SQL or add to model

---

**26. Table: `com.workflows`**

- **Issue**: Column 'workflow_name' exists in SQL but not in model
- **SQL**: `workflow_name           VARCHAR(100)             NOT NULL,                                           -- 워크플로우명`
- **Model**: `N/A`
- **Fix**: Remove column workflow_name from SQL or add to model

---

**27. Table: `com.workflows`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                INTEGER                  DEFAULT 0,                                          -- 우선순위 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**28. Table: `com.workflows`**

- **Issue**: Column 'min_amount' exists in SQL but not in model
- **SQL**: `min_amount              NUMERIC(18,4),                                                               -- 최소 금액 (조건) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column min_amount from SQL or add to model

---

**29. Table: `com.workflows`**

- **Issue**: Column 'condition_rule' exists in SQL but not in model
- **SQL**: `condition_rule          JSONB,                                                                       -- 조건 규칙 (JSON) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column condition_rule from SQL or add to model

---

**30. Table: `com.codes`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 코드 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**31. Table: `com.codes`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                                           -- 코드명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**32. Table: `com.codes`**

- **Issue**: Column 'sort_order' exists in SQL but not in model
- **SQL**: `sort_order              INTEGER                  DEFAULT 0,                                          -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column sort_order from SQL or add to model

---

**33. Table: `com.codes`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**34. Table: `com.codes`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                                        -- 비고 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**35. Table: `com.codes`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                                -- 코드 영문명 (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**36. Table: `com.codes`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**37. Table: `com.codes`**

- **Issue**: Column 'additional_value1' exists in SQL but not in model
- **SQL**: `additional_value1       VARCHAR(100),                                                                -- 추가 값 1 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column additional_value1 from SQL or add to model

---

**38. Table: `com.codes`**

- **Issue**: Column 'group_id' exists in SQL but not in model
- **SQL**: `group_id                UUID                     NOT NULL,                                           -- 코드 그룹 식별자`
- **Model**: `N/A`
- **Fix**: Remove column group_id from SQL or add to model

---

**39. Table: `com.codes`**

- **Issue**: Column 'attributes' exists in SQL but not in model
- **SQL**: `attributes              JSONB,                                                                       -- 추가 속성 (JSON) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column attributes from SQL or add to model

---

**40. Table: `com.codes`**

- **Issue**: Column 'parent_code_id' exists in SQL but not in model
- **SQL**: `parent_code_id          UUID,                                                                        -- 상위 코드 식별자 (계층 구조용) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column parent_code_id from SQL or add to model

---

**41. Table: `com.codes`**

- **Issue**: Column 'icon_name' exists in SQL but not in model
- **SQL**: `icon_name               VARCHAR(50),                                                                 -- 아이콘 이름 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column icon_name from SQL or add to model

---

**42. Table: `com.codes`**

- **Issue**: Column 'level_depth' exists in SQL but not in model
- **SQL**: `level_depth             INTEGER                  DEFAULT 1,                                          -- 계층 깊이 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column level_depth from SQL or add to model

---

**43. Table: `com.codes`**

- **Issue**: Column 'additional_value2' exists in SQL but not in model
- **SQL**: `additional_value2       VARCHAR(100),                                                                -- 추가 값 2 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column additional_value2 from SQL or add to model

---

**44. Table: `com.codes`**

- **Issue**: Column 'color_code' exists in SQL but not in model
- **SQL**: `color_code              VARCHAR(7),                                                                  -- 색상 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column color_code from SQL or add to model

---

**45. Table: `com.codes`**

- **Issue**: Column 'additional_value3' exists in SQL but not in model
- **SQL**: `additional_value3       VARCHAR(100),                                                                -- 추가 값 3 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column additional_value3 from SQL or add to model

---

**46. Table: `com.codes`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                                           -- 코드값`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---


### Schema: CRM (344 issues)


#### Extra SQL Column (342)

**1. Table: `crm.customer_surveys`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**2. Table: `crm.customer_surveys`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**3. Table: `crm.customer_surveys`**

- **Issue**: Column 'response_at' exists in SQL but not in model
- **SQL**: `response_at             TIMESTAMP WITH TIME ZONE,                                        -- 응답일시`
- **Model**: `N/A`
- **Fix**: Remove column response_at from SQL or add to model

---

**4. Table: `crm.customer_surveys`**

- **Issue**: Column 'sent_date' exists in SQL but not in model
- **SQL**: `sent_date               DATE,                                                            -- 발송일`
- **Model**: `N/A`
- **Fix**: Remove column sent_date from SQL or add to model

---

**5. Table: `crm.customer_surveys`**

- **Issue**: Column 'is_anonymous' exists in SQL but not in model
- **SQL**: `is_anonymous            BOOLEAN                  DEFAULT false,                          -- 익명 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_anonymous from SQL or add to model

---

**6. Table: `crm.customer_surveys`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**7. Table: `crm.customer_surveys`**

- **Issue**: Column 'survey_type' exists in SQL but not in model
- **SQL**: `survey_type             VARCHAR(20)              NOT NULL,                               -- 설문 유형`
- **Model**: `N/A`
- **Fix**: Remove column survey_type from SQL or add to model

---

**8. Table: `crm.customer_surveys`**

- **Issue**: Column 'response_score' exists in SQL but not in model
- **SQL**: `response_score          INTEGER,                                                         -- 응답 점수`
- **Model**: `N/A`
- **Fix**: Remove column response_score from SQL or add to model

---

**9. Table: `crm.customer_surveys`**

- **Issue**: Column 'response_text' exists in SQL but not in model
- **SQL**: `response_text           TEXT,                                                            -- 응답 텍스트`
- **Model**: `N/A`
- **Fix**: Remove column response_text from SQL or add to model

---

**10. Table: `crm.customer_surveys`**

- **Issue**: Column 'lead_id' exists in SQL but not in model
- **SQL**: `lead_id                 UUID,                                                            -- 리드 ID`
- **Model**: `N/A`
- **Fix**: Remove column lead_id from SQL or add to model

---

**11. Table: `crm.customer_surveys`**

- **Issue**: Column 'survey_code' exists in SQL but not in model
- **SQL**: `survey_code             VARCHAR(50)              NOT NULL,                               -- 설문 코드`
- **Model**: `N/A`
- **Fix**: Remove column survey_code from SQL or add to model

---

**12. Table: `crm.customer_surveys`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**13. Table: `crm.customer_surveys`**

- **Issue**: Column 'so_id' exists in SQL but not in model
- **SQL**: `so_id                   UUID,                                                            -- 판매주문 ID`
- **Model**: `N/A`
- **Fix**: Remove column so_id from SQL or add to model

---

**14. Table: `crm.customer_surveys`**

- **Issue**: Column 'sent_by' exists in SQL but not in model
- **SQL**: `sent_by                 UUID,                                                            -- 발송자`
- **Model**: `N/A`
- **Fix**: Remove column sent_by from SQL or add to model

---

**15. Table: `crm.customer_surveys`**

- **Issue**: Column 'send_channel' exists in SQL but not in model
- **SQL**: `send_channel            VARCHAR(20),                                                     -- 발송 채널`
- **Model**: `N/A`
- **Fix**: Remove column send_channel from SQL or add to model

---

**16. Table: `crm.customer_surveys`**

- **Issue**: Column 'sentiment' exists in SQL but not in model
- **SQL**: `sentiment               VARCHAR(20),                                                     -- 감정 분석`
- **Model**: `N/A`
- **Fix**: Remove column sentiment from SQL or add to model

---

**17. Table: `crm.customer_surveys`**

- **Issue**: Column 'contact_id' exists in SQL but not in model
- **SQL**: `contact_id              UUID,                                                            -- 담당자 ID`
- **Model**: `N/A`
- **Fix**: Remove column contact_id from SQL or add to model

---

**18. Table: `crm.customer_surveys`**

- **Issue**: Column 'question' exists in SQL but not in model
- **SQL**: `question                TEXT                     NOT NULL,                               -- 질문`
- **Model**: `N/A`
- **Fix**: Remove column question from SQL or add to model

---

**19. Table: `crm.customer_surveys`**

- **Issue**: Column 'opportunity_id' exists in SQL but not in model
- **SQL**: `opportunity_id          UUID,                                                            -- 영업기회 ID`
- **Model**: `N/A`
- **Fix**: Remove column opportunity_id from SQL or add to model

---

**20. Table: `crm.sales_targets`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 목표명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**21. Table: `crm.sales_targets`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**22. Table: `crm.sales_targets`**

- **Issue**: Column 'target_leads' exists in SQL but not in model
- **SQL**: `target_leads            INTEGER                  DEFAULT 0,                              -- 목표 리드 수`
- **Model**: `N/A`
- **Fix**: Remove column target_leads from SQL or add to model

---

**23. Table: `crm.sales_targets`**

- **Issue**: Column 'target_code' exists in SQL but not in model
- **SQL**: `target_code             VARCHAR(50)              NOT NULL,                               -- 목표 코드`
- **Model**: `N/A`
- **Fix**: Remove column target_code from SQL or add to model

---

**24. Table: `crm.sales_targets`**

- **Issue**: Column 'target_type' exists in SQL but not in model
- **SQL**: `target_type             VARCHAR(20)              NOT NULL,                               -- 목표 유형`
- **Model**: `N/A`
- **Fix**: Remove column target_type from SQL or add to model

---

**25. Table: `crm.sales_targets`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**26. Table: `crm.sales_targets`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID,                                                            -- 대상 직원`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**27. Table: `crm.sales_targets`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**28. Table: `crm.sales_targets`**

- **Issue**: Column 'actual_leads' exists in SQL but not in model
- **SQL**: `actual_leads            INTEGER                  DEFAULT 0,                              -- 실제 리드 수`
- **Model**: `N/A`
- **Fix**: Remove column actual_leads from SQL or add to model

---

**29. Table: `crm.sales_targets`**

- **Issue**: Column 'year' exists in SQL but not in model
- **SQL**: `year                    INTEGER                  NOT NULL,                               -- 연도`
- **Model**: `N/A`
- **Fix**: Remove column year from SQL or add to model

---

**30. Table: `crm.sales_targets`**

- **Issue**: Column 'team_id' exists in SQL but not in model
- **SQL**: `team_id                 UUID,                                                            -- 대상 팀/부서`
- **Model**: `N/A`
- **Fix**: Remove column team_id from SQL or add to model

---

**31. Table: `crm.sales_targets`**

- **Issue**: Column 'actual_revenue' exists in SQL but not in model
- **SQL**: `actual_revenue          NUMERIC(18,2)            DEFAULT 0,                              -- 실제 매출`
- **Model**: `N/A`
- **Fix**: Remove column actual_revenue from SQL or add to model

---

**32. Table: `crm.sales_targets`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**33. Table: `crm.sales_targets`**

- **Issue**: Column 'actual_opportunities' exists in SQL but not in model
- **SQL**: `actual_opportunities    INTEGER                  DEFAULT 0,                              -- 실제 영업기회 수`
- **Model**: `N/A`
- **Fix**: Remove column actual_opportunities from SQL or add to model

---

**34. Table: `crm.sales_targets`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**35. Table: `crm.sales_targets`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**36. Table: `crm.sales_targets`**

- **Issue**: Column 'month' exists in SQL but not in model
- **SQL**: `month                   INTEGER,                                                         -- 월 (1-12)`
- **Model**: `N/A`
- **Fix**: Remove column month from SQL or add to model

---

**37. Table: `crm.sales_targets`**

- **Issue**: Column 'target_deals' exists in SQL but not in model
- **SQL**: `target_deals            INTEGER                  DEFAULT 0,                              -- 목표 계약 건수`
- **Model**: `N/A`
- **Fix**: Remove column target_deals from SQL or add to model

---

**38. Table: `crm.sales_targets`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE                     NOT NULL,                               -- 종료일`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**39. Table: `crm.sales_targets`**

- **Issue**: Column 'target_conversion_rate' exists in SQL but not in model
- **SQL**: `target_conversion_rate  NUMERIC(5,2),                                                    -- 목표 전환율 (%)`
- **Model**: `N/A`
- **Fix**: Remove column target_conversion_rate from SQL or add to model

---

**40. Table: `crm.sales_targets`**

- **Issue**: Column 'quarter' exists in SQL but not in model
- **SQL**: `quarter                 INTEGER,                                                         -- 분기 (1-4)`
- **Model**: `N/A`
- **Fix**: Remove column quarter from SQL or add to model

---

**41. Table: `crm.sales_targets`**

- **Issue**: Column 'target_opportunities' exists in SQL but not in model
- **SQL**: `target_opportunities    INTEGER                  DEFAULT 0,                              -- 목표 영업기회 수`
- **Model**: `N/A`
- **Fix**: Remove column target_opportunities from SQL or add to model

---

**42. Table: `crm.sales_targets`**

- **Issue**: Column 'target_revenue' exists in SQL but not in model
- **SQL**: `target_revenue          NUMERIC(18,2)            DEFAULT 0,                              -- 목표 매출`
- **Model**: `N/A`
- **Fix**: Remove column target_revenue from SQL or add to model

---

**43. Table: `crm.sales_targets`**

- **Issue**: Column 'period_type' exists in SQL but not in model
- **SQL**: `period_type             VARCHAR(20)              NOT NULL,                               -- 기간 유형`
- **Model**: `N/A`
- **Fix**: Remove column period_type from SQL or add to model

---

**44. Table: `crm.sales_targets`**

- **Issue**: Column 'actual_conversion_rate' exists in SQL but not in model
- **SQL**: `actual_conversion_rate  NUMERIC(5,2),                                                    -- 실제 전환율 (%)`
- **Model**: `N/A`
- **Fix**: Remove column actual_conversion_rate from SQL or add to model

---

**45. Table: `crm.sales_targets`**

- **Issue**: Column 'actual_deals' exists in SQL but not in model
- **SQL**: `actual_deals            INTEGER                  DEFAULT 0,                              -- 실제 계약 건수`
- **Model**: `N/A`
- **Fix**: Remove column actual_deals from SQL or add to model

---

**46. Table: `crm.sales_targets`**

- **Issue**: Column 'revenue_achievement_rate' exists in SQL but not in model
- **SQL**: `revenue_achievement_rate NUMERIC(5,2)            DEFAULT 0,                              -- 매출 달성률 (%)`
- **Model**: `N/A`
- **Fix**: Remove column revenue_achievement_rate from SQL or add to model

---

**47. Table: `crm.sales_targets`**

- **Issue**: Column 'deals_achievement_rate' exists in SQL but not in model
- **SQL**: `deals_achievement_rate  NUMERIC(5,2)            DEFAULT 0,                              -- 건수 달성률 (%)`
- **Model**: `N/A`
- **Fix**: Remove column deals_achievement_rate from SQL or add to model

---

**48. Table: `crm.customer_segment_members`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**49. Table: `crm.customer_segment_members`**

- **Issue**: Column 'assigned_by' exists in SQL but not in model
- **SQL**: `assigned_by             UUID,                                                            -- 할당자`
- **Model**: `N/A`
- **Fix**: Remove column assigned_by from SQL or add to model

---

**50. Table: `crm.customer_segment_members`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**51. Table: `crm.customer_segment_members`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**52. Table: `crm.customer_segment_members`**

- **Issue**: Column 'segment_id' exists in SQL but not in model
- **SQL**: `segment_id              UUID                     NOT NULL,                               -- 세그먼트 ID`
- **Model**: `N/A`
- **Fix**: Remove column segment_id from SQL or add to model

---

**53. Table: `crm.customer_segment_members`**

- **Issue**: Column 'assignment_type' exists in SQL but not in model
- **SQL**: `assignment_type         VARCHAR(20)              DEFAULT 'MANUAL',                       -- 할당 유형`
- **Model**: `N/A`
- **Fix**: Remove column assignment_type from SQL or add to model

---

**54. Table: `crm.customer_segment_members`**

- **Issue**: Column 'assigned_date' exists in SQL but not in model
- **SQL**: `assigned_date           DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 할당일`
- **Model**: `N/A`
- **Fix**: Remove column assigned_date from SQL or add to model

---

**55. Table: `crm.partner_banks`**

- **Issue**: Column 'bank_code' exists in SQL but not in model
- **SQL**: `bank_code               VARCHAR(10)              NOT NULL,                               -- 은행 코드`
- **Model**: `N/A`
- **Fix**: Remove column bank_code from SQL or add to model

---

**56. Table: `crm.partner_banks`**

- **Issue**: Column 'branch_name' exists in SQL but not in model
- **SQL**: `branch_name             VARCHAR(100),                                                    -- 지점명`
- **Model**: `N/A`
- **Fix**: Remove column branch_name from SQL or add to model

---

**57. Table: `crm.partner_banks`**

- **Issue**: Column 'is_primary' exists in SQL but not in model
- **SQL**: `is_primary              BOOLEAN                  NOT NULL DEFAULT false,                 -- 주계좌 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_primary from SQL or add to model

---

**58. Table: `crm.partner_banks`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**59. Table: `crm.partner_banks`**

- **Issue**: Column 'swift_code' exists in SQL but not in model
- **SQL**: `swift_code              VARCHAR(20),                                                     -- SWIFT 코드 (해외송금용)`
- **Model**: `N/A`
- **Fix**: Remove column swift_code from SQL or add to model

---

**60. Table: `crm.partner_banks`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**61. Table: `crm.partner_banks`**

- **Issue**: Column 'is_payment' exists in SQL but not in model
- **SQL**: `is_payment              BOOLEAN                  NOT NULL DEFAULT false,                 -- 기본 지급계좌 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_payment from SQL or add to model

---

**62. Table: `crm.partner_banks`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**63. Table: `crm.partner_banks`**

- **Issue**: Column 'account_no' exists in SQL but not in model
- **SQL**: `account_no              VARCHAR(50)              NOT NULL,                               -- 계좌번호`
- **Model**: `N/A`
- **Fix**: Remove column account_no from SQL or add to model

---

**64. Table: `crm.partner_banks`**

- **Issue**: Column 'is_receive' exists in SQL but not in model
- **SQL**: `is_receive              BOOLEAN                  NOT NULL DEFAULT false,                 -- 기본 입금계좌 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_receive from SQL or add to model

---

**65. Table: `crm.partner_banks`**

- **Issue**: Column 'bank_name' exists in SQL but not in model
- **SQL**: `bank_name               VARCHAR(100),                                                    -- 은행명`
- **Model**: `N/A`
- **Fix**: Remove column bank_name from SQL or add to model

---

**66. Table: `crm.partner_banks`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id             UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**67. Table: `crm.partner_banks`**

- **Issue**: Column 'account_type' exists in SQL but not in model
- **SQL**: `account_type            VARCHAR(20)              NOT NULL,                               -- 계좌 유형`
- **Model**: `N/A`
- **Fix**: Remove column account_type from SQL or add to model

---

**68. Table: `crm.partner_banks`**

- **Issue**: Column 'account_name' exists in SQL but not in model
- **SQL**: `account_name            VARCHAR(100),                                                    -- 계좌별칭`
- **Model**: `N/A`
- **Fix**: Remove column account_name from SQL or add to model

---

**69. Table: `crm.partner_banks`**

- **Issue**: Column 'account_holder' exists in SQL but not in model
- **SQL**: `account_holder          VARCHAR(100)             NOT NULL,                               -- 예금주명`
- **Model**: `N/A`
- **Fix**: Remove column account_holder from SQL or add to model

---

**70. Table: `crm.partner_banks`**

- **Issue**: Column 'branch_code' exists in SQL but not in model
- **SQL**: `branch_code             VARCHAR(20),                                                     -- 지점 코드`
- **Model**: `N/A`
- **Fix**: Remove column branch_code from SQL or add to model

---

**71. Table: `crm.contracts`**

- **Issue**: Column 'contract_currency' exists in SQL but not in model
- **SQL**: `contract_currency       VARCHAR(3)               DEFAULT 'KRW',                          -- 계약 통화`
- **Model**: `N/A`
- **Fix**: Remove column contract_currency from SQL or add to model

---

**72. Table: `crm.contracts`**

- **Issue**: Column 'contract_date' exists in SQL but not in model
- **SQL**: `contract_date           DATE                     NOT NULL,                               -- 계약 체결일`
- **Model**: `N/A`
- **Fix**: Remove column contract_date from SQL or add to model

---

**73. Table: `crm.contracts`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 계약 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**74. Table: `crm.contracts`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(100),                                                    -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**75. Table: `crm.contracts`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 계약 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**76. Table: `crm.contracts`**

- **Issue**: Column 'contract_title' exists in SQL but not in model
- **SQL**: `contract_title          VARCHAR(200),                                                    -- 계약 제목`
- **Model**: `N/A`
- **Fix**: Remove column contract_title from SQL or add to model

---

**77. Table: `crm.contracts`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**78. Table: `crm.contracts`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 계약 종료일 (NULL이면 무기한)`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**79. Table: `crm.contracts`**

- **Issue**: Column 'contract_amount' exists in SQL but not in model
- **SQL**: `contract_amount         NUMERIC(18,2),                                                   -- 계약 금액`
- **Model**: `N/A`
- **Fix**: Remove column contract_amount from SQL or add to model

---

**80. Table: `crm.contracts`**

- **Issue**: Column 'contract_file_path' exists in SQL but not in model
- **SQL**: `contract_file_path      VARCHAR(500),                                                    -- 계약서 파일 경로`
- **Model**: `N/A`
- **Fix**: Remove column contract_file_path from SQL or add to model

---

**81. Table: `crm.contracts`**

- **Issue**: Column 'signatory_partner' exists in SQL but not in model
- **SQL**: `signatory_partner       VARCHAR(200),                                                    -- 거래처 서명자`
- **Model**: `N/A`
- **Fix**: Remove column signatory_partner from SQL or add to model

---

**82. Table: `crm.contracts`**

- **Issue**: Column 'contract_notes' exists in SQL but not in model
- **SQL**: `contract_notes          TEXT,                                                            -- 계약 조건/비고`
- **Model**: `N/A`
- **Fix**: Remove column contract_notes from SQL or add to model

---

**83. Table: `crm.contracts`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**84. Table: `crm.contracts`**

- **Issue**: Column 'contract_code' exists in SQL but not in model
- **SQL**: `contract_code           VARCHAR(50)              NOT NULL UNIQUE,                        -- 계약 코드`
- **Model**: `N/A`
- **Fix**: Remove column contract_code from SQL or add to model

---

**85. Table: `crm.contracts`**

- **Issue**: Column 'is_auto_renewal' exists in SQL but not in model
- **SQL**: `is_auto_renewal         BOOLEAN                  DEFAULT false,                          -- 자동 갱신 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_auto_renewal from SQL or add to model

---

**86. Table: `crm.contracts`**

- **Issue**: Column 'contract_file_name' exists in SQL but not in model
- **SQL**: `contract_file_name      VARCHAR(255),                                                    -- 계약서 파일명`
- **Model**: `N/A`
- **Fix**: Remove column contract_file_name from SQL or add to model

---

**87. Table: `crm.contracts`**

- **Issue**: Column 'signatory_company' exists in SQL but not in model
- **SQL**: `signatory_company       VARCHAR(200),                                                    -- 우리 회사 서명자`
- **Model**: `N/A`
- **Fix**: Remove column signatory_company from SQL or add to model

---

**88. Table: `crm.contracts`**

- **Issue**: Column 'renewal_date' exists in SQL but not in model
- **SQL**: `renewal_date            DATE,                                                            -- 갱신 예정일`
- **Model**: `N/A`
- **Fix**: Remove column renewal_date from SQL or add to model

---

**89. Table: `crm.contracts`**

- **Issue**: Column 'contract_type' exists in SQL but not in model
- **SQL**: `contract_type           VARCHAR(30)              NOT NULL,                               -- 계약 유형`
- **Model**: `N/A`
- **Fix**: Remove column contract_type from SQL or add to model

---

**90. Table: `crm.interactions`**

- **Issue**: Column 'outcome' exists in SQL but not in model
- **SQL**: `outcome                 VARCHAR(50),                                                     -- 결과`
- **Model**: `N/A`
- **Fix**: Remove column outcome from SQL or add to model

---

**91. Table: `crm.interactions`**

- **Issue**: Column 'attachments' exists in SQL but not in model
- **SQL**: `attachments             JSONB,                                                           -- 첨부파일 정보 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column attachments from SQL or add to model

---

**92. Table: `crm.interactions`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**93. Table: `crm.interactions`**

- **Issue**: Column 'interaction_type' exists in SQL but not in model
- **SQL**: `interaction_type        VARCHAR(20)              NOT NULL,                               -- 상호작용 유형`
- **Model**: `N/A`
- **Fix**: Remove column interaction_type from SQL or add to model

---

**94. Table: `crm.interactions`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                     -- 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**95. Table: `crm.interactions`**

- **Issue**: Column 'handled_by' exists in SQL but not in model
- **SQL**: `handled_by              UUID,                                                            -- 처리자 (자사 직원)`
- **Model**: `N/A`
- **Fix**: Remove column handled_by from SQL or add to model

---

**96. Table: `crm.interactions`**

- **Issue**: Column 'duration_seconds' exists in SQL but not in model
- **SQL**: `duration_seconds        INTEGER,                                                         -- 소요 시간 (초)`
- **Model**: `N/A`
- **Fix**: Remove column duration_seconds from SQL or add to model

---

**97. Table: `crm.interactions`**

- **Issue**: Column 'satisfaction_score' exists in SQL but not in model
- **SQL**: `satisfaction_score      INTEGER,                                                         -- 만족도 점수 (1-5)`
- **Model**: `N/A`
- **Fix**: Remove column satisfaction_score from SQL or add to model

---

**98. Table: `crm.interactions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**99. Table: `crm.interactions`**

- **Issue**: Column 'summary' exists in SQL but not in model
- **SQL**: `summary                 TEXT,                                                            -- 요약`
- **Model**: `N/A`
- **Fix**: Remove column summary from SQL or add to model

---

**100. Table: `crm.interactions`**

- **Issue**: Column 'is_follow_up_required' exists in SQL but not in model
- **SQL**: `is_follow_up_required   BOOLEAN                  DEFAULT false,                          -- 후속 조치 필요 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_follow_up_required from SQL or add to model

---

**101. Table: `crm.interactions`**

- **Issue**: Column 'follow_up_notes' exists in SQL but not in model
- **SQL**: `follow_up_notes         TEXT,                                                            -- 후속 조치 메모`
- **Model**: `N/A`
- **Fix**: Remove column follow_up_notes from SQL or add to model

---

**102. Table: `crm.interactions`**

- **Issue**: Column 'lead_id' exists in SQL but not in model
- **SQL**: `lead_id                 UUID,                                                            -- 리드 ID`
- **Model**: `N/A`
- **Fix**: Remove column lead_id from SQL or add to model

---

**103. Table: `crm.interactions`**

- **Issue**: Column 'content' exists in SQL but not in model
- **SQL**: `content                 TEXT,                                                            -- 내용`
- **Model**: `N/A`
- **Fix**: Remove column content from SQL or add to model

---

**104. Table: `crm.interactions`**

- **Issue**: Column 'interaction_date' exists in SQL but not in model
- **SQL**: `interaction_date        TIMESTAMP WITH TIME ZONE NOT NULL,                               -- 상호작용 일시`
- **Model**: `N/A`
- **Fix**: Remove column interaction_date from SQL or add to model

---

**105. Table: `crm.interactions`**

- **Issue**: Column 'reference_url' exists in SQL but not in model
- **SQL**: `reference_url           VARCHAR(500),                                                    -- 참조 URL`
- **Model**: `N/A`
- **Fix**: Remove column reference_url from SQL or add to model

---

**106. Table: `crm.interactions`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**107. Table: `crm.interactions`**

- **Issue**: Column 'subject' exists in SQL but not in model
- **SQL**: `subject                 VARCHAR(200),                                                    -- 제목`
- **Model**: `N/A`
- **Fix**: Remove column subject from SQL or add to model

---

**108. Table: `crm.interactions`**

- **Issue**: Column 'channel' exists in SQL but not in model
- **SQL**: `channel                 VARCHAR(20)              NOT NULL,                               -- 채널`
- **Model**: `N/A`
- **Fix**: Remove column channel from SQL or add to model

---

**109. Table: `crm.interactions`**

- **Issue**: Column 'tags' exists in SQL but not in model
- **SQL**: `tags                    TEXT[],                                                          -- 태그 (배열)`
- **Model**: `N/A`
- **Fix**: Remove column tags from SQL or add to model

---

**110. Table: `crm.interactions`**

- **Issue**: Column 'follow_up_date' exists in SQL but not in model
- **SQL**: `follow_up_date          DATE,                                                            -- 후속 조치 예정일`
- **Model**: `N/A`
- **Fix**: Remove column follow_up_date from SQL or add to model

---

**111. Table: `crm.interactions`**

- **Issue**: Column 'sentiment' exists in SQL but not in model
- **SQL**: `sentiment               VARCHAR(20),                                                     -- 감정 분석`
- **Model**: `N/A`
- **Fix**: Remove column sentiment from SQL or add to model

---

**112. Table: `crm.interactions`**

- **Issue**: Column 'contact_id' exists in SQL but not in model
- **SQL**: `contact_id              UUID,                                                            -- 담당자 ID`
- **Model**: `N/A`
- **Fix**: Remove column contact_id from SQL or add to model

---

**113. Table: `crm.interactions`**

- **Issue**: Column 'opportunity_id' exists in SQL but not in model
- **SQL**: `opportunity_id          UUID,                                                            -- 영업 기회 ID`
- **Model**: `N/A`
- **Fix**: Remove column opportunity_id from SQL or add to model

---

**114. Table: `crm.interactions`**

- **Issue**: Column 'direction' exists in SQL but not in model
- **SQL**: `direction               VARCHAR(20)              NOT NULL,                               -- 방향`
- **Model**: `N/A`
- **Fix**: Remove column direction from SQL or add to model

---

**115. Table: `crm.partner_managers`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 담당 업무/역할`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**116. Table: `crm.partner_managers`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**117. Table: `crm.partner_managers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**118. Table: `crm.partner_managers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고/메모`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**119. Table: `crm.partner_managers`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 담당 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**120. Table: `crm.partner_managers`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 담당 사원 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**121. Table: `crm.partner_managers`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**122. Table: `crm.partner_managers`**

- **Issue**: Column 'manager_type' exists in SQL but not in model
- **SQL**: `manager_type            VARCHAR(20)              NOT NULL DEFAULT 'PRIMARY',             -- 담당자 유형`
- **Model**: `N/A`
- **Fix**: Remove column manager_type from SQL or add to model

---

**123. Table: `crm.partner_managers`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 담당 종료일 (추가 - NULL이면 현재 담당)`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**124. Table: `crm.customer_segments`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**125. Table: `crm.customer_segments`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID,                                                            -- 담당자`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**126. Table: `crm.customer_segments`**

- **Issue**: Column 'member_count' exists in SQL but not in model
- **SQL**: `member_count            INTEGER                  DEFAULT 0,                              -- 회원 수`
- **Model**: `N/A`
- **Fix**: Remove column member_count from SQL or add to model

---

**127. Table: `crm.customer_segments`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 세그먼트명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**128. Table: `crm.customer_segments`**

- **Issue**: Column 'segment_code' exists in SQL but not in model
- **SQL**: `segment_code            VARCHAR(50)              NOT NULL,                               -- 세그먼트 코드`
- **Model**: `N/A`
- **Fix**: Remove column segment_code from SQL or add to model

---

**129. Table: `crm.customer_segments`**

- **Issue**: Column 'update_frequency' exists in SQL but not in model
- **SQL**: `update_frequency        VARCHAR(20),                                                     -- 업데이트 주기`
- **Model**: `N/A`
- **Fix**: Remove column update_frequency from SQL or add to model

---

**130. Table: `crm.customer_segments`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**131. Table: `crm.customer_segments`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**132. Table: `crm.customer_segments`**

- **Issue**: Column 'criteria' exists in SQL but not in model
- **SQL**: `criteria                JSONB,                                                           -- 세그먼트 조건 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column criteria from SQL or add to model

---

**133. Table: `crm.customer_segments`**

- **Issue**: Column 'is_dynamic' exists in SQL but not in model
- **SQL**: `is_dynamic              BOOLEAN                  DEFAULT false,                          -- 동적 세그먼트 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_dynamic from SQL or add to model

---

**134. Table: `crm.customer_segments`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**135. Table: `crm.customer_segments`**

- **Issue**: Column 'is_auto_update' exists in SQL but not in model
- **SQL**: `is_auto_update          BOOLEAN                  DEFAULT false,                          -- 자동 업데이트 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_auto_update from SQL or add to model

---

**136. Table: `crm.customer_segments`**

- **Issue**: Column 'last_calculated_at' exists in SQL but not in model
- **SQL**: `last_calculated_at      TIMESTAMP WITH TIME ZONE,                                        -- 마지막 계산 일시`
- **Model**: `N/A`
- **Fix**: Remove column last_calculated_at from SQL or add to model

---

**137. Table: `crm.customer_segments`**

- **Issue**: Column 'segment_type' exists in SQL but not in model
- **SQL**: `segment_type            VARCHAR(20)              NOT NULL,                               -- 세그먼트 유형`
- **Model**: `N/A`
- **Fix**: Remove column segment_type from SQL or add to model

---

**138. Table: `crm.partners`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 거래처명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**139. Table: `crm.partners`**

- **Issue**: Column 'employee_count' exists in SQL but not in model
- **SQL**: `employee_count          INTEGER,                                                         -- 직원 수`
- **Model**: `N/A`
- **Fix**: Remove column employee_count from SQL or add to model

---

**140. Table: `crm.partners`**

- **Issue**: Column 'website' exists in SQL but not in model
- **SQL**: `website                 VARCHAR(255),                                                    -- 웹사이트 URL`
- **Model**: `N/A`
- **Fix**: Remove column website from SQL or add to model

---

**141. Table: `crm.partners`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(20),                                                     -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**142. Table: `crm.partners`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**143. Table: `crm.partners`**

- **Issue**: Column 'annual_revenue' exists in SQL but not in model
- **SQL**: `annual_revenue          NUMERIC(18,2),                                                   -- 연매출액`
- **Model**: `N/A`
- **Fix**: Remove column annual_revenue from SQL or add to model

---

**144. Table: `crm.partners`**

- **Issue**: Column 'business_kind' exists in SQL but not in model
- **SQL**: `business_kind           VARCHAR(100),                                                    -- 업태`
- **Model**: `N/A`
- **Fix**: Remove column business_kind from SQL or add to model

---

**145. Table: `crm.partners`**

- **Issue**: Column 'business_name' exists in SQL but not in model
- **SQL**: `business_name           VARCHAR(200),                                                    -- 상호(법인명)`
- **Model**: `N/A`
- **Fix**: Remove column business_name from SQL or add to model

---

**146. Table: `crm.partners`**

- **Issue**: Column 'business_no' exists in SQL but not in model
- **SQL**: `business_no             VARCHAR(20),                                                     -- 사업자등록번호`
- **Model**: `N/A`
- **Fix**: Remove column business_no from SQL or add to model

---

**147. Table: `crm.partners`**

- **Issue**: Column 'partner_type' exists in SQL but not in model
- **SQL**: `partner_type            VARCHAR(20)              NOT NULL,                               -- 거래처 유형`
- **Model**: `N/A`
- **Fix**: Remove column partner_type from SQL or add to model

---

**148. Table: `crm.partners`**

- **Issue**: Column 'currency_code' exists in SQL but not in model
- **SQL**: `currency_code           VARCHAR(3)               DEFAULT 'KRW',                          -- 거래 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency_code from SQL or add to model

---

**149. Table: `crm.partners`**

- **Issue**: Column 'ceo_name' exists in SQL but not in model
- **SQL**: `ceo_name                VARCHAR(50),                                                     -- 대표자명`
- **Model**: `N/A`
- **Fix**: Remove column ceo_name from SQL or add to model

---

**150. Table: `crm.partners`**

- **Issue**: Column 'fax' exists in SQL but not in model
- **SQL**: `fax                     VARCHAR(50),                                                     -- 팩스번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fax from SQL or add to model

---

**151. Table: `crm.partners`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode                VARCHAR(10),                                                     -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---

**152. Table: `crm.partners`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255),                                                    -- 거래처 이메일`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**153. Table: `crm.partners`**

- **Issue**: Column 'business_item' exists in SQL but not in model
- **SQL**: `business_item           VARCHAR(100),                                                    -- 종목`
- **Model**: `N/A`
- **Fix**: Remove column business_item from SQL or add to model

---

**154. Table: `crm.partners`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1                VARCHAR(200),                                                    -- 주소1 (기본주소)`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**155. Table: `crm.partners`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**156. Table: `crm.partners`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(200),                                                    -- 거래처명 (영문)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**157. Table: `crm.partners`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2                VARCHAR(200),                                                    -- 주소2 (상세주소)`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**158. Table: `crm.partners`**

- **Issue**: Column 'business_type' exists in SQL but not in model
- **SQL**: `business_type           CHAR(1)                  DEFAULT 'C',                            -- 사업자구분 (C:법인, S:개인)`
- **Model**: `N/A`
- **Fix**: Remove column business_type from SQL or add to model

---

**159. Table: `crm.partners`**

- **Issue**: Column 'established_date' exists in SQL but not in model
- **SQL**: `established_date        DATE,                                                            -- 설립일`
- **Model**: `N/A`
- **Fix**: Remove column established_date from SQL or add to model

---

**160. Table: `crm.partners`**

- **Issue**: Column 'credit_limit' exists in SQL but not in model
- **SQL**: `credit_limit            NUMERIC(18,2)            DEFAULT 0,                              -- 신용 한도`
- **Model**: `N/A`
- **Fix**: Remove column credit_limit from SQL or add to model

---

**161. Table: `crm.partners`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                     -- 거래처 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**162. Table: `crm.partners`**

- **Issue**: Column 'industry' exists in SQL but not in model
- **SQL**: `industry                VARCHAR(100),                                                    -- 산업/업종`
- **Model**: `N/A`
- **Fix**: Remove column industry from SQL or add to model

---

**163. Table: `crm.partners`**

- **Issue**: Column 'tax_no' exists in SQL but not in model
- **SQL**: `tax_no                  VARCHAR(50),                                                     -- 법인등록번호/세무번호`
- **Model**: `N/A`
- **Fix**: Remove column tax_no from SQL or add to model

---

**164. Table: `crm.partners`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 거래처 코드 (사내 규칙)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**165. Table: `crm.rfq_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 상세 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**166. Table: `crm.rfq_items`**

- **Issue**: Column 'target_delivery_date' exists in SQL but not in model
- **SQL**: `target_delivery_date    DATE,                                                            -- 희망 납기일`
- **Model**: `N/A`
- **Fix**: Remove column target_delivery_date from SQL or add to model

---

**167. Table: `crm.rfq_items`**

- **Issue**: Column 'rfq_id' exists in SQL but not in model
- **SQL**: `rfq_id                  UUID                     NOT NULL,                               -- 견적 요청서 헤더 ID`
- **Model**: `N/A`
- **Fix**: Remove column rfq_id from SQL or add to model

---

**168. Table: `crm.rfq_items`**

- **Issue**: Column 'product_name' exists in SQL but not in model
- **SQL**: `product_name            VARCHAR(200),                                                    -- 제품명 (제품 미등록 시)`
- **Model**: `N/A`
- **Fix**: Remove column product_name from SQL or add to model

---

**169. Table: `crm.rfq_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**170. Table: `crm.rfq_items`**

- **Issue**: Column 'product_code' exists in SQL but not in model
- **SQL**: `product_code            VARCHAR(100),                                                    -- 제품 코드 (제품 미등록 시)`
- **Model**: `N/A`
- **Fix**: Remove column product_code from SQL or add to model

---

**171. Table: `crm.rfq_items`**

- **Issue**: Column 'unit' exists in SQL but not in model
- **SQL**: `unit                    VARCHAR(20),                                                     -- 단위`
- **Model**: `N/A`
- **Fix**: Remove column unit from SQL or add to model

---

**172. Table: `crm.rfq_items`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**173. Table: `crm.rfq_items`**

- **Issue**: Column 'specifications' exists in SQL but not in model
- **SQL**: `specifications          TEXT,                                                            -- 사양`
- **Model**: `N/A`
- **Fix**: Remove column specifications from SQL or add to model

---

**174. Table: `crm.rfq_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 요청 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**175. Table: `crm.rfq_items`**

- **Issue**: Column 'target_price' exists in SQL but not in model
- **SQL**: `target_price            NUMERIC(18,4),                                                   -- 희망 단가`
- **Model**: `N/A`
- **Fix**: Remove column target_price from SQL or add to model

---

**176. Table: `crm.rfq_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID,                                                            -- 제품 ID`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**177. Table: `crm.rfqs`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**178. Table: `crm.rfqs`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID,                                                            -- 담당 영업자`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**179. Table: `crm.rfqs`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**180. Table: `crm.rfqs`**

- **Issue**: Column 'request_date' exists in SQL but not in model
- **SQL**: `request_date            DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 요청일`
- **Model**: `N/A`
- **Fix**: Remove column request_date from SQL or add to model

---

**181. Table: `crm.rfqs`**

- **Issue**: Column 'required_delivery_date' exists in SQL but not in model
- **SQL**: `required_delivery_date  DATE,                                                            -- 납품 희망일`
- **Model**: `N/A`
- **Fix**: Remove column required_delivery_date from SQL or add to model

---

**182. Table: `crm.rfqs`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**183. Table: `crm.rfqs`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(100),                                                    -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**184. Table: `crm.rfqs`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**185. Table: `crm.rfqs`**

- **Issue**: Column 'converted_quote_id' exists in SQL but not in model
- **SQL**: `converted_quote_id      UUID,                                                            -- 전환된 견적서 ID`
- **Model**: `N/A`
- **Fix**: Remove column converted_quote_id from SQL or add to model

---

**186. Table: `crm.rfqs`**

- **Issue**: Column 'title' exists in SQL but not in model
- **SQL**: `title                   VARCHAR(200)             NOT NULL,                               -- 제목`
- **Model**: `N/A`
- **Fix**: Remove column title from SQL or add to model

---

**187. Table: `crm.rfqs`**

- **Issue**: Column 'converted_at' exists in SQL but not in model
- **SQL**: `converted_at            TIMESTAMP WITH TIME ZONE,                                        -- 전환 일시`
- **Model**: `N/A`
- **Fix**: Remove column converted_at from SQL or add to model

---

**188. Table: `crm.rfqs`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**189. Table: `crm.rfqs`**

- **Issue**: Column 'due_date' exists in SQL but not in model
- **SQL**: `due_date                DATE,                                                            -- 회신 마감일`
- **Model**: `N/A`
- **Fix**: Remove column due_date from SQL or add to model

---

**190. Table: `crm.rfqs`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                VARCHAR(20)              DEFAULT 'NORMAL',                       -- 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**191. Table: `crm.rfqs`**

- **Issue**: Column 'delivery_address' exists in SQL but not in model
- **SQL**: `delivery_address        TEXT,                                                            -- 배송 주소`
- **Model**: `N/A`
- **Fix**: Remove column delivery_address from SQL or add to model

---

**192. Table: `crm.rfqs`**

- **Issue**: Column 'lead_id' exists in SQL but not in model
- **SQL**: `lead_id                 UUID,                                                            -- 리드 ID`
- **Model**: `N/A`
- **Fix**: Remove column lead_id from SQL or add to model

---

**193. Table: `crm.rfqs`**

- **Issue**: Column 'delivery_terms' exists in SQL but not in model
- **SQL**: `delivery_terms          VARCHAR(100),                                                    -- 배송 조건`
- **Model**: `N/A`
- **Fix**: Remove column delivery_terms from SQL or add to model

---

**194. Table: `crm.rfqs`**

- **Issue**: Column 'rfq_code' exists in SQL but not in model
- **SQL**: `rfq_code                VARCHAR(50)              NOT NULL,                               -- 견적 요청서 코드`
- **Model**: `N/A`
- **Fix**: Remove column rfq_code from SQL or add to model

---

**195. Table: `crm.rfqs`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**196. Table: `crm.rfqs`**

- **Issue**: Column 'contact_id' exists in SQL but not in model
- **SQL**: `contact_id              UUID,                                                            -- 담당자 ID`
- **Model**: `N/A`
- **Fix**: Remove column contact_id from SQL or add to model

---

**197. Table: `crm.activities`**

- **Issue**: Column 'related_to_type' exists in SQL but not in model
- **SQL**: `related_to_type         VARCHAR(20),                                                     -- 관련 대상 타입`
- **Model**: `N/A`
- **Fix**: Remove column related_to_type from SQL or add to model

---

**198. Table: `crm.activities`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID                     NOT NULL,                               -- 담당자 (활동 수행자)`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**199. Table: `crm.activities`**

- **Issue**: Column 'participants' exists in SQL but not in model
- **SQL**: `participants            TEXT,                                                            -- 참석자 (JSON 배열)`
- **Model**: `N/A`
- **Fix**: Remove column participants from SQL or add to model

---

**200. Table: `crm.activities`**

- **Issue**: Column 'is_completed' exists in SQL but not in model
- **SQL**: `is_completed            BOOLEAN                  DEFAULT false,                          -- 완료 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_completed from SQL or add to model

---

**201. Table: `crm.activities`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**202. Table: `crm.activities`**

- **Issue**: Column 'activity_date' exists in SQL but not in model
- **SQL**: `activity_date           DATE                     NOT NULL,                               -- 활동 일자`
- **Model**: `N/A`
- **Fix**: Remove column activity_date from SQL or add to model

---

**203. Table: `crm.activities`**

- **Issue**: Column 'completed_by' exists in SQL but not in model
- **SQL**: `completed_by            UUID,                                                            -- 완료 처리자`
- **Model**: `N/A`
- **Fix**: Remove column completed_by from SQL or add to model

---

**204. Table: `crm.activities`**

- **Issue**: Column 'subject' exists in SQL but not in model
- **SQL**: `subject                 VARCHAR(200)             NOT NULL,                               -- 제목`
- **Model**: `N/A`
- **Fix**: Remove column subject from SQL or add to model

---

**205. Table: `crm.activities`**

- **Issue**: Column 'duration_minutes' exists in SQL but not in model
- **SQL**: `duration_minutes        INTEGER,                                                         -- 소요 시간 (분)`
- **Model**: `N/A`
- **Fix**: Remove column duration_minutes from SQL or add to model

---

**206. Table: `crm.activities`**

- **Issue**: Column 'follow_up_date' exists in SQL but not in model
- **SQL**: `follow_up_date          DATE,                                                            -- 후속 활동 예정일`
- **Model**: `N/A`
- **Fix**: Remove column follow_up_date from SQL or add to model

---

**207. Table: `crm.activities`**

- **Issue**: Column 'contact_id' exists in SQL but not in model
- **SQL**: `contact_id              UUID,                                                            -- 담당자 ID`
- **Model**: `N/A`
- **Fix**: Remove column contact_id from SQL or add to model

---

**208. Table: `crm.activities`**

- **Issue**: Column 'opportunity_id' exists in SQL but not in model
- **SQL**: `opportunity_id          UUID,                                                            -- 영업 기회 ID`
- **Model**: `N/A`
- **Fix**: Remove column opportunity_id from SQL or add to model

---

**209. Table: `crm.activities`**

- **Issue**: Column 'activity_type' exists in SQL but not in model
- **SQL**: `activity_type           VARCHAR(20)              NOT NULL,                               -- 활동 유형`
- **Model**: `N/A`
- **Fix**: Remove column activity_type from SQL or add to model

---

**210. Table: `crm.activities`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 내용`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**211. Table: `crm.activities`**

- **Issue**: Column 'end_time' exists in SQL but not in model
- **SQL**: `end_time                TIME,                                                            -- 종료 시간`
- **Model**: `N/A`
- **Fix**: Remove column end_time from SQL or add to model

---

**212. Table: `crm.activities`**

- **Issue**: Column 'outcome' exists in SQL but not in model
- **SQL**: `outcome                 VARCHAR(50),                                                     -- 결과`
- **Model**: `N/A`
- **Fix**: Remove column outcome from SQL or add to model

---

**213. Table: `crm.activities`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**214. Table: `crm.activities`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PLANNED',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**215. Table: `crm.activities`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**216. Table: `crm.activities`**

- **Issue**: Column 'follow_up_activity_id' exists in SQL but not in model
- **SQL**: `follow_up_activity_id   UUID,                                                            -- 후속 활동 ID`
- **Model**: `N/A`
- **Fix**: Remove column follow_up_activity_id from SQL or add to model

---

**217. Table: `crm.activities`**

- **Issue**: Column 'meeting_url' exists in SQL but not in model
- **SQL**: `meeting_url             VARCHAR(500),                                                    -- 회의 URL (화상회의)`
- **Model**: `N/A`
- **Fix**: Remove column meeting_url from SQL or add to model

---

**218. Table: `crm.activities`**

- **Issue**: Column 'location' exists in SQL but not in model
- **SQL**: `location                VARCHAR(200),                                                    -- 장소`
- **Model**: `N/A`
- **Fix**: Remove column location from SQL or add to model

---

**219. Table: `crm.activities`**

- **Issue**: Column 'is_follow_up_required' exists in SQL but not in model
- **SQL**: `is_follow_up_required   BOOLEAN                  DEFAULT false,                          -- 후속 활동 필요 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_follow_up_required from SQL or add to model

---

**220. Table: `crm.activities`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                VARCHAR(20)              DEFAULT 'NORMAL',                       -- 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**221. Table: `crm.activities`**

- **Issue**: Column 'lead_id' exists in SQL but not in model
- **SQL**: `lead_id                 UUID,                                                            -- 리드 ID`
- **Model**: `N/A`
- **Fix**: Remove column lead_id from SQL or add to model

---

**222. Table: `crm.activities`**

- **Issue**: Column 'is_online' exists in SQL but not in model
- **SQL**: `is_online               BOOLEAN                  DEFAULT false,                          -- 온라인 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_online from SQL or add to model

---

**223. Table: `crm.activities`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**224. Table: `crm.activities`**

- **Issue**: Column 'is_reminder_enabled' exists in SQL but not in model
- **SQL**: `is_reminder_enabled     BOOLEAN                  DEFAULT false,                          -- 알림 사용 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_reminder_enabled from SQL or add to model

---

**225. Table: `crm.activities`**

- **Issue**: Column 'outcome_notes' exists in SQL but not in model
- **SQL**: `outcome_notes           TEXT,                                                            -- 결과 메모`
- **Model**: `N/A`
- **Fix**: Remove column outcome_notes from SQL or add to model

---

**226. Table: `crm.activities`**

- **Issue**: Column 'reminder_minutes' exists in SQL but not in model
- **SQL**: `reminder_minutes        INTEGER,                                                         -- 알림 시간 (분 전)`
- **Model**: `N/A`
- **Fix**: Remove column reminder_minutes from SQL or add to model

---

**227. Table: `crm.activities`**

- **Issue**: Column 'start_time' exists in SQL but not in model
- **SQL**: `start_time              TIME,                                                            -- 시작 시간`
- **Model**: `N/A`
- **Fix**: Remove column start_time from SQL or add to model

---

**228. Table: `crm.email_templates`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**229. Table: `crm.email_templates`**

- **Issue**: Column 'body_text' exists in SQL but not in model
- **SQL**: `body_text               TEXT,                                                            -- 본문 (텍스트)`
- **Model**: `N/A`
- **Fix**: Remove column body_text from SQL or add to model

---

**230. Table: `crm.email_templates`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 템플릿명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**231. Table: `crm.email_templates`**

- **Issue**: Column 'usage_count' exists in SQL but not in model
- **SQL**: `usage_count             INTEGER                  DEFAULT 0,                              -- 사용 횟수`
- **Model**: `N/A`
- **Fix**: Remove column usage_count from SQL or add to model

---

**232. Table: `crm.email_templates`**

- **Issue**: Column 'template_type' exists in SQL but not in model
- **SQL**: `template_type           VARCHAR(20)              NOT NULL,                               -- 템플릿 유형`
- **Model**: `N/A`
- **Fix**: Remove column template_type from SQL or add to model

---

**233. Table: `crm.email_templates`**

- **Issue**: Column 'variables' exists in SQL but not in model
- **SQL**: `variables               JSONB,                                                           -- 변수 목록 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column variables from SQL or add to model

---

**234. Table: `crm.email_templates`**

- **Issue**: Column 'from_email' exists in SQL but not in model
- **SQL**: `from_email              VARCHAR(100),                                                    -- 발신자 이메일`
- **Model**: `N/A`
- **Fix**: Remove column from_email from SQL or add to model

---

**235. Table: `crm.email_templates`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**236. Table: `crm.email_templates`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**237. Table: `crm.email_templates`**

- **Issue**: Column 'default_attachments' exists in SQL but not in model
- **SQL**: `default_attachments     JSONB,                                                           -- 기본 첨부파일 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column default_attachments from SQL or add to model

---

**238. Table: `crm.email_templates`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                     -- 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**239. Table: `crm.email_templates`**

- **Issue**: Column 'body_html' exists in SQL but not in model
- **SQL**: `body_html               TEXT                     NOT NULL,                               -- 본문 (HTML)`
- **Model**: `N/A`
- **Fix**: Remove column body_html from SQL or add to model

---

**240. Table: `crm.email_templates`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**241. Table: `crm.email_templates`**

- **Issue**: Column 'reply_to' exists in SQL but not in model
- **SQL**: `reply_to                VARCHAR(100),                                                    -- 답장 주소`
- **Model**: `N/A`
- **Fix**: Remove column reply_to from SQL or add to model

---

**242. Table: `crm.email_templates`**

- **Issue**: Column 'template_code' exists in SQL but not in model
- **SQL**: `template_code           VARCHAR(50)              NOT NULL,                               -- 템플릿 코드`
- **Model**: `N/A`
- **Fix**: Remove column template_code from SQL or add to model

---

**243. Table: `crm.email_templates`**

- **Issue**: Column 'last_used_at' exists in SQL but not in model
- **SQL**: `last_used_at            TIMESTAMP WITH TIME ZONE,                                        -- 마지막 사용 일시`
- **Model**: `N/A`
- **Fix**: Remove column last_used_at from SQL or add to model

---

**244. Table: `crm.email_templates`**

- **Issue**: Column 'subject' exists in SQL but not in model
- **SQL**: `subject                 VARCHAR(500)             NOT NULL,                               -- 제목`
- **Model**: `N/A`
- **Fix**: Remove column subject from SQL or add to model

---

**245. Table: `crm.email_templates`**

- **Issue**: Column 'from_name' exists in SQL but not in model
- **SQL**: `from_name               VARCHAR(100),                                                    -- 발신자명`
- **Model**: `N/A`
- **Fix**: Remove column from_name from SQL or add to model

---

**246. Table: `crm.leads`**

- **Issue**: Column 'contact_phone' exists in SQL but not in model
- **SQL**: `contact_phone           VARCHAR(20),                                                     -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column contact_phone from SQL or add to model

---

**247. Table: `crm.leads`**

- **Issue**: Column 'interest_product' exists in SQL but not in model
- **SQL**: `interest_product        VARCHAR(200),                                                    -- 관심 제품`
- **Model**: `N/A`
- **Fix**: Remove column interest_product from SQL or add to model

---

**248. Table: `crm.leads`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID,                                                            -- 담당 영업자`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**249. Table: `crm.leads`**

- **Issue**: Column 'employee_count' exists in SQL but not in model
- **SQL**: `employee_count          INTEGER,                                                         -- 직원 수`
- **Model**: `N/A`
- **Fix**: Remove column employee_count from SQL or add to model

---

**250. Table: `crm.leads`**

- **Issue**: Column 'company_name' exists in SQL but not in model
- **SQL**: `company_name            VARCHAR(200)             NOT NULL,                               -- 회사명`
- **Model**: `N/A`
- **Fix**: Remove column company_name from SQL or add to model

---

**251. Table: `crm.leads`**

- **Issue**: Column 'website' exists in SQL but not in model
- **SQL**: `website                 VARCHAR(200),                                                    -- 웹사이트`
- **Model**: `N/A`
- **Fix**: Remove column website from SQL or add to model

---

**252. Table: `crm.leads`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**253. Table: `crm.leads`**

- **Issue**: Column 'converted_at' exists in SQL but not in model
- **SQL**: `converted_at            TIMESTAMP WITH TIME ZONE,                                        -- 전환 일시`
- **Model**: `N/A`
- **Fix**: Remove column converted_at from SQL or add to model

---

**254. Table: `crm.leads`**

- **Issue**: Column 'contact_name' exists in SQL but not in model
- **SQL**: `contact_name            VARCHAR(100)             NOT NULL,                               -- 담당자명`
- **Model**: `N/A`
- **Fix**: Remove column contact_name from SQL or add to model

---

**255. Table: `crm.leads`**

- **Issue**: Column 'budget_range' exists in SQL but not in model
- **SQL**: `budget_range            VARCHAR(50),                                                     -- 예산 범위`
- **Model**: `N/A`
- **Fix**: Remove column budget_range from SQL or add to model

---

**256. Table: `crm.leads`**

- **Issue**: Column 'city' exists in SQL but not in model
- **SQL**: `city                    VARCHAR(100),                                                    -- 도시`
- **Model**: `N/A`
- **Fix**: Remove column city from SQL or add to model

---

**257. Table: `crm.leads`**

- **Issue**: Column 'annual_revenue' exists in SQL but not in model
- **SQL**: `annual_revenue          NUMERIC(18,2),                                                   -- 연매출액`
- **Model**: `N/A`
- **Fix**: Remove column annual_revenue from SQL or add to model

---

**258. Table: `crm.leads`**

- **Issue**: Column 'country_code' exists in SQL but not in model
- **SQL**: `country_code            VARCHAR(3),                                                      -- 국가 코드`
- **Model**: `N/A`
- **Fix**: Remove column country_code from SQL or add to model

---

**259. Table: `crm.leads`**

- **Issue**: Column 'rating' exists in SQL but not in model
- **SQL**: `rating                  VARCHAR(20),                                                     -- 등급`
- **Model**: `N/A`
- **Fix**: Remove column rating from SQL or add to model

---

**260. Table: `crm.leads`**

- **Issue**: Column 'interest_service' exists in SQL but not in model
- **SQL**: `interest_service        VARCHAR(200),                                                    -- 관심 서비스`
- **Model**: `N/A`
- **Fix**: Remove column interest_service from SQL or add to model

---

**261. Table: `crm.leads`**

- **Issue**: Column 'contact_mobile' exists in SQL but not in model
- **SQL**: `contact_mobile          VARCHAR(20),                                                     -- 휴대폰`
- **Model**: `N/A`
- **Fix**: Remove column contact_mobile from SQL or add to model

---

**262. Table: `crm.leads`**

- **Issue**: Column 'state_province' exists in SQL but not in model
- **SQL**: `state_province          VARCHAR(100),                                                    -- 주/도`
- **Model**: `N/A`
- **Fix**: Remove column state_province from SQL or add to model

---

**263. Table: `crm.leads`**

- **Issue**: Column 'converted_by' exists in SQL but not in model
- **SQL**: `converted_by            UUID,                                                            -- 전환 처리자`
- **Model**: `N/A`
- **Fix**: Remove column converted_by from SQL or add to model

---

**264. Table: `crm.leads`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode                VARCHAR(20),                                                     -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---

**265. Table: `crm.leads`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**266. Table: `crm.leads`**

- **Issue**: Column 'contact_title' exists in SQL but not in model
- **SQL**: `contact_title           VARCHAR(100),                                                    -- 직책`
- **Model**: `N/A`
- **Fix**: Remove column contact_title from SQL or add to model

---

**267. Table: `crm.leads`**

- **Issue**: Column 'source' exists in SQL but not in model
- **SQL**: `source                  VARCHAR(50),                                                     -- 리드 출처`
- **Model**: `N/A`
- **Fix**: Remove column source from SQL or add to model

---

**268. Table: `crm.leads`**

- **Issue**: Column 'contact_email' exists in SQL but not in model
- **SQL**: `contact_email           VARCHAR(100),                                                    -- 이메일`
- **Model**: `N/A`
- **Fix**: Remove column contact_email from SQL or add to model

---

**269. Table: `crm.leads`**

- **Issue**: Column 'purchase_timeframe' exists in SQL but not in model
- **SQL**: `purchase_timeframe      VARCHAR(50),                                                     -- 구매 시기`
- **Model**: `N/A`
- **Fix**: Remove column purchase_timeframe from SQL or add to model

---

**270. Table: `crm.leads`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1                VARCHAR(200),                                                    -- 주소1`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**271. Table: `crm.leads`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'NEW',                          -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**272. Table: `crm.leads`**

- **Issue**: Column 'converted_partner_id' exists in SQL but not in model
- **SQL**: `converted_partner_id    UUID,                                                            -- 전환된 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column converted_partner_id from SQL or add to model

---

**273. Table: `crm.leads`**

- **Issue**: Column 'source_detail' exists in SQL but not in model
- **SQL**: `source_detail           VARCHAR(200),                                                    -- 출처 상세`
- **Model**: `N/A`
- **Fix**: Remove column source_detail from SQL or add to model

---

**274. Table: `crm.leads`**

- **Issue**: Column 'lead_code' exists in SQL but not in model
- **SQL**: `lead_code               VARCHAR(50)              NOT NULL,                               -- 리드 코드`
- **Model**: `N/A`
- **Fix**: Remove column lead_code from SQL or add to model

---

**275. Table: `crm.leads`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**276. Table: `crm.leads`**

- **Issue**: Column 'lead_score' exists in SQL but not in model
- **SQL**: `lead_score              INTEGER                  DEFAULT 0,                              -- 리드 점수`
- **Model**: `N/A`
- **Fix**: Remove column lead_score from SQL or add to model

---

**277. Table: `crm.leads`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2                VARCHAR(200),                                                    -- 주소2`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**278. Table: `crm.leads`**

- **Issue**: Column 'industry' exists in SQL but not in model
- **SQL**: `industry                VARCHAR(100),                                                    -- 업종`
- **Model**: `N/A`
- **Fix**: Remove column industry from SQL or add to model

---

**279. Table: `crm.opportunities`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID,                                                            -- 담당 영업자`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**280. Table: `crm.opportunities`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 영업 기회명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**281. Table: `crm.opportunities`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**282. Table: `crm.opportunities`**

- **Issue**: Column 'competitors' exists in SQL but not in model
- **SQL**: `competitors             TEXT,                                                            -- 경쟁사`
- **Model**: `N/A`
- **Fix**: Remove column competitors from SQL or add to model

---

**283. Table: `crm.opportunities`**

- **Issue**: Column 'opportunity_code' exists in SQL but not in model
- **SQL**: `opportunity_code        VARCHAR(50)              NOT NULL,                               -- 영업 기회 코드`
- **Model**: `N/A`
- **Fix**: Remove column opportunity_code from SQL or add to model

---

**284. Table: `crm.opportunities`**

- **Issue**: Column 'expected_close_date' exists in SQL but not in model
- **SQL**: `expected_close_date     DATE,                                                            -- 예상 마감일`
- **Model**: `N/A`
- **Fix**: Remove column expected_close_date from SQL or add to model

---

**285. Table: `crm.opportunities`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**286. Table: `crm.opportunities`**

- **Issue**: Column 'won_so_id' exists in SQL but not in model
- **SQL**: `won_so_id               UUID,                                                            -- 수주된 판매주문 ID`
- **Model**: `N/A`
- **Fix**: Remove column won_so_id from SQL or add to model

---

**287. Table: `crm.opportunities`**

- **Issue**: Column 'expected_revenue' exists in SQL but not in model
- **SQL**: `expected_revenue        NUMERIC(18,2)            DEFAULT 0,                              -- 예상 수익 (금액 × 확률)`
- **Model**: `N/A`
- **Fix**: Remove column expected_revenue from SQL or add to model

---

**288. Table: `crm.opportunities`**

- **Issue**: Column 'team_id' exists in SQL but not in model
- **SQL**: `team_id                 UUID,                                                            -- 담당 팀`
- **Model**: `N/A`
- **Fix**: Remove column team_id from SQL or add to model

---

**289. Table: `crm.opportunities`**

- **Issue**: Column 'stage' exists in SQL but not in model
- **SQL**: `stage                   VARCHAR(20)              NOT NULL DEFAULT 'LEAD',                -- 영업 단계`
- **Model**: `N/A`
- **Fix**: Remove column stage from SQL or add to model

---

**290. Table: `crm.opportunities`**

- **Issue**: Column 'contact_id' exists in SQL but not in model
- **SQL**: `contact_id              UUID,                                                            -- 담당자 ID`
- **Model**: `N/A`
- **Fix**: Remove column contact_id from SQL or add to model

---

**291. Table: `crm.opportunities`**

- **Issue**: Column 'win_probability' exists in SQL but not in model
- **SQL**: `win_probability         INTEGER                  DEFAULT 0,                              -- 성공 확률 (%)`
- **Model**: `N/A`
- **Fix**: Remove column win_probability from SQL or add to model

---

**292. Table: `crm.opportunities`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**293. Table: `crm.opportunities`**

- **Issue**: Column 'product_interest' exists in SQL but not in model
- **SQL**: `product_interest        VARCHAR(200),                                                    -- 관심 제품`
- **Model**: `N/A`
- **Fix**: Remove column product_interest from SQL or add to model

---

**294. Table: `crm.opportunities`**

- **Issue**: Column 'source' exists in SQL but not in model
- **SQL**: `source                  VARCHAR(50),                                                     -- 기회 출처`
- **Model**: `N/A`
- **Fix**: Remove column source from SQL or add to model

---

**295. Table: `crm.opportunities`**

- **Issue**: Column 'service_interest' exists in SQL but not in model
- **SQL**: `service_interest        VARCHAR(200),                                                    -- 관심 서비스`
- **Model**: `N/A`
- **Fix**: Remove column service_interest from SQL or add to model

---

**296. Table: `crm.opportunities`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**297. Table: `crm.opportunities`**

- **Issue**: Column 'amount' exists in SQL but not in model
- **SQL**: `amount                  NUMERIC(18,2)            DEFAULT 0,                              -- 예상 금액`
- **Model**: `N/A`
- **Fix**: Remove column amount from SQL or add to model

---

**298. Table: `crm.opportunities`**

- **Issue**: Column 'source_detail' exists in SQL but not in model
- **SQL**: `source_detail           VARCHAR(200),                                                    -- 출처 상세`
- **Model**: `N/A`
- **Fix**: Remove column source_detail from SQL or add to model

---

**299. Table: `crm.opportunities`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**300. Table: `crm.opportunities`**

- **Issue**: Column 'lost_reason_detail' exists in SQL but not in model
- **SQL**: `lost_reason_detail      TEXT,                                                            -- 실패 사유 상세`
- **Model**: `N/A`
- **Fix**: Remove column lost_reason_detail from SQL or add to model

---

**301. Table: `crm.opportunities`**

- **Issue**: Column 'lead_id' exists in SQL but not in model
- **SQL**: `lead_id                 UUID,                                                            -- 리드 ID`
- **Model**: `N/A`
- **Fix**: Remove column lead_id from SQL or add to model

---

**302. Table: `crm.opportunities`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**303. Table: `crm.opportunities`**

- **Issue**: Column 'campaign_id' exists in SQL but not in model
- **SQL**: `campaign_id             UUID,                                                            -- 관련 캠페인`
- **Model**: `N/A`
- **Fix**: Remove column campaign_id from SQL or add to model

---

**304. Table: `crm.opportunities`**

- **Issue**: Column 'actual_close_date' exists in SQL but not in model
- **SQL**: `actual_close_date       DATE,                                                            -- 실제 마감일`
- **Model**: `N/A`
- **Fix**: Remove column actual_close_date from SQL or add to model

---

**305. Table: `crm.opportunities`**

- **Issue**: Column 'our_advantage' exists in SQL but not in model
- **SQL**: `our_advantage           TEXT,                                                            -- 우리의 강점`
- **Model**: `N/A`
- **Fix**: Remove column our_advantage from SQL or add to model

---

**306. Table: `crm.opportunities`**

- **Issue**: Column 'lost_reason' exists in SQL but not in model
- **SQL**: `lost_reason             VARCHAR(50),                                                     -- 실패 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column lost_reason from SQL or add to model

---

**307. Table: `crm.partner_contacts`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                VARCHAR(100)             NOT NULL,                               -- 담당자명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**308. Table: `crm.partner_contacts`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone               VARCHAR(50),                                                     -- 직장 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**309. Table: `crm.partner_contacts`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email               VARCHAR(255),                                                    -- 이메일 주소`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**310. Table: `crm.partner_contacts`**

- **Issue**: Column 'contact_type' exists in SQL but not in model
- **SQL**: `contact_type        VARCHAR(20),                                                     -- 업무 유형`
- **Model**: `N/A`
- **Fix**: Remove column contact_type from SQL or add to model

---

**311. Table: `crm.partner_contacts`**

- **Issue**: Column 'is_primary' exists in SQL but not in model
- **SQL**: `is_primary          BOOLEAN                  NOT NULL DEFAULT false,                 -- 주담당자 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_primary from SQL or add to model

---

**312. Table: `crm.partner_contacts`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status              VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**313. Table: `crm.partner_contacts`**

- **Issue**: Column 'mobile' exists in SQL but not in model
- **SQL**: `mobile              VARCHAR(50),                                                     -- 휴대폰 번호`
- **Model**: `N/A`
- **Fix**: Remove column mobile from SQL or add to model

---

**314. Table: `crm.partner_contacts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes               TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**315. Table: `crm.partner_contacts`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id          UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**316. Table: `crm.partner_contacts`**

- **Issue**: Column 'department' exists in SQL but not in model
- **SQL**: `department          VARCHAR(100),                                                    -- 소속 부서`
- **Model**: `N/A`
- **Fix**: Remove column department from SQL or add to model

---

**317. Table: `crm.partner_contacts`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted          BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**318. Table: `crm.partner_contacts`**

- **Issue**: Column 'position' exists in SQL but not in model
- **SQL**: `position            VARCHAR(100),                                                    -- 직책/직위`
- **Model**: `N/A`
- **Fix**: Remove column position from SQL or add to model

---

**319. Table: `crm.partner_addresses`**

- **Issue**: Column 'is_default' exists in SQL but not in model
- **SQL**: `is_default          BOOLEAN                  DEFAULT false,                          -- 기본 주소 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_default from SQL or add to model

---

**320. Table: `crm.partner_addresses`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email               VARCHAR(255),                                                    -- 이메일`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**321. Table: `crm.partner_addresses`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1            VARCHAR(200),                                                    -- 기본 주소`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**322. Table: `crm.partner_addresses`**

- **Issue**: Column 'region_code' exists in SQL but not in model
- **SQL**: `region_code         VARCHAR(20),                                                     -- 지역 코드`
- **Model**: `N/A`
- **Fix**: Remove column region_code from SQL or add to model

---

**323. Table: `crm.partner_addresses`**

- **Issue**: Column 'mobile' exists in SQL but not in model
- **SQL**: `mobile              VARCHAR(50),                                                     -- 휴대폰 번호`
- **Model**: `N/A`
- **Fix**: Remove column mobile from SQL or add to model

---

**324. Table: `crm.partner_addresses`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes               TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**325. Table: `crm.partner_addresses`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status              VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**326. Table: `crm.partner_addresses`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2            VARCHAR(200),                                                    -- 상세 주소`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**327. Table: `crm.partner_addresses`**

- **Issue**: Column 'building' exists in SQL but not in model
- **SQL**: `building            VARCHAR(200),                                                    -- 건물명`
- **Model**: `N/A`
- **Fix**: Remove column building from SQL or add to model

---

**328. Table: `crm.partner_addresses`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted          BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**329. Table: `crm.partner_addresses`**

- **Issue**: Column 'contact_name' exists in SQL but not in model
- **SQL**: `contact_name        VARCHAR(100),                                                    -- 연락처 담당자명`
- **Model**: `N/A`
- **Fix**: Remove column contact_name from SQL or add to model

---

**330. Table: `crm.partner_addresses`**

- **Issue**: Column 'city' exists in SQL but not in model
- **SQL**: `city                VARCHAR(100),                                                    -- 도시`
- **Model**: `N/A`
- **Fix**: Remove column city from SQL or add to model

---

**331. Table: `crm.partner_addresses`**

- **Issue**: Column 'address_name' exists in SQL but not in model
- **SQL**: `address_name        VARCHAR(100),                                                    -- 주소 별칭`
- **Model**: `N/A`
- **Fix**: Remove column address_name from SQL or add to model

---

**332. Table: `crm.partner_addresses`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone               VARCHAR(50),                                                     -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**333. Table: `crm.partner_addresses`**

- **Issue**: Column 'address_type' exists in SQL but not in model
- **SQL**: `address_type        VARCHAR(20)              NOT NULL,                               -- 주소 유형`
- **Model**: `N/A`
- **Fix**: Remove column address_type from SQL or add to model

---

**334. Table: `crm.partner_addresses`**

- **Issue**: Column 'country_code' exists in SQL but not in model
- **SQL**: `country_code        VARCHAR(3)               DEFAULT 'KOR',                          -- 국가 코드`
- **Model**: `N/A`
- **Fix**: Remove column country_code from SQL or add to model

---

**335. Table: `crm.partner_addresses`**

- **Issue**: Column 'access_code' exists in SQL but not in model
- **SQL**: `access_code         VARCHAR(20),                                                     -- 출입코드`
- **Model**: `N/A`
- **Fix**: Remove column access_code from SQL or add to model

---

**336. Table: `crm.partner_addresses`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id          UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**337. Table: `crm.partner_addresses`**

- **Issue**: Column 'instruction' exists in SQL but not in model
- **SQL**: `instruction         TEXT,                                                            -- 배송 지시사항`
- **Model**: `N/A`
- **Fix**: Remove column instruction from SQL or add to model

---

**338. Table: `crm.partner_addresses`**

- **Issue**: Column 'is_billing' exists in SQL but not in model
- **SQL**: `is_billing          BOOLEAN                  DEFAULT false,                          -- 청구지 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_billing from SQL or add to model

---

**339. Table: `crm.partner_addresses`**

- **Issue**: Column 'state_province' exists in SQL but not in model
- **SQL**: `state_province      VARCHAR(100),                                                    -- 주/도`
- **Model**: `N/A`
- **Fix**: Remove column state_province from SQL or add to model

---

**340. Table: `crm.partner_addresses`**

- **Issue**: Column 'is_shipping' exists in SQL but not in model
- **SQL**: `is_shipping         BOOLEAN                  DEFAULT false,                          -- 배송지 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_shipping from SQL or add to model

---

**341. Table: `crm.partner_addresses`**

- **Issue**: Column 'fax' exists in SQL but not in model
- **SQL**: `fax                 VARCHAR(50),                                                     -- 팩스번호`
- **Model**: `N/A`
- **Fix**: Remove column fax from SQL or add to model

---

**342. Table: `crm.partner_addresses`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode            VARCHAR(20),                                                     -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---


#### Missing Model (2)

**1. Table: `crm.campaigns`**

- **Issue**: Table campaigns exists in SQL but has no corresponding Python model
- **SQL**: `Table defined in 10_campaigns.sql`
- **Model**: `N/A`
- **Fix**: Create Python model for campaigns or remove SQL table definition

---

**2. Table: `crm.campaign_members`**

- **Issue**: Table campaign_members exists in SQL but has no corresponding Python model
- **SQL**: `Table defined in 11_campaign_members.sql`
- **Model**: `N/A`
- **Fix**: Create Python model for campaign_members or remove SQL table definition

---


### Schema: FAM (77 issues)


#### Extra SQL Column (77)

**1. Table: `fam.fixed_assets`**

- **Issue**: Column 'asset_type' exists in SQL but not in model
- **SQL**: `asset_type              VARCHAR(50),                                                     -- 자산 유형`
- **Model**: `N/A`
- **Fix**: Remove column asset_type from SQL or add to model

---

**2. Table: `fam.fixed_assets`**

- **Issue**: Column 'asset_code' exists in SQL but not in model
- **SQL**: `asset_code              VARCHAR(50)              NOT NULL,                               -- 자산 코드`
- **Model**: `N/A`
- **Fix**: Remove column asset_code from SQL or add to model

---

**3. Table: `fam.fixed_assets`**

- **Issue**: Column 'useful_life_years' exists in SQL but not in model
- **SQL**: `useful_life_years       INTEGER                  NOT NULL,                               -- 내용연수 (년)`
- **Model**: `N/A`
- **Fix**: Remove column useful_life_years from SQL or add to model

---

**4. Table: `fam.fixed_assets`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**5. Table: `fam.fixed_assets`**

- **Issue**: Column 'depreciable_cost' exists in SQL but not in model
- **SQL**: `depreciable_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 상각대상 금액`
- **Model**: `N/A`
- **Fix**: Remove column depreciable_cost from SQL or add to model

---

**6. Table: `fam.fixed_assets`**

- **Issue**: Column 'supplier_name' exists in SQL but not in model
- **SQL**: `supplier_name           VARCHAR(200),                                                    -- 공급업체명 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column supplier_name from SQL or add to model

---

**7. Table: `fam.fixed_assets`**

- **Issue**: Column 'disposal_gain_loss' exists in SQL but not in model
- **SQL**: `disposal_gain_loss      NUMERIC(18,2),                                                   -- 처분손익`
- **Model**: `N/A`
- **Fix**: Remove column disposal_gain_loss from SQL or add to model

---

**8. Table: `fam.fixed_assets`**

- **Issue**: Column 'useful_life_months' exists in SQL but not in model
- **SQL**: `useful_life_months      INTEGER                  NOT NULL,                               -- 내용연수 (월)`
- **Model**: `N/A`
- **Fix**: Remove column useful_life_months from SQL or add to model

---

**9. Table: `fam.fixed_assets`**

- **Issue**: Column 'depreciation_account' exists in SQL but not in model
- **SQL**: `depreciation_account    VARCHAR(50),                                                     -- 감가상각비 계정`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_account from SQL or add to model

---

**10. Table: `fam.fixed_assets`**

- **Issue**: Column 'disposal_date' exists in SQL but not in model
- **SQL**: `disposal_date           DATE,                                                            -- 처분일`
- **Model**: `N/A`
- **Fix**: Remove column disposal_date from SQL or add to model

---

**11. Table: `fam.fixed_assets`**

- **Issue**: Column 'account_code' exists in SQL but not in model
- **SQL**: `account_code            VARCHAR(50),                                                     -- 계정과목 코드`
- **Model**: `N/A`
- **Fix**: Remove column account_code from SQL or add to model

---

**12. Table: `fam.fixed_assets`**

- **Issue**: Column 'manufacturer' exists in SQL but not in model
- **SQL**: `manufacturer            VARCHAR(200),                                                    -- 제조사`
- **Model**: `N/A`
- **Fix**: Remove column manufacturer from SQL or add to model

---

**13. Table: `fam.fixed_assets`**

- **Issue**: Column 'accumulated_account' exists in SQL but not in model
- **SQL**: `accumulated_account     VARCHAR(50),                                                     -- 감가상각누계액 계정`
- **Model**: `N/A`
- **Fix**: Remove column accumulated_account from SQL or add to model

---

**14. Table: `fam.fixed_assets`**

- **Issue**: Column 'supplier_id' exists in SQL but not in model
- **SQL**: `supplier_id             UUID,                                                            -- 공급업체`
- **Model**: `N/A`
- **Fix**: Remove column supplier_id from SQL or add to model

---

**15. Table: `fam.fixed_assets`**

- **Issue**: Column 'warranty_end_date' exists in SQL but not in model
- **SQL**: `warranty_end_date       DATE,                                                            -- 보증 종료일`
- **Model**: `N/A`
- **Fix**: Remove column warranty_end_date from SQL or add to model

---

**16. Table: `fam.fixed_assets`**

- **Issue**: Column 'acquisition_method' exists in SQL but not in model
- **SQL**: `acquisition_method      VARCHAR(20),                                                     -- 취득 방법`
- **Model**: `N/A`
- **Fix**: Remove column acquisition_method from SQL or add to model

---

**17. Table: `fam.fixed_assets`**

- **Issue**: Column 'salvage_value' exists in SQL but not in model
- **SQL**: `salvage_value           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 잔존가치`
- **Model**: `N/A`
- **Fix**: Remove column salvage_value from SQL or add to model

---

**18. Table: `fam.fixed_assets`**

- **Issue**: Column 'model_number' exists in SQL but not in model
- **SQL**: `model_number            VARCHAR(100),                                                    -- 모델번호`
- **Model**: `N/A`
- **Fix**: Remove column model_number from SQL or add to model

---

**19. Table: `fam.fixed_assets`**

- **Issue**: Column 'disposal_amount' exists in SQL but not in model
- **SQL**: `disposal_amount         NUMERIC(18,2),                                                   -- 처분가액`
- **Model**: `N/A`
- **Fix**: Remove column disposal_amount from SQL or add to model

---

**20. Table: `fam.fixed_assets`**

- **Issue**: Column 'disposal_method' exists in SQL but not in model
- **SQL**: `disposal_method         VARCHAR(20),                                                     -- 처분 방법`
- **Model**: `N/A`
- **Fix**: Remove column disposal_method from SQL or add to model

---

**21. Table: `fam.fixed_assets`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**22. Table: `fam.fixed_assets`**

- **Issue**: Column 'warranty_start_date' exists in SQL but not in model
- **SQL**: `warranty_start_date     DATE,                                                            -- 보증 시작일`
- **Model**: `N/A`
- **Fix**: Remove column warranty_start_date from SQL or add to model

---

**23. Table: `fam.fixed_assets`**

- **Issue**: Column 'next_maintenance_date' exists in SQL but not in model
- **SQL**: `next_maintenance_date   DATE,                                                            -- 다음 점검일`
- **Model**: `N/A`
- **Fix**: Remove column next_maintenance_date from SQL or add to model

---

**24. Table: `fam.fixed_assets`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 관리 부서`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**25. Table: `fam.fixed_assets`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'IN_USE',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**26. Table: `fam.fixed_assets`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**27. Table: `fam.fixed_assets`**

- **Issue**: Column 'location' exists in SQL but not in model
- **SQL**: `location                VARCHAR(200),                                                    -- 위치`
- **Model**: `N/A`
- **Fix**: Remove column location from SQL or add to model

---

**28. Table: `fam.fixed_assets`**

- **Issue**: Column 'acquisition_date' exists in SQL but not in model
- **SQL**: `acquisition_date        DATE                     NOT NULL,                               -- 취득일`
- **Model**: `N/A`
- **Fix**: Remove column acquisition_date from SQL or add to model

---

**29. Table: `fam.fixed_assets`**

- **Issue**: Column 'depreciation_rate' exists in SQL but not in model
- **SQL**: `depreciation_rate       NUMERIC(10,4),                                                   -- 상각률 (%)`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_rate from SQL or add to model

---

**30. Table: `fam.fixed_assets`**

- **Issue**: Column 'accumulated_depreciation' exists in SQL but not in model
- **SQL**: `accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 감가상각누계액`
- **Model**: `N/A`
- **Fix**: Remove column accumulated_depreciation from SQL or add to model

---

**31. Table: `fam.fixed_assets`**

- **Issue**: Column 'last_maintenance_date' exists in SQL but not in model
- **SQL**: `last_maintenance_date   DATE,                                                            -- 최근 점검일`
- **Model**: `N/A`
- **Fix**: Remove column last_maintenance_date from SQL or add to model

---

**32. Table: `fam.fixed_assets`**

- **Issue**: Column 'asset_name' exists in SQL but not in model
- **SQL**: `asset_name              VARCHAR(200)             NOT NULL,                               -- 자산명`
- **Model**: `N/A`
- **Fix**: Remove column asset_name from SQL or add to model

---

**33. Table: `fam.fixed_assets`**

- **Issue**: Column 'asset_category' exists in SQL but not in model
- **SQL**: `asset_category          VARCHAR(50)              NOT NULL,                               -- 자산 분류`
- **Model**: `N/A`
- **Fix**: Remove column asset_category from SQL or add to model

---

**34. Table: `fam.fixed_assets`**

- **Issue**: Column 'custodian_id' exists in SQL but not in model
- **SQL**: `custodian_id            UUID,                                                            -- 관리자 (사원)`
- **Model**: `N/A`
- **Fix**: Remove column custodian_id from SQL or add to model

---

**35. Table: `fam.fixed_assets`**

- **Issue**: Column 'depreciation_method' exists in SQL but not in model
- **SQL**: `depreciation_method     VARCHAR(20)              NOT NULL DEFAULT 'STRAIGHT_LINE',       -- 상각 방법`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_method from SQL or add to model

---

**36. Table: `fam.fixed_assets`**

- **Issue**: Column 'acquisition_cost' exists in SQL but not in model
- **SQL**: `acquisition_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 취득가액`
- **Model**: `N/A`
- **Fix**: Remove column acquisition_cost from SQL or add to model

---

**37. Table: `fam.fixed_assets`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 일련번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**38. Table: `fam.fixed_assets`**

- **Issue**: Column 'maintenance_cycle' exists in SQL but not in model
- **SQL**: `maintenance_cycle       INTEGER,                                                         -- 정기점검 주기 (월)`
- **Model**: `N/A`
- **Fix**: Remove column maintenance_cycle from SQL or add to model

---

**39. Table: `fam.fixed_assets`**

- **Issue**: Column 'book_value' exists in SQL but not in model
- **SQL**: `book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액`
- **Model**: `N/A`
- **Fix**: Remove column book_value from SQL or add to model

---

**40. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_amount' exists in SQL but not in model
- **SQL**: `disposal_amount         NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 처분가액`
- **Model**: `N/A`
- **Fix**: Remove column disposal_amount from SQL or add to model

---

**41. Table: `fam.asset_disposals`**

- **Issue**: Column 'buyer_partner_id' exists in SQL but not in model
- **SQL**: `buyer_partner_id        UUID,                                                            -- 매입자 (거래처)`
- **Model**: `N/A`
- **Fix**: Remove column buyer_partner_id from SQL or add to model

---

**42. Table: `fam.asset_disposals`**

- **Issue**: Column 'buyer_name' exists in SQL but not in model
- **SQL**: `buyer_name              VARCHAR(200),                                                    -- 매입자명`
- **Model**: `N/A`
- **Fix**: Remove column buyer_name from SQL or add to model

---

**43. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_method' exists in SQL but not in model
- **SQL**: `disposal_method         VARCHAR(20)              NOT NULL,                               -- 처분 방법`
- **Model**: `N/A`
- **Fix**: Remove column disposal_method from SQL or add to model

---

**44. Table: `fam.asset_disposals`**

- **Issue**: Column 'business_document_id' exists in SQL but not in model
- **SQL**: `business_document_id    UUID,                                                            -- 업무전표 ID`
- **Model**: `N/A`
- **Fix**: Remove column business_document_id from SQL or add to model

---

**45. Table: `fam.asset_disposals`**

- **Issue**: Column 'asset_id' exists in SQL but not in model
- **SQL**: `asset_id                UUID                     NOT NULL,                               -- 고정자산 ID`
- **Model**: `N/A`
- **Fix**: Remove column asset_id from SQL or add to model

---

**46. Table: `fam.asset_disposals`**

- **Issue**: Column 'asset_code' exists in SQL but not in model
- **SQL**: `asset_code              VARCHAR(50),                                                     -- 자산 코드 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column asset_code from SQL or add to model

---

**47. Table: `fam.asset_disposals`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**48. Table: `fam.asset_disposals`**

- **Issue**: Column 'buyer_contact' exists in SQL but not in model
- **SQL**: `buyer_contact           VARCHAR(100),                                                    -- 매입자 연락처`
- **Model**: `N/A`
- **Fix**: Remove column buyer_contact from SQL or add to model

---

**49. Table: `fam.asset_disposals`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**50. Table: `fam.asset_disposals`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**51. Table: `fam.asset_disposals`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**52. Table: `fam.asset_disposals`**

- **Issue**: Column 'accumulated_depreciation' exists in SQL but not in model
- **SQL**: `accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 감가상각누계액 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column accumulated_depreciation from SQL or add to model

---

**53. Table: `fam.asset_disposals`**

- **Issue**: Column 'asset_name' exists in SQL but not in model
- **SQL**: `asset_name              VARCHAR(200),                                                    -- 자산명 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column asset_name from SQL or add to model

---

**54. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_gain_loss' exists in SQL but not in model
- **SQL**: `disposal_gain_loss      NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 처분손익`
- **Model**: `N/A`
- **Fix**: Remove column disposal_gain_loss from SQL or add to model

---

**55. Table: `fam.asset_disposals`**

- **Issue**: Column 'acquisition_cost' exists in SQL but not in model
- **SQL**: `acquisition_cost        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 취득가액 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column acquisition_cost from SQL or add to model

---

**56. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_reason' exists in SQL but not in model
- **SQL**: `disposal_reason         TEXT,                                                            -- 처분 사유`
- **Model**: `N/A`
- **Fix**: Remove column disposal_reason from SQL or add to model

---

**57. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_date' exists in SQL but not in model
- **SQL**: `disposal_date           DATE                     NOT NULL,                               -- 처분일`
- **Model**: `N/A`
- **Fix**: Remove column disposal_date from SQL or add to model

---

**58. Table: `fam.asset_disposals`**

- **Issue**: Column 'disposal_no' exists in SQL but not in model
- **SQL**: `disposal_no             VARCHAR(50)              NOT NULL,                               -- 처분 번호`
- **Model**: `N/A`
- **Fix**: Remove column disposal_no from SQL or add to model

---

**59. Table: `fam.asset_disposals`**

- **Issue**: Column 'journal_entry_id' exists in SQL but not in model
- **SQL**: `journal_entry_id        UUID,                                                            -- 분개 ID`
- **Model**: `N/A`
- **Fix**: Remove column journal_entry_id from SQL or add to model

---

**60. Table: `fam.asset_disposals`**

- **Issue**: Column 'book_value' exists in SQL but not in model
- **SQL**: `book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column book_value from SQL or add to model

---

**61. Table: `fam.asset_disposals`**

- **Issue**: Column 'approval_status' exists in SQL but not in model
- **SQL**: `approval_status         VARCHAR(20),                                                     -- 승인 상태`
- **Model**: `N/A`
- **Fix**: Remove column approval_status from SQL or add to model

---

**62. Table: `fam.asset_depreciation`**

- **Issue**: Column 'depreciation_month' exists in SQL but not in model
- **SQL**: `depreciation_month      INTEGER                  NOT NULL,                               -- 상각 월`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_month from SQL or add to model

---

**63. Table: `fam.asset_depreciation`**

- **Issue**: Column 'asset_id' exists in SQL but not in model
- **SQL**: `asset_id                UUID                     NOT NULL,                               -- 고정자산 ID`
- **Model**: `N/A`
- **Fix**: Remove column asset_id from SQL or add to model

---

**64. Table: `fam.asset_depreciation`**

- **Issue**: Column 'business_document_id' exists in SQL but not in model
- **SQL**: `business_document_id    UUID,                                                            -- 업무전표 ID`
- **Model**: `N/A`
- **Fix**: Remove column business_document_id from SQL or add to model

---

**65. Table: `fam.asset_depreciation`**

- **Issue**: Column 'depreciation_year' exists in SQL but not in model
- **SQL**: `depreciation_year       INTEGER                  NOT NULL,                               -- 상각 연도`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_year from SQL or add to model

---

**66. Table: `fam.asset_depreciation`**

- **Issue**: Column 'asset_code' exists in SQL but not in model
- **SQL**: `asset_code              VARCHAR(50),                                                     -- 자산 코드 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column asset_code from SQL or add to model

---

**67. Table: `fam.asset_depreciation`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**68. Table: `fam.asset_depreciation`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**69. Table: `fam.asset_depreciation`**

- **Issue**: Column 'posted_at' exists in SQL but not in model
- **SQL**: `posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시`
- **Model**: `N/A`
- **Fix**: Remove column posted_at from SQL or add to model

---

**70. Table: `fam.asset_depreciation`**

- **Issue**: Column 'accumulated_depreciation' exists in SQL but not in model
- **SQL**: `accumulated_depreciation NUMERIC(18,2)           NOT NULL DEFAULT 0,                     -- 누계액`
- **Model**: `N/A`
- **Fix**: Remove column accumulated_depreciation from SQL or add to model

---

**71. Table: `fam.asset_depreciation`**

- **Issue**: Column 'asset_name' exists in SQL but not in model
- **SQL**: `asset_name              VARCHAR(200),                                                    -- 자산명 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column asset_name from SQL or add to model

---

**72. Table: `fam.asset_depreciation`**

- **Issue**: Column 'is_posted' exists in SQL but not in model
- **SQL**: `is_posted               BOOLEAN                  NOT NULL DEFAULT false,                 -- 전기 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_posted from SQL or add to model

---

**73. Table: `fam.asset_depreciation`**

- **Issue**: Column 'depreciation_method' exists in SQL but not in model
- **SQL**: `depreciation_method     VARCHAR(20)              NOT NULL,                               -- 상각 방법`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_method from SQL or add to model

---

**74. Table: `fam.asset_depreciation`**

- **Issue**: Column 'depreciation_amount' exists in SQL but not in model
- **SQL**: `depreciation_amount     NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 당월 상각액`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_amount from SQL or add to model

---

**75. Table: `fam.asset_depreciation`**

- **Issue**: Column 'journal_entry_id' exists in SQL but not in model
- **SQL**: `journal_entry_id        UUID,                                                            -- 분개 ID`
- **Model**: `N/A`
- **Fix**: Remove column journal_entry_id from SQL or add to model

---

**76. Table: `fam.asset_depreciation`**

- **Issue**: Column 'depreciation_date' exists in SQL but not in model
- **SQL**: `depreciation_date       DATE                     NOT NULL,                               -- 상각 일자`
- **Model**: `N/A`
- **Fix**: Remove column depreciation_date from SQL or add to model

---

**77. Table: `fam.asset_depreciation`**

- **Issue**: Column 'book_value' exists in SQL but not in model
- **SQL**: `book_value              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장부가액`
- **Model**: `N/A`
- **Fix**: Remove column book_value from SQL or add to model

---


### Schema: FIM (223 issues)


#### Extra SQL Column (223)

**1. Table: `fim.journal_entries`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 적요 (전표 설명)`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**2. Table: `fim.journal_entries`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**3. Table: `fim.journal_entries`**

- **Issue**: Column 'total_debit' exists in SQL but not in model
- **SQL**: `total_debit             NUMERIC(18,4)            DEFAULT 0,                              -- 총 차변 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_debit from SQL or add to model

---

**4. Table: `fim.journal_entries`**

- **Issue**: Column 'total_credit' exists in SQL but not in model
- **SQL**: `total_credit            NUMERIC(18,4)            DEFAULT 0,                              -- 총 대변 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_credit from SQL or add to model

---

**5. Table: `fim.journal_entries`**

- **Issue**: Column 'posted_by' exists in SQL but not in model
- **SQL**: `posted_by               UUID,                                                            -- 전기자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column posted_by from SQL or add to model

---

**6. Table: `fim.journal_entries`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**7. Table: `fim.journal_entries`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**8. Table: `fim.journal_entries`**

- **Issue**: Column 'je_type' exists in SQL but not in model
- **SQL**: `je_type                 VARCHAR(20)              DEFAULT 'GENERAL',                      -- 전표 유형 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column je_type from SQL or add to model

---

**9. Table: `fim.journal_entries`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**10. Table: `fim.journal_entries`**

- **Issue**: Column 'fiscal_year' exists in SQL but not in model
- **SQL**: `fiscal_year             VARCHAR(4),                                                      -- 회계 연도 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_year from SQL or add to model

---

**11. Table: `fim.journal_entries`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**12. Table: `fim.journal_entries`**

- **Issue**: Column 'exchange_rate' exists in SQL but not in model
- **SQL**: `exchange_rate           NUMERIC(15,6)            DEFAULT 1,                              -- 환율 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column exchange_rate from SQL or add to model

---

**13. Table: `fim.journal_entries`**

- **Issue**: Column 'posted_at' exists in SQL but not in model
- **SQL**: `posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시`
- **Model**: `N/A`
- **Fix**: Remove column posted_at from SQL or add to model

---

**14. Table: `fim.journal_entries`**

- **Issue**: Column 'reference_number' exists in SQL but not in model
- **SQL**: `reference_number        VARCHAR(100),                                                    -- 참조 번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column reference_number from SQL or add to model

---

**15. Table: `fim.journal_entries`**

- **Issue**: Column 'memo' exists in SQL but not in model
- **SQL**: `memo                    TEXT,                                                            -- 메모 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column memo from SQL or add to model

---

**16. Table: `fim.journal_entries`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**17. Table: `fim.journal_entries`**

- **Issue**: Column 'reversed_je_id' exists in SQL but not in model
- **SQL**: `reversed_je_id          UUID,                                                            -- 역분개 전표 ID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column reversed_je_id from SQL or add to model

---

**18. Table: `fim.journal_entries`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID,                                                            -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**19. Table: `fim.journal_entries`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자 (문서 일자)`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**20. Table: `fim.journal_entries`**

- **Issue**: Column 'posting_date' exists in SQL but not in model
- **SQL**: `posting_date            DATE                     NOT NULL,                               -- 전기 일자`
- **Model**: `N/A`
- **Fix**: Remove column posting_date from SQL or add to model

---

**21. Table: `fim.journal_entries`**

- **Issue**: Column 'je_code' exists in SQL but not in model
- **SQL**: `je_code                 VARCHAR(50)              NOT NULL,                               -- 분개 전표 코드`
- **Model**: `N/A`
- **Fix**: Remove column je_code from SQL or add to model

---

**22. Table: `fim.journal_entries`**

- **Issue**: Column 'period' exists in SQL but not in model
- **SQL**: `period                  VARCHAR(7)               NOT NULL,                               -- 회계 기간 (YYYY-MM)`
- **Model**: `N/A`
- **Fix**: Remove column period from SQL or add to model

---

**23. Table: `fim.payment_transactions`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 거래 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**24. Table: `fim.payment_transactions`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**25. Table: `fim.payment_transactions`**

- **Issue**: Column 'transaction_date' exists in SQL but not in model
- **SQL**: `transaction_date        DATE                     NOT NULL,                               -- 거래 일자`
- **Model**: `N/A`
- **Fix**: Remove column transaction_date from SQL or add to model

---

**26. Table: `fim.payment_transactions`**

- **Issue**: Column 'transaction_type' exists in SQL but not in model
- **SQL**: `transaction_type        VARCHAR(20)              NOT NULL,                               -- 거래 유형`
- **Model**: `N/A`
- **Fix**: Remove column transaction_type from SQL or add to model

---

**27. Table: `fim.payment_transactions`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'COMPLETED',                    -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**28. Table: `fim.payment_transactions`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**29. Table: `fim.payment_transactions`**

- **Issue**: Column 'transaction_code' exists in SQL but not in model
- **SQL**: `transaction_code        VARCHAR(50)              NOT NULL,                               -- 거래 코드`
- **Model**: `N/A`
- **Fix**: Remove column transaction_code from SQL or add to model

---

**30. Table: `fim.payment_transactions`**

- **Issue**: Column 'amount' exists in SQL but not in model
- **SQL**: `amount                  NUMERIC(18,4)            NOT NULL,                               -- 거래 금액`
- **Model**: `N/A`
- **Fix**: Remove column amount from SQL or add to model

---

**31. Table: `fim.payment_transactions`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**32. Table: `fim.payment_transactions`**

- **Issue**: Column 'bank_account_holder' exists in SQL but not in model
- **SQL**: `bank_account_holder     VARCHAR(100),                                                    -- 예금주명 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column bank_account_holder from SQL or add to model

---

**33. Table: `fim.payment_transactions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**34. Table: `fim.payment_transactions`**

- **Issue**: Column 'exchange_rate' exists in SQL but not in model
- **SQL**: `exchange_rate           NUMERIC(15,6)            DEFAULT 1,                              -- 환율 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column exchange_rate from SQL or add to model

---

**35. Table: `fim.payment_transactions`**

- **Issue**: Column 'reference_number' exists in SQL but not in model
- **SQL**: `reference_number        VARCHAR(100),                                                    -- 참조 번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column reference_number from SQL or add to model

---

**36. Table: `fim.payment_transactions`**

- **Issue**: Column 'memo' exists in SQL but not in model
- **SQL**: `memo                    TEXT,                                                            -- 메모 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column memo from SQL or add to model

---

**37. Table: `fim.payment_transactions`**

- **Issue**: Column 'card_number' exists in SQL but not in model
- **SQL**: `card_number             VARCHAR(20),                                                     -- 카드 번호 (마스킹) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column card_number from SQL or add to model

---

**38. Table: `fim.payment_transactions`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID,                                                            -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**39. Table: `fim.payment_transactions`**

- **Issue**: Column 'account_id' exists in SQL but not in model
- **SQL**: `account_id              UUID                     NOT NULL,                               -- 계정과목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column account_id from SQL or add to model

---

**40. Table: `fim.payment_transactions`**

- **Issue**: Column 'approval_code' exists in SQL but not in model
- **SQL**: `approval_code           VARCHAR(50),                                                     -- 승인 코드 (카드 거래) (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approval_code from SQL or add to model

---

**41. Table: `fim.payment_transactions`**

- **Issue**: Column 'bank_name' exists in SQL but not in model
- **SQL**: `bank_name               VARCHAR(100),                                                    -- 은행명 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column bank_name from SQL or add to model

---

**42. Table: `fim.payment_transactions`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID                     NOT NULL,                               -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**43. Table: `fim.payment_transactions`**

- **Issue**: Column 'bank_account' exists in SQL but not in model
- **SQL**: `bank_account            VARCHAR(50),                                                     -- 은행 계좌 번호`
- **Model**: `N/A`
- **Fix**: Remove column bank_account from SQL or add to model

---

**44. Table: `fim.payment_transactions`**

- **Issue**: Column 'payment_status' exists in SQL but not in model
- **SQL**: `payment_status          VARCHAR(20)              DEFAULT 'COMPLETED',                    -- 결제 상태 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column payment_status from SQL or add to model

---

**45. Table: `fim.payment_transactions`**

- **Issue**: Column 'partner_type' exists in SQL but not in model
- **SQL**: `partner_type            VARCHAR(20),                                                     -- 거래처 유형 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column partner_type from SQL or add to model

---

**46. Table: `fim.payment_transactions`**

- **Issue**: Column 'fee_amount' exists in SQL but not in model
- **SQL**: `fee_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 수수료 금액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fee_amount from SQL or add to model

---

**47. Table: `fim.payment_transactions`**

- **Issue**: Column 'payment_method' exists in SQL but not in model
- **SQL**: `payment_method          VARCHAR(20)              NOT NULL,                               -- 결제 수단`
- **Model**: `N/A`
- **Fix**: Remove column payment_method from SQL or add to model

---

**48. Table: `fim.business_documents`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**49. Table: `fim.business_documents`**

- **Issue**: Column 'is_cancelled' exists in SQL but not in model
- **SQL**: `is_cancelled            BOOLEAN                  NOT NULL DEFAULT false,                 -- 취소 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_cancelled from SQL or add to model

---

**50. Table: `fim.business_documents`**

- **Issue**: Column 'cost_center_code' exists in SQL but not in model
- **SQL**: `cost_center_code        VARCHAR(20),                                                     -- 원가센터`
- **Model**: `N/A`
- **Fix**: Remove column cost_center_code from SQL or add to model

---

**51. Table: `fim.business_documents`**

- **Issue**: Column 'posted_by' exists in SQL but not in model
- **SQL**: `posted_by               UUID,                                                            -- 전기자`
- **Model**: `N/A`
- **Fix**: Remove column posted_by from SQL or add to model

---

**52. Table: `fim.business_documents`**

- **Issue**: Column 'document_no' exists in SQL but not in model
- **SQL**: `document_no             VARCHAR(50)              NOT NULL,                               -- 전표 번호`
- **Model**: `N/A`
- **Fix**: Remove column document_no from SQL or add to model

---

**53. Table: `fim.business_documents`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**54. Table: `fim.business_documents`**

- **Issue**: Column 'fiscal_year' exists in SQL but not in model
- **SQL**: `fiscal_year             INTEGER                  NOT NULL,                               -- 회계연도`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_year from SQL or add to model

---

**55. Table: `fim.business_documents`**

- **Issue**: Column 'document_type' exists in SQL but not in model
- **SQL**: `document_type           VARCHAR(30)              NOT NULL,                               -- 전표 유형`
- **Model**: `N/A`
- **Fix**: Remove column document_type from SQL or add to model

---

**56. Table: `fim.business_documents`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**57. Table: `fim.business_documents`**

- **Issue**: Column 'account_date' exists in SQL but not in model
- **SQL**: `account_date            DATE                     NOT NULL,                               -- 회계처리일`
- **Model**: `N/A`
- **Fix**: Remove column account_date from SQL or add to model

---

**58. Table: `fim.business_documents`**

- **Issue**: Column 'project_code' exists in SQL but not in model
- **SQL**: `project_code            VARCHAR(50),                                                     -- 프로젝트 코드`
- **Model**: `N/A`
- **Fix**: Remove column project_code from SQL or add to model

---

**59. Table: `fim.business_documents`**

- **Issue**: Column 'tax_invoice_date' exists in SQL but not in model
- **SQL**: `tax_invoice_date        DATE,                                                            -- 세금계산서 발행일`
- **Model**: `N/A`
- **Fix**: Remove column tax_invoice_date from SQL or add to model

---

**60. Table: `fim.business_documents`**

- **Issue**: Column 'cancelled_at' exists in SQL but not in model
- **SQL**: `cancelled_at            TIMESTAMP WITH TIME ZONE,                                        -- 취소 일시`
- **Model**: `N/A`
- **Fix**: Remove column cancelled_at from SQL or add to model

---

**61. Table: `fim.business_documents`**

- **Issue**: Column 'tax_invoice_no' exists in SQL but not in model
- **SQL**: `tax_invoice_no          VARCHAR(50),                                                     -- 세금계산서 번호`
- **Model**: `N/A`
- **Fix**: Remove column tax_invoice_no from SQL or add to model

---

**62. Table: `fim.business_documents`**

- **Issue**: Column 'source_module' exists in SQL but not in model
- **SQL**: `source_module           VARCHAR(20)              NOT NULL,                               -- 원천 모듈`
- **Model**: `N/A`
- **Fix**: Remove column source_module from SQL or add to model

---

**63. Table: `fim.business_documents`**

- **Issue**: Column 'source_no' exists in SQL but not in model
- **SQL**: `source_no               VARCHAR(50),                                                     -- 원천 문서 번호`
- **Model**: `N/A`
- **Fix**: Remove column source_no from SQL or add to model

---

**64. Table: `fim.business_documents`**

- **Issue**: Column 'journal_entry_id' exists in SQL but not in model
- **SQL**: `journal_entry_id        UUID,                                                            -- 분개 ID`
- **Model**: `N/A`
- **Fix**: Remove column journal_entry_id from SQL or add to model

---

**65. Table: `fim.business_documents`**

- **Issue**: Column 'document_date' exists in SQL but not in model
- **SQL**: `document_date           DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column document_date from SQL or add to model

---

**66. Table: `fim.business_documents`**

- **Issue**: Column 'reversed_document_id' exists in SQL but not in model
- **SQL**: `reversed_document_id    UUID,                                                            -- 역분개 전표 ID`
- **Model**: `N/A`
- **Fix**: Remove column reversed_document_id from SQL or add to model

---

**67. Table: `fim.business_documents`**

- **Issue**: Column 'currency_code' exists in SQL but not in model
- **SQL**: `currency_code           VARCHAR(3)               NOT NULL,                               -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency_code from SQL or add to model

---

**68. Table: `fim.business_documents`**

- **Issue**: Column 'source_line_id' exists in SQL but not in model
- **SQL**: `source_line_id          UUID,                                                            -- 원천 문서 라인 ID (선택)`
- **Model**: `N/A`
- **Fix**: Remove column source_line_id from SQL or add to model

---

**69. Table: `fim.business_documents`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 적요`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**70. Table: `fim.business_documents`**

- **Issue**: Column 'cancelled_by' exists in SQL but not in model
- **SQL**: `cancelled_by            UUID,                                                            -- 취소자`
- **Model**: `N/A`
- **Fix**: Remove column cancelled_by from SQL or add to model

---

**71. Table: `fim.business_documents`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 전표 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**72. Table: `fim.business_documents`**

- **Issue**: Column 'fiscal_period' exists in SQL but not in model
- **SQL**: `fiscal_period           INTEGER                  NOT NULL,                               -- 회계기간(월)`
- **Model**: `N/A`
- **Fix**: Remove column fiscal_period from SQL or add to model

---

**73. Table: `fim.business_documents`**

- **Issue**: Column 'cancelled_reason' exists in SQL but not in model
- **SQL**: `cancelled_reason        TEXT,                                                            -- 취소 사유`
- **Model**: `N/A`
- **Fix**: Remove column cancelled_reason from SQL or add to model

---

**74. Table: `fim.business_documents`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 부서`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**75. Table: `fim.business_documents`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**76. Table: `fim.business_documents`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**77. Table: `fim.business_documents`**

- **Issue**: Column 'exchange_rate' exists in SQL but not in model
- **SQL**: `exchange_rate           NUMERIC(18,6)            DEFAULT 1,                              -- 환율`
- **Model**: `N/A`
- **Fix**: Remove column exchange_rate from SQL or add to model

---

**78. Table: `fim.business_documents`**

- **Issue**: Column 'posted_at' exists in SQL but not in model
- **SQL**: `posted_at               TIMESTAMP WITH TIME ZONE,                                        -- 전기 일시`
- **Model**: `N/A`
- **Fix**: Remove column posted_at from SQL or add to model

---

**79. Table: `fim.business_documents`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**80. Table: `fim.business_documents`**

- **Issue**: Column 'source_type' exists in SQL but not in model
- **SQL**: `source_type             VARCHAR(30)              NOT NULL,                               -- 원천 유형`
- **Model**: `N/A`
- **Fix**: Remove column source_type from SQL or add to model

---

**81. Table: `fim.business_documents`**

- **Issue**: Column 'is_posted' exists in SQL but not in model
- **SQL**: `is_posted               BOOLEAN                  NOT NULL DEFAULT false,                 -- 전기 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_posted from SQL or add to model

---

**82. Table: `fim.business_documents`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**83. Table: `fim.business_documents`**

- **Issue**: Column 'partner_name' exists in SQL but not in model
- **SQL**: `partner_name            VARCHAR(200),                                                    -- 거래처명 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column partner_name from SQL or add to model

---

**84. Table: `fim.business_documents`**

- **Issue**: Column 'approval_status' exists in SQL but not in model
- **SQL**: `approval_status         VARCHAR(20),                                                     -- 승인 상태`
- **Model**: `N/A`
- **Fix**: Remove column approval_status from SQL or add to model

---

**85. Table: `fim.business_documents`**

- **Issue**: Column 'source_id' exists in SQL but not in model
- **SQL**: `source_id               UUID                     NOT NULL,                               -- 원천 문서 ID`
- **Model**: `N/A`
- **Fix**: Remove column source_id from SQL or add to model

---

**86. Table: `fim.accounts_receivable`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**87. Table: `fim.accounts_receivable`**

- **Issue**: Column 'invoice_number' exists in SQL but not in model
- **SQL**: `invoice_number          VARCHAR(100),                                                    -- 송장 번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column invoice_number from SQL or add to model

---

**88. Table: `fim.accounts_receivable`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**89. Table: `fim.accounts_receivable`**

- **Issue**: Column 'paid_amount' exists in SQL but not in model
- **SQL**: `paid_amount             NUMERIC(18,4)            DEFAULT 0,                              -- 입금된 금액`
- **Model**: `N/A`
- **Fix**: Remove column paid_amount from SQL or add to model

---

**90. Table: `fim.accounts_receivable`**

- **Issue**: Column 'overdue_days' exists in SQL but not in model
- **SQL**: `overdue_days            INTEGER                  DEFAULT 0,                              -- 연체 일수 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column overdue_days from SQL or add to model

---

**91. Table: `fim.accounts_receivable`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**92. Table: `fim.accounts_receivable`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**93. Table: `fim.accounts_receivable`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(50),                                                     -- 결제 조건 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**94. Table: `fim.accounts_receivable`**

- **Issue**: Column 'collection_status' exists in SQL but not in model
- **SQL**: `collection_status       VARCHAR(20),                                                     -- 추심 상태 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column collection_status from SQL or add to model

---

**95. Table: `fim.accounts_receivable`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**96. Table: `fim.accounts_receivable`**

- **Issue**: Column 'due_date' exists in SQL but not in model
- **SQL**: `due_date                DATE                     NOT NULL,                               -- 결제 예정일`
- **Model**: `N/A`
- **Fix**: Remove column due_date from SQL or add to model

---

**97. Table: `fim.accounts_receivable`**

- **Issue**: Column 'outstanding_amount' exists in SQL but not in model
- **SQL**: `outstanding_amount      NUMERIC(18,4)            NOT NULL,                               -- 미수금 잔액`
- **Model**: `N/A`
- **Fix**: Remove column outstanding_amount from SQL or add to model

---

**98. Table: `fim.accounts_receivable`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID,                                                            -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**99. Table: `fim.accounts_receivable`**

- **Issue**: Column 'last_payment_date' exists in SQL but not in model
- **SQL**: `last_payment_date       DATE,                                                            -- 최근 입금 일자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column last_payment_date from SQL or add to model

---

**100. Table: `fim.accounts_receivable`**

- **Issue**: Column 'ar_code' exists in SQL but not in model
- **SQL**: `ar_code                 VARCHAR(50)              NOT NULL,                               -- 매출채권 코드`
- **Model**: `N/A`
- **Fix**: Remove column ar_code from SQL or add to model

---

**101. Table: `fim.accounts_receivable`**

- **Issue**: Column 'collection_notes' exists in SQL but not in model
- **SQL**: `collection_notes        TEXT,                                                            -- 추심 메모 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column collection_notes from SQL or add to model

---

**102. Table: `fim.accounts_receivable`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 채권 발생 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**103. Table: `fim.accounts_receivable`**

- **Issue**: Column 'invoice_amount' exists in SQL but not in model
- **SQL**: `invoice_amount          NUMERIC(18,4)            NOT NULL,                               -- 채권 발생 금액 (세금 포함)`
- **Model**: `N/A`
- **Fix**: Remove column invoice_amount from SQL or add to model

---

**104. Table: `fim.accounts_receivable`**

- **Issue**: Column 'discount_amount' exists in SQL but not in model
- **SQL**: `discount_amount         NUMERIC(18,4)            DEFAULT 0,                              -- 할인 금액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column discount_amount from SQL or add to model

---

**105. Table: `fim.accounts_receivable`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**106. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**107. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 적요 (라인별 설명)`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**108. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 부서 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**109. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'cost_center_id' exists in SQL but not in model
- **SQL**: `cost_center_id          UUID,                                                            -- 원가센터 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column cost_center_id from SQL or add to model

---

**110. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4),                                                   -- 단가 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**111. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**112. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'cost_center' exists in SQL but not in model
- **SQL**: `cost_center             VARCHAR(50),                                                     -- 원가센터 코드`
- **Model**: `N/A`
- **Fix**: Remove column cost_center from SQL or add to model

---

**113. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'tax_code' exists in SQL but not in model
- **SQL**: `tax_code                VARCHAR(20),                                                     -- 세금 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_code from SQL or add to model

---

**114. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'credit_amount' exists in SQL but not in model
- **SQL**: `credit_amount           NUMERIC(18,4)            DEFAULT 0,                              -- 대변 금액`
- **Model**: `N/A`
- **Fix**: Remove column credit_amount from SQL or add to model

---

**115. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'account_id' exists in SQL but not in model
- **SQL**: `account_id              UUID                     NOT NULL,                               -- 계정과목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column account_id from SQL or add to model

---

**116. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'project_id' exists in SQL but not in model
- **SQL**: `project_id              UUID,                                                            -- 프로젝트 식별자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column project_id from SQL or add to model

---

**117. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호 (순서)`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**118. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 식별자`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**119. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'debit_amount' exists in SQL but not in model
- **SQL**: `debit_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 차변 금액`
- **Model**: `N/A`
- **Fix**: Remove column debit_amount from SQL or add to model

---

**120. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'je_id' exists in SQL but not in model
- **SQL**: `je_id                   UUID                     NOT NULL,                               -- 분개 전표 식별자`
- **Model**: `N/A`
- **Fix**: Remove column je_id from SQL or add to model

---

**121. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'quantity' exists in SQL but not in model
- **SQL**: `quantity                NUMERIC(15,3),                                                   -- 수량 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column quantity from SQL or add to model

---

**122. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'partner_type' exists in SQL but not in model
- **SQL**: `partner_type            VARCHAR(20),                                                     -- 거래처 유형 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column partner_type from SQL or add to model

---

**123. Table: `fim.journal_entry_lines`**

- **Issue**: Column 'project_code' exists in SQL but not in model
- **SQL**: `project_code            VARCHAR(50),                                                     -- 프로젝트 코드`
- **Model**: `N/A`
- **Fix**: Remove column project_code from SQL or add to model

---

**124. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**125. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 합계금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**126. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'product_name' exists in SQL but not in model
- **SQL**: `product_name            VARCHAR(200)             NOT NULL,                               -- 품목명`
- **Model**: `N/A`
- **Fix**: Remove column product_name from SQL or add to model

---

**127. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**128. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'product_code' exists in SQL but not in model
- **SQL**: `product_code            VARCHAR(50),                                                     -- 품목 코드`
- **Model**: `N/A`
- **Fix**: Remove column product_code from SQL or add to model

---

**129. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'unit' exists in SQL but not in model
- **SQL**: `unit                    VARCHAR(20),                                                     -- 단위`
- **Model**: `N/A`
- **Fix**: Remove column unit from SQL or add to model

---

**130. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**131. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'remark' exists in SQL but not in model
- **SQL**: `remark                  TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column remark from SQL or add to model

---

**132. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'quantity' exists in SQL but not in model
- **SQL**: `quantity                NUMERIC(18,4)            NOT NULL DEFAULT 0,                     -- 수량`
- **Model**: `N/A`
- **Fix**: Remove column quantity from SQL or add to model

---

**133. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**134. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'supply_amount' exists in SQL but not in model
- **SQL**: `supply_amount           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 공급가액`
- **Model**: `N/A`
- **Fix**: Remove column supply_amount from SQL or add to model

---

**135. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'tax_invoice_id' exists in SQL but not in model
- **SQL**: `tax_invoice_id          UUID                     NOT NULL,                               -- 세금계산서 ID`
- **Model**: `N/A`
- **Fix**: Remove column tax_invoice_id from SQL or add to model

---

**136. Table: `fim.tax_invoice_lines`**

- **Issue**: Column 'product_spec' exists in SQL but not in model
- **SQL**: `product_spec            VARCHAR(200),                                                    -- 규격`
- **Model**: `N/A`
- **Fix**: Remove column product_spec from SQL or add to model

---

**137. Table: `fim.accounts_payable`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**138. Table: `fim.accounts_payable`**

- **Issue**: Column 'invoice_number' exists in SQL but not in model
- **SQL**: `invoice_number          VARCHAR(100),                                                    -- 송장 번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column invoice_number from SQL or add to model

---

**139. Table: `fim.accounts_payable`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**140. Table: `fim.accounts_payable`**

- **Issue**: Column 'paid_amount' exists in SQL but not in model
- **SQL**: `paid_amount             NUMERIC(18,4)            DEFAULT 0,                              -- 지급된 금액`
- **Model**: `N/A`
- **Fix**: Remove column paid_amount from SQL or add to model

---

**141. Table: `fim.accounts_payable`**

- **Issue**: Column 'overdue_days' exists in SQL but not in model
- **SQL**: `overdue_days            INTEGER                  DEFAULT 0,                              -- 연체 일수 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column overdue_days from SQL or add to model

---

**142. Table: `fim.accounts_payable`**

- **Issue**: Column 'approval_status' exists in SQL but not in model
- **SQL**: `approval_status         VARCHAR(20)              DEFAULT 'PENDING',                      -- 승인 상태 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approval_status from SQL or add to model

---

**143. Table: `fim.accounts_payable`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'OPEN',                         -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**144. Table: `fim.accounts_payable`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**145. Table: `fim.accounts_payable`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(50),                                                     -- 지급 조건 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**146. Table: `fim.accounts_payable`**

- **Issue**: Column 'vendor_id' exists in SQL but not in model
- **SQL**: `vendor_id               UUID                     NOT NULL,                               -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column vendor_id from SQL or add to model

---

**147. Table: `fim.accounts_payable`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**148. Table: `fim.accounts_payable`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**149. Table: `fim.accounts_payable`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**150. Table: `fim.accounts_payable`**

- **Issue**: Column 'ap_code' exists in SQL but not in model
- **SQL**: `ap_code                 VARCHAR(50)              NOT NULL,                               -- 매입채무 코드`
- **Model**: `N/A`
- **Fix**: Remove column ap_code from SQL or add to model

---

**151. Table: `fim.accounts_payable`**

- **Issue**: Column 'due_date' exists in SQL but not in model
- **SQL**: `due_date                DATE                     NOT NULL,                               -- 지급 예정일`
- **Model**: `N/A`
- **Fix**: Remove column due_date from SQL or add to model

---

**152. Table: `fim.accounts_payable`**

- **Issue**: Column 'outstanding_amount' exists in SQL but not in model
- **SQL**: `outstanding_amount      NUMERIC(18,4)            NOT NULL,                               -- 미지급금 잔액`
- **Model**: `N/A`
- **Fix**: Remove column outstanding_amount from SQL or add to model

---

**153. Table: `fim.accounts_payable`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID,                                                            -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**154. Table: `fim.accounts_payable`**

- **Issue**: Column 'last_payment_date' exists in SQL but not in model
- **SQL**: `last_payment_date       DATE,                                                            -- 최근 지급 일자 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column last_payment_date from SQL or add to model

---

**155. Table: `fim.accounts_payable`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 채무 발생 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**156. Table: `fim.accounts_payable`**

- **Issue**: Column 'invoice_amount' exists in SQL but not in model
- **SQL**: `invoice_amount          NUMERIC(18,4)            NOT NULL,                               -- 채무 발생 금액 (세금 포함)`
- **Model**: `N/A`
- **Fix**: Remove column invoice_amount from SQL or add to model

---

**157. Table: `fim.accounts_payable`**

- **Issue**: Column 'discount_amount' exists in SQL but not in model
- **SQL**: `discount_amount         NUMERIC(18,4)            DEFAULT 0,                              -- 할인 금액 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column discount_amount from SQL or add to model

---

**158. Table: `fim.accounts`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 계정 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**159. Table: `fim.accounts`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 기본 통화 (ISO 4217)`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**160. Table: `fim.accounts`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 사용 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**161. Table: `fim.accounts`**

- **Issue**: Column 'full_path' exists in SQL but not in model
- **SQL**: `full_path               VARCHAR(500),                                                    -- 전체 경로 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column full_path from SQL or add to model

---

**162. Table: `fim.accounts`**

- **Issue**: Column 'tax_category' exists in SQL but not in model
- **SQL**: `tax_category            VARCHAR(20),                                                     -- 세금 분류 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_category from SQL or add to model

---

**163. Table: `fim.accounts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**164. Table: `fim.accounts`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**165. Table: `fim.accounts`**

- **Issue**: Column 'is_control_account' exists in SQL but not in model
- **SQL**: `is_control_account      BOOLEAN                  DEFAULT false,                          -- 통제계정 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_control_account from SQL or add to model

---

**166. Table: `fim.accounts`**

- **Issue**: Column 'fs_position' exists in SQL but not in model
- **SQL**: `fs_position             VARCHAR(50),                                                     -- 재무제표 표시 위치 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fs_position from SQL or add to model

---

**167. Table: `fim.accounts`**

- **Issue**: Column 'is_bank_account' exists in SQL but not in model
- **SQL**: `is_bank_account         BOOLEAN                  DEFAULT false,                          -- 은행계정 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column is_bank_account from SQL or add to model

---

**168. Table: `fim.accounts`**

- **Issue**: Column 'tax_code' exists in SQL but not in model
- **SQL**: `tax_code                VARCHAR(20),                                                     -- 세금 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column tax_code from SQL or add to model

---

**169. Table: `fim.accounts`**

- **Issue**: Column 'account_name_en' exists in SQL but not in model
- **SQL**: `account_name_en         VARCHAR(200),                                                    -- 계정과목 영문명 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column account_name_en from SQL or add to model

---

**170. Table: `fim.accounts`**

- **Issue**: Column 'is_cash_account' exists in SQL but not in model
- **SQL**: `is_cash_account         BOOLEAN                  DEFAULT false,                          -- 현금계정 여부 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column is_cash_account from SQL or add to model

---

**171. Table: `fim.accounts`**

- **Issue**: Column 'account_group' exists in SQL but not in model
- **SQL**: `account_group           VARCHAR(50),                                                     -- 계정 그룹`
- **Model**: `N/A`
- **Fix**: Remove column account_group from SQL or add to model

---

**172. Table: `fim.accounts`**

- **Issue**: Column 'account_class' exists in SQL but not in model
- **SQL**: `account_class           VARCHAR(50),                                                     -- 계정 분류 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column account_class from SQL or add to model

---

**173. Table: `fim.accounts`**

- **Issue**: Column 'level_depth' exists in SQL but not in model
- **SQL**: `level_depth             INTEGER                  DEFAULT 1,                              -- 계층 깊이 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column level_depth from SQL or add to model

---

**174. Table: `fim.accounts`**

- **Issue**: Column 'statement_order' exists in SQL but not in model
- **SQL**: `statement_order         INTEGER                  DEFAULT 0,                              -- 재무제표 표시 순서 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column statement_order from SQL or add to model

---

**175. Table: `fim.accounts`**

- **Issue**: Column 'account_type' exists in SQL but not in model
- **SQL**: `account_type            VARCHAR(20)              NOT NULL,                               -- 계정 유형`
- **Model**: `N/A`
- **Fix**: Remove column account_type from SQL or add to model

---

**176. Table: `fim.accounts`**

- **Issue**: Column 'account_name' exists in SQL but not in model
- **SQL**: `account_name            VARCHAR(200)             NOT NULL,                               -- 계정과목 명칭`
- **Model**: `N/A`
- **Fix**: Remove column account_name from SQL or add to model

---

**177. Table: `fim.accounts`**

- **Issue**: Column 'account_code' exists in SQL but not in model
- **SQL**: `account_code            VARCHAR(50)              NOT NULL,                               -- 계정과목 코드`
- **Model**: `N/A`
- **Fix**: Remove column account_code from SQL or add to model

---

**178. Table: `fim.accounts`**

- **Issue**: Column 'is_posting_allowed' exists in SQL but not in model
- **SQL**: `is_posting_allowed      BOOLEAN                  DEFAULT true,                           -- 전기 허용 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_posting_allowed from SQL or add to model

---

**179. Table: `fim.accounts`**

- **Issue**: Column 'parent_account_id' exists in SQL but not in model
- **SQL**: `parent_account_id       UUID,                                                            -- 상위 계정과목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column parent_account_id from SQL or add to model

---

**180. Table: `fim.tax_invoices`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 세액`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**181. Table: `fim.tax_invoices`**

- **Issue**: Column 'sales_delivery_id' exists in SQL but not in model
- **SQL**: `sales_delivery_id       UUID,                                                            -- 출고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_delivery_id from SQL or add to model

---

**182. Table: `fim.tax_invoices`**

- **Issue**: Column 'remark' exists in SQL but not in model
- **SQL**: `remark                  TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column remark from SQL or add to model

---

**183. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_business_type' exists in SQL but not in model
- **SQL**: `buyer_business_type     VARCHAR(100),                                                    -- 공급받는자 업태`
- **Model**: `N/A`
- **Fix**: Remove column buyer_business_type from SQL or add to model

---

**184. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_address' exists in SQL but not in model
- **SQL**: `buyer_address           VARCHAR(500),                                                    -- 공급받는자 주소`
- **Model**: `N/A`
- **Fix**: Remove column buyer_address from SQL or add to model

---

**185. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_contact' exists in SQL but not in model
- **SQL**: `buyer_contact           VARCHAR(50),                                                     -- 공급받는자 담당자`
- **Model**: `N/A`
- **Fix**: Remove column buyer_contact from SQL or add to model

---

**186. Table: `fim.tax_invoices`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**187. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_name' exists in SQL but not in model
- **SQL**: `supplier_name           VARCHAR(200)             NOT NULL,                               -- 공급자 상호`
- **Model**: `N/A`
- **Fix**: Remove column supplier_name from SQL or add to model

---

**188. Table: `fim.tax_invoices`**

- **Issue**: Column 'due_date' exists in SQL but not in model
- **SQL**: `due_date                DATE,                                                            -- 지급 기한일 (판매 시)`
- **Model**: `N/A`
- **Fix**: Remove column due_date from SQL or add to model

---

**189. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_business_type' exists in SQL but not in model
- **SQL**: `supplier_business_type  VARCHAR(100),                                                    -- 공급자 업태`
- **Model**: `N/A`
- **Fix**: Remove column supplier_business_type from SQL or add to model

---

**190. Table: `fim.tax_invoices`**

- **Issue**: Column 'nts_confirmed_at' exists in SQL but not in model
- **SQL**: `nts_confirmed_at        TIMESTAMP WITH TIME ZONE,                                        -- 국세청 확인일시`
- **Model**: `N/A`
- **Fix**: Remove column nts_confirmed_at from SQL or add to model

---

**191. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_email' exists in SQL but not in model
- **SQL**: `supplier_email          VARCHAR(255),                                                    -- 공급자 이메일`
- **Model**: `N/A`
- **Fix**: Remove column supplier_email from SQL or add to model

---

**192. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_ceo' exists in SQL but not in model
- **SQL**: `supplier_ceo            VARCHAR(50),                                                     -- 공급자 대표자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_ceo from SQL or add to model

---

**193. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_phone' exists in SQL but not in model
- **SQL**: `buyer_phone             VARCHAR(50),                                                     -- 공급받는자 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column buyer_phone from SQL or add to model

---

**194. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_business_item' exists in SQL but not in model
- **SQL**: `supplier_business_item  VARCHAR(100),                                                    -- 공급자 종목`
- **Model**: `N/A`
- **Fix**: Remove column supplier_business_item from SQL or add to model

---

**195. Table: `fim.tax_invoices`**

- **Issue**: Column 'source_no' exists in SQL but not in model
- **SQL**: `source_no               VARCHAR(50),                                                     -- 원천 문서 번호`
- **Model**: `N/A`
- **Fix**: Remove column source_no from SQL or add to model

---

**196. Table: `fim.tax_invoices`**

- **Issue**: Column 'issue_date' exists in SQL but not in model
- **SQL**: `issue_date              DATE                     NOT NULL,                               -- 발행일자`
- **Model**: `N/A`
- **Fix**: Remove column issue_date from SQL or add to model

---

**197. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_contact' exists in SQL but not in model
- **SQL**: `supplier_contact        VARCHAR(50),                                                     -- 공급자 담당자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_contact from SQL or add to model

---

**198. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_phone' exists in SQL but not in model
- **SQL**: `supplier_phone          VARCHAR(50),                                                     -- 공급자 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column supplier_phone from SQL or add to model

---

**199. Table: `fim.tax_invoices`**

- **Issue**: Column 'supply_amount' exists in SQL but not in model
- **SQL**: `supply_amount           NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 공급가액`
- **Model**: `N/A`
- **Fix**: Remove column supply_amount from SQL or add to model

---

**200. Table: `fim.tax_invoices`**

- **Issue**: Column 'currency_code' exists in SQL but not in model
- **SQL**: `currency_code           VARCHAR(3)               NOT NULL DEFAULT 'KRW',                 -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency_code from SQL or add to model

---

**201. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_address' exists in SQL but not in model
- **SQL**: `supplier_address        VARCHAR(500),                                                    -- 공급자 주소`
- **Model**: `N/A`
- **Fix**: Remove column supplier_address from SQL or add to model

---

**202. Table: `fim.tax_invoices`**

- **Issue**: Column 'issue_type' exists in SQL but not in model
- **SQL**: `issue_type              VARCHAR(20)              NOT NULL DEFAULT 'NORMAL',              -- 발행 유형`
- **Model**: `N/A`
- **Fix**: Remove column issue_type from SQL or add to model

---

**203. Table: `fim.tax_invoices`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID,                                                            -- 고객 식별자 (판매 시)`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**204. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_business_no' exists in SQL but not in model
- **SQL**: `buyer_business_no       VARCHAR(20)              NOT NULL,                               -- 공급받는자 사업자등록번호`
- **Model**: `N/A`
- **Fix**: Remove column buyer_business_no from SQL or add to model

---

**205. Table: `fim.tax_invoices`**

- **Issue**: Column 'supplier_business_no' exists in SQL but not in model
- **SQL**: `supplier_business_no    VARCHAR(20)              NOT NULL,                               -- 공급자 사업자등록번호`
- **Model**: `N/A`
- **Fix**: Remove column supplier_business_no from SQL or add to model

---

**206. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_name' exists in SQL but not in model
- **SQL**: `buyer_name              VARCHAR(200)             NOT NULL,                               -- 공급받는자 상호`
- **Model**: `N/A`
- **Fix**: Remove column buyer_name from SQL or add to model

---

**207. Table: `fim.tax_invoices`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 합계금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**208. Table: `fim.tax_invoices`**

- **Issue**: Column 'business_document_id' exists in SQL but not in model
- **SQL**: `business_document_id    UUID,                                                            -- 업무전표 ID`
- **Model**: `N/A`
- **Fix**: Remove column business_document_id from SQL or add to model

---

**209. Table: `fim.tax_invoices`**

- **Issue**: Column 'invoice_no' exists in SQL but not in model
- **SQL**: `invoice_no              VARCHAR(50)              NOT NULL,                               -- 세금계산서 번호`
- **Model**: `N/A`
- **Fix**: Remove column invoice_no from SQL or add to model

---

**210. Table: `fim.tax_invoices`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**211. Table: `fim.tax_invoices`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 메모`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**212. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_email' exists in SQL but not in model
- **SQL**: `buyer_email             VARCHAR(255),                                                    -- 공급받는자 이메일`
- **Model**: `N/A`
- **Fix**: Remove column buyer_email from SQL or add to model

---

**213. Table: `fim.tax_invoices`**

- **Issue**: Column 'approval_datetime' exists in SQL but not in model
- **SQL**: `approval_datetime       TIMESTAMP WITH TIME ZONE,                                        -- 승인일시`
- **Model**: `N/A`
- **Fix**: Remove column approval_datetime from SQL or add to model

---

**214. Table: `fim.tax_invoices`**

- **Issue**: Column 'source_type' exists in SQL but not in model
- **SQL**: `source_type             VARCHAR(30),                                                     -- 원천 유형`
- **Model**: `N/A`
- **Fix**: Remove column source_type from SQL or add to model

---

**215. Table: `fim.tax_invoices`**

- **Issue**: Column 'invoice_date' exists in SQL but not in model
- **SQL**: `invoice_date            DATE                     NOT NULL,                               -- 작성일자`
- **Model**: `N/A`
- **Fix**: Remove column invoice_date from SQL or add to model

---

**216. Table: `fim.tax_invoices`**

- **Issue**: Column 'approval_no' exists in SQL but not in model
- **SQL**: `approval_no             VARCHAR(50),                                                     -- 승인번호`
- **Model**: `N/A`
- **Fix**: Remove column approval_no from SQL or add to model

---

**217. Table: `fim.tax_invoices`**

- **Issue**: Column 'is_nts_confirmed' exists in SQL but not in model
- **SQL**: `is_nts_confirmed        BOOLEAN                  NOT NULL DEFAULT false,                 -- 국세청 전송 확인`
- **Model**: `N/A`
- **Fix**: Remove column is_nts_confirmed from SQL or add to model

---

**218. Table: `fim.tax_invoices`**

- **Issue**: Column 'partner_id' exists in SQL but not in model
- **SQL**: `partner_id              UUID,                                                            -- 거래처 ID (구매/판매 공용)`
- **Model**: `N/A`
- **Fix**: Remove column partner_id from SQL or add to model

---

**219. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_business_item' exists in SQL but not in model
- **SQL**: `buyer_business_item     VARCHAR(100),                                                    -- 공급받는자 종목`
- **Model**: `N/A`
- **Fix**: Remove column buyer_business_item from SQL or add to model

---

**220. Table: `fim.tax_invoices`**

- **Issue**: Column 'sales_order_id' exists in SQL but not in model
- **SQL**: `sales_order_id          UUID,                                                            -- 판매주문 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_order_id from SQL or add to model

---

**221. Table: `fim.tax_invoices`**

- **Issue**: Column 'invoice_type' exists in SQL but not in model
- **SQL**: `invoice_type            VARCHAR(20)              NOT NULL,                               -- 세금계산서 유형`
- **Model**: `N/A`
- **Fix**: Remove column invoice_type from SQL or add to model

---

**222. Table: `fim.tax_invoices`**

- **Issue**: Column 'source_id' exists in SQL but not in model
- **SQL**: `source_id               UUID,                                                            -- 원천 문서 ID`
- **Model**: `N/A`
- **Fix**: Remove column source_id from SQL or add to model

---

**223. Table: `fim.tax_invoices`**

- **Issue**: Column 'buyer_ceo' exists in SQL but not in model
- **SQL**: `buyer_ceo               VARCHAR(50),                                                     -- 공급받는자 대표자`
- **Model**: `N/A`
- **Fix**: Remove column buyer_ceo from SQL or add to model

---


### Schema: HRM (191 issues)


#### Extra SQL Column (191)

**1. Table: `hrm.payroll_records`**

- **Issue**: Column 'national_pension' exists in SQL but not in model
- **SQL**: `national_pension        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 국민연금`
- **Model**: `N/A`
- **Fix**: Remove column national_pension from SQL or add to model

---

**2. Table: `hrm.payroll_records`**

- **Issue**: Column 'holiday_pay' exists in SQL but not in model
- **SQL**: `holiday_pay             NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 휴일근무수당`
- **Model**: `N/A`
- **Fix**: Remove column holiday_pay from SQL or add to model

---

**3. Table: `hrm.payroll_records`**

- **Issue**: Column 'holiday_hours' exists in SQL but not in model
- **SQL**: `holiday_hours           NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 휴일 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column holiday_hours from SQL or add to model

---

**4. Table: `hrm.payroll_records`**

- **Issue**: Column 'position_allowance' exists in SQL but not in model
- **SQL**: `position_allowance      NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 직책수당`
- **Model**: `N/A`
- **Fix**: Remove column position_allowance from SQL or add to model

---

**5. Table: `hrm.payroll_records`**

- **Issue**: Column 'health_insurance' exists in SQL but not in model
- **SQL**: `health_insurance        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 건강보험`
- **Model**: `N/A`
- **Fix**: Remove column health_insurance from SQL or add to model

---

**6. Table: `hrm.payroll_records`**

- **Issue**: Column 'other_deductions' exists in SQL but not in model
- **SQL**: `other_deductions        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기타공제`
- **Model**: `N/A`
- **Fix**: Remove column other_deductions from SQL or add to model

---

**7. Table: `hrm.payroll_records`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 사원 ID`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**8. Table: `hrm.payroll_records`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**9. Table: `hrm.payroll_records`**

- **Issue**: Column 'total_allowances' exists in SQL but not in model
- **SQL**: `total_allowances        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 수당`
- **Model**: `N/A`
- **Fix**: Remove column total_allowances from SQL or add to model

---

**10. Table: `hrm.payroll_records`**

- **Issue**: Column 'account_number' exists in SQL but not in model
- **SQL**: `account_number          VARCHAR(100),                                                    -- 계좌번호`
- **Model**: `N/A`
- **Fix**: Remove column account_number from SQL or add to model

---

**11. Table: `hrm.payroll_records`**

- **Issue**: Column 'night_hours' exists in SQL but not in model
- **SQL**: `night_hours             NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 야간 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column night_hours from SQL or add to model

---

**12. Table: `hrm.payroll_records`**

- **Issue**: Column 'base_salary' exists in SQL but not in model
- **SQL**: `base_salary             NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기본급`
- **Model**: `N/A`
- **Fix**: Remove column base_salary from SQL or add to model

---

**13. Table: `hrm.payroll_records`**

- **Issue**: Column 'position_id' exists in SQL but not in model
- **SQL**: `position_id             UUID,                                                            -- 직위 ID`
- **Model**: `N/A`
- **Fix**: Remove column position_id from SQL or add to model

---

**14. Table: `hrm.payroll_records`**

- **Issue**: Column 'work_days' exists in SQL but not in model
- **SQL**: `work_days               INTEGER                  NOT NULL DEFAULT 0,                     -- 근무 일수`
- **Model**: `N/A`
- **Fix**: Remove column work_days from SQL or add to model

---

**15. Table: `hrm.payroll_records`**

- **Issue**: Column 'transport_allowance' exists in SQL but not in model
- **SQL**: `transport_allowance     NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 교통비`
- **Model**: `N/A`
- **Fix**: Remove column transport_allowance from SQL or add to model

---

**16. Table: `hrm.payroll_records`**

- **Issue**: Column 'meal_allowance' exists in SQL but not in model
- **SQL**: `meal_allowance          NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 식대`
- **Model**: `N/A`
- **Fix**: Remove column meal_allowance from SQL or add to model

---

**17. Table: `hrm.payroll_records`**

- **Issue**: Column 'journal_entry_id' exists in SQL but not in model
- **SQL**: `journal_entry_id        UUID,                                                            -- 분개 ID`
- **Model**: `N/A`
- **Fix**: Remove column journal_entry_id from SQL or add to model

---

**18. Table: `hrm.payroll_records`**

- **Issue**: Column 'payment_month' exists in SQL but not in model
- **SQL**: `payment_month           VARCHAR(7)               NOT NULL,                               -- 귀속월 (YYYY-MM)`
- **Model**: `N/A`
- **Fix**: Remove column payment_month from SQL or add to model

---

**19. Table: `hrm.payroll_records`**

- **Issue**: Column 'overtime_pay' exists in SQL but not in model
- **SQL**: `overtime_pay            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 초과근무수당`
- **Model**: `N/A`
- **Fix**: Remove column overtime_pay from SQL or add to model

---

**20. Table: `hrm.payroll_records`**

- **Issue**: Column 'night_pay' exists in SQL but not in model
- **SQL**: `night_pay               NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 야간근무수당`
- **Model**: `N/A`
- **Fix**: Remove column night_pay from SQL or add to model

---

**21. Table: `hrm.payroll_records`**

- **Issue**: Column 'employment_insurance' exists in SQL but not in model
- **SQL**: `employment_insurance    NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 고용보험`
- **Model**: `N/A`
- **Fix**: Remove column employment_insurance from SQL or add to model

---

**22. Table: `hrm.payroll_records`**

- **Issue**: Column 'paid_at' exists in SQL but not in model
- **SQL**: `paid_at                 TIMESTAMP WITH TIME ZONE,                                        -- 지급 일시`
- **Model**: `N/A`
- **Fix**: Remove column paid_at from SQL or add to model

---

**23. Table: `hrm.payroll_records`**

- **Issue**: Column 'net_salary' exists in SQL but not in model
- **SQL**: `net_salary              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 실 지급액`
- **Model**: `N/A`
- **Fix**: Remove column net_salary from SQL or add to model

---

**24. Table: `hrm.payroll_records`**

- **Issue**: Column 'overtime_hours' exists in SQL but not in model
- **SQL**: `overtime_hours          NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 초과 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column overtime_hours from SQL or add to model

---

**25. Table: `hrm.payroll_records`**

- **Issue**: Column 'work_hours' exists in SQL but not in model
- **SQL**: `work_hours              NUMERIC(10,2)            NOT NULL DEFAULT 0,                     -- 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column work_hours from SQL or add to model

---

**26. Table: `hrm.payroll_records`**

- **Issue**: Column 'other_allowances' exists in SQL but not in model
- **SQL**: `other_allowances        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기타수당`
- **Model**: `N/A`
- **Fix**: Remove column other_allowances from SQL or add to model

---

**27. Table: `hrm.payroll_records`**

- **Issue**: Column 'income_tax' exists in SQL but not in model
- **SQL**: `income_tax              NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 소득세`
- **Model**: `N/A`
- **Fix**: Remove column income_tax from SQL or add to model

---

**28. Table: `hrm.payroll_records`**

- **Issue**: Column 'employee_name' exists in SQL but not in model
- **SQL**: `employee_name           VARCHAR(100),                                                    -- 사원명 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column employee_name from SQL or add to model

---

**29. Table: `hrm.payroll_records`**

- **Issue**: Column 'employee_code' exists in SQL but not in model
- **SQL**: `employee_code           VARCHAR(50),                                                     -- 사원 코드 (스냅샷)`
- **Model**: `N/A`
- **Fix**: Remove column employee_code from SQL or add to model

---

**30. Table: `hrm.payroll_records`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 부서 ID`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**31. Table: `hrm.payroll_records`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**32. Table: `hrm.payroll_records`**

- **Issue**: Column 'gross_salary' exists in SQL but not in model
- **SQL**: `gross_salary            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 급여 (지급액)`
- **Model**: `N/A`
- **Fix**: Remove column gross_salary from SQL or add to model

---

**33. Table: `hrm.payroll_records`**

- **Issue**: Column 'total_deductions' exists in SQL but not in model
- **SQL**: `total_deductions        NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 총 공제액`
- **Model**: `N/A`
- **Fix**: Remove column total_deductions from SQL or add to model

---

**34. Table: `hrm.payroll_records`**

- **Issue**: Column 'payroll_date' exists in SQL but not in model
- **SQL**: `payroll_date            DATE                     NOT NULL,                               -- 급여 지급일`
- **Model**: `N/A`
- **Fix**: Remove column payroll_date from SQL or add to model

---

**35. Table: `hrm.payroll_records`**

- **Issue**: Column 'payroll_no' exists in SQL but not in model
- **SQL**: `payroll_no              VARCHAR(50)              NOT NULL,                               -- 급여 번호`
- **Model**: `N/A`
- **Fix**: Remove column payroll_no from SQL or add to model

---

**36. Table: `hrm.payroll_records`**

- **Issue**: Column 'bank_name' exists in SQL but not in model
- **SQL**: `bank_name               VARCHAR(100),                                                    -- 은행명`
- **Model**: `N/A`
- **Fix**: Remove column bank_name from SQL or add to model

---

**37. Table: `hrm.payroll_records`**

- **Issue**: Column 'payment_status' exists in SQL but not in model
- **SQL**: `payment_status          VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 지급 상태`
- **Model**: `N/A`
- **Fix**: Remove column payment_status from SQL or add to model

---

**38. Table: `hrm.payroll_records`**

- **Issue**: Column 'resident_tax' exists in SQL but not in model
- **SQL**: `resident_tax            NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 주민세`
- **Model**: `N/A`
- **Fix**: Remove column resident_tax from SQL or add to model

---

**39. Table: `hrm.payroll_records`**

- **Issue**: Column 'long_term_care' exists in SQL but not in model
- **SQL**: `long_term_care          NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 장기요양보험`
- **Model**: `N/A`
- **Fix**: Remove column long_term_care from SQL or add to model

---

**40. Table: `hrm.payroll_records`**

- **Issue**: Column 'payment_method' exists in SQL but not in model
- **SQL**: `payment_method          VARCHAR(20),                                                     -- 지급 방법`
- **Model**: `N/A`
- **Fix**: Remove column payment_method from SQL or add to model

---

**41. Table: `hrm.department_histories`**

- **Issue**: Column 'new_name' exists in SQL but not in model
- **SQL**: `new_name                VARCHAR(100),                                                    -- 변경 후 부서명`
- **Model**: `N/A`
- **Fix**: Remove column new_name from SQL or add to model

---

**42. Table: `hrm.department_histories`**

- **Issue**: Column 'new_manager_id' exists in SQL but not in model
- **SQL**: `new_manager_id          UUID,                                                            -- 변경 후 부서장`
- **Model**: `N/A`
- **Fix**: Remove column new_manager_id from SQL or add to model

---

**43. Table: `hrm.department_histories`**

- **Issue**: Column 'change_date' exists in SQL but not in model
- **SQL**: `change_date             DATE                     NOT NULL,                               -- 변경 발령일`
- **Model**: `N/A`
- **Fix**: Remove column change_date from SQL or add to model

---

**44. Table: `hrm.department_histories`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID                     NOT NULL,                               -- 부서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**45. Table: `hrm.department_histories`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 상태 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**46. Table: `hrm.department_histories`**

- **Issue**: Column 'new_code' exists in SQL but not in model
- **SQL**: `new_code                VARCHAR(50),                                                     -- 변경 후 부서 코드`
- **Model**: `N/A`
- **Fix**: Remove column new_code from SQL or add to model

---

**47. Table: `hrm.department_histories`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**48. Table: `hrm.department_histories`**

- **Issue**: Column 'effective_date' exists in SQL but not in model
- **SQL**: `effective_date          DATE                     NOT NULL,                               -- 변경 시행일`
- **Model**: `N/A`
- **Fix**: Remove column effective_date from SQL or add to model

---

**49. Table: `hrm.department_histories`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**50. Table: `hrm.department_histories`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**51. Table: `hrm.department_histories`**

- **Issue**: Column 'old_manager_id' exists in SQL but not in model
- **SQL**: `old_manager_id          UUID,                                                            -- 변경 전 부서장`
- **Model**: `N/A`
- **Fix**: Remove column old_manager_id from SQL or add to model

---

**52. Table: `hrm.department_histories`**

- **Issue**: Column 'new_parent_id' exists in SQL but not in model
- **SQL**: `new_parent_id           UUID,                                                            -- 변경 후 상위 부서`
- **Model**: `N/A`
- **Fix**: Remove column new_parent_id from SQL or add to model

---

**53. Table: `hrm.department_histories`**

- **Issue**: Column 'new_dept_type' exists in SQL but not in model
- **SQL**: `new_dept_type           VARCHAR(20),                                                     -- 변경 후 부서 유형`
- **Model**: `N/A`
- **Fix**: Remove column new_dept_type from SQL or add to model

---

**54. Table: `hrm.department_histories`**

- **Issue**: Column 'order_document' exists in SQL but not in model
- **SQL**: `order_document          TEXT,                                                            -- 발령 문서 내용 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column order_document from SQL or add to model

---

**55. Table: `hrm.department_histories`**

- **Issue**: Column 'change_type' exists in SQL but not in model
- **SQL**: `change_type             VARCHAR(20)              NOT NULL,                               -- 변경 유형`
- **Model**: `N/A`
- **Fix**: Remove column change_type from SQL or add to model

---

**56. Table: `hrm.department_histories`**

- **Issue**: Column 'change_reason' exists in SQL but not in model
- **SQL**: `change_reason           TEXT,                                                            -- 변경 사유`
- **Model**: `N/A`
- **Fix**: Remove column change_reason from SQL or add to model

---

**57. Table: `hrm.department_histories`**

- **Issue**: Column 'old_parent_id' exists in SQL but not in model
- **SQL**: `old_parent_id           UUID,                                                            -- 변경 전 상위 부서`
- **Model**: `N/A`
- **Fix**: Remove column old_parent_id from SQL or add to model

---

**58. Table: `hrm.department_histories`**

- **Issue**: Column 'order_number' exists in SQL but not in model
- **SQL**: `order_number            VARCHAR(50),                                                     -- 발령 번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column order_number from SQL or add to model

---

**59. Table: `hrm.department_histories`**

- **Issue**: Column 'old_name' exists in SQL but not in model
- **SQL**: `old_name                VARCHAR(100),                                                    -- 변경 전 부서명`
- **Model**: `N/A`
- **Fix**: Remove column old_name from SQL or add to model

---

**60. Table: `hrm.department_histories`**

- **Issue**: Column 'attachment_url' exists in SQL but not in model
- **SQL**: `attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL (추가)`
- **Model**: `N/A`
- **Fix**: Remove column attachment_url from SQL or add to model

---

**61. Table: `hrm.department_histories`**

- **Issue**: Column 'old_code' exists in SQL but not in model
- **SQL**: `old_code                VARCHAR(50),                                                     -- 변경 전 부서 코드`
- **Model**: `N/A`
- **Fix**: Remove column old_code from SQL or add to model

---

**62. Table: `hrm.department_histories`**

- **Issue**: Column 'old_dept_type' exists in SQL but not in model
- **SQL**: `old_dept_type           VARCHAR(20),                                                     -- 변경 전 부서 유형`
- **Model**: `N/A`
- **Fix**: Remove column old_dept_type from SQL or add to model

---

**63. Table: `hrm.salary_structures`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**64. Table: `hrm.salary_structures`**

- **Issue**: Column 'effective_from' exists in SQL but not in model
- **SQL**: `effective_from          DATE                     NOT NULL,                               -- 시작일`
- **Model**: `N/A`
- **Fix**: Remove column effective_from from SQL or add to model

---

**65. Table: `hrm.salary_structures`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 급여 구조명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**66. Table: `hrm.salary_structures`**

- **Issue**: Column 'base_salary' exists in SQL but not in model
- **SQL**: `base_salary             NUMERIC(18,2)            NOT NULL DEFAULT 0,                     -- 기본급`
- **Model**: `N/A`
- **Fix**: Remove column base_salary from SQL or add to model

---

**67. Table: `hrm.salary_structures`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**68. Table: `hrm.salary_structures`**

- **Issue**: Column 'position_id' exists in SQL but not in model
- **SQL**: `position_id             UUID,                                                            -- 직위 (선택)`
- **Model**: `N/A`
- **Fix**: Remove column position_id from SQL or add to model

---

**69. Table: `hrm.salary_structures`**

- **Issue**: Column 'payment_cycle' exists in SQL but not in model
- **SQL**: `payment_cycle           VARCHAR(20)              NOT NULL DEFAULT 'MONTHLY',             -- 지급 주기`
- **Model**: `N/A`
- **Fix**: Remove column payment_cycle from SQL or add to model

---

**70. Table: `hrm.salary_structures`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 부서 (선택)`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**71. Table: `hrm.salary_structures`**

- **Issue**: Column 'employment_type' exists in SQL but not in model
- **SQL**: `employment_type         VARCHAR(20),                                                     -- 고용 형태`
- **Model**: `N/A`
- **Fix**: Remove column employment_type from SQL or add to model

---

**72. Table: `hrm.salary_structures`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**73. Table: `hrm.salary_structures`**

- **Issue**: Column 'effective_to' exists in SQL but not in model
- **SQL**: `effective_to            DATE,                                                            -- 종료일`
- **Model**: `N/A`
- **Fix**: Remove column effective_to from SQL or add to model

---

**74. Table: `hrm.salary_structures`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**75. Table: `hrm.salary_structures`**

- **Issue**: Column 'currency_code' exists in SQL but not in model
- **SQL**: `currency_code           VARCHAR(3)               NOT NULL DEFAULT 'KRW',                 -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency_code from SQL or add to model

---

**76. Table: `hrm.salary_structures`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 급여 구조 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**77. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_work_location' exists in SQL but not in model
- **SQL**: `old_work_location       VARCHAR(100),                                                    -- 변경 전 근무지`
- **Model**: `N/A`
- **Fix**: Remove column old_work_location from SQL or add to model

---

**78. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_status' exists in SQL but not in model
- **SQL**: `new_status              VARCHAR(20),                                                     -- 변경 후 재직 상태`
- **Model**: `N/A`
- **Fix**: Remove column new_status from SQL or add to model

---

**79. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_base_salary' exists in SQL but not in model
- **SQL**: `new_base_salary         NUMERIC(18,2),                                                   -- 변경 후 기본급`
- **Model**: `N/A`
- **Fix**: Remove column new_base_salary from SQL or add to model

---

**80. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_status' exists in SQL but not in model
- **SQL**: `old_status              VARCHAR(20),                                                     -- 변경 전 재직 상태`
- **Model**: `N/A`
- **Fix**: Remove column old_status from SQL or add to model

---

**81. Table: `hrm.employee_histories`**

- **Issue**: Column 'order_type' exists in SQL but not in model
- **SQL**: `order_type              VARCHAR(20)              NOT NULL,                               -- 발령 유형`
- **Model**: `N/A`
- **Fix**: Remove column order_type from SQL or add to model

---

**82. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_job_level' exists in SQL but not in model
- **SQL**: `old_job_level           VARCHAR(20),                                                     -- 변경 전 직급`
- **Model**: `N/A`
- **Fix**: Remove column old_job_level from SQL or add to model

---

**83. Table: `hrm.employee_histories`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 사원 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**84. Table: `hrm.employee_histories`**

- **Issue**: Column 'effective_date' exists in SQL but not in model
- **SQL**: `effective_date          DATE                     NOT NULL,                               -- 시행일`
- **Model**: `N/A`
- **Fix**: Remove column effective_date from SQL or add to model

---

**85. Table: `hrm.employee_histories`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**86. Table: `hrm.employee_histories`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**87. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_job_level' exists in SQL but not in model
- **SQL**: `new_job_level           VARCHAR(20),                                                     -- 변경 후 직급`
- **Model**: `N/A`
- **Fix**: Remove column new_job_level from SQL or add to model

---

**88. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_salary_type' exists in SQL but not in model
- **SQL**: `old_salary_type         VARCHAR(20),                                                     -- 변경 전 급여 유형`
- **Model**: `N/A`
- **Fix**: Remove column old_salary_type from SQL or add to model

---

**89. Table: `hrm.employee_histories`**

- **Issue**: Column 'order_document' exists in SQL but not in model
- **SQL**: `order_document          TEXT,                                                            -- 발령 문서 내용`
- **Model**: `N/A`
- **Fix**: Remove column order_document from SQL or add to model

---

**90. Table: `hrm.employee_histories`**

- **Issue**: Column 'order_number' exists in SQL but not in model
- **SQL**: `order_number            VARCHAR(50),                                                     -- 발령 번호`
- **Model**: `N/A`
- **Fix**: Remove column order_number from SQL or add to model

---

**91. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_work_location' exists in SQL but not in model
- **SQL**: `new_work_location       VARCHAR(100),                                                    -- 변경 후 근무지`
- **Model**: `N/A`
- **Fix**: Remove column new_work_location from SQL or add to model

---

**92. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_employment_type' exists in SQL but not in model
- **SQL**: `new_employment_type     VARCHAR(20),                                                     -- 변경 후 고용 형태`
- **Model**: `N/A`
- **Fix**: Remove column new_employment_type from SQL or add to model

---

**93. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_employment_type' exists in SQL but not in model
- **SQL**: `old_employment_type     VARCHAR(20),                                                     -- 변경 전 고용 형태`
- **Model**: `N/A`
- **Fix**: Remove column old_employment_type from SQL or add to model

---

**94. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_department_id' exists in SQL but not in model
- **SQL**: `new_department_id       UUID,                                                            -- 변경 후 부서`
- **Model**: `N/A`
- **Fix**: Remove column new_department_id from SQL or add to model

---

**95. Table: `hrm.employee_histories`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'PENDING',             -- 발령 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**96. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_department_id' exists in SQL but not in model
- **SQL**: `old_department_id       UUID,                                                            -- 변경 전 부서`
- **Model**: `N/A`
- **Fix**: Remove column old_department_id from SQL or add to model

---

**97. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_work_type' exists in SQL but not in model
- **SQL**: `old_work_type           VARCHAR(20),                                                     -- 변경 전 근무 형태`
- **Model**: `N/A`
- **Fix**: Remove column old_work_type from SQL or add to model

---

**98. Table: `hrm.employee_histories`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**99. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_salary_type' exists in SQL but not in model
- **SQL**: `new_salary_type         VARCHAR(20),                                                     -- 변경 후 급여 유형`
- **Model**: `N/A`
- **Fix**: Remove column new_salary_type from SQL or add to model

---

**100. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_job_title' exists in SQL but not in model
- **SQL**: `old_job_title           VARCHAR(100),                                                    -- 변경 전 직책`
- **Model**: `N/A`
- **Fix**: Remove column old_job_title from SQL or add to model

---

**101. Table: `hrm.employee_histories`**

- **Issue**: Column 'attachment_url' exists in SQL but not in model
- **SQL**: `attachment_url          VARCHAR(500),                                                    -- 첨부 문서 URL`
- **Model**: `N/A`
- **Fix**: Remove column attachment_url from SQL or add to model

---

**102. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_work_type' exists in SQL but not in model
- **SQL**: `new_work_type           VARCHAR(20),                                                     -- 변경 후 근무 형태`
- **Model**: `N/A`
- **Fix**: Remove column new_work_type from SQL or add to model

---

**103. Table: `hrm.employee_histories`**

- **Issue**: Column 'new_job_title' exists in SQL but not in model
- **SQL**: `new_job_title           VARCHAR(100),                                                    -- 변경 후 직책`
- **Model**: `N/A`
- **Fix**: Remove column new_job_title from SQL or add to model

---

**104. Table: `hrm.employee_histories`**

- **Issue**: Column 'order_date' exists in SQL but not in model
- **SQL**: `order_date              DATE                     NOT NULL,                               -- 발령일`
- **Model**: `N/A`
- **Fix**: Remove column order_date from SQL or add to model

---

**105. Table: `hrm.employee_histories`**

- **Issue**: Column 'order_reason' exists in SQL but not in model
- **SQL**: `order_reason            TEXT,                                                            -- 발령 사유`
- **Model**: `N/A`
- **Fix**: Remove column order_reason from SQL or add to model

---

**106. Table: `hrm.employee_histories`**

- **Issue**: Column 'old_base_salary' exists in SQL but not in model
- **SQL**: `old_base_salary         NUMERIC(18,2),                                                   -- 변경 전 기본급`
- **Model**: `N/A`
- **Fix**: Remove column old_base_salary from SQL or add to model

---

**107. Table: `hrm.employees`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 사원명 (한글명)`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**108. Table: `hrm.employees`**

- **Issue**: Column 'salary_type' exists in SQL but not in model
- **SQL**: `salary_type             VARCHAR(20),                                                     -- 급여 유형 (추가 - MONTHLY/HOURLY/ANNUAL)`
- **Model**: `N/A`
- **Fix**: Remove column salary_type from SQL or add to model

---

**109. Table: `hrm.employees`**

- **Issue**: Column 'job_title' exists in SQL but not in model
- **SQL**: `job_title               VARCHAR(100),                                                    -- 직책/직위`
- **Model**: `N/A`
- **Fix**: Remove column job_title from SQL or add to model

---

**110. Table: `hrm.employees`**

- **Issue**: Column 'leave_date' exists in SQL but not in model
- **SQL**: `leave_date              DATE,                                                            -- 퇴사일`
- **Model**: `N/A`
- **Fix**: Remove column leave_date from SQL or add to model

---

**111. Table: `hrm.employees`**

- **Issue**: Column 'hire_date' exists in SQL but not in model
- **SQL**: `hire_date               DATE,                                                            -- 입사일`
- **Model**: `N/A`
- **Fix**: Remove column hire_date from SQL or add to model

---

**112. Table: `hrm.employees`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**113. Table: `hrm.employees`**

- **Issue**: Column 'leave_reason' exists in SQL but not in model
- **SQL**: `leave_reason            TEXT,                                                            -- 퇴사 사유 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column leave_reason from SQL or add to model

---

**114. Table: `hrm.employees`**

- **Issue**: Column 'id_number' exists in SQL but not in model
- **SQL**: `id_number               VARCHAR(50),                                                     -- 주민등록번호/여권번호 (추가 - 암호화 필요)`
- **Model**: `N/A`
- **Fix**: Remove column id_number from SQL or add to model

---

**115. Table: `hrm.employees`**

- **Issue**: Column 'birth_date' exists in SQL but not in model
- **SQL**: `birth_date              DATE,                                                            -- 생년월일 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column birth_date from SQL or add to model

---

**116. Table: `hrm.employees`**

- **Issue**: Column 'job_level' exists in SQL but not in model
- **SQL**: `job_level               VARCHAR(20),                                                     -- 직급`
- **Model**: `N/A`
- **Fix**: Remove column job_level from SQL or add to model

---

**117. Table: `hrm.employees`**

- **Issue**: Column 'base_salary' exists in SQL but not in model
- **SQL**: `base_salary             NUMERIC(18,2),                                                   -- 기본급 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column base_salary from SQL or add to model

---

**118. Table: `hrm.employees`**

- **Issue**: Column 'currency_code' exists in SQL but not in model
- **SQL**: `currency_code           VARCHAR(3)               DEFAULT 'KRW',                          -- 통화 코드 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column currency_code from SQL or add to model

---

**119. Table: `hrm.employees`**

- **Issue**: Column 'work_type' exists in SQL but not in model
- **SQL**: `work_type               VARCHAR(20)              NOT NULL DEFAULT 'OFFICE',              -- 근무 형태`
- **Model**: `N/A`
- **Fix**: Remove column work_type from SQL or add to model

---

**120. Table: `hrm.employees`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode                VARCHAR(10),                                                     -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---

**121. Table: `hrm.employees`**

- **Issue**: Column 'emergency_contact' exists in SQL but not in model
- **SQL**: `emergency_contact       VARCHAR(50),                                                     -- 비상연락처 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column emergency_contact from SQL or add to model

---

**122. Table: `hrm.employees`**

- **Issue**: Column 'name_cn' exists in SQL but not in model
- **SQL**: `name_cn                 VARCHAR(100),                                                    -- 사원명 (한자명) (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_cn from SQL or add to model

---

**123. Table: `hrm.employees`**

- **Issue**: Column 'work_location' exists in SQL but not in model
- **SQL**: `work_location           VARCHAR(100),                                                    -- 근무지`
- **Model**: `N/A`
- **Fix**: Remove column work_location from SQL or add to model

---

**124. Table: `hrm.employees`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255),                                                    -- 이메일 주소`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**125. Table: `hrm.employees`**

- **Issue**: Column 'emergency_contact_name' exists in SQL but not in model
- **SQL**: `emergency_contact_name  VARCHAR(100),                                                    -- 비상연락처 이름 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column emergency_contact_name from SQL or add to model

---

**126. Table: `hrm.employees`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1                VARCHAR(200),                                                    -- 기본 주소`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**127. Table: `hrm.employees`**

- **Issue**: Column 'mobile' exists in SQL but not in model
- **SQL**: `mobile                  VARCHAR(50),                                                     -- 휴대폰 번호`
- **Model**: `N/A`
- **Fix**: Remove column mobile from SQL or add to model

---

**128. Table: `hrm.employees`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 소속 부서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**129. Table: `hrm.employees`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 재직 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**130. Table: `hrm.employees`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 사원명 (영문명) (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**131. Table: `hrm.employees`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2                VARCHAR(200),                                                    -- 상세 주소`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**132. Table: `hrm.employees`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                     -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**133. Table: `hrm.employees`**

- **Issue**: Column 'probation_end_date' exists in SQL but not in model
- **SQL**: `probation_end_date      DATE,                                                            -- 수습 종료일 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column probation_end_date from SQL or add to model

---

**134. Table: `hrm.employees`**

- **Issue**: Column 'gender' exists in SQL but not in model
- **SQL**: `gender                  VARCHAR(10),                                                     -- 성별 (추가 - MALE/FEMALE/OTHER)`
- **Model**: `N/A`
- **Fix**: Remove column gender from SQL or add to model

---

**135. Table: `hrm.employees`**

- **Issue**: Column 'employment_type' exists in SQL but not in model
- **SQL**: `employment_type         VARCHAR(20)              DEFAULT 'REGULAR',                      -- 고용 형태 (추가 - REGULAR/CONTRACT/PART_TIME)`
- **Model**: `N/A`
- **Fix**: Remove column employment_type from SQL or add to model

---

**136. Table: `hrm.employees`**

- **Issue**: Column 'job_description' exists in SQL but not in model
- **SQL**: `job_description         TEXT,                                                            -- 직무내용`
- **Model**: `N/A`
- **Fix**: Remove column job_description from SQL or add to model

---

**137. Table: `hrm.employees`**

- **Issue**: Column 'nationality' exists in SQL but not in model
- **SQL**: `nationality             VARCHAR(3),                                                      -- 국적 (추가 - ISO 3166-1 alpha-3)`
- **Model**: `N/A`
- **Fix**: Remove column nationality from SQL or add to model

---

**138. Table: `hrm.employees`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 사원번호 (영대문자, 숫자, 언더스코어)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**139. Table: `hrm.absences`**

- **Issue**: Column 'reason' exists in SQL but not in model
- **SQL**: `reason                  TEXT,                                                            -- 사유`
- **Model**: `N/A`
- **Fix**: Remove column reason from SQL or add to model

---

**140. Table: `hrm.absences`**

- **Issue**: Column 'attached_document_path' exists in SQL but not in model
- **SQL**: `attached_document_path  VARCHAR(500),                                                    -- 첨부 문서 경로 (진단서 등)`
- **Model**: `N/A`
- **Fix**: Remove column attached_document_path from SQL or add to model

---

**141. Table: `hrm.absences`**

- **Issue**: Column 'duration_hours' exists in SQL but not in model
- **SQL**: `duration_hours          INTEGER,                                                         -- 소요 시간 (NULL이면 전일)`
- **Model**: `N/A`
- **Fix**: Remove column duration_hours from SQL or add to model

---

**142. Table: `hrm.absences`**

- **Issue**: Column 'approval_date' exists in SQL but not in model
- **SQL**: `approval_date           TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approval_date from SQL or add to model

---

**143. Table: `hrm.absences`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**144. Table: `hrm.absences`**

- **Issue**: Column 'absence_type' exists in SQL but not in model
- **SQL**: `absence_type            VARCHAR(20)              NOT NULL,                               -- 결근 유형`
- **Model**: `N/A`
- **Fix**: Remove column absence_type from SQL or add to model

---

**145. Table: `hrm.absences`**

- **Issue**: Column 'date_from' exists in SQL but not in model
- **SQL**: `date_from               DATE                     NOT NULL,                               -- 시작일`
- **Model**: `N/A`
- **Fix**: Remove column date_from from SQL or add to model

---

**146. Table: `hrm.absences`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 직원 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**147. Table: `hrm.absences`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**148. Table: `hrm.absences`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**149. Table: `hrm.absences`**

- **Issue**: Column 'date_to' exists in SQL but not in model
- **SQL**: `date_to                 DATE                     NOT NULL,                               -- 종료일`
- **Model**: `N/A`
- **Fix**: Remove column date_to from SQL or add to model

---

**150. Table: `hrm.absences`**

- **Issue**: Column 'rejection_reason' exists in SQL but not in model
- **SQL**: `rejection_reason        TEXT,                                                            -- 거부 사유`
- **Model**: `N/A`
- **Fix**: Remove column rejection_reason from SQL or add to model

---

**151. Table: `hrm.leave_policies`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**152. Table: `hrm.leave_policies`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**153. Table: `hrm.leave_policies`**

- **Issue**: Column 'is_carryover_allowed' exists in SQL but not in model
- **SQL**: `is_carryover_allowed    BOOLEAN                  DEFAULT false,                          -- 이월 가능 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_carryover_allowed from SQL or add to model

---

**154. Table: `hrm.leave_policies`**

- **Issue**: Column 'leave_name' exists in SQL but not in model
- **SQL**: `leave_name              VARCHAR(100)             NOT NULL,                               -- 휴가명`
- **Model**: `N/A`
- **Fix**: Remove column leave_name from SQL or add to model

---

**155. Table: `hrm.leave_policies`**

- **Issue**: Column 'validity_years' exists in SQL but not in model
- **SQL**: `validity_years          INTEGER                  DEFAULT 2,                              -- 유효 기간 (연)`
- **Model**: `N/A`
- **Fix**: Remove column validity_years from SQL or add to model

---

**156. Table: `hrm.leave_policies`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**157. Table: `hrm.leave_policies`**

- **Issue**: Column 'is_compensation_required' exists in SQL but not in model
- **SQL**: `is_compensation_required BOOLEAN                 DEFAULT true,                           -- 미사용 보상금 필요 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_compensation_required from SQL or add to model

---

**158. Table: `hrm.leave_policies`**

- **Issue**: Column 'is_paid' exists in SQL but not in model
- **SQL**: `is_paid                 BOOLEAN                  NOT NULL DEFAULT true,                  -- 유급 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_paid from SQL or add to model

---

**159. Table: `hrm.leave_policies`**

- **Issue**: Column 'carryover_max_days' exists in SQL but not in model
- **SQL**: `carryover_max_days      INTEGER,                                                         -- 이월 최대 일수 (NULL이면 무제한)`
- **Model**: `N/A`
- **Fix**: Remove column carryover_max_days from SQL or add to model

---

**160. Table: `hrm.leave_policies`**

- **Issue**: Column 'compensation_rate' exists in SQL but not in model
- **SQL**: `compensation_rate       NUMERIC(5,2)             DEFAULT 100,                            -- 보상금 비율 (%)`
- **Model**: `N/A`
- **Fix**: Remove column compensation_rate from SQL or add to model

---

**161. Table: `hrm.leave_policies`**

- **Issue**: Column 'entitled_days_per_year' exists in SQL but not in model
- **SQL**: `entitled_days_per_year  INTEGER,                                                         -- 연간 부여 일수 (NULL이면 무제한)`
- **Model**: `N/A`
- **Fix**: Remove column entitled_days_per_year from SQL or add to model

---

**162. Table: `hrm.leave_policies`**

- **Issue**: Column 'leave_type' exists in SQL but not in model
- **SQL**: `leave_type              VARCHAR(20)              NOT NULL UNIQUE,                        -- 휴가 유형 (ANNUAL, SICK, MATERNITY, UNPAID)`
- **Model**: `N/A`
- **Fix**: Remove column leave_type from SQL or add to model

---

**163. Table: `hrm.departments`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 부서 설명 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**164. Table: `hrm.departments`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 부서명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**165. Table: `hrm.departments`**

- **Issue**: Column 'sort_order' exists in SQL but not in model
- **SQL**: `sort_order              INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column sort_order from SQL or add to model

---

**166. Table: `hrm.departments`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255),                                                    -- 부서 이메일`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**167. Table: `hrm.departments`**

- **Issue**: Column 'cost_center_code' exists in SQL but not in model
- **SQL**: `cost_center_code        VARCHAR(50),                                                     -- 원가센터 코드 (추가 - 회계 연계)`
- **Model**: `N/A`
- **Fix**: Remove column cost_center_code from SQL or add to model

---

**168. Table: `hrm.departments`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 부서 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**169. Table: `hrm.departments`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 부서명 (영문) (추가 - 다국어 지원)`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**170. Table: `hrm.departments`**

- **Issue**: Column 'floor' exists in SQL but not in model
- **SQL**: `floor                   VARCHAR(20),                                                     -- 층 정보 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column floor from SQL or add to model

---

**171. Table: `hrm.departments`**

- **Issue**: Column 'location' exists in SQL but not in model
- **SQL**: `location                VARCHAR(200),                                                    -- 근무지/사무실 위치 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column location from SQL or add to model

---

**172. Table: `hrm.departments`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**173. Table: `hrm.departments`**

- **Issue**: Column 'parent_id' exists in SQL but not in model
- **SQL**: `parent_id               UUID,                                                            -- 상위 부서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column parent_id from SQL or add to model

---

**174. Table: `hrm.departments`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                     -- 부서 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**175. Table: `hrm.departments`**

- **Issue**: Column 'level' exists in SQL but not in model
- **SQL**: `level                   INTEGER                  DEFAULT 1,                              -- 부서 레벨 (추가 - 1: 회사, 2: 본부, 3: 부서, 4: 팀)`
- **Model**: `N/A`
- **Fix**: Remove column level from SQL or add to model

---

**176. Table: `hrm.departments`**

- **Issue**: Column 'dept_type' exists in SQL but not in model
- **SQL**: `dept_type               VARCHAR(20)              NOT NULL DEFAULT 'DEPARTMENT',          -- 부서 유형`
- **Model**: `N/A`
- **Fix**: Remove column dept_type from SQL or add to model

---

**177. Table: `hrm.departments`**

- **Issue**: Column 'manager_id' exists in SQL but not in model
- **SQL**: `manager_id              UUID,                                                            -- 부서장 식별자`
- **Model**: `N/A`
- **Fix**: Remove column manager_id from SQL or add to model

---

**178. Table: `hrm.departments`**

- **Issue**: Column 'fax' exists in SQL but not in model
- **SQL**: `fax                     VARCHAR(50),                                                     -- 팩스번호 (추가)`
- **Model**: `N/A`
- **Fix**: Remove column fax from SQL or add to model

---

**179. Table: `hrm.departments`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 부서 코드 (영대문자, 숫자, 언더스코어)`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**180. Table: `hrm.attendances`**

- **Issue**: Column 'late_minutes' exists in SQL but not in model
- **SQL**: `late_minutes            INTEGER                  DEFAULT 0,                              -- 지각 시간 (분)`
- **Model**: `N/A`
- **Fix**: Remove column late_minutes from SQL or add to model

---

**181. Table: `hrm.attendances`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'NORMAL',              -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**182. Table: `hrm.attendances`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**183. Table: `hrm.attendances`**

- **Issue**: Column 'attendance_type' exists in SQL but not in model
- **SQL**: `attendance_type         VARCHAR(20)              NOT NULL DEFAULT 'WORK',                -- 근태 유형`
- **Model**: `N/A`
- **Fix**: Remove column attendance_type from SQL or add to model

---

**184. Table: `hrm.attendances`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 사원 ID`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**185. Table: `hrm.attendances`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 삭제 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**186. Table: `hrm.attendances`**

- **Issue**: Column 'attendance_date' exists in SQL but not in model
- **SQL**: `attendance_date         DATE                     NOT NULL,                               -- 근태 일자`
- **Model**: `N/A`
- **Fix**: Remove column attendance_date from SQL or add to model

---

**187. Table: `hrm.attendances`**

- **Issue**: Column 'overtime_hours' exists in SQL but not in model
- **SQL**: `overtime_hours          NUMERIC(10,2)            DEFAULT 0,                              -- 초과 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column overtime_hours from SQL or add to model

---

**188. Table: `hrm.attendances`**

- **Issue**: Column 'early_leave_minutes' exists in SQL but not in model
- **SQL**: `early_leave_minutes     INTEGER                  DEFAULT 0,                              -- 조퇴 시간 (분)`
- **Model**: `N/A`
- **Fix**: Remove column early_leave_minutes from SQL or add to model

---

**189. Table: `hrm.attendances`**

- **Issue**: Column 'night_hours' exists in SQL but not in model
- **SQL**: `night_hours             NUMERIC(10,2)            DEFAULT 0,                              -- 야간 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column night_hours from SQL or add to model

---

**190. Table: `hrm.attendances`**

- **Issue**: Column 'break_minutes' exists in SQL but not in model
- **SQL**: `break_minutes           INTEGER                  DEFAULT 0,                              -- 휴게 시간 (분)`
- **Model**: `N/A`
- **Fix**: Remove column break_minutes from SQL or add to model

---

**191. Table: `hrm.attendances`**

- **Issue**: Column 'work_hours' exists in SQL but not in model
- **SQL**: `work_hours              NUMERIC(10,2)            DEFAULT 0,                              -- 근무 시간`
- **Model**: `N/A`
- **Fix**: Remove column work_hours from SQL or add to model

---


### Schema: IVM (190 issues)


#### Extra SQL Column (190)

**1. Table: `ivm.inventory_movements`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**2. Table: `ivm.inventory_movements`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**3. Table: `ivm.inventory_movements`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**4. Table: `ivm.inventory_movements`**

- **Issue**: Column 'total_cost' exists in SQL but not in model
- **SQL**: `total_cost              NUMERIC(18,4)            DEFAULT 0,                              -- 총 원가`
- **Model**: `N/A`
- **Fix**: Remove column total_cost from SQL or add to model

---

**5. Table: `ivm.inventory_movements`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50),                                                     -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**6. Table: `ivm.inventory_movements`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**7. Table: `ivm.inventory_movements`**

- **Issue**: Column 'movement_type' exists in SQL but not in model
- **SQL**: `movement_type           VARCHAR(20)              NOT NULL,                               -- 이동 유형`
- **Model**: `N/A`
- **Fix**: Remove column movement_type from SQL or add to model

---

**8. Table: `ivm.inventory_movements`**

- **Issue**: Column 'reason_code' exists in SQL but not in model
- **SQL**: `reason_code             VARCHAR(50),                                                     -- 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column reason_code from SQL or add to model

---

**9. Table: `ivm.inventory_movements`**

- **Issue**: Column 'unit_cost' exists in SQL but not in model
- **SQL**: `unit_cost               NUMERIC(18,4)            DEFAULT 0,                              -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_cost from SQL or add to model

---

**10. Table: `ivm.inventory_movements`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID,                                                            -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**11. Table: `ivm.inventory_movements`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**12. Table: `ivm.inventory_movements`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**13. Table: `ivm.inventory_movements`**

- **Issue**: Column 'movement_code' exists in SQL but not in model
- **SQL**: `movement_code           VARCHAR(50)              NOT NULL,                               -- 이동 코드`
- **Model**: `N/A`
- **Fix**: Remove column movement_code from SQL or add to model

---

**14. Table: `ivm.inventory_movements`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**15. Table: `ivm.inventory_movements`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 이동 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**16. Table: `ivm.inventory_movements`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**17. Table: `ivm.inventory_movements`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**18. Table: `ivm.inventory_lots`**

- **Issue**: Column 'supplier_id' exists in SQL but not in model
- **SQL**: `supplier_id             UUID,                                                            -- 공급사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_id from SQL or add to model

---

**19. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quality_grade' exists in SQL but not in model
- **SQL**: `quality_grade           VARCHAR(20),                                                     -- 품질 등급`
- **Model**: `N/A`
- **Fix**: Remove column quality_grade from SQL or add to model

---

**20. Table: `ivm.inventory_lots`**

- **Issue**: Column 'manufactured_date' exists in SQL but not in model
- **SQL**: `manufactured_date       DATE,                                                            -- 제조 일자`
- **Model**: `N/A`
- **Fix**: Remove column manufactured_date from SQL or add to model

---

**21. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quality_test_date' exists in SQL but not in model
- **SQL**: `quality_test_date       DATE,                                                            -- 품질 검사 일자`
- **Model**: `N/A`
- **Fix**: Remove column quality_test_date from SQL or add to model

---

**22. Table: `ivm.inventory_lots`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**23. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quarantine_reason' exists in SQL but not in model
- **SQL**: `quarantine_reason       TEXT,                                                            -- 격리 사유`
- **Model**: `N/A`
- **Fix**: Remove column quarantine_reason from SQL or add to model

---

**24. Table: `ivm.inventory_lots`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**25. Table: `ivm.inventory_lots`**

- **Issue**: Column 'manufacturer_id' exists in SQL but not in model
- **SQL**: `manufacturer_id         UUID,                                                            -- 제조사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column manufacturer_id from SQL or add to model

---

**26. Table: `ivm.inventory_lots`**

- **Issue**: Column 'best_before_date' exists in SQL but not in model
- **SQL**: `best_before_date        DATE,                                                            -- 품질 보증 기한`
- **Model**: `N/A`
- **Fix**: Remove column best_before_date from SQL or add to model

---

**27. Table: `ivm.inventory_lots`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**28. Table: `ivm.inventory_lots`**

- **Issue**: Column 'origin_country' exists in SQL but not in model
- **SQL**: `origin_country          VARCHAR(3),                                                      -- 원산지 국가 코드 (ISO 3166-1)`
- **Model**: `N/A`
- **Fix**: Remove column origin_country from SQL or add to model

---

**29. Table: `ivm.inventory_lots`**

- **Issue**: Column 'origin_region' exists in SQL but not in model
- **SQL**: `origin_region           VARCHAR(100),                                                    -- 원산지 지역`
- **Model**: `N/A`
- **Fix**: Remove column origin_region from SQL or add to model

---

**30. Table: `ivm.inventory_lots`**

- **Issue**: Column 'expiry_date' exists in SQL but not in model
- **SQL**: `expiry_date IS NULL OR`
- **Model**: `N/A`
- **Fix**: Remove column expiry_date from SQL or add to model

---

**31. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quality_notes' exists in SQL but not in model
- **SQL**: `quality_notes           TEXT,                                                            -- 품질 관련 비고`
- **Model**: `N/A`
- **Fix**: Remove column quality_notes from SQL or add to model

---

**32. Table: `ivm.inventory_lots`**

- **Issue**: Column 'recall_date' exists in SQL but not in model
- **SQL**: `recall_date             DATE,                                                            -- 리콜 일자`
- **Model**: `N/A`
- **Fix**: Remove column recall_date from SQL or add to model

---

**33. Table: `ivm.inventory_lots`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100)             NOT NULL,                               -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**34. Table: `ivm.inventory_lots`**

- **Issue**: Column 'recall_reason' exists in SQL but not in model
- **SQL**: `recall_reason           TEXT,                                                            -- 리콜 사유`
- **Model**: `N/A`
- **Fix**: Remove column recall_reason from SQL or add to model

---

**35. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quality_certificate_no' exists in SQL but not in model
- **SQL**: `quality_certificate_no  VARCHAR(100),                                                    -- 품질 인증서 번호`
- **Model**: `N/A`
- **Fix**: Remove column quality_certificate_no from SQL or add to model

---

**36. Table: `ivm.inventory_lots`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**37. Table: `ivm.inventory_lots`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**38. Table: `ivm.inventory_lots`**

- **Issue**: Column 'quality_test_result' exists in SQL but not in model
- **SQL**: `quality_test_result IN ('PASS', 'FAIL', 'PENDING'))`
- **Model**: `N/A`
- **Fix**: Remove column quality_test_result from SQL or add to model

---

**39. Table: `ivm.inventory_counts`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 대상 로케이션 (NULL: 전체)`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**40. Table: `ivm.inventory_counts`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID,                                                            -- 대상 창고 (NULL: 전체)`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**41. Table: `ivm.inventory_counts`**

- **Issue**: Column 'variance_items' exists in SQL but not in model
- **SQL**: `variance_items          INTEGER                  DEFAULT 0,                              -- 차이 발생 항목 수`
- **Model**: `N/A`
- **Fix**: Remove column variance_items from SQL or add to model

---

**42. Table: `ivm.inventory_counts`**

- **Issue**: Column 'supervisor_id' exists in SQL but not in model
- **SQL**: `supervisor_id           UUID,                                                            -- 감독자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column supervisor_id from SQL or add to model

---

**43. Table: `ivm.inventory_counts`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**44. Table: `ivm.inventory_counts`**

- **Issue**: Column 'is_adjustment_approved' exists in SQL but not in model
- **SQL**: `is_adjustment_approved  BOOLEAN                  DEFAULT false,                          -- 조정 승인 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_adjustment_approved from SQL or add to model

---

**45. Table: `ivm.inventory_counts`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**46. Table: `ivm.inventory_counts`**

- **Issue**: Column 'started_at' exists in SQL but not in model
- **SQL**: `started_at              TIMESTAMP WITH TIME ZONE,                                        -- 시작 일시`
- **Model**: `N/A`
- **Fix**: Remove column started_at from SQL or add to model

---

**47. Table: `ivm.inventory_counts`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PLANNED',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**48. Table: `ivm.inventory_counts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**49. Table: `ivm.inventory_counts`**

- **Issue**: Column 'product_category_id' exists in SQL but not in model
- **SQL**: `product_category_id     UUID,                                                            -- 대상 제품 카테고리 (NULL: 전체)`
- **Model**: `N/A`
- **Fix**: Remove column product_category_id from SQL or add to model

---

**50. Table: `ivm.inventory_counts`**

- **Issue**: Column 'count_type' exists in SQL but not in model
- **SQL**: `count_type              VARCHAR(20)              NOT NULL,                               -- 실사 유형`
- **Model**: `N/A`
- **Fix**: Remove column count_type from SQL or add to model

---

**51. Table: `ivm.inventory_counts`**

- **Issue**: Column 'counted_items' exists in SQL but not in model
- **SQL**: `counted_items           INTEGER                  DEFAULT 0,                              -- 실사 완료 항목 수`
- **Model**: `N/A`
- **Fix**: Remove column counted_items from SQL or add to model

---

**52. Table: `ivm.inventory_counts`**

- **Issue**: Column 'counter_ids' exists in SQL but not in model
- **SQL**: `counter_ids             UUID[],                                                          -- 실사자 UUID 배열`
- **Model**: `N/A`
- **Fix**: Remove column counter_ids from SQL or add to model

---

**53. Table: `ivm.inventory_counts`**

- **Issue**: Column 'is_adjustment_created' exists in SQL but not in model
- **SQL**: `is_adjustment_created   BOOLEAN                  DEFAULT false,                          -- 조정 생성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_adjustment_created from SQL or add to model

---

**54. Table: `ivm.inventory_counts`**

- **Issue**: Column 'count_code' exists in SQL but not in model
- **SQL**: `count_code              VARCHAR(50)              NOT NULL,                               -- 실사 코드`
- **Model**: `N/A`
- **Fix**: Remove column count_code from SQL or add to model

---

**55. Table: `ivm.inventory_counts`**

- **Issue**: Column 'count_name' exists in SQL but not in model
- **SQL**: `count_name              VARCHAR(200)             NOT NULL,                               -- 실사명`
- **Model**: `N/A`
- **Fix**: Remove column count_name from SQL or add to model

---

**56. Table: `ivm.inventory_counts`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES wms.warehouse_locations(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**57. Table: `ivm.inventory_counts`**

- **Issue**: Column 'total_items' exists in SQL but not in model
- **SQL**: `total_items             INTEGER                  DEFAULT 0,                              -- 전체 항목 수`
- **Model**: `N/A`
- **Fix**: Remove column total_items from SQL or add to model

---

**58. Table: `ivm.inventory_counts`**

- **Issue**: Column 'scheduled_date' exists in SQL but not in model
- **SQL**: `scheduled_date          DATE                     NOT NULL,                               -- 예정 일자`
- **Model**: `N/A`
- **Fix**: Remove column scheduled_date from SQL or add to model

---

**59. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'last_count_date' exists in SQL but not in model
- **SQL**: `last_count_date         DATE,                                                            -- 마지막 조사 일자`
- **Model**: `N/A`
- **Fix**: Remove column last_count_date from SQL or add to model

---

**60. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**61. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'next_count_date' exists in SQL but not in model
- **SQL**: `next_count_date         DATE,                                                            -- 다음 조사 예정일`
- **Model**: `N/A`
- **Fix**: Remove column next_count_date from SQL or add to model

---

**62. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**63. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**64. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'frequency_value' exists in SQL but not in model
- **SQL**: `frequency_value         INTEGER                  NOT NULL,                               -- 빈도 값`
- **Model**: `N/A`
- **Fix**: Remove column frequency_value from SQL or add to model

---

**65. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'last_variance_qty' exists in SQL but not in model
- **SQL**: `last_variance_qty       INTEGER,                                                         -- 마지막 차이 수량`
- **Model**: `N/A`
- **Fix**: Remove column last_variance_qty from SQL or add to model

---

**66. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**67. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'frequency_type' exists in SQL but not in model
- **SQL**: `frequency_type          VARCHAR(20)              NOT NULL,                               -- 빈도 유형`
- **Model**: `N/A`
- **Fix**: Remove column frequency_type from SQL or add to model

---

**68. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'accuracy_rate' exists in SQL but not in model
- **SQL**: `accuracy_rate           NUMERIC(5,2),                                                    -- 정확도 (%)`
- **Model**: `N/A`
- **Fix**: Remove column accuracy_rate from SQL or add to model

---

**69. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**70. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'abc_class' exists in SQL but not in model
- **SQL**: `abc_class IN ('A', 'B', 'C'))`
- **Model**: `N/A`
- **Fix**: Remove column abc_class from SQL or add to model

---

**71. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'last_count_id' exists in SQL but not in model
- **SQL**: `last_count_id           UUID,                                                            -- 마지막 조사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column last_count_id from SQL or add to model

---

**72. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'variance_count_times' exists in SQL but not in model
- **SQL**: `variance_count_times    INTEGER                  DEFAULT 0,                              -- 차이 발생 횟수`
- **Model**: `N/A`
- **Fix**: Remove column variance_count_times from SQL or add to model

---

**73. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES ivm.inventory_counts(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**74. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Column 'total_count_times' exists in SQL but not in model
- **SQL**: `total_count_times       INTEGER                  DEFAULT 0,                              -- 총 조사 횟수`
- **Model**: `N/A`
- **Fix**: Remove column total_count_times from SQL or add to model

---

**75. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'transfer_date' exists in SQL but not in model
- **SQL**: `transfer_date           DATE                     NOT NULL,                               -- 이동 요청 일자`
- **Model**: `N/A`
- **Fix**: Remove column transfer_date from SQL or add to model

---

**76. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**77. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 이동 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**78. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'started_at' exists in SQL but not in model
- **SQL**: `started_at              TIMESTAMP WITH TIME ZONE,                                        -- 이동 시작 일시`
- **Model**: `N/A`
- **Fix**: Remove column started_at from SQL or add to model

---

**79. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**80. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**81. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'to_location_id' exists in SQL but not in model
- **SQL**: `to_location_id          UUID,                                                            -- 도착 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column to_location_id from SQL or add to model

---

**82. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'to_warehouse_id' exists in SQL but not in model
- **SQL**: `to_warehouse_id         UUID                     NOT NULL,                               -- 도착 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column to_warehouse_id from SQL or add to model

---

**83. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'from_warehouse_id' exists in SQL but not in model
- **SQL**: `from_warehouse_id       UUID                     NOT NULL,                               -- 출발 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column from_warehouse_id from SQL or add to model

---

**84. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'from_location_id' exists in SQL but not in model
- **SQL**: `from_location_id        UUID,                                                            -- 출발 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column from_location_id from SQL or add to model

---

**85. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'reason' exists in SQL but not in model
- **SQL**: `reason                  TEXT,                                                            -- 이동 사유`
- **Model**: `N/A`
- **Fix**: Remove column reason from SQL or add to model

---

**86. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**87. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**88. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'transfer_code' exists in SQL but not in model
- **SQL**: `transfer_code           VARCHAR(50)              NOT NULL,                               -- 이동 요청 코드`
- **Model**: `N/A`
- **Fix**: Remove column transfer_code from SQL or add to model

---

**89. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 이동 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**90. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**91. Table: `ivm.inventory_transfers`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**92. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**93. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**94. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**95. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**96. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'counted_at' exists in SQL but not in model
- **SQL**: `counted_at              TIMESTAMP WITH TIME ZONE,                                        -- 실사 일시`
- **Model**: `N/A`
- **Fix**: Remove column counted_at from SQL or add to model

---

**97. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'count_id' exists in SQL but not in model
- **SQL**: `count_id                UUID                     NOT NULL,                               -- 실사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column count_id from SQL or add to model

---

**98. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'variance_qty' exists in SQL but not in model
- **SQL**: `variance_qty            INTEGER,                                                         -- 차이 수량 (counted - system)`
- **Model**: `N/A`
- **Fix**: Remove column variance_qty from SQL or add to model

---

**99. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'counted_qty' exists in SQL but not in model
- **SQL**: `counted_qty             INTEGER,                                                         -- 실사 수량`
- **Model**: `N/A`
- **Fix**: Remove column counted_qty from SQL or add to model

---

**100. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'recount_count' exists in SQL but not in model
- **SQL**: `recount_count           INTEGER                  DEFAULT 0,                              -- 재실사 횟수`
- **Model**: `N/A`
- **Fix**: Remove column recount_count from SQL or add to model

---

**101. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'counted_by' exists in SQL but not in model
- **SQL**: `counted_by              UUID,                                                            -- 실사자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column counted_by from SQL or add to model

---

**102. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'variance_reason_code' exists in SQL but not in model
- **SQL**: `variance_reason_code    VARCHAR(50),                                                     -- 차이 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column variance_reason_code from SQL or add to model

---

**103. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'adjustment_id' exists in SQL but not in model
- **SQL**: `adjustment_id           UUID,                                                            -- 조정 식별자`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_id from SQL or add to model

---

**104. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**105. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**106. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'is_recount_required' exists in SQL but not in model
- **SQL**: `is_recount_required     BOOLEAN                  DEFAULT false,                          -- 재실사 필요 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_recount_required from SQL or add to model

---

**107. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'system_qty' exists in SQL but not in model
- **SQL**: `system_qty              INTEGER                  NOT NULL,                               -- 시스템 수량`
- **Model**: `N/A`
- **Fix**: Remove column system_qty from SQL or add to model

---

**108. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES ivm.inventory_adjustments(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**109. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'variance_reason' exists in SQL but not in model
- **SQL**: `variance_reason         TEXT,                                                            -- 차이 사유`
- **Model**: `N/A`
- **Fix**: Remove column variance_reason from SQL or add to model

---

**110. Table: `ivm.inventory_count_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**111. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**112. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'after_qty' exists in SQL but not in model
- **SQL**: `after_qty               INTEGER                  NOT NULL,                               -- 조정 후 수량`
- **Model**: `N/A`
- **Fix**: Remove column after_qty from SQL or add to model

---

**113. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**114. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'before_qty' exists in SQL but not in model
- **SQL**: `before_qty              INTEGER                  NOT NULL,                               -- 조정 전 수량`
- **Model**: `N/A`
- **Fix**: Remove column before_qty from SQL or add to model

---

**115. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**116. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 조정 완료 일시`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**117. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'PENDING',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**118. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'adjustment_code' exists in SQL but not in model
- **SQL**: `adjustment_code         VARCHAR(50)              NOT NULL,                               -- 조정 코드`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_code from SQL or add to model

---

**119. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'adjustment_date' exists in SQL but not in model
- **SQL**: `adjustment_date         DATE                     NOT NULL,                               -- 조정 일자`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_date from SQL or add to model

---

**120. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'adjustment_qty' exists in SQL but not in model
- **SQL**: `adjustment_qty          INTEGER                  NOT NULL,                               -- 조정 수량 (after - before)`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_qty from SQL or add to model

---

**121. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**122. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**123. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**124. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'reason_code' exists in SQL but not in model
- **SQL**: `reason_code             VARCHAR(50),                                                     -- 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column reason_code from SQL or add to model

---

**125. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**126. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'reason' exists in SQL but not in model
- **SQL**: `reason                  TEXT                     NOT NULL,                               -- 조정 사유 (필수)`
- **Model**: `N/A`
- **Fix**: Remove column reason from SQL or add to model

---

**127. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**128. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**129. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**130. Table: `ivm.inventory_adjustments`**

- **Issue**: Column 'adjustment_type' exists in SQL but not in model
- **SQL**: `adjustment_type         VARCHAR(20)              NOT NULL,                               -- 조정 유형`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_type from SQL or add to model

---

**131. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'owner_id' exists in SQL but not in model
- **SQL**: `owner_id                UUID,                                                            -- 소유자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column owner_id from SQL or add to model

---

**132. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'last_service_date' exists in SQL but not in model
- **SQL**: `last_service_date       DATE,                                                            -- 최종 A/S 일자`
- **Model**: `N/A`
- **Fix**: Remove column last_service_date from SQL or add to model

---

**133. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'shipped_date' exists in SQL but not in model
- **SQL**: `shipped_date            DATE,                                                            -- 배송 일자`
- **Model**: `N/A`
- **Fix**: Remove column shipped_date from SQL or add to model

---

**134. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**135. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'delivered_date' exists in SQL but not in model
- **SQL**: `delivered_date          DATE,                                                            -- 배송 완료 일자`
- **Model**: `N/A`
- **Fix**: Remove column delivered_date from SQL or add to model

---

**136. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'scrapped_reason' exists in SQL but not in model
- **SQL**: `scrapped_reason         TEXT,                                                            -- 폐기 사유`
- **Model**: `N/A`
- **Fix**: Remove column scrapped_reason from SQL or add to model

---

**137. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'return_reason' exists in SQL but not in model
- **SQL**: `return_reason           TEXT,                                                            -- 반품 사유`
- **Model**: `N/A`
- **Fix**: Remove column return_reason from SQL or add to model

---

**138. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'sold_date' exists in SQL but not in model
- **SQL**: `sold_date               DATE,                                                            -- 판매 일자`
- **Model**: `N/A`
- **Fix**: Remove column sold_date from SQL or add to model

---

**139. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'ownership_date' exists in SQL but not in model
- **SQL**: `ownership_date          DATE,                                                            -- 소유권 이전 일자`
- **Model**: `N/A`
- **Fix**: Remove column ownership_date from SQL or add to model

---

**140. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'service_count' exists in SQL but not in model
- **SQL**: `service_count           INTEGER                  DEFAULT 0,                              -- A/S 횟수`
- **Model**: `N/A`
- **Fix**: Remove column service_count from SQL or add to model

---

**141. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES wms.warehouse_locations(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**142. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'scrapped_date' exists in SQL but not in model
- **SQL**: `scrapped_date           DATE,                                                            -- 폐기 일자`
- **Model**: `N/A`
- **Fix**: Remove column scrapped_date from SQL or add to model

---

**143. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'warranty_end_date' exists in SQL but not in model
- **SQL**: `warranty_end_date IS NULL OR`
- **Model**: `N/A`
- **Fix**: Remove column warranty_end_date from SQL or add to model

---

**144. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'condition_grade' exists in SQL but not in model
- **SQL**: `condition_grade IN ('NEW', 'GOOD', 'FAIR', 'POOR', 'REFURBISHED'))`
- **Model**: `N/A`
- **Fix**: Remove column condition_grade from SQL or add to model

---

**145. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'manufactured_date' exists in SQL but not in model
- **SQL**: `manufactured_date       DATE,                                                            -- 제조 일자`
- **Model**: `N/A`
- **Fix**: Remove column manufactured_date from SQL or add to model

---

**146. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'warranty_start_date' exists in SQL but not in model
- **SQL**: `warranty_start_date     DATE,                                                            -- 워런티 시작일`
- **Model**: `N/A`
- **Fix**: Remove column warranty_start_date from SQL or add to model

---

**147. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'owner_type' exists in SQL but not in model
- **SQL**: `owner_type IN ('COMPANY', 'CUSTOMER', 'SUPPLIER'))`
- **Model**: `N/A`
- **Fix**: Remove column owner_type from SQL or add to model

---

**148. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'AVAILABLE',                    -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**149. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'manufacturer_id' exists in SQL but not in model
- **SQL**: `manufacturer_id         UUID,                                                            -- 제조사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column manufacturer_id from SQL or add to model

---

**150. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**151. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'current_location_id' exists in SQL but not in model
- **SQL**: `current_location_id     UUID,                                                            -- 현재 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column current_location_id from SQL or add to model

---

**152. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'current_warehouse_id' exists in SQL but not in model
- **SQL**: `current_warehouse_id    UUID,                                                            -- 현재 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column current_warehouse_id from SQL or add to model

---

**153. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'return_date' exists in SQL but not in model
- **SQL**: `return_date             DATE,                                                            -- 반품 일자`
- **Model**: `N/A`
- **Fix**: Remove column return_date from SQL or add to model

---

**154. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'warranty_months' exists in SQL but not in model
- **SQL**: `warranty_months         INTEGER,                                                         -- 워런티 기간 (개월)`
- **Model**: `N/A`
- **Fix**: Remove column warranty_months from SQL or add to model

---

**155. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**156. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100)             NOT NULL,                               -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**157. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**158. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**159. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**160. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**161. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reference_line_id' exists in SQL but not in model
- **SQL**: `reference_line_id       UUID,                                                            -- 참조 라인 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_line_id from SQL or add to model

---

**162. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**163. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reference_doc_type' exists in SQL but not in model
- **SQL**: `reference_doc_type      VARCHAR(50)              NOT NULL,                               -- 참조 문서 유형`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_type from SQL or add to model

---

**164. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**165. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reserved_qty' exists in SQL but not in model
- **SQL**: `reserved_qty            INTEGER                  NOT NULL,                               -- 예약 수량`
- **Model**: `N/A`
- **Fix**: Remove column reserved_qty from SQL or add to model

---

**166. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'release_reason' exists in SQL but not in model
- **SQL**: `release_reason          TEXT,                                                            -- 해제 사유`
- **Model**: `N/A`
- **Fix**: Remove column release_reason from SQL or add to model

---

**167. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reservation_date' exists in SQL but not in model
- **SQL**: `reservation_date        DATE                     NOT NULL,                               -- 예약 일자`
- **Model**: `N/A`
- **Fix**: Remove column reservation_date from SQL or add to model

---

**168. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'fulfilled_qty' exists in SQL but not in model
- **SQL**: `fulfilled_qty           INTEGER                  DEFAULT 0,                              -- 이행 수량`
- **Model**: `N/A`
- **Fix**: Remove column fulfilled_qty from SQL or add to model

---

**169. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'remaining_qty' exists in SQL but not in model
- **SQL**: `remaining_qty           INTEGER                  NOT NULL,                               -- 잔여 수량`
- **Model**: `N/A`
- **Fix**: Remove column remaining_qty from SQL or add to model

---

**170. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reference_doc_id' exists in SQL but not in model
- **SQL**: `reference_doc_id        UUID                     NOT NULL,                               -- 참조 문서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column reference_doc_id from SQL or add to model

---

**171. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'expires_at' exists in SQL but not in model
- **SQL**: `expires_at              TIMESTAMP WITH TIME ZONE,                                        -- 예약 만료 일시`
- **Model**: `N/A`
- **Fix**: Remove column expires_at from SQL or add to model

---

**172. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'released_by' exists in SQL but not in model
- **SQL**: `released_by             UUID,                                                            -- 해제자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column released_by from SQL or add to model

---

**173. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**174. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**175. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'reservation_code' exists in SQL but not in model
- **SQL**: `reservation_code        VARCHAR(50)              NOT NULL,                               -- 예약 코드`
- **Model**: `N/A`
- **Fix**: Remove column reservation_code from SQL or add to model

---

**176. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**177. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'released_at' exists in SQL but not in model
- **SQL**: `released_at             TIMESTAMP WITH TIME ZONE,                                        -- 해제 일시`
- **Model**: `N/A`
- **Fix**: Remove column released_at from SQL or add to model

---

**178. Table: `ivm.inventory_reservations`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**179. Table: `ivm.inventory_balances`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**180. Table: `ivm.inventory_balances`**

- **Issue**: Column 'available_qty' exists in SQL but not in model
- **SQL**: `available_qty           INTEGER                  DEFAULT 0,                              -- 가용 수량`
- **Model**: `N/A`
- **Fix**: Remove column available_qty from SQL or add to model

---

**181. Table: `ivm.inventory_balances`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**182. Table: `ivm.inventory_balances`**

- **Issue**: Column 'on_hand_qty' exists in SQL but not in model
- **SQL**: `on_hand_qty             INTEGER                  DEFAULT 0,                              -- 현재고 수량`
- **Model**: `N/A`
- **Fix**: Remove column on_hand_qty from SQL or add to model

---

**183. Table: `ivm.inventory_balances`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**184. Table: `ivm.inventory_balances`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**185. Table: `ivm.inventory_balances`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**186. Table: `ivm.inventory_balances`**

- **Issue**: Column 'reserved_qty' exists in SQL but not in model
- **SQL**: `reserved_qty            INTEGER                  DEFAULT 0,                              -- 예약 수량`
- **Model**: `N/A`
- **Fix**: Remove column reserved_qty from SQL or add to model

---

**187. Table: `ivm.inventory_balances`**

- **Issue**: Column 'last_movement_date' exists in SQL but not in model
- **SQL**: `last_movement_date      TIMESTAMP WITH TIME ZONE,                                        -- 최종 이동 일시`
- **Model**: `N/A`
- **Fix**: Remove column last_movement_date from SQL or add to model

---

**188. Table: `ivm.inventory_balances`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**189. Table: `ivm.inventory_balances`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**190. Table: `ivm.inventory_balances`**

- **Issue**: Column 'avg_cost' exists in SQL but not in model
- **SQL**: `avg_cost                NUMERIC(18,4)            DEFAULT 0,                              -- 평균 단가`
- **Model**: `N/A`
- **Fix**: Remove column avg_cost from SQL or add to model

---


### Schema: LWM (29 issues)


#### Extra SQL Column (29)

**1. Table: `lwm.steps`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**2. Table: `lwm.steps`**

- **Issue**: Column 'config' exists in SQL but not in model
- **SQL**: `config                  JSONB,                                                           -- 단계 설정 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column config from SQL or add to model

---

**3. Table: `lwm.steps`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(255)             NOT NULL,                               -- 단계명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**4. Table: `lwm.steps`**

- **Issue**: Column 'step_type' exists in SQL but not in model
- **SQL**: `step_type               VARCHAR(50)              NOT NULL,                               -- 단계 유형 (sequential, parallel, conditional)`
- **Model**: `N/A`
- **Fix**: Remove column step_type from SQL or add to model

---

**5. Table: `lwm.steps`**

- **Issue**: Column 'timeout_days' exists in SQL but not in model
- **SQL**: `timeout_days            INTEGER,                                                         -- 타임아웃 (일 수)`
- **Model**: `N/A`
- **Fix**: Remove column timeout_days from SQL or add to model

---

**6. Table: `lwm.steps`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**7. Table: `lwm.steps`**

- **Issue**: Column 'action_type' exists in SQL but not in model
- **SQL**: `action_type             VARCHAR(50)              NOT NULL,                               -- 작업 유형 (approve, reject, review, etc)`
- **Model**: `N/A`
- **Fix**: Remove column action_type from SQL or add to model

---

**8. Table: `lwm.steps`**

- **Issue**: Column 'step_number' exists in SQL but not in model
- **SQL**: `step_number             INTEGER                  NOT NULL,                               -- 단계 번호`
- **Model**: `N/A`
- **Fix**: Remove column step_number from SQL or add to model

---

**9. Table: `lwm.steps`**

- **Issue**: Column 'workflow_id' exists in SQL but not in model
- **SQL**: `workflow_id             UUID                     NOT NULL,                               -- 워크플로우 ID`
- **Model**: `N/A`
- **Fix**: Remove column workflow_id from SQL or add to model

---

**10. Table: `lwm.steps`**

- **Issue**: Column 'required_approvers' exists in SQL but not in model
- **SQL**: `required_approvers      INTEGER                  DEFAULT 1,                              -- 필요한 승인자 수`
- **Model**: `N/A`
- **Fix**: Remove column required_approvers from SQL or add to model

---

**11. Table: `lwm.tasks`**

- **Issue**: Column 'config' exists in SQL but not in model
- **SQL**: `config                  JSONB,                                                           -- 작업 설정 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column config from SQL or add to model

---

**12. Table: `lwm.tasks`**

- **Issue**: Column 'assigned_to' exists in SQL but not in model
- **SQL**: `assigned_to             UUID,                                                            -- 할당 대상 (사용자 ID)`
- **Model**: `N/A`
- **Fix**: Remove column assigned_to from SQL or add to model

---

**13. Table: `lwm.tasks`**

- **Issue**: Column 'task_status' exists in SQL but not in model
- **SQL**: `task_status             VARCHAR(50)              NOT NULL DEFAULT 'pending',              -- 작업 상태 (pending, in_progress, completed, rejected)`
- **Model**: `N/A`
- **Fix**: Remove column task_status from SQL or add to model

---

**14. Table: `lwm.tasks`**

- **Issue**: Column 'completed_by' exists in SQL but not in model
- **SQL**: `completed_by            UUID,                                                            -- 완료자`
- **Model**: `N/A`
- **Fix**: Remove column completed_by from SQL or add to model

---

**15. Table: `lwm.tasks`**

- **Issue**: Column 'completed_at' exists in SQL but not in model
- **SQL**: `completed_at            TIMESTAMP WITH TIME ZONE,                                        -- 완료일`
- **Model**: `N/A`
- **Fix**: Remove column completed_at from SQL or add to model

---

**16. Table: `lwm.tasks`**

- **Issue**: Column 'workflow_id' exists in SQL but not in model
- **SQL**: `workflow_id             UUID                     NOT NULL,                               -- 워크플로우 ID`
- **Model**: `N/A`
- **Fix**: Remove column workflow_id from SQL or add to model

---

**17. Table: `lwm.tasks`**

- **Issue**: Column 'comments' exists in SQL but not in model
- **SQL**: `comments                TEXT,                                                            -- 의견/코멘트`
- **Model**: `N/A`
- **Fix**: Remove column comments from SQL or add to model

---

**18. Table: `lwm.tasks`**

- **Issue**: Column 'request_id' exists in SQL but not in model
- **SQL**: `request_id              UUID,                                                            -- 요청 ID (승인 요청 참조)`
- **Model**: `N/A`
- **Fix**: Remove column request_id from SQL or add to model

---

**19. Table: `lwm.tasks`**

- **Issue**: Column 'step_id' exists in SQL but not in model
- **SQL**: `step_id                 UUID                     NOT NULL,                               -- 단계 ID`
- **Model**: `N/A`
- **Fix**: Remove column step_id from SQL or add to model

---

**20. Table: `lwm.tasks`**

- **Issue**: Column 'due_date' exists in SQL but not in model
- **SQL**: `due_date                TIMESTAMP WITH TIME ZONE,                                        -- 마감일`
- **Model**: `N/A`
- **Fix**: Remove column due_date from SQL or add to model

---

**21. Table: `lwm.tasks`**

- **Issue**: Column 'assigned_group' exists in SQL but not in model
- **SQL**: `assigned_group          UUID,                                                            -- 할당 그룹 (그룹 ID)`
- **Model**: `N/A`
- **Fix**: Remove column assigned_group from SQL or add to model

---

**22. Table: `lwm.tasks`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                VARCHAR(20)              NOT NULL DEFAULT 'normal',               -- 우선순위 (low, normal, high, urgent)`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**23. Table: `lwm.workflows`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**24. Table: `lwm.workflows`**

- **Issue**: Column 'config' exists in SQL but not in model
- **SQL**: `config                  JSONB,                                                           -- 워크플로우 설정 (JSON)`
- **Model**: `N/A`
- **Fix**: Remove column config from SQL or add to model

---

**25. Table: `lwm.workflows`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(255)             NOT NULL,                               -- 워크플로우명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**26. Table: `lwm.workflows`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  NOT NULL DEFAULT true,                  -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**27. Table: `lwm.workflows`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(50)              NOT NULL DEFAULT 'draft',                -- 상태 (draft, active, inactive)`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**28. Table: `lwm.workflows`**

- **Issue**: Column 'workflow_type' exists in SQL but not in model
- **SQL**: `workflow_type           VARCHAR(50)              NOT NULL,                               -- 워크플로우 유형 (approval, task, etc)`
- **Model**: `N/A`
- **Fix**: Remove column workflow_type from SQL or add to model

---

**29. Table: `lwm.workflows`**

- **Issue**: Column 'version' exists in SQL but not in model
- **SQL**: `version                 INTEGER                  NOT NULL DEFAULT 1,                     -- 버전`
- **Model**: `N/A`
- **Fix**: Remove column version from SQL or add to model

---


### Schema: PIM (234 issues)


#### Extra SQL Column (234)

**1. Table: `pim.categories`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 카테고리 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**2. Table: `pim.categories`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 카테고리명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**3. Table: `pim.categories`**

- **Issue**: Column 'external_code' exists in SQL but not in model
- **SQL**: `external_code           VARCHAR(50),                                                     -- 외부 시스템 코드`
- **Model**: `N/A`
- **Fix**: Remove column external_code from SQL or add to model

---

**4. Table: `pim.categories`**

- **Issue**: Column 'image_url' exists in SQL but not in model
- **SQL**: `image_url               VARCHAR(500),                                                    -- 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column image_url from SQL or add to model

---

**5. Table: `pim.categories`**

- **Issue**: Column 'full_path' exists in SQL but not in model
- **SQL**: `full_path               VARCHAR(500),                                                    -- 전체 경로 (대분류>중분류>소분류)`
- **Model**: `N/A`
- **Fix**: Remove column full_path from SQL or add to model

---

**6. Table: `pim.categories`**

- **Issue**: Column 'tax_category' exists in SQL but not in model
- **SQL**: `tax_category            VARCHAR(20),                                                     -- 세금 분류`
- **Model**: `N/A`
- **Fix**: Remove column tax_category from SQL or add to model

---

**7. Table: `pim.categories`**

- **Issue**: Column 'icon_url' exists in SQL but not in model
- **SQL**: `icon_url                VARCHAR(500),                                                    -- 아이콘 URL`
- **Model**: `N/A`
- **Fix**: Remove column icon_url from SQL or add to model

---

**8. Table: `pim.categories`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**9. Table: `pim.categories`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**10. Table: `pim.categories`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**11. Table: `pim.categories`**

- **Issue**: Column 'type' exists in SQL but not in model
- **SQL**: `type                    VARCHAR(20)              DEFAULT 'PRODUCT',                      -- 카테고리 유형`
- **Model**: `N/A`
- **Fix**: Remove column type from SQL or add to model

---

**12. Table: `pim.categories`**

- **Issue**: Column 'parent_id' exists in SQL but not in model
- **SQL**: `parent_id               UUID,                                                            -- 상위 카테고리 식별자`
- **Model**: `N/A`
- **Fix**: Remove column parent_id from SQL or add to model

---

**13. Table: `pim.categories`**

- **Issue**: Column 'buyer_id' exists in SQL but not in model
- **SQL**: `buyer_id                UUID,                                                            -- 구매 담당자`
- **Model**: `N/A`
- **Fix**: Remove column buyer_id from SQL or add to model

---

**14. Table: `pim.categories`**

- **Issue**: Column 'level_depth' exists in SQL but not in model
- **SQL**: `level_depth             INTEGER                  DEFAULT 1,                              -- 계층 깊이 (1=대분류, 2=중분류, 3=소분류)`
- **Model**: `N/A`
- **Fix**: Remove column level_depth from SQL or add to model

---

**15. Table: `pim.categories`**

- **Issue**: Column 'marketplace' exists in SQL but not in model
- **SQL**: `marketplace             VARCHAR(100),                                                    -- 마켓플레이스 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column marketplace from SQL or add to model

---

**16. Table: `pim.categories`**

- **Issue**: Column 'account_code' exists in SQL but not in model
- **SQL**: `account_code            VARCHAR(30),                                                     -- 회계 코드`
- **Model**: `N/A`
- **Fix**: Remove column account_code from SQL or add to model

---

**17. Table: `pim.categories`**

- **Issue**: Column 'manager_id' exists in SQL but not in model
- **SQL**: `manager_id              UUID,                                                            -- 카테고리 담당자`
- **Model**: `N/A`
- **Fix**: Remove column manager_id from SQL or add to model

---

**18. Table: `pim.categories`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**19. Table: `pim.categories`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 카테고리 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**20. Table: `pim.product_option_values`**

- **Issue**: Column 'price_adjustment' exists in SQL but not in model
- **SQL**: `price_adjustment        NUMERIC(18,4)            DEFAULT 0,                              -- 가격 조정 금액`
- **Model**: `N/A`
- **Fix**: Remove column price_adjustment from SQL or add to model

---

**21. Table: `pim.product_option_values`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**22. Table: `pim.product_option_values`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 옵션 값명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**23. Table: `pim.product_option_values`**

- **Issue**: Column 'color_code' exists in SQL but not in model
- **SQL**: `color_code              VARCHAR(20),                                                     -- 색상 코드 (hex)`
- **Model**: `N/A`
- **Fix**: Remove column color_code from SQL or add to model

---

**24. Table: `pim.product_option_values`**

- **Issue**: Column 'image_url' exists in SQL but not in model
- **SQL**: `image_url               VARCHAR(500),                                                    -- 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column image_url from SQL or add to model

---

**25. Table: `pim.product_option_values`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**26. Table: `pim.product_option_values`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**27. Table: `pim.product_option_values`**

- **Issue**: Column 'option_id' exists in SQL but not in model
- **SQL**: `option_id               UUID                     NOT NULL,                               -- 옵션 그룹 식별자`
- **Model**: `N/A`
- **Fix**: Remove column option_id from SQL or add to model

---

**28. Table: `pim.product_option_values`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 영문 옵션 값명`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**29. Table: `pim.product_option_values`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**30. Table: `pim.product_option_values`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**31. Table: `pim.product_option_values`**

- **Issue**: Column 'adjustment_type' exists in SQL but not in model
- **SQL**: `adjustment_type         VARCHAR(20)              DEFAULT 'FIXED',                        -- 조정 유형`
- **Model**: `N/A`
- **Fix**: Remove column adjustment_type from SQL or add to model

---

**32. Table: `pim.product_option_values`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 옵션 값 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**33. Table: `pim.product_units`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**34. Table: `pim.product_units`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(50)              NOT NULL,                               -- 단위명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**35. Table: `pim.product_units`**

- **Issue**: Column 'symbol' exists in SQL but not in model
- **SQL**: `symbol                  VARCHAR(10),                                                     -- 단위 기호`
- **Model**: `N/A`
- **Fix**: Remove column symbol from SQL or add to model

---

**36. Table: `pim.product_units`**

- **Issue**: Column 'unit_type' exists in SQL but not in model
- **SQL**: `unit_type               VARCHAR(20)              DEFAULT 'COUNT',                        -- 단위 유형`
- **Model**: `N/A`
- **Fix**: Remove column unit_type from SQL or add to model

---

**37. Table: `pim.product_units`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**38. Table: `pim.product_units`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**39. Table: `pim.product_units`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(50),                                                     -- 영문 단위명`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**40. Table: `pim.product_units`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**41. Table: `pim.product_units`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 단위 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**42. Table: `pim.category_managers`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 담당 업무/역할`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**43. Table: `pim.category_managers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**44. Table: `pim.category_managers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**45. Table: `pim.category_managers`**

- **Issue**: Column 'category_id' exists in SQL but not in model
- **SQL**: `category_id             UUID                     NOT NULL,                               -- 카테고리 식별자`
- **Model**: `N/A`
- **Fix**: Remove column category_id from SQL or add to model

---

**46. Table: `pim.category_managers`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 담당 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**47. Table: `pim.category_managers`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**48. Table: `pim.category_managers`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**49. Table: `pim.category_managers`**

- **Issue**: Column 'manager_type' exists in SQL but not in model
- **SQL**: `manager_type            VARCHAR(20)              DEFAULT 'PRIMARY',                      -- 담당자 유형`
- **Model**: `N/A`
- **Fix**: Remove column manager_type from SQL or add to model

---

**50. Table: `pim.category_managers`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 담당 종료일`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**51. Table: `pim.product_suppliers`**

- **Issue**: Column 'supplier_id' exists in SQL but not in model
- **SQL**: `supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_id from SQL or add to model

---

**52. Table: `pim.product_suppliers`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**53. Table: `pim.product_suppliers`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**54. Table: `pim.product_suppliers`**

- **Issue**: Column 'delivery_rating' exists in SQL but not in model
- **SQL**: `delivery_rating         INTEGER,                                                         -- 납기 평가 (1-5)`
- **Model**: `N/A`
- **Fix**: Remove column delivery_rating from SQL or add to model

---

**55. Table: `pim.product_suppliers`**

- **Issue**: Column 'contract_end_date' exists in SQL but not in model
- **SQL**: `contract_end_date       DATE,                                                            -- 계약 종료일`
- **Model**: `N/A`
- **Fix**: Remove column contract_end_date from SQL or add to model

---

**56. Table: `pim.product_suppliers`**

- **Issue**: Column 'supply_price' exists in SQL but not in model
- **SQL**: `supply_price            NUMERIC(18,4),                                                   -- 공급 가격`
- **Model**: `N/A`
- **Fix**: Remove column supply_price from SQL or add to model

---

**57. Table: `pim.product_suppliers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**58. Table: `pim.product_suppliers`**

- **Issue**: Column 'moq_unit' exists in SQL but not in model
- **SQL**: `moq_unit                VARCHAR(20),                                                     -- MOQ 단위`
- **Model**: `N/A`
- **Fix**: Remove column moq_unit from SQL or add to model

---

**59. Table: `pim.product_suppliers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**60. Table: `pim.product_suppliers`**

- **Issue**: Column 'quality_rating' exists in SQL but not in model
- **SQL**: `quality_rating          INTEGER,                                                         -- 품질 평가 (1-5)`
- **Model**: `N/A`
- **Fix**: Remove column quality_rating from SQL or add to model

---

**61. Table: `pim.product_suppliers`**

- **Issue**: Column 'is_preferred' exists in SQL but not in model
- **SQL**: `is_preferred            BOOLEAN                  DEFAULT false,                          -- 주 공급업체 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_preferred from SQL or add to model

---

**62. Table: `pim.product_suppliers`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**63. Table: `pim.product_suppliers`**

- **Issue**: Column 'lead_time_days' exists in SQL but not in model
- **SQL**: `lead_time_days          INTEGER,                                                         -- 리드타임 (일)`
- **Model**: `N/A`
- **Fix**: Remove column lead_time_days from SQL or add to model

---

**64. Table: `pim.product_suppliers`**

- **Issue**: Column 'moq' exists in SQL but not in model
- **SQL**: `moq                     NUMERIC(18,2),                                                   -- 최소 주문 수량 (MOQ)`
- **Model**: `N/A`
- **Fix**: Remove column moq from SQL or add to model

---

**65. Table: `pim.product_suppliers`**

- **Issue**: Column 'supplier_name' exists in SQL but not in model
- **SQL**: `supplier_name           VARCHAR(200),                                                    -- 공급업체의 제품명`
- **Model**: `N/A`
- **Fix**: Remove column supplier_name from SQL or add to model

---

**66. Table: `pim.product_suppliers`**

- **Issue**: Column 'contract_start_date' exists in SQL but not in model
- **SQL**: `contract_start_date     DATE,                                                            -- 계약 시작일`
- **Model**: `N/A`
- **Fix**: Remove column contract_start_date from SQL or add to model

---

**67. Table: `pim.product_suppliers`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                INTEGER                  DEFAULT 0,                              -- 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**68. Table: `pim.product_suppliers`**

- **Issue**: Column 'supplier_code' exists in SQL but not in model
- **SQL**: `supplier_code           VARCHAR(50),                                                     -- 공급업체의 제품 코드`
- **Model**: `N/A`
- **Fix**: Remove column supplier_code from SQL or add to model

---

**69. Table: `pim.product_suppliers`**

- **Issue**: Column 'contract_no' exists in SQL but not in model
- **SQL**: `contract_no             VARCHAR(50),                                                     -- 계약 번호`
- **Model**: `N/A`
- **Fix**: Remove column contract_no from SQL or add to model

---

**70. Table: `pim.product_suppliers`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**71. Table: `pim.product_relations`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**72. Table: `pim.product_relations`**

- **Issue**: Column 'related_product_id' exists in SQL but not in model
- **SQL**: `related_product_id      UUID                     NOT NULL,                               -- 연관 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column related_product_id from SQL or add to model

---

**73. Table: `pim.product_relations`**

- **Issue**: Column 'relation_type' exists in SQL but not in model
- **SQL**: `relation_type           VARCHAR(20)              NOT NULL,                               -- 관계 유형`
- **Model**: `N/A`
- **Fix**: Remove column relation_type from SQL or add to model

---

**74. Table: `pim.product_relations`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**75. Table: `pim.product_relations`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**76. Table: `pim.product_relations`**

- **Issue**: Column 'quantity' exists in SQL but not in model
- **SQL**: `quantity                NUMERIC(18,2)            DEFAULT 1,                              -- 수량`
- **Model**: `N/A`
- **Fix**: Remove column quantity from SQL or add to model

---

**77. Table: `pim.product_relations`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**78. Table: `pim.product_relations`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**79. Table: `pim.product_relations`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**80. Table: `pim.product_tags`**

- **Issue**: Column 'tag_name' exists in SQL but not in model
- **SQL**: `tag_name                VARCHAR(50)              NOT NULL,                               -- 태그명`
- **Model**: `N/A`
- **Fix**: Remove column tag_name from SQL or add to model

---

**81. Table: `pim.product_tags`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**82. Table: `pim.product_tags`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**83. Table: `pim.product_tags`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**84. Table: `pim.product_tags`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE,                                                            -- 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**85. Table: `pim.product_tags`**

- **Issue**: Column 'tag_type' exists in SQL but not in model
- **SQL**: `tag_type                VARCHAR(20)              DEFAULT 'GENERAL',                      -- 태그 유형`
- **Model**: `N/A`
- **Fix**: Remove column tag_type from SQL or add to model

---

**86. Table: `pim.product_tags`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**87. Table: `pim.product_tags`**

- **Issue**: Column 'color_code' exists in SQL but not in model
- **SQL**: `color_code              VARCHAR(20),                                                     -- 색상 코드 (hex)`
- **Model**: `N/A`
- **Fix**: Remove column color_code from SQL or add to model

---

**88. Table: `pim.product_tags`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**89. Table: `pim.product_tags`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 종료일`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**90. Table: `pim.product_price_history`**

- **Issue**: Column 'price_type' exists in SQL but not in model
- **SQL**: `price_type              VARCHAR(20)              NOT NULL,                               -- 가격 유형`
- **Model**: `N/A`
- **Fix**: Remove column price_type from SQL or add to model

---

**91. Table: `pim.product_price_history`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 상세 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**92. Table: `pim.product_price_history`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**93. Table: `pim.product_price_history`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**94. Table: `pim.product_price_history`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**95. Table: `pim.product_price_history`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**96. Table: `pim.product_price_history`**

- **Issue**: Column 'effective_date' exists in SQL but not in model
- **SQL**: `effective_date          DATE                     NOT NULL,                               -- 적용 시작일`
- **Model**: `N/A`
- **Fix**: Remove column effective_date from SQL or add to model

---

**97. Table: `pim.product_price_history`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**98. Table: `pim.product_price_history`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**99. Table: `pim.product_price_history`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 적용 종료일`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**100. Table: `pim.product_price_history`**

- **Issue**: Column 'reason' exists in SQL but not in model
- **SQL**: `reason                  VARCHAR(200),                                                    -- 변경 사유`
- **Model**: `N/A`
- **Fix**: Remove column reason from SQL or add to model

---

**101. Table: `pim.product_price_history`**

- **Issue**: Column 'new_price' exists in SQL but not in model
- **SQL**: `new_price               NUMERIC(18,4)            NOT NULL,                               -- 변경 후 가격`
- **Model**: `N/A`
- **Fix**: Remove column new_price from SQL or add to model

---

**102. Table: `pim.product_price_history`**

- **Issue**: Column 'reason_type' exists in SQL but not in model
- **SQL**: `reason_type             VARCHAR(20),                                                     -- 사유 유형`
- **Model**: `N/A`
- **Fix**: Remove column reason_type from SQL or add to model

---

**103. Table: `pim.product_price_history`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**104. Table: `pim.product_price_history`**

- **Issue**: Column 'old_price' exists in SQL but not in model
- **SQL**: `old_price               NUMERIC(18,4),                                                   -- 변경 전 가격`
- **Model**: `N/A`
- **Fix**: Remove column old_price from SQL or add to model

---

**105. Table: `pim.product_options`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**106. Table: `pim.product_options`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                               -- 옵션명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**107. Table: `pim.product_options`**

- **Issue**: Column 'is_required' exists in SQL but not in model
- **SQL**: `is_required             BOOLEAN                  DEFAULT true,                           -- 필수 선택 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_required from SQL or add to model

---

**108. Table: `pim.product_options`**

- **Issue**: Column 'option_type' exists in SQL but not in model
- **SQL**: `option_type             VARCHAR(20)              DEFAULT 'SELECT',                       -- 옵션 유형`
- **Model**: `N/A`
- **Fix**: Remove column option_type from SQL or add to model

---

**109. Table: `pim.product_options`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**110. Table: `pim.product_options`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**111. Table: `pim.product_options`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(100),                                                    -- 영문 옵션명`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**112. Table: `pim.product_options`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**113. Table: `pim.product_options`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**114. Table: `pim.product_options`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**115. Table: `pim.product_options`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(50)              NOT NULL,                               -- 옵션 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**116. Table: `pim.product_images`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 이미지 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**117. Table: `pim.product_images`**

- **Issue**: Column 'mime_type' exists in SQL but not in model
- **SQL**: `mime_type               VARCHAR(50),                                                     -- MIME 타입`
- **Model**: `N/A`
- **Fix**: Remove column mime_type from SQL or add to model

---

**118. Table: `pim.product_images`**

- **Issue**: Column 'image_url' exists in SQL but not in model
- **SQL**: `image_url               VARCHAR(500)             NOT NULL,                               -- 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column image_url from SQL or add to model

---

**119. Table: `pim.product_images`**

- **Issue**: Column 'is_primary' exists in SQL but not in model
- **SQL**: `is_primary              BOOLEAN                  DEFAULT false,                          -- 대표 이미지 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_primary from SQL or add to model

---

**120. Table: `pim.product_images`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**121. Table: `pim.product_images`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**122. Table: `pim.product_images`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**123. Table: `pim.product_images`**

- **Issue**: Column 'image_type' exists in SQL but not in model
- **SQL**: `image_type              VARCHAR(20)              DEFAULT 'DETAIL',                       -- 이미지 유형`
- **Model**: `N/A`
- **Fix**: Remove column image_type from SQL or add to model

---

**124. Table: `pim.product_images`**

- **Issue**: Column 'width' exists in SQL but not in model
- **SQL**: `width                   INTEGER,                                                         -- 이미지 너비`
- **Model**: `N/A`
- **Fix**: Remove column width from SQL or add to model

---

**125. Table: `pim.product_images`**

- **Issue**: Column 'file_size' exists in SQL but not in model
- **SQL**: `file_size               BIGINT,                                                          -- 파일 크기 (bytes)`
- **Model**: `N/A`
- **Fix**: Remove column file_size from SQL or add to model

---

**126. Table: `pim.product_images`**

- **Issue**: Column 'file_name' exists in SQL but not in model
- **SQL**: `file_name               VARCHAR(200),                                                    -- 파일명`
- **Model**: `N/A`
- **Fix**: Remove column file_name from SQL or add to model

---

**127. Table: `pim.product_images`**

- **Issue**: Column 'alt_text' exists in SQL but not in model
- **SQL**: `alt_text                VARCHAR(200),                                                    -- 대체 텍스트`
- **Model**: `N/A`
- **Fix**: Remove column alt_text from SQL or add to model

---

**128. Table: `pim.product_images`**

- **Issue**: Column 'height' exists in SQL but not in model
- **SQL**: `height                  INTEGER,                                                         -- 이미지 높이`
- **Model**: `N/A`
- **Fix**: Remove column height from SQL or add to model

---

**129. Table: `pim.product_images`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 표시 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**130. Table: `pim.product_images`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**131. Table: `pim.brands`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 브랜드 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**132. Table: `pim.brands`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 브랜드명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**133. Table: `pim.brands`**

- **Issue**: Column 'market_segment' exists in SQL but not in model
- **SQL**: `market_segment          VARCHAR(50),                                                     -- 시장 세그먼트`
- **Model**: `N/A`
- **Fix**: Remove column market_segment from SQL or add to model

---

**134. Table: `pim.brands`**

- **Issue**: Column 'website' exists in SQL but not in model
- **SQL**: `website                 VARCHAR(255),                                                    -- 브랜드 웹사이트`
- **Model**: `N/A`
- **Fix**: Remove column website from SQL or add to model

---

**135. Table: `pim.brands`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**136. Table: `pim.brands`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**137. Table: `pim.brands`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(200),                                                    -- 영문 브랜드명`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**138. Table: `pim.brands`**

- **Issue**: Column 'category' exists in SQL but not in model
- **SQL**: `category                VARCHAR(50),                                                     -- 브랜드 카테고리`
- **Model**: `N/A`
- **Fix**: Remove column category from SQL or add to model

---

**139. Table: `pim.brands`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**140. Table: `pim.brands`**

- **Issue**: Column 'type' exists in SQL but not in model
- **SQL**: `type                    VARCHAR(20)              DEFAULT 'PRODUCT',                      -- 브랜드 유형`
- **Model**: `N/A`
- **Fix**: Remove column type from SQL or add to model

---

**141. Table: `pim.brands`**

- **Issue**: Column 'target_market' exists in SQL but not in model
- **SQL**: `target_market           VARCHAR(100),                                                    -- 타겟 시장`
- **Model**: `N/A`
- **Fix**: Remove column target_market from SQL or add to model

---

**142. Table: `pim.brands`**

- **Issue**: Column 'is_private' exists in SQL but not in model
- **SQL**: `is_private              BOOLEAN                  DEFAULT false,                          -- 자체 브랜드 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_private from SQL or add to model

---

**143. Table: `pim.brands`**

- **Issue**: Column 'tagline' exists in SQL but not in model
- **SQL**: `tagline                 VARCHAR(200),                                                    -- 브랜드 슬로건`
- **Model**: `N/A`
- **Fix**: Remove column tagline from SQL or add to model

---

**144. Table: `pim.brands`**

- **Issue**: Column 'price_range' exists in SQL but not in model
- **SQL**: `price_range             VARCHAR(20),                                                     -- 가격대`
- **Model**: `N/A`
- **Fix**: Remove column price_range from SQL or add to model

---

**145. Table: `pim.brands`**

- **Issue**: Column 'is_premium' exists in SQL but not in model
- **SQL**: `is_premium              BOOLEAN                  DEFAULT false,                          -- 프리미엄 브랜드 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_premium from SQL or add to model

---

**146. Table: `pim.brands`**

- **Issue**: Column 'country_code' exists in SQL but not in model
- **SQL**: `country_code            VARCHAR(3),                                                      -- 브랜드 원산지`
- **Model**: `N/A`
- **Fix**: Remove column country_code from SQL or add to model

---

**147. Table: `pim.brands`**

- **Issue**: Column 'maker_id' exists in SQL but not in model
- **SQL**: `maker_id                UUID                     NOT NULL,                               -- 제조사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column maker_id from SQL or add to model

---

**148. Table: `pim.brands`**

- **Issue**: Column 'color' exists in SQL but not in model
- **SQL**: `color                   VARCHAR(20),                                                     -- 브랜드 컬러 (hex)`
- **Model**: `N/A`
- **Fix**: Remove column color from SQL or add to model

---

**149. Table: `pim.brands`**

- **Issue**: Column 'logo_url' exists in SQL but not in model
- **SQL**: `logo_url                VARCHAR(500),                                                    -- 로고 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column logo_url from SQL or add to model

---

**150. Table: `pim.brands`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**151. Table: `pim.brands`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 브랜드 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**152. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**153. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'is_default' exists in SQL but not in model
- **SQL**: `is_default              BOOLEAN                  DEFAULT false,                          -- 기본 변환 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_default from SQL or add to model

---

**154. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'from_unit_id' exists in SQL but not in model
- **SQL**: `from_unit_id            UUID                     NOT NULL,                               -- 원단위 식별자`
- **Model**: `N/A`
- **Fix**: Remove column from_unit_id from SQL or add to model

---

**155. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**156. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**157. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'conversion_rate' exists in SQL but not in model
- **SQL**: `conversion_rate         NUMERIC(18,6)            NOT NULL,                               -- 변환 비율`
- **Model**: `N/A`
- **Fix**: Remove column conversion_rate from SQL or add to model

---

**158. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**159. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'to_unit_id' exists in SQL but not in model
- **SQL**: `to_unit_id              UUID                     NOT NULL,                               -- 변환단위 식별자`
- **Model**: `N/A`
- **Fix**: Remove column to_unit_id from SQL or add to model

---

**160. Table: `pim.product_unit_conversions`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**161. Table: `pim.product_managers`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 담당 업무/역할`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**162. Table: `pim.product_managers`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**163. Table: `pim.product_managers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**164. Table: `pim.product_managers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**165. Table: `pim.product_managers`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 담당 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**166. Table: `pim.product_managers`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id             UUID                     NOT NULL,                               -- 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**167. Table: `pim.product_managers`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**168. Table: `pim.product_managers`**

- **Issue**: Column 'manager_type' exists in SQL but not in model
- **SQL**: `manager_type            VARCHAR(20)              DEFAULT 'PRIMARY',                      -- 담당자 유형`
- **Model**: `N/A`
- **Fix**: Remove column manager_type from SQL or add to model

---

**169. Table: `pim.product_managers`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 담당 종료일`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**170. Table: `pim.makers`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 제조사 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**171. Table: `pim.makers`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 제조사명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**172. Table: `pim.makers`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 제조사 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**173. Table: `pim.makers`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255),                                                    -- 이메일`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**174. Table: `pim.makers`**

- **Issue**: Column 'website' exists in SQL but not in model
- **SQL**: `website                 VARCHAR(255),                                                    -- 웹사이트 URL`
- **Model**: `N/A`
- **Fix**: Remove column website from SQL or add to model

---

**175. Table: `pim.makers`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1                VARCHAR(100),                                                    -- 주소1 (기본주소)`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**176. Table: `pim.makers`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**177. Table: `pim.makers`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**178. Table: `pim.makers`**

- **Issue**: Column 'name_en' exists in SQL but not in model
- **SQL**: `name_en                 VARCHAR(200),                                                    -- 영문 제조사명`
- **Model**: `N/A`
- **Fix**: Remove column name_en from SQL or add to model

---

**179. Table: `pim.makers`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2                VARCHAR(100),                                                    -- 주소2 (상세주소)`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**180. Table: `pim.makers`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**181. Table: `pim.makers`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                     -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**182. Table: `pim.makers`**

- **Issue**: Column 'country_code' exists in SQL but not in model
- **SQL**: `country_code            VARCHAR(3),                                                      -- 본사 국가코드`
- **Model**: `N/A`
- **Fix**: Remove column country_code from SQL or add to model

---

**183. Table: `pim.makers`**

- **Issue**: Column 'logo_url' exists in SQL but not in model
- **SQL**: `logo_url                VARCHAR(500),                                                    -- 로고 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column logo_url from SQL or add to model

---

**184. Table: `pim.makers`**

- **Issue**: Column 'display_order' exists in SQL but not in model
- **SQL**: `display_order           INTEGER                  DEFAULT 0,                              -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column display_order from SQL or add to model

---

**185. Table: `pim.makers`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode                VARCHAR(10),                                                     -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---

**186. Table: `pim.products`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200)             NOT NULL,                               -- 제품명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**187. Table: `pim.products`**

- **Issue**: Column 'std_cost_price' exists in SQL but not in model
- **SQL**: `std_cost_price          NUMERIC(18,4),                                                   -- 표준 원가`
- **Model**: `N/A`
- **Fix**: Remove column std_cost_price from SQL or add to model

---

**188. Table: `pim.products`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**189. Table: `pim.products`**

- **Issue**: Column 'model_name' exists in SQL but not in model
- **SQL**: `model_name              VARCHAR(100),                                                    -- 모델명`
- **Model**: `N/A`
- **Fix**: Remove column model_name from SQL or add to model

---

**190. Table: `pim.products`**

- **Issue**: Column 'image_url' exists in SQL but not in model
- **SQL**: `image_url               VARCHAR(200),                                                    -- 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column image_url from SQL or add to model

---

**191. Table: `pim.products`**

- **Issue**: Column 'is_serial' exists in SQL but not in model
- **SQL**: `is_serial               BOOLEAN                  DEFAULT false,                          -- 시리얼 관리 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_serial from SQL or add to model

---

**192. Table: `pim.products`**

- **Issue**: Column 'brand_id' exists in SQL but not in model
- **SQL**: `brand_id                UUID,                                                            -- 브랜드 식별자`
- **Model**: `N/A`
- **Fix**: Remove column brand_id from SQL or add to model

---

**193. Table: `pim.products`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**194. Table: `pim.products`**

- **Issue**: Column 'type' exists in SQL but not in model
- **SQL**: `type                    VARCHAR(10),                                                     -- 제품 유형`
- **Model**: `N/A`
- **Fix**: Remove column type from SQL or add to model

---

**195. Table: `pim.products`**

- **Issue**: Column 'maker_id' exists in SQL but not in model
- **SQL**: `maker_id                UUID,                                                            -- 제조사 식별자`
- **Model**: `N/A`
- **Fix**: Remove column maker_id from SQL or add to model

---

**196. Table: `pim.products`**

- **Issue**: Column 'item_type' exists in SQL but not in model
- **SQL**: `item_type               VARCHAR(10),                                                     -- 품목 유형`
- **Model**: `N/A`
- **Fix**: Remove column item_type from SQL or add to model

---

**197. Table: `pim.products`**

- **Issue**: Column 'std_sell_price' exists in SQL but not in model
- **SQL**: `std_sell_price          NUMERIC(18,4),                                                   -- 표준 판매가`
- **Model**: `N/A`
- **Fix**: Remove column std_sell_price from SQL or add to model

---

**198. Table: `pim.products`**

- **Issue**: Column 'manager_id' exists in SQL but not in model
- **SQL**: `manager_id              UUID,                                                            -- 제품 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column manager_id from SQL or add to model

---

**199. Table: `pim.products`**

- **Issue**: Column 'is_inventory' exists in SQL but not in model
- **SQL**: `is_inventory            BOOLEAN                  DEFAULT true,                           -- 재고 관리 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_inventory from SQL or add to model

---

**200. Table: `pim.products`**

- **Issue**: Column 'is_barcode' exists in SQL but not in model
- **SQL**: `is_barcode              BOOLEAN                  DEFAULT false,                          -- 바코드 보유 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_barcode from SQL or add to model

---

**201. Table: `pim.products`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 제품 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**202. Table: `pim.products`**

- **Issue**: Column 'is_checkno' exists in SQL but not in model
- **SQL**: `is_checkno              BOOLEAN                  DEFAULT false,                          -- 체크번호 필요 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_checkno from SQL or add to model

---

**203. Table: `pim.products`**

- **Issue**: Column 'is_bigdeal' exists in SQL but not in model
- **SQL**: `is_bigdeal              BOOLEAN                  DEFAULT false,                          -- 거액 거래 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_bigdeal from SQL or add to model

---

**204. Table: `pim.products`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**205. Table: `pim.products`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**206. Table: `pim.products`**

- **Issue**: Column 'specifications' exists in SQL but not in model
- **SQL**: `specifications          JSONB,                                                           -- 제품 사양`
- **Model**: `N/A`
- **Fix**: Remove column specifications from SQL or add to model

---

**207. Table: `pim.products`**

- **Issue**: Column 'is_taxfree' exists in SQL but not in model
- **SQL**: `is_taxfree              BOOLEAN                  DEFAULT false,                          -- 면세 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_taxfree from SQL or add to model

---

**208. Table: `pim.products`**

- **Issue**: Column 'barcode' exists in SQL but not in model
- **SQL**: `barcode                 VARCHAR(50),                                                     -- 바코드`
- **Model**: `N/A`
- **Fix**: Remove column barcode from SQL or add to model

---

**209. Table: `pim.products`**

- **Issue**: Column 'min_sell_price' exists in SQL but not in model
- **SQL**: `min_sell_price          NUMERIC(18,4),                                                   -- 최소 판매가`
- **Model**: `N/A`
- **Fix**: Remove column min_sell_price from SQL or add to model

---

**210. Table: `pim.products`**

- **Issue**: Column 'cto_id' exists in SQL but not in model
- **SQL**: `cto_id                  VARCHAR(50),                                                     -- CTO ID`
- **Model**: `N/A`
- **Fix**: Remove column cto_id from SQL or add to model

---

**211. Table: `pim.products`**

- **Issue**: Column 'eclipse_id' exists in SQL but not in model
- **SQL**: `eclipse_id              VARCHAR(20),                                                     -- Eclipse ID`
- **Model**: `N/A`
- **Fix**: Remove column eclipse_id from SQL or add to model

---

**212. Table: `pim.products`**

- **Issue**: Column 'no' exists in SQL but not in model
- **SQL**: `no                      VARCHAR(10),                                                     -- 제품 번호`
- **Model**: `N/A`
- **Fix**: Remove column no from SQL or add to model

---

**213. Table: `pim.products`**

- **Issue**: Column 'category_id' exists in SQL but not in model
- **SQL**: `category_id             UUID,                                                            -- 카테고리 식별자`
- **Model**: `N/A`
- **Fix**: Remove column category_id from SQL or add to model

---

**214. Table: `pim.products`**

- **Issue**: Column 'procure_id' exists in SQL but not in model
- **SQL**: `procure_id              VARCHAR(20),                                                     -- 조달 ID`
- **Model**: `N/A`
- **Fix**: Remove column procure_id from SQL or add to model

---

**215. Table: `pim.products`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                               -- 제품 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**216. Table: `pim.product_variants`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**217. Table: `pim.product_variants`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(200),                                                    -- 변형명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**218. Table: `pim.product_variants`**

- **Issue**: Column 'sku' exists in SQL but not in model
- **SQL**: `sku                     VARCHAR(50)              NOT NULL,                               -- SKU (Stock Keeping Unit)`
- **Model**: `N/A`
- **Fix**: Remove column sku from SQL or add to model

---

**219. Table: `pim.product_variants`**

- **Issue**: Column 'weight' exists in SQL but not in model
- **SQL**: `weight                  NUMERIC(10,2),                                                   -- 무게 (g)`
- **Model**: `N/A`
- **Fix**: Remove column weight from SQL or add to model

---

**220. Table: `pim.product_variants`**

- **Issue**: Column 'image_url' exists in SQL but not in model
- **SQL**: `image_url               VARCHAR(500),                                                    -- 대표 이미지 URL`
- **Model**: `N/A`
- **Fix**: Remove column image_url from SQL or add to model

---

**221. Table: `pim.product_variants`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**222. Table: `pim.product_variants`**

- **Issue**: Column 'length' exists in SQL but not in model
- **SQL**: `length                  NUMERIC(10,2),                                                   -- 길이 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column length from SQL or add to model

---

**223. Table: `pim.product_variants`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**224. Table: `pim.product_variants`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**225. Table: `pim.product_variants`**

- **Issue**: Column 'barcode' exists in SQL but not in model
- **SQL**: `barcode                 VARCHAR(50),                                                     -- 바코드`
- **Model**: `N/A`
- **Fix**: Remove column barcode from SQL or add to model

---

**226. Table: `pim.product_variants`**

- **Issue**: Column 'width' exists in SQL but not in model
- **SQL**: `width                   NUMERIC(10,2),                                                   -- 너비 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column width from SQL or add to model

---

**227. Table: `pim.product_variants`**

- **Issue**: Column 'price' exists in SQL but not in model
- **SQL**: `price                   NUMERIC(18,4),                                                   -- 판매 가격`
- **Model**: `N/A`
- **Fix**: Remove column price from SQL or add to model

---

**228. Table: `pim.product_variants`**

- **Issue**: Column 'stock_quantity' exists in SQL but not in model
- **SQL**: `stock_quantity          NUMERIC(18,2)            DEFAULT 0,                              -- 재고 수량`
- **Model**: `N/A`
- **Fix**: Remove column stock_quantity from SQL or add to model

---

**229. Table: `pim.product_variants`**

- **Issue**: Column 'reserved_quantity' exists in SQL but not in model
- **SQL**: `reserved_quantity       NUMERIC(18,2)            DEFAULT 0,                              -- 예약 수량`
- **Model**: `N/A`
- **Fix**: Remove column reserved_quantity from SQL or add to model

---

**230. Table: `pim.product_variants`**

- **Issue**: Column 'option_values' exists in SQL but not in model
- **SQL**: `option_values           JSONB                    NOT NULL,                               -- 옵션 값 조합`
- **Model**: `N/A`
- **Fix**: Remove column option_values from SQL or add to model

---

**231. Table: `pim.product_variants`**

- **Issue**: Column 'height' exists in SQL but not in model
- **SQL**: `height                  NUMERIC(10,2),                                                   -- 높이 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column height from SQL or add to model

---

**232. Table: `pim.product_variants`**

- **Issue**: Column 'available_quantity' exists in SQL but not in model
- **SQL**: `available_quantity      NUMERIC(18,2)            GENERATED ALWAYS AS (stock_quantity - reserved_quantity) STORED, -- 가용 수량`
- **Model**: `N/A`
- **Fix**: Remove column available_quantity from SQL or add to model

---

**233. Table: `pim.product_variants`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**234. Table: `pim.product_variants`**

- **Issue**: Column 'cost_price' exists in SQL but not in model
- **SQL**: `cost_price              NUMERIC(18,4),                                                   -- 원가`
- **Model**: `N/A`
- **Fix**: Remove column cost_price from SQL or add to model

---


### Schema: PSM (128 issues)


#### Extra SQL Column (128)

**1. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 입고 로케이션`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**2. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'received_qty' exists in SQL but not in model
- **SQL**: `received_qty            INTEGER                  NOT NULL,                               -- 입고 수량`
- **Model**: `N/A`
- **Fix**: Remove column received_qty from SQL or add to model

---

**3. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**4. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**5. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'ordered_qty' exists in SQL but not in model
- **SQL**: `ordered_qty             INTEGER                  NOT NULL,                               -- 발주 수량`
- **Model**: `N/A`
- **Fix**: Remove column ordered_qty from SQL or add to model

---

**6. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'inspection_status' exists in SQL but not in model
- **SQL**: `inspection_status       VARCHAR(20)              DEFAULT 'PENDING',                      -- 검수 상태`
- **Model**: `N/A`
- **Fix**: Remove column inspection_status from SQL or add to model

---

**7. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES ivm.warehouse_locations(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**8. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'rejected_qty' exists in SQL but not in model
- **SQL**: `rejected_qty            INTEGER                  DEFAULT 0,                              -- 불합격 수량`
- **Model**: `N/A`
- **Fix**: Remove column rejected_qty from SQL or add to model

---

**9. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'accepted_qty' exists in SQL but not in model
- **SQL**: `accepted_qty            INTEGER                  DEFAULT 0,                              -- 합격 수량`
- **Model**: `N/A`
- **Fix**: Remove column accepted_qty from SQL or add to model

---

**10. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'lot_no' exists in SQL but not in model
- **SQL**: `lot_no                  VARCHAR(100),                                                    -- LOT 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_no from SQL or add to model

---

**11. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'receipt_id' exists in SQL but not in model
- **SQL**: `receipt_id              UUID                     NOT NULL,                               -- 입고 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column receipt_id from SQL or add to model

---

**12. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**13. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'rejection_reason' exists in SQL but not in model
- **SQL**: `rejection_reason        TEXT,                                                            -- 불합격 사유`
- **Model**: `N/A`
- **Fix**: Remove column rejection_reason from SQL or add to model

---

**14. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Column 'po_item_id' exists in SQL but not in model
- **SQL**: `po_item_id              UUID                     NOT NULL,                               -- 구매발주 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column po_item_id from SQL or add to model

---

**15. Table: `psm.purchase_order_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**16. Table: `psm.purchase_order_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**17. Table: `psm.purchase_order_items`**

- **Issue**: Column 'received_qty' exists in SQL but not in model
- **SQL**: `received_qty            INTEGER                  DEFAULT 0,                              -- 입고 완료 수량`
- **Model**: `N/A`
- **Fix**: Remove column received_qty from SQL or add to model

---

**18. Table: `psm.purchase_order_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**19. Table: `psm.purchase_order_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**20. Table: `psm.purchase_order_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**21. Table: `psm.purchase_order_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 발주 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**22. Table: `psm.purchase_order_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**23. Table: `psm.purchase_order_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**24. Table: `psm.purchase_order_items`**

- **Issue**: Column 'po_id' exists in SQL but not in model
- **SQL**: `po_id                   UUID                     NOT NULL,                               -- 구매발주 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column po_id from SQL or add to model

---

**25. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**26. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**27. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**28. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**29. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'pr_id' exists in SQL but not in model
- **SQL**: `pr_id                   UUID                     NOT NULL,                               -- 구매요청 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column pr_id from SQL or add to model

---

**30. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            DEFAULT 0,                              -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**31. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 요청 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**32. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**33. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**34. Table: `psm.purchase_requisition_items`**

- **Issue**: Column 'required_date' exists in SQL but not in model
- **SQL**: `required_date           DATE,                                                            -- 필요 일자`
- **Model**: `N/A`
- **Fix**: Remove column required_date from SQL or add to model

---

**35. Table: `psm.purchase_quotations`**

- **Issue**: Column 'supplier_id' exists in SQL but not in model
- **SQL**: `supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_id from SQL or add to model

---

**36. Table: `psm.purchase_quotations`**

- **Issue**: Column 'valid_from' exists in SQL but not in model
- **SQL**: `valid_from              DATE                     NOT NULL,                               -- 유효 시작일`
- **Model**: `N/A`
- **Fix**: Remove column valid_from from SQL or add to model

---

**37. Table: `psm.purchase_quotations`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**38. Table: `psm.purchase_quotations`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 견적 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**39. Table: `psm.purchase_quotations`**

- **Issue**: Column 'quotation_date' exists in SQL but not in model
- **SQL**: `quotation_date          DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 견적 일자`
- **Model**: `N/A`
- **Fix**: Remove column quotation_date from SQL or add to model

---

**40. Table: `psm.purchase_quotations`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**41. Table: `psm.purchase_quotations`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 견적 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**42. Table: `psm.purchase_quotations`**

- **Issue**: Column 'pr_id' exists in SQL but not in model
- **SQL**: `pr_id                   UUID,                                                            -- 구매요청 식별자 (선택)`
- **Model**: `N/A`
- **Fix**: Remove column pr_id from SQL or add to model

---

**43. Table: `psm.purchase_quotations`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           TEXT,                                                            -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**44. Table: `psm.purchase_quotations`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**45. Table: `psm.purchase_quotations`**

- **Issue**: Column 'selected_by' exists in SQL but not in model
- **SQL**: `selected_by             UUID,                                                            -- 선택자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column selected_by from SQL or add to model

---

**46. Table: `psm.purchase_quotations`**

- **Issue**: Column 'is_selected' exists in SQL but not in model
- **SQL**: `is_selected             BOOLEAN                  DEFAULT false,                          -- 선택 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_selected from SQL or add to model

---

**47. Table: `psm.purchase_quotations`**

- **Issue**: Column 'valid_to' exists in SQL but not in model
- **SQL**: `valid_to                DATE                     NOT NULL,                               -- 유효 종료일`
- **Model**: `N/A`
- **Fix**: Remove column valid_to from SQL or add to model

---

**48. Table: `psm.purchase_quotations`**

- **Issue**: Column 'delivery_terms' exists in SQL but not in model
- **SQL**: `delivery_terms          TEXT,                                                            -- 배송 조건`
- **Model**: `N/A`
- **Fix**: Remove column delivery_terms from SQL or add to model

---

**49. Table: `psm.purchase_quotations`**

- **Issue**: Column 'quotation_no' exists in SQL but not in model
- **SQL**: `quotation_no            VARCHAR(50)              NOT NULL,                               -- 견적 번호`
- **Model**: `N/A`
- **Fix**: Remove column quotation_no from SQL or add to model

---

**50. Table: `psm.purchase_quotations`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES csm.customers(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**51. Table: `psm.purchase_quotations`**

- **Issue**: Column 'selected_at' exists in SQL but not in model
- **SQL**: `selected_at             TIMESTAMP WITH TIME ZONE,                                        -- 선택 일시`
- **Model**: `N/A`
- **Fix**: Remove column selected_at from SQL or add to model

---

**52. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'supplier_id' exists in SQL but not in model
- **SQL**: `supplier_id             UUID                     NOT NULL,                               -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column supplier_id from SQL or add to model

---

**53. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**54. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'valid_from' exists in SQL but not in model
- **SQL**: `valid_from              DATE                     NOT NULL,                               -- 유효 시작일`
- **Model**: `N/A`
- **Fix**: Remove column valid_from from SQL or add to model

---

**55. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**56. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'ACTIVE',              -- 계약 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**57. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 계약 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**58. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           TEXT,                                                            -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**59. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**60. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'agreement_date' exists in SQL but not in model
- **SQL**: `agreement_date          DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 계약 일자`
- **Model**: `N/A`
- **Fix**: Remove column agreement_date from SQL or add to model

---

**61. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'min_order_qty' exists in SQL but not in model
- **SQL**: `min_order_qty           INTEGER,                                                         -- 최소 주문 수량`
- **Model**: `N/A`
- **Fix**: Remove column min_order_qty from SQL or add to model

---

**62. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'delivery_terms' exists in SQL but not in model
- **SQL**: `delivery_terms          TEXT,                                                            -- 배송 조건`
- **Model**: `N/A`
- **Fix**: Remove column delivery_terms from SQL or add to model

---

**63. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'valid_to' exists in SQL but not in model
- **SQL**: `valid_to                DATE                     NOT NULL,                               -- 유효 종료일`
- **Model**: `N/A`
- **Fix**: Remove column valid_to from SQL or add to model

---

**64. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'agreement_no' exists in SQL but not in model
- **SQL**: `agreement_no            VARCHAR(50)              NOT NULL,                               -- 계약 번호`
- **Model**: `N/A`
- **Fix**: Remove column agreement_no from SQL or add to model

---

**65. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**66. Table: `psm.purchase_price_agreements`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**67. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE CASCADE`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**68. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'pr_id' exists in SQL but not in model
- **SQL**: `pr_id                   UUID                     NOT NULL,                               -- 구매요청 식별자`
- **Model**: `N/A`
- **Fix**: Remove column pr_id from SQL or add to model

---

**69. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'pr_item_id' exists in SQL but not in model
- **SQL**: `pr_item_id              UUID                     NOT NULL,                               -- 구매요청 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column pr_item_id from SQL or add to model

---

**70. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 연결된 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**71. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES psm.purchase_requisition_items(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**72. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'po_item_id' exists in SQL but not in model
- **SQL**: `po_item_id              UUID                     NOT NULL,                               -- 구매발주 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column po_item_id from SQL or add to model

---

**73. Table: `psm.purchase_order_pr_links`**

- **Issue**: Column 'po_id' exists in SQL but not in model
- **SQL**: `po_id                   UUID                     NOT NULL,                               -- 구매발주 식별자`
- **Model**: `N/A`
- **Fix**: Remove column po_id from SQL or add to model

---

**74. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 입고 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**75. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 입고 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**76. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'receipt_date' exists in SQL but not in model
- **SQL**: `receipt_date            DATE                     NOT NULL DEFAULT CURRENT_DATE,          -- 입고 일자`
- **Model**: `N/A`
- **Fix**: Remove column receipt_date from SQL or add to model

---

**77. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**78. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'tracking_no' exists in SQL but not in model
- **SQL**: `tracking_no             VARCHAR(100),                                                    -- 송장 번호`
- **Model**: `N/A`
- **Fix**: Remove column tracking_no from SQL or add to model

---

**79. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              NOT NULL DEFAULT 'DRAFT',               -- 입고 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**80. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**81. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'delivery_note_no' exists in SQL but not in model
- **SQL**: `delivery_note_no        VARCHAR(50),                                                     -- 배송 전표 번호`
- **Model**: `N/A`
- **Fix**: Remove column delivery_note_no from SQL or add to model

---

**82. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'inspected_by' exists in SQL but not in model
- **SQL**: `inspected_by            UUID,                                                            -- 검수자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column inspected_by from SQL or add to model

---

**83. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'inspection_result' exists in SQL but not in model
- **SQL**: `inspection_result       VARCHAR(20),                                                     -- 검수 결과`
- **Model**: `N/A`
- **Fix**: Remove column inspection_result from SQL or add to model

---

**84. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'po_id' exists in SQL but not in model
- **SQL**: `po_id                   UUID                     NOT NULL,                               -- 구매발주 식별자`
- **Model**: `N/A`
- **Fix**: Remove column po_id from SQL or add to model

---

**85. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'inspected_at' exists in SQL but not in model
- **SQL**: `inspected_at            TIMESTAMP WITH TIME ZONE,                                        -- 검수 일시`
- **Model**: `N/A`
- **Fix**: Remove column inspected_at from SQL or add to model

---

**86. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES ivm.warehouse_locations(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**87. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'carrier' exists in SQL but not in model
- **SQL**: `carrier                 VARCHAR(100),                                                    -- 배송 업체`
- **Model**: `N/A`
- **Fix**: Remove column carrier from SQL or add to model

---

**88. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'inspection_notes' exists in SQL but not in model
- **SQL**: `inspection_notes        TEXT,                                                            -- 검수 비고`
- **Model**: `N/A`
- **Fix**: Remove column inspection_notes from SQL or add to model

---

**89. Table: `psm.purchase_order_receipts`**

- **Issue**: Column 'receipt_no' exists in SQL but not in model
- **SQL**: `receipt_no              VARCHAR(50)              NOT NULL,                               -- 입고 번호`
- **Model**: `N/A`
- **Fix**: Remove column receipt_no from SQL or add to model

---

**90. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**91. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**92. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**93. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE RESTRICT`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**94. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**95. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES pim.products(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**96. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'quotation_id' exists in SQL but not in model
- **SQL**: `quotation_id            UUID                     NOT NULL,                               -- 견적 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column quotation_id from SQL or add to model

---

**97. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'lead_time_days' exists in SQL but not in model
- **SQL**: `lead_time_days          INTEGER,                                                         -- 납기 (일)`
- **Model**: `N/A`
- **Fix**: Remove column lead_time_days from SQL or add to model

---

**98. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 견적 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**99. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'min_order_qty' exists in SQL but not in model
- **SQL**: `min_order_qty           INTEGER,                                                         -- 최소 주문 수량`
- **Model**: `N/A`
- **Fix**: Remove column min_order_qty from SQL or add to model

---

**100. Table: `psm.purchase_quotation_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**101. Table: `psm.purchase_orders`**

- **Issue**: Column 'po_code' exists in SQL but not in model
- **SQL**: `po_code                 VARCHAR(50)              NOT NULL,                               -- 구매발주 코드`
- **Model**: `N/A`
- **Fix**: Remove column po_code from SQL or add to model

---

**102. Table: `psm.purchase_orders`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID,                                                            -- 입고 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**103. Table: `psm.purchase_orders`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**104. Table: `psm.purchase_orders`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**105. Table: `psm.purchase_orders`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**106. Table: `psm.purchase_orders`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**107. Table: `psm.purchase_orders`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(20),                                                     -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**108. Table: `psm.purchase_orders`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**109. Table: `psm.purchase_orders`**

- **Issue**: Column 'vendor_id' exists in SQL but not in model
- **SQL**: `vendor_id               UUID                     NOT NULL,                               -- 공급업체 식별자`
- **Model**: `N/A`
- **Fix**: Remove column vendor_id from SQL or add to model

---

**110. Table: `psm.purchase_orders`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**111. Table: `psm.purchase_orders`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**112. Table: `psm.purchase_orders`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**113. Table: `psm.purchase_orders`**

- **Issue**: Column 'delivery_date' exists in SQL but not in model
- **SQL**: `delivery_date           DATE,                                                            -- 납품 희망일`
- **Model**: `N/A`
- **Fix**: Remove column delivery_date from SQL or add to model

---

**114. Table: `psm.purchase_orders`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES hrm.employees(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**115. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**116. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'requester_id' exists in SQL but not in model
- **SQL**: `requester_id            UUID                     NOT NULL,                               -- 요청자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column requester_id from SQL or add to model

---

**117. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**118. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE SET NULL`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**119. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                            -- 부서 식별자`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**120. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**121. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**122. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'approved_at' exists in SQL but not in model
- **SQL**: `approved_at             TIMESTAMP WITH TIME ZONE,                                        -- 승인 일시`
- **Model**: `N/A`
- **Fix**: Remove column approved_at from SQL or add to model

---

**123. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**124. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'approved_by' exists in SQL but not in model
- **SQL**: `approved_by             UUID,                                                            -- 승인자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column approved_by from SQL or add to model

---

**125. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES hrm.employees(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**126. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'purpose' exists in SQL but not in model
- **SQL**: `purpose                 TEXT,                                                            -- 구매 목적`
- **Model**: `N/A`
- **Fix**: Remove column purpose from SQL or add to model

---

**127. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'pr_code' exists in SQL but not in model
- **SQL**: `pr_code                 VARCHAR(50)              NOT NULL,                               -- 구매요청 코드`
- **Model**: `N/A`
- **Fix**: Remove column pr_code from SQL or add to model

---

**128. Table: `psm.purchase_requisitions`**

- **Issue**: Column 'required_date' exists in SQL but not in model
- **SQL**: `required_date           DATE,                                                            -- 필요 일자`
- **Model**: `N/A`
- **Fix**: Remove column required_date from SQL or add to model

---


### Schema: SRM (116 issues)


#### Extra SQL Column (116)

**1. Table: `srm.sales_returns`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 입고 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**2. Table: `srm.sales_returns`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**3. Table: `srm.sales_returns`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**4. Table: `srm.sales_returns`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**5. Table: `srm.sales_returns`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**6. Table: `srm.sales_returns`**

- **Issue**: Column 'reason_desc' exists in SQL but not in model
- **SQL**: `reason_desc             TEXT,                                                            -- 반품 사유 설명`
- **Model**: `N/A`
- **Fix**: Remove column reason_desc from SQL or add to model

---

**7. Table: `srm.sales_returns`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**8. Table: `srm.sales_returns`**

- **Issue**: Column 'reason_code' exists in SQL but not in model
- **SQL**: `reason_code             VARCHAR(20),                                                     -- 반품 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column reason_code from SQL or add to model

---

**9. Table: `srm.sales_returns`**

- **Issue**: Column 'return_type' exists in SQL but not in model
- **SQL**: `return_type             VARCHAR(20)              NOT NULL DEFAULT 'RETURN',              -- 반품 유형`
- **Model**: `N/A`
- **Fix**: Remove column return_type from SQL or add to model

---

**10. Table: `srm.sales_returns`**

- **Issue**: Column 'delivery_id' exists in SQL but not in model
- **SQL**: `delivery_id             UUID,                                                            -- 출고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column delivery_id from SQL or add to model

---

**11. Table: `srm.sales_returns`**

- **Issue**: Column 'return_code' exists in SQL but not in model
- **SQL**: `return_code             VARCHAR(50)              NOT NULL,                               -- 반품 코드`
- **Model**: `N/A`
- **Fix**: Remove column return_code from SQL or add to model

---

**12. Table: `srm.sales_returns`**

- **Issue**: Column 'return_date' exists in SQL but not in model
- **SQL**: `return_date             DATE,                                                            -- 실제 반품일`
- **Model**: `N/A`
- **Fix**: Remove column return_date from SQL or add to model

---

**13. Table: `srm.sales_returns`**

- **Issue**: Column 'invoice_id' exists in SQL but not in model
- **SQL**: `invoice_id              UUID,                                                            -- 송장 식별자`
- **Model**: `N/A`
- **Fix**: Remove column invoice_id from SQL or add to model

---

**14. Table: `srm.sales_returns`**

- **Issue**: Column 'so_id' exists in SQL but not in model
- **SQL**: `so_id                   UUID,                                                            -- 판매주문 식별자`
- **Model**: `N/A`
- **Fix**: Remove column so_id from SQL or add to model

---

**15. Table: `srm.sales_returns`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**16. Table: `srm.sales_returns`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**17. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**18. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'delivery_id' exists in SQL but not in model
- **SQL**: `delivery_id             UUID                     NOT NULL,                               -- 출고 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column delivery_id from SQL or add to model

---

**19. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**20. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'so_item_id' exists in SQL but not in model
- **SQL**: `so_item_id              UUID                     NOT NULL,                               -- 판매주문 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column so_item_id from SQL or add to model

---

**21. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 출고 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**22. Table: `srm.sales_delivery_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**23. Table: `srm.sales_deliveries`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 출고 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**24. Table: `srm.sales_deliveries`**

- **Issue**: Column 'tracking_no' exists in SQL but not in model
- **SQL**: `tracking_no             VARCHAR(100),                                                    -- 송장 번호`
- **Model**: `N/A`
- **Fix**: Remove column tracking_no from SQL or add to model

---

**25. Table: `srm.sales_deliveries`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**26. Table: `srm.sales_deliveries`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**27. Table: `srm.sales_deliveries`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**28. Table: `srm.sales_deliveries`**

- **Issue**: Column 'so_id' exists in SQL but not in model
- **SQL**: `so_id                   UUID                     NOT NULL,                               -- 판매주문 식별자`
- **Model**: `N/A`
- **Fix**: Remove column so_id from SQL or add to model

---

**29. Table: `srm.sales_deliveries`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**30. Table: `srm.sales_deliveries`**

- **Issue**: Column 'carrier' exists in SQL but not in model
- **SQL**: `carrier                 VARCHAR(100),                                                    -- 배송업체`
- **Model**: `N/A`
- **Fix**: Remove column carrier from SQL or add to model

---

**31. Table: `srm.sales_deliveries`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**32. Table: `srm.sales_deliveries`**

- **Issue**: Column 'delivery_date' exists in SQL but not in model
- **SQL**: `delivery_date           DATE,                                                            -- 실제 배송일`
- **Model**: `N/A`
- **Fix**: Remove column delivery_date from SQL or add to model

---

**33. Table: `srm.sales_deliveries`**

- **Issue**: Column 'shipping_address' exists in SQL but not in model
- **SQL**: `shipping_address        TEXT,                                                            -- 배송 주소`
- **Model**: `N/A`
- **Fix**: Remove column shipping_address from SQL or add to model

---

**34. Table: `srm.sales_deliveries`**

- **Issue**: Column 'shipping_contact' exists in SQL but not in model
- **SQL**: `shipping_contact        VARCHAR(100),                                                    -- 배송 연락처`
- **Model**: `N/A`
- **Fix**: Remove column shipping_contact from SQL or add to model

---

**35. Table: `srm.sales_deliveries`**

- **Issue**: Column 'delivery_code' exists in SQL but not in model
- **SQL**: `delivery_code           VARCHAR(50)              NOT NULL,                               -- 출고 코드`
- **Model**: `N/A`
- **Fix**: Remove column delivery_code from SQL or add to model

---

**36. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'tax_amount' exists in SQL but not in model
- **SQL**: `tax_amount              NUMERIC(18,4)            DEFAULT 0,                              -- 세액`
- **Model**: `N/A`
- **Fix**: Remove column tax_amount from SQL or add to model

---

**37. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**38. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 합계 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**39. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**40. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**41. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'tax_rate' exists in SQL but not in model
- **SQL**: `tax_rate                NUMERIC(5,2)             DEFAULT 10,                             -- 세율`
- **Model**: `N/A`
- **Fix**: Remove column tax_rate from SQL or add to model

---

**42. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'delivery_item_id' exists in SQL but not in model
- **SQL**: `delivery_item_id        UUID,                                                            -- 출고 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column delivery_item_id from SQL or add to model

---

**43. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 청구 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**44. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'invoice_id' exists in SQL but not in model
- **SQL**: `invoice_id              UUID                     NOT NULL,                               -- 송장 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column invoice_id from SQL or add to model

---

**45. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**46. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'subtotal' exists in SQL but not in model
- **SQL**: `subtotal                NUMERIC(18,4)            NOT NULL,                               -- 공급가액`
- **Model**: `N/A`
- **Fix**: Remove column subtotal from SQL or add to model

---

**47. Table: `srm.sales_invoice_items`**

- **Issue**: Column 'discount_rate' exists in SQL but not in model
- **SQL**: `discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율`
- **Model**: `N/A`
- **Fix**: Remove column discount_rate from SQL or add to model

---

**48. Table: `srm.sales_return_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**49. Table: `srm.sales_return_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**50. Table: `srm.sales_return_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**51. Table: `srm.sales_return_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**52. Table: `srm.sales_return_items`**

- **Issue**: Column 'delivery_item_id' exists in SQL but not in model
- **SQL**: `delivery_item_id        UUID,                                                            -- 출고 품목 식별자`
- **Model**: `N/A`
- **Fix**: Remove column delivery_item_id from SQL or add to model

---

**53. Table: `srm.sales_return_items`**

- **Issue**: Column 'reason_desc' exists in SQL but not in model
- **SQL**: `reason_desc             TEXT,                                                            -- 반품 사유 설명`
- **Model**: `N/A`
- **Fix**: Remove column reason_desc from SQL or add to model

---

**54. Table: `srm.sales_return_items`**

- **Issue**: Column 'return_id' exists in SQL but not in model
- **SQL**: `return_id               UUID                     NOT NULL,                               -- 반품 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column return_id from SQL or add to model

---

**55. Table: `srm.sales_return_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 반품 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**56. Table: `srm.sales_return_items`**

- **Issue**: Column 'reason_code' exists in SQL but not in model
- **SQL**: `reason_code             VARCHAR(20),                                                     -- 반품 사유 코드`
- **Model**: `N/A`
- **Fix**: Remove column reason_code from SQL or add to model

---

**57. Table: `srm.sales_return_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**58. Table: `srm.sales_return_items`**

- **Issue**: Column 'discount_rate' exists in SQL but not in model
- **SQL**: `discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율`
- **Model**: `N/A`
- **Fix**: Remove column discount_rate from SQL or add to model

---

**59. Table: `srm.quotation_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**60. Table: `srm.quotation_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**61. Table: `srm.quotation_items`**

- **Issue**: Column 'quote_id' exists in SQL but not in model
- **SQL**: `quote_id                UUID                     NOT NULL,                               -- 견적서 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column quote_id from SQL or add to model

---

**62. Table: `srm.quotation_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**63. Table: `srm.quotation_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**64. Table: `srm.quotation_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 견적 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**65. Table: `srm.quotation_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**66. Table: `srm.quotation_items`**

- **Issue**: Column 'discount_rate' exists in SQL but not in model
- **SQL**: `discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율`
- **Model**: `N/A`
- **Fix**: Remove column discount_rate from SQL or add to model

---

**67. Table: `srm.promotions`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**68. Table: `srm.promotions`**

- **Issue**: Column 'min_order_amount' exists in SQL but not in model
- **SQL**: `min_order_amount        NUMERIC(18,2),                                                   -- 최소 주문액`
- **Model**: `N/A`
- **Fix**: Remove column min_order_amount from SQL or add to model

---

**69. Table: `srm.promotions`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                           -- 활성 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**70. Table: `srm.promotions`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date              DATE                     NOT NULL,                               -- 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**71. Table: `srm.promotions`**

- **Issue**: Column 'promotion_code' exists in SQL but not in model
- **SQL**: `promotion_code          VARCHAR(50)              NOT NULL UNIQUE,                        -- 프로모션 코드`
- **Model**: `N/A`
- **Fix**: Remove column promotion_code from SQL or add to model

---

**72. Table: `srm.promotions`**

- **Issue**: Column 'promotion_name' exists in SQL but not in model
- **SQL**: `promotion_name          VARCHAR(200)             NOT NULL,                               -- 프로모션명`
- **Model**: `N/A`
- **Fix**: Remove column promotion_name from SQL or add to model

---

**73. Table: `srm.promotions`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  NOT NULL DEFAULT false,                 -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**74. Table: `srm.promotions`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID,                                                            -- 제품 식별자 (NULL이면 전체 상품 대상)`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**75. Table: `srm.promotions`**

- **Issue**: Column 'priority' exists in SQL but not in model
- **SQL**: `priority                INTEGER                  DEFAULT 0,                              -- 우선순위 (높을수록 높은 우선순위)`
- **Model**: `N/A`
- **Fix**: Remove column priority from SQL or add to model

---

**76. Table: `srm.promotions`**

- **Issue**: Column 'end_date' exists in SQL but not in model
- **SQL**: `end_date                DATE,                                                            -- 종료일 (NULL이면 무기한)`
- **Model**: `N/A`
- **Fix**: Remove column end_date from SQL or add to model

---

**77. Table: `srm.promotions`**

- **Issue**: Column 'discount_percent' exists in SQL but not in model
- **SQL**: `discount_percent        NUMERIC(5,2),                                                    -- 할인율 (%)`
- **Model**: `N/A`
- **Fix**: Remove column discount_percent from SQL or add to model

---

**78. Table: `srm.promotions`**

- **Issue**: Column 'promotion_type' exists in SQL but not in model
- **SQL**: `promotion_type          VARCHAR(30)              NOT NULL,                               -- 프로모션 유형`
- **Model**: `N/A`
- **Fix**: Remove column promotion_type from SQL or add to model

---

**79. Table: `srm.promotions`**

- **Issue**: Column 'max_discount_amount' exists in SQL but not in model
- **SQL**: `max_discount_amount     NUMERIC(18,2),                                                   -- 최대 할인액`
- **Model**: `N/A`
- **Fix**: Remove column max_discount_amount from SQL or add to model

---

**80. Table: `srm.promotions`**

- **Issue**: Column 'customer_segment_id' exists in SQL but not in model
- **SQL**: `customer_segment_id     UUID,                                                            -- 고객 세그먼트 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_segment_id from SQL or add to model

---

**81. Table: `srm.promotions`**

- **Issue**: Column 'discount_amount' exists in SQL but not in model
- **SQL**: `discount_amount         NUMERIC(18,2),                                                   -- 할인액`
- **Model**: `N/A`
- **Fix**: Remove column discount_amount from SQL or add to model

---

**82. Table: `srm.quotations`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**83. Table: `srm.quotations`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**84. Table: `srm.quotations`**

- **Issue**: Column 'valid_until' exists in SQL but not in model
- **SQL**: `valid_until             DATE,                                                            -- 유효기간 만료일`
- **Model**: `N/A`
- **Fix**: Remove column valid_until from SQL or add to model

---

**85. Table: `srm.quotations`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**86. Table: `srm.quotations`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**87. Table: `srm.quotations`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**88. Table: `srm.quotations`**

- **Issue**: Column 'sales_person_id' exists in SQL but not in model
- **SQL**: `sales_person_id         UUID,                                                            -- 영업 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_person_id from SQL or add to model

---

**89. Table: `srm.quotations`**

- **Issue**: Column 'quote_code' exists in SQL but not in model
- **SQL**: `quote_code              VARCHAR(50)              NOT NULL,                               -- 견적서 코드`
- **Model**: `N/A`
- **Fix**: Remove column quote_code from SQL or add to model

---

**90. Table: `srm.quotations`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**91. Table: `srm.sales_order_items`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 품목 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**92. Table: `srm.sales_order_items`**

- **Issue**: Column 'shipped_qty' exists in SQL but not in model
- **SQL**: `shipped_qty             INTEGER                  DEFAULT 0,                              -- 출고 완료 수량`
- **Model**: `N/A`
- **Fix**: Remove column shipped_qty from SQL or add to model

---

**93. Table: `srm.sales_order_items`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            NOT NULL,                               -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**94. Table: `srm.sales_order_items`**

- **Issue**: Column 'line_no' exists in SQL but not in model
- **SQL**: `line_no                 INTEGER                  NOT NULL,                               -- 라인 번호`
- **Model**: `N/A`
- **Fix**: Remove column line_no from SQL or add to model

---

**95. Table: `srm.sales_order_items`**

- **Issue**: Column 'unit_price' exists in SQL but not in model
- **SQL**: `unit_price              NUMERIC(18,4)            NOT NULL,                               -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_price from SQL or add to model

---

**96. Table: `srm.sales_order_items`**

- **Issue**: Column 'so_id' exists in SQL but not in model
- **SQL**: `so_id                   UUID                     NOT NULL,                               -- 판매주문 헤더 식별자`
- **Model**: `N/A`
- **Fix**: Remove column so_id from SQL or add to model

---

**97. Table: `srm.sales_order_items`**

- **Issue**: Column 'qty' exists in SQL but not in model
- **SQL**: `qty                     INTEGER                  NOT NULL,                               -- 주문 수량`
- **Model**: `N/A`
- **Fix**: Remove column qty from SQL or add to model

---

**98. Table: `srm.sales_order_items`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**99. Table: `srm.sales_order_items`**

- **Issue**: Column 'discount_rate' exists in SQL but not in model
- **SQL**: `discount_rate           NUMERIC(5,2)             DEFAULT 0,                              -- 할인율`
- **Model**: `N/A`
- **Fix**: Remove column discount_rate from SQL or add to model

---

**100. Table: `srm.sales_orders`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID,                                                            -- 출고 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**101. Table: `srm.sales_orders`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                          -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**102. Table: `srm.sales_orders`**

- **Issue**: Column 'total_amount' exists in SQL but not in model
- **SQL**: `total_amount            NUMERIC(18,4)            DEFAULT 0,                              -- 총 금액`
- **Model**: `N/A`
- **Fix**: Remove column total_amount from SQL or add to model

---

**103. Table: `srm.sales_orders`**

- **Issue**: Column 'so_code' exists in SQL but not in model
- **SQL**: `so_code                 VARCHAR(50)              NOT NULL,                               -- 판매주문 코드`
- **Model**: `N/A`
- **Fix**: Remove column so_code from SQL or add to model

---

**104. Table: `srm.sales_orders`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'DRAFT',                        -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**105. Table: `srm.sales_orders`**

- **Issue**: Column 'payment_terms' exists in SQL but not in model
- **SQL**: `payment_terms           VARCHAR(20),                                                     -- 결제 조건`
- **Model**: `N/A`
- **Fix**: Remove column payment_terms from SQL or add to model

---

**106. Table: `srm.sales_orders`**

- **Issue**: Column 'doc_date' exists in SQL but not in model
- **SQL**: `doc_date                DATE                     NOT NULL,                               -- 전표 일자`
- **Model**: `N/A`
- **Fix**: Remove column doc_date from SQL or add to model

---

**107. Table: `srm.sales_orders`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**108. Table: `srm.sales_orders`**

- **Issue**: Column 'delivery_date' exists in SQL but not in model
- **SQL**: `delivery_date           DATE,                                                            -- 납품 희망일`
- **Model**: `N/A`
- **Fix**: Remove column delivery_date from SQL or add to model

---

**109. Table: `srm.sales_orders`**

- **Issue**: Column 'sales_person_id' exists in SQL but not in model
- **SQL**: `sales_person_id         UUID,                                                            -- 영업 담당자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_person_id from SQL or add to model

---

**110. Table: `srm.sales_orders`**

- **Issue**: Column 'customer_id' exists in SQL but not in model
- **SQL**: `customer_id             UUID                     NOT NULL,                               -- 고객 식별자`
- **Model**: `N/A`
- **Fix**: Remove column customer_id from SQL or add to model

---

**111. Table: `srm.promotion_usage`**

- **Issue**: Column 'promotion_id' exists in SQL but not in model
- **SQL**: `promotion_id            UUID                     NOT NULL,                               -- 프로모션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column promotion_id from SQL or add to model

---

**112. Table: `srm.promotion_usage`**

- **Issue**: Column 'applied_at' exists in SQL but not in model
- **SQL**: `applied_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,    -- 적용 일시`
- **Model**: `N/A`
- **Fix**: Remove column applied_at from SQL or add to model

---

**113. Table: `srm.promotion_usage`**

- **Issue**: Column 'discount_applied' exists in SQL but not in model
- **SQL**: `discount_applied        NUMERIC(18,2)            NOT NULL,                               -- 적용된 할인액`
- **Model**: `N/A`
- **Fix**: Remove column discount_applied from SQL or add to model

---

**114. Table: `srm.promotion_usage`**

- **Issue**: Column 'sales_order_id' exists in SQL but not in model
- **SQL**: `sales_order_id          UUID                     NOT NULL,                               -- 판매주문 식별자`
- **Model**: `N/A`
- **Fix**: Remove column sales_order_id from SQL or add to model

---

**115. Table: `srm.promotion_usage`**

- **Issue**: Column 'sales_order_item_id' exists in SQL but not in model
- **SQL**: `sales_order_item_id     UUID,                                                            -- 판매주문 항목 식별자 (NULL이면 전체 주문)`
- **Model**: `N/A`
- **Fix**: Remove column sales_order_item_id from SQL or add to model

---

**116. Table: `srm.promotion_usage`**

- **Issue**: Column 'discount_percentage' exists in SQL but not in model
- **SQL**: `discount_percentage     NUMERIC(5,2),                                                    -- 적용된 할인율 (%)`
- **Model**: `N/A`
- **Fix**: Remove column discount_percentage from SQL or add to model

---


### Schema: SYS (38 issues)


#### Extra SQL Column (38)

**1. Table: `sys.role_permissions`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true                                        -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**2. Table: `sys.role_permissions`**

- **Issue**: Column 'permission_id' exists in SQL but not in model
- **SQL**: `permission_id           UUID                     NOT NULL,                                           -- 권한 ID`
- **Model**: `N/A`
- **Fix**: Remove column permission_id from SQL or add to model

---

**3. Table: `sys.role_permissions`**

- **Issue**: Column 'role_id' exists in SQL but not in model
- **SQL**: `role_id                 UUID                     NOT NULL,                                           -- 역할 ID`
- **Model**: `N/A`
- **Fix**: Remove column role_id from SQL or add to model

---

**4. Table: `sys.users`**

- **Issue**: Column 'last_login_at' exists in SQL but not in model
- **SQL**: `last_login_at           TIMESTAMP                WITH TIME ZONE,                                     -- 마지막 로그인 일시`
- **Model**: `N/A`
- **Fix**: Remove column last_login_at from SQL or add to model

---

**5. Table: `sys.users`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                                 -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**6. Table: `sys.users`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255)             NOT NULL,                                           -- 이메일 주소 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**7. Table: `sys.users`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**8. Table: `sys.users`**

- **Issue**: Column 'last_name' exists in SQL but not in model
- **SQL**: `last_name               VARCHAR(100),                                                                -- 성`
- **Model**: `N/A`
- **Fix**: Remove column last_name from SQL or add to model

---

**9. Table: `sys.users`**

- **Issue**: Column 'username' exists in SQL but not in model
- **SQL**: `username                VARCHAR(100)             NOT NULL,                                           -- 로그인 사용자명 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column username from SQL or add to model

---

**10. Table: `sys.users`**

- **Issue**: Column 'department_id' exists in SQL but not in model
- **SQL**: `department_id           UUID,                                                                        -- 소속 부서 ID`
- **Model**: `N/A`
- **Fix**: Remove column department_id from SQL or add to model

---

**11. Table: `sys.users`**

- **Issue**: Column 'user_code' exists in SQL but not in model
- **SQL**: `user_code               VARCHAR(50)              NOT NULL,                                           -- 사용자 코드 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column user_code from SQL or add to model

---

**12. Table: `sys.users`**

- **Issue**: Column 'role_id' exists in SQL but not in model
- **SQL**: `role_id                 UUID,                                                                        -- 역할 ID`
- **Model**: `N/A`
- **Fix**: Remove column role_id from SQL or add to model

---

**13. Table: `sys.users`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**14. Table: `sys.users`**

- **Issue**: Column 'position' exists in SQL but not in model
- **SQL**: `position                VARCHAR(100),                                                                -- 직급/직책`
- **Model**: `N/A`
- **Fix**: Remove column position from SQL or add to model

---

**15. Table: `sys.users`**

- **Issue**: Column 'first_name' exists in SQL but not in model
- **SQL**: `first_name              VARCHAR(100),                                                                -- 이름`
- **Model**: `N/A`
- **Fix**: Remove column first_name from SQL or add to model

---

**16. Table: `sys.users`**

- **Issue**: Column 'password_hash' exists in SQL but not in model
- **SQL**: `password_hash           VARCHAR(255)             NOT NULL,                                           -- 암호화된 비밀번호`
- **Model**: `N/A`
- **Fix**: Remove column password_hash from SQL or add to model

---

**17. Table: `sys.code_rules`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**18. Table: `sys.code_rules`**

- **Issue**: Column 'prefix' exists in SQL but not in model
- **SQL**: `prefix                  VARCHAR(3)               NOT NULL,                                           -- 코드 Prefix (3자리 영문 대문자, 예: MCO, MPT, MWH)`
- **Model**: `N/A`
- **Fix**: Remove column prefix from SQL or add to model

---

**19. Table: `sys.code_rules`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**20. Table: `sys.code_rules`**

- **Issue**: Column 'entity_name' exists in SQL but not in model
- **SQL**: `entity_name             VARCHAR(100)             NOT NULL,                                           -- 엔티티명 (예: 거래처, 제품, 창고)`
- **Model**: `N/A`
- **Fix**: Remove column entity_name from SQL or add to model

---

**21. Table: `sys.code_rules`**

- **Issue**: Column 'example_code' exists in SQL but not in model
- **SQL**: `example_code            VARCHAR(20),                                                                 -- 예시 코드 (자동 생성)`
- **Model**: `N/A`
- **Fix**: Remove column example_code from SQL or add to model

---

**22. Table: `sys.code_rules`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**23. Table: `sys.code_rules`**

- **Issue**: Column 'current_number' exists in SQL but not in model
- **SQL**: `current_number          INTEGER                  NOT NULL DEFAULT 0,                                 -- 현재 일련번호 (다음 발급될 번호)`
- **Model**: `N/A`
- **Fix**: Remove column current_number from SQL or add to model

---

**24. Table: `sys.code_rules`**

- **Issue**: Column 'entity_code' exists in SQL but not in model
- **SQL**: `entity_code             VARCHAR(50)              NOT NULL,                                           -- 엔티티 코드 (예: PARTNER, PRODUCT, WAREHOUSE)`
- **Model**: `N/A`
- **Fix**: Remove column entity_code from SQL or add to model

---

**25. Table: `sys.code_rules`**

- **Issue**: Column 'digit_length' exists in SQL but not in model
- **SQL**: `digit_length            SMALLINT                 NOT NULL DEFAULT 4,                                 -- 일련번호 자릿수 (2-10)`
- **Model**: `N/A`
- **Fix**: Remove column digit_length from SQL or add to model

---

**26. Table: `sys.roles`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 역할 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**27. Table: `sys.roles`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**28. Table: `sys.roles`**

- **Issue**: Column 'role_code' exists in SQL but not in model
- **SQL**: `role_code               VARCHAR(50)              NOT NULL,                                           -- 역할 코드 (테넌트 내 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column role_code from SQL or add to model

---

**29. Table: `sys.roles`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                                      -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**30. Table: `sys.roles`**

- **Issue**: Column 'is_system_role' exists in SQL but not in model
- **SQL**: `is_system_role          BOOLEAN                  DEFAULT false,                                      -- 시스템 기본 역할 여부 (삭제 불가)`
- **Model**: `N/A`
- **Fix**: Remove column is_system_role from SQL or add to model

---

**31. Table: `sys.roles`**

- **Issue**: Column 'role_name' exists in SQL but not in model
- **SQL**: `role_name               VARCHAR(100)             NOT NULL,                                           -- 역할명`
- **Model**: `N/A`
- **Fix**: Remove column role_name from SQL or add to model

---

**32. Table: `sys.permissions`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                                        -- 권한 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**33. Table: `sys.permissions`**

- **Issue**: Column 'module_code' exists in SQL but not in model
- **SQL**: `module_code             VARCHAR(50)              NOT NULL,                                           -- 모듈 코드 (ADM, PSM, SRM 등)`
- **Model**: `N/A`
- **Fix**: Remove column module_code from SQL or add to model

---

**34. Table: `sys.permissions`**

- **Issue**: Column 'is_active' exists in SQL but not in model
- **SQL**: `is_active               BOOLEAN                  DEFAULT true,                                       -- 활성 상태`
- **Model**: `N/A`
- **Fix**: Remove column is_active from SQL or add to model

---

**35. Table: `sys.permissions`**

- **Issue**: Column 'resource' exists in SQL but not in model
- **SQL**: `resource                VARCHAR(100)             NOT NULL,                                           -- 리소스명 (테이블명 또는 기능명)`
- **Model**: `N/A`
- **Fix**: Remove column resource from SQL or add to model

---

**36. Table: `sys.permissions`**

- **Issue**: Column 'permission_code' exists in SQL but not in model
- **SQL**: `permission_code         VARCHAR(100)             NOT NULL,                                           -- 권한 코드 (전체 시스템 유니크)`
- **Model**: `N/A`
- **Fix**: Remove column permission_code from SQL or add to model

---

**37. Table: `sys.permissions`**

- **Issue**: Column 'permission_name' exists in SQL but not in model
- **SQL**: `permission_name         VARCHAR(200)             NOT NULL,                                           -- 권한명`
- **Model**: `N/A`
- **Fix**: Remove column permission_name from SQL or add to model

---

**38. Table: `sys.permissions`**

- **Issue**: Column 'action' exists in SQL but not in model
- **SQL**: `action                  VARCHAR(50)              NOT NULL,                                           -- 액션 (CREATE, READ, UPDATE, DELETE, APPROVE 등)`
- **Model**: `N/A`
- **Fix**: Remove column action from SQL or add to model

---


### Schema: WMS (110 issues)


#### Extra SQL Column (110)

**1. Table: `wms.warehouses`**

- **Issue**: Column 'storage_cost' exists in SQL but not in model
- **SQL**: `storage_cost            NUMERIC(18,4),                                                  -- 단위당 보관비`
- **Model**: `N/A`
- **Fix**: Remove column storage_cost from SQL or add to model

---

**2. Table: `wms.warehouses`**

- **Issue**: Column 'name' exists in SQL but not in model
- **SQL**: `name                    VARCHAR(100)             NOT NULL,                              -- 창고명`
- **Model**: `N/A`
- **Fix**: Remove column name from SQL or add to model

---

**3. Table: `wms.warehouses`**

- **Issue**: Column 'monthly_rent' exists in SQL but not in model
- **SQL**: `monthly_rent            NUMERIC(18,4),                                                  -- 월 임대료`
- **Model**: `N/A`
- **Fix**: Remove column monthly_rent from SQL or add to model

---

**4. Table: `wms.warehouses`**

- **Issue**: Column 'currency' exists in SQL but not in model
- **SQL**: `currency                VARCHAR(3)               DEFAULT 'KRW',                         -- 통화`
- **Model**: `N/A`
- **Fix**: Remove column currency from SQL or add to model

---

**5. Table: `wms.warehouses`**

- **Issue**: Column 'contract_close_date' exists in SQL but not in model
- **SQL**: `contract_close_date     DATE,                                                           -- 계약 종료일`
- **Model**: `N/A`
- **Fix**: Remove column contract_close_date from SQL or add to model

---

**6. Table: `wms.warehouses`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**7. Table: `wms.warehouses`**

- **Issue**: Column 'has_dock' exists in SQL but not in model
- **SQL**: `has_dock                BOOLEAN                  DEFAULT false,                         -- 도크 보유 여부`
- **Model**: `N/A`
- **Fix**: Remove column has_dock from SQL or add to model

---

**8. Table: `wms.warehouses`**

- **Issue**: Column 'city' exists in SQL but not in model
- **SQL**: `city                    VARCHAR(100),                                                   -- 도시`
- **Model**: `N/A`
- **Fix**: Remove column city from SQL or add to model

---

**9. Table: `wms.warehouses`**

- **Issue**: Column 'type' exists in SQL but not in model
- **SQL**: `type                    VARCHAR(20)              NOT NULL,                              -- 창고 유형`
- **Model**: `N/A`
- **Fix**: Remove column type from SQL or add to model

---

**10. Table: `wms.warehouses`**

- **Issue**: Column 'country_code' exists in SQL but not in model
- **SQL**: `country_code            VARCHAR(3)               DEFAULT 'KOR',                         -- 국가 코드`
- **Model**: `N/A`
- **Fix**: Remove column country_code from SQL or add to model

---

**11. Table: `wms.warehouses`**

- **Issue**: Column 'max_weight' exists in SQL but not in model
- **SQL**: `max_weight              NUMERIC(12,2),                                                  -- 최대 중량 (kg)`
- **Model**: `N/A`
- **Fix**: Remove column max_weight from SQL or add to model

---

**12. Table: `wms.warehouses`**

- **Issue**: Column 'state_province' exists in SQL but not in model
- **SQL**: `state_province          VARCHAR(100),                                                   -- 주/도`
- **Model**: `N/A`
- **Fix**: Remove column state_province from SQL or add to model

---

**13. Table: `wms.warehouses`**

- **Issue**: Column 'manager_id' exists in SQL but not in model
- **SQL**: `manager_id              UUID,                                                           -- 창고 관리자 식별자`
- **Model**: `N/A`
- **Fix**: Remove column manager_id from SQL or add to model

---

**14. Table: `wms.warehouses`**

- **Issue**: Column 'fax' exists in SQL but not in model
- **SQL**: `fax                     VARCHAR(50),                                                    -- 팩스번호`
- **Model**: `N/A`
- **Fix**: Remove column fax from SQL or add to model

---

**15. Table: `wms.warehouses`**

- **Issue**: Column 'external_provider' exists in SQL but not in model
- **SQL**: `external_provider       VARCHAR(100),                                                   -- 외부 업체명 (3PL 등)`
- **Model**: `N/A`
- **Fix**: Remove column external_provider from SQL or add to model

---

**16. Table: `wms.warehouses`**

- **Issue**: Column 'postcode' exists in SQL but not in model
- **SQL**: `postcode                VARCHAR(20),                                                    -- 우편번호`
- **Model**: `N/A`
- **Fix**: Remove column postcode from SQL or add to model

---

**17. Table: `wms.warehouses`**

- **Issue**: Column 'operating_hours' exists in SQL but not in model
- **SQL**: `operating_hours         VARCHAR(100),                                                   -- 운영 시간`
- **Model**: `N/A`
- **Fix**: Remove column operating_hours from SQL or add to model

---

**18. Table: `wms.warehouses`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                           -- 창고 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**19. Table: `wms.warehouses`**

- **Issue**: Column 'has_freezer' exists in SQL but not in model
- **SQL**: `has_freezer             BOOLEAN                  DEFAULT false,                         -- 냉동 시설 여부`
- **Model**: `N/A`
- **Fix**: Remove column has_freezer from SQL or add to model

---

**20. Table: `wms.warehouses`**

- **Issue**: Column 'email' exists in SQL but not in model
- **SQL**: `email                   VARCHAR(255),                                                   -- 이메일`
- **Model**: `N/A`
- **Fix**: Remove column email from SQL or add to model

---

**21. Table: `wms.warehouses`**

- **Issue**: Column 'has_crane' exists in SQL but not in model
- **SQL**: `has_crane               BOOLEAN                  DEFAULT false,                         -- 크레인 보유 여부`
- **Model**: `N/A`
- **Fix**: Remove column has_crane from SQL or add to model

---

**22. Table: `wms.warehouses`**

- **Issue**: Column 'has_cold_storage' exists in SQL but not in model
- **SQL**: `has_cold_storage        BOOLEAN                  DEFAULT false,                         -- 냉장 시설 여부`
- **Model**: `N/A`
- **Fix**: Remove column has_cold_storage from SQL or add to model

---

**23. Table: `wms.warehouses`**

- **Issue**: Column 'is_primary' exists in SQL but not in model
- **SQL**: `is_primary              BOOLEAN                  DEFAULT false,                         -- 본창고 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_primary from SQL or add to model

---

**24. Table: `wms.warehouses`**

- **Issue**: Column 'address1' exists in SQL but not in model
- **SQL**: `address1                VARCHAR(200),                                                   -- 기본 주소`
- **Model**: `N/A`
- **Fix**: Remove column address1 from SQL or add to model

---

**25. Table: `wms.warehouses`**

- **Issue**: Column 'capacity_volume' exists in SQL but not in model
- **SQL**: `capacity_volume         NUMERIC(12,2),                                                  -- 용적 (세제곱미터)`
- **Model**: `N/A`
- **Fix**: Remove column capacity_volume from SQL or add to model

---

**26. Table: `wms.warehouses`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                           -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**27. Table: `wms.warehouses`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**28. Table: `wms.warehouses`**

- **Issue**: Column 'address2' exists in SQL but not in model
- **SQL**: `address2                VARCHAR(200),                                                   -- 상세 주소`
- **Model**: `N/A`
- **Fix**: Remove column address2 from SQL or add to model

---

**29. Table: `wms.warehouses`**

- **Issue**: Column 'contract_start_date' exists in SQL but not in model
- **SQL**: `contract_start_date     DATE,                                                           -- 계약 시작일`
- **Model**: `N/A`
- **Fix**: Remove column contract_start_date from SQL or add to model

---

**30. Table: `wms.warehouses`**

- **Issue**: Column 'is_external' exists in SQL but not in model
- **SQL**: `is_external             BOOLEAN                  DEFAULT false,                         -- 외부창고 여부 (3PL 등)`
- **Model**: `N/A`
- **Fix**: Remove column is_external from SQL or add to model

---

**31. Table: `wms.warehouses`**

- **Issue**: Column 'phone' exists in SQL but not in model
- **SQL**: `phone                   VARCHAR(50),                                                    -- 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column phone from SQL or add to model

---

**32. Table: `wms.warehouses`**

- **Issue**: Column 'building_name' exists in SQL but not in model
- **SQL**: `building_name           VARCHAR(200),                                                   -- 건물명`
- **Model**: `N/A`
- **Fix**: Remove column building_name from SQL or add to model

---

**33. Table: `wms.warehouses`**

- **Issue**: Column 'capacity_sqm' exists in SQL but not in model
- **SQL**: `capacity_sqm            NUMERIC(12,2),                                                  -- 면적 (제곱미터)`
- **Model**: `N/A`
- **Fix**: Remove column capacity_sqm from SQL or add to model

---

**34. Table: `wms.warehouses`**

- **Issue**: Column 'code' exists in SQL but not in model
- **SQL**: `code                    VARCHAR(20)              NOT NULL,                              -- 창고 코드`
- **Model**: `N/A`
- **Fix**: Remove column code from SQL or add to model

---

**35. Table: `wms.inventory`**

- **Issue**: Column 'location_id' exists in SQL but not in model
- **SQL**: `location_id             UUID,                                                            -- 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column location_id from SQL or add to model

---

**36. Table: `wms.inventory`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description             TEXT,                                                            -- 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**37. Table: `wms.inventory`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id            UUID                     NOT NULL,                               -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**38. Table: `wms.inventory`**

- **Issue**: Column 'quantity_available' exists in SQL but not in model
- **SQL**: `quantity_available      NUMERIC(18,2)            GENERATED ALWAYS AS (quantity_on_hand - quantity_allocated) STORED, -- 가용 수량`
- **Model**: `N/A`
- **Fix**: Remove column quantity_available from SQL or add to model

---

**39. Table: `wms.inventory`**

- **Issue**: Column 'manufactured_date' exists in SQL but not in model
- **SQL**: `manufactured_date       DATE,                                                            -- 제조 일자`
- **Model**: `N/A`
- **Fix**: Remove column manufactured_date from SQL or add to model

---

**40. Table: `wms.inventory`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status                  VARCHAR(20)              DEFAULT 'ACTIVE',                       -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**41. Table: `wms.inventory`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes                   TEXT,                                                            -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**42. Table: `wms.inventory`**

- **Issue**: Column 'received_date' exists in SQL but not in model
- **SQL**: `received_date           DATE,                                                            -- 입고 일자`
- **Model**: `N/A`
- **Fix**: Remove column received_date from SQL or add to model

---

**43. Table: `wms.inventory`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted              BOOLEAN                  DEFAULT false,                          -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**44. Table: `wms.inventory`**

- **Issue**: Column 'quality_status' exists in SQL but not in model
- **SQL**: `quality_status          VARCHAR(20)              DEFAULT 'GOOD',                         -- 품질 상태`
- **Model**: `N/A`
- **Fix**: Remove column quality_status from SQL or add to model

---

**45. Table: `wms.inventory`**

- **Issue**: Column 'expiry_date' exists in SQL but not in model
- **SQL**: `expiry_date             DATE,                                                            -- 유효 기한`
- **Model**: `N/A`
- **Fix**: Remove column expiry_date from SQL or add to model

---

**46. Table: `wms.inventory`**

- **Issue**: Column 'unit_cost' exists in SQL but not in model
- **SQL**: `unit_cost               NUMERIC(18,4),                                                   -- 단가`
- **Model**: `N/A`
- **Fix**: Remove column unit_cost from SQL or add to model

---

**47. Table: `wms.inventory`**

- **Issue**: Column 'quantity_on_hand' exists in SQL but not in model
- **SQL**: `quantity_on_hand        NUMERIC(18,2)            DEFAULT 0,                              -- 재고 수량`
- **Model**: `N/A`
- **Fix**: Remove column quantity_on_hand from SQL or add to model

---

**48. Table: `wms.inventory`**

- **Issue**: Column 'quantity_allocated' exists in SQL but not in model
- **SQL**: `quantity_allocated      NUMERIC(18,2)            DEFAULT 0,                              -- 할당 수량 (예약)`
- **Model**: `N/A`
- **Fix**: Remove column quantity_allocated from SQL or add to model

---

**49. Table: `wms.inventory`**

- **Issue**: Column 'lot_number' exists in SQL but not in model
- **SQL**: `lot_number              VARCHAR(100),                                                    -- 로트 번호`
- **Model**: `N/A`
- **Fix**: Remove column lot_number from SQL or add to model

---

**50. Table: `wms.inventory`**

- **Issue**: Column 'serial_number' exists in SQL but not in model
- **SQL**: `serial_number           VARCHAR(100),                                                    -- 시리얼 번호`
- **Model**: `N/A`
- **Fix**: Remove column serial_number from SQL or add to model

---

**51. Table: `wms.inventory`**

- **Issue**: Column 'product_id' exists in SQL but not in model
- **SQL**: `product_id              UUID                     NOT NULL,                               -- 제품 식별자`
- **Model**: `N/A`
- **Fix**: Remove column product_id from SQL or add to model

---

**52. Table: `wms.warehouse_locations`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**53. Table: `wms.warehouse_locations`**

- **Issue**: Column 'sort_order' exists in SQL but not in model
- **SQL**: `sort_order          INTEGER                  DEFAULT 0,                             -- 정렬 순서`
- **Model**: `N/A`
- **Fix**: Remove column sort_order from SQL or add to model

---

**54. Table: `wms.warehouse_locations`**

- **Issue**: Column 'zone_code' exists in SQL but not in model
- **SQL**: `zone_code           VARCHAR(20),                                                    -- 구역 코드`
- **Model**: `N/A`
- **Fix**: Remove column zone_code from SQL or add to model

---

**55. Table: `wms.warehouse_locations`**

- **Issue**: Column 'location_type' exists in SQL but not in model
- **SQL**: `location_type       VARCHAR(20)              DEFAULT 'BIN',                         -- 로케이션 유형`
- **Model**: `N/A`
- **Fix**: Remove column location_type from SQL or add to model

---

**56. Table: `wms.warehouse_locations`**

- **Issue**: Column 'ON' exists in SQL but not in model
- **SQL**: `ON DELETE CASCADE`
- **Model**: `N/A`
- **Fix**: Remove column ON from SQL or add to model

---

**57. Table: `wms.warehouse_locations`**

- **Issue**: Column 'rack_code' exists in SQL but not in model
- **SQL**: `rack_code           VARCHAR(20),                                                    -- 랙 코드`
- **Model**: `N/A`
- **Fix**: Remove column rack_code from SQL or add to model

---

**58. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_pickable' exists in SQL but not in model
- **SQL**: `is_pickable         BOOLEAN                  DEFAULT true,                          -- 피킹 가능 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_pickable from SQL or add to model

---

**59. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_virtual' exists in SQL but not in model
- **SQL**: `is_virtual          BOOLEAN                  DEFAULT false,                         -- 가상 로케이션 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_virtual from SQL or add to model

---

**60. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**61. Table: `wms.warehouse_locations`**

- **Issue**: Column 'depth_cm' exists in SQL but not in model
- **SQL**: `depth_cm            NUMERIC(8,2),                                                   -- 깊이 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column depth_cm from SQL or add to model

---

**62. Table: `wms.warehouse_locations`**

- **Issue**: Column 'parent_id' exists in SQL but not in model
- **SQL**: `parent_id           UUID,                                                           -- 상위 로케이션 식별자`
- **Model**: `N/A`
- **Fix**: Remove column parent_id from SQL or add to model

---

**63. Table: `wms.warehouse_locations`**

- **Issue**: Column 'x_coordinate' exists in SQL but not in model
- **SQL**: `x_coordinate        NUMERIC(10,2),                                                  -- X 좌표`
- **Model**: `N/A`
- **Fix**: Remove column x_coordinate from SQL or add to model

---

**64. Table: `wms.warehouse_locations`**

- **Issue**: Column 'z_coordinate' exists in SQL but not in model
- **SQL**: `z_coordinate        NUMERIC(10,2),                                                  -- Z 좌표 (높이)`
- **Model**: `N/A`
- **Fix**: Remove column z_coordinate from SQL or add to model

---

**65. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_quarantine' exists in SQL but not in model
- **SQL**: `is_quarantine       BOOLEAN                  DEFAULT false,                         -- 격리 구역 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_quarantine from SQL or add to model

---

**66. Table: `wms.warehouse_locations`**

- **Issue**: Column 'humidity_min' exists in SQL but not in model
- **SQL**: `humidity_min        NUMERIC(5,2),                                                   -- 최저 습도 (%)`
- **Model**: `N/A`
- **Fix**: Remove column humidity_min from SQL or add to model

---

**67. Table: `wms.warehouse_locations`**

- **Issue**: Column 'aisle_code' exists in SQL but not in model
- **SQL**: `aisle_code          VARCHAR(20),                                                    -- 통로 코드`
- **Model**: `N/A`
- **Fix**: Remove column aisle_code from SQL or add to model

---

**68. Table: `wms.warehouse_locations`**

- **Issue**: Column 'rfid_tag' exists in SQL but not in model
- **SQL**: `rfid_tag            VARCHAR(100),                                                   -- RFID 태그`
- **Model**: `N/A`
- **Fix**: Remove column rfid_tag from SQL or add to model

---

**69. Table: `wms.warehouse_locations`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES wms.warehouse_locations(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**70. Table: `wms.warehouse_locations`**

- **Issue**: Column 'humidity_max' exists in SQL but not in model
- **SQL**: `humidity_max        NUMERIC(5,2),                                                   -- 최고 습도 (%)`
- **Model**: `N/A`
- **Fix**: Remove column humidity_max from SQL or add to model

---

**71. Table: `wms.warehouse_locations`**

- **Issue**: Column 'location_name' exists in SQL but not in model
- **SQL**: `location_name       VARCHAR(100)             NOT NULL,                              -- 로케이션명`
- **Model**: `N/A`
- **Fix**: Remove column location_name from SQL or add to model

---

**72. Table: `wms.warehouse_locations`**

- **Issue**: Column 'description' exists in SQL but not in model
- **SQL**: `description         TEXT,                                                           -- 로케이션 설명`
- **Model**: `N/A`
- **Fix**: Remove column description from SQL or add to model

---

**73. Table: `wms.warehouse_locations`**

- **Issue**: Column 'full_path' exists in SQL but not in model
- **SQL**: `full_path           VARCHAR(500),                                                   -- 전체 경로 (예: ZONE-A/AISLE-01/RACK-001/BIN-A001)`
- **Model**: `N/A`
- **Fix**: Remove column full_path from SQL or add to model

---

**74. Table: `wms.warehouse_locations`**

- **Issue**: Column 'capacity_volume' exists in SQL but not in model
- **SQL**: `capacity_volume     NUMERIC(12,2),                                                  -- 부피 용량 (㎥)`
- **Model**: `N/A`
- **Fix**: Remove column capacity_volume from SQL or add to model

---

**75. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_receivable' exists in SQL but not in model
- **SQL**: `is_receivable       BOOLEAN                  DEFAULT true,                          -- 입고 가능 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_receivable from SQL or add to model

---

**76. Table: `wms.warehouse_locations`**

- **Issue**: Column 'is_damaged_area' exists in SQL but not in model
- **SQL**: `is_damaged_area     BOOLEAN                  DEFAULT false,                         -- 불량품 구역 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_damaged_area from SQL or add to model

---

**77. Table: `wms.warehouse_locations`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes               TEXT,                                                           -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**78. Table: `wms.warehouse_locations`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**79. Table: `wms.warehouse_locations`**

- **Issue**: Column 'capacity_weight' exists in SQL but not in model
- **SQL**: `capacity_weight     NUMERIC(12,2),                                                  -- 중량 용량 (kg)`
- **Model**: `N/A`
- **Fix**: Remove column capacity_weight from SQL or add to model

---

**80. Table: `wms.warehouse_locations`**

- **Issue**: Column 'y_coordinate' exists in SQL but not in model
- **SQL**: `y_coordinate        NUMERIC(10,2),                                                  -- Y 좌표`
- **Model**: `N/A`
- **Fix**: Remove column y_coordinate from SQL or add to model

---

**81. Table: `wms.warehouse_locations`**

- **Issue**: Column 'bin_code' exists in SQL but not in model
- **SQL**: `bin_code            VARCHAR(20),                                                    -- 빈 코드`
- **Model**: `N/A`
- **Fix**: Remove column bin_code from SQL or add to model

---

**82. Table: `wms.warehouse_locations`**

- **Issue**: Column 'barcode' exists in SQL but not in model
- **SQL**: `barcode             VARCHAR(100),                                                   -- 바코드`
- **Model**: `N/A`
- **Fix**: Remove column barcode from SQL or add to model

---

**83. Table: `wms.warehouse_locations`**

- **Issue**: Column 'location_code' exists in SQL but not in model
- **SQL**: `location_code       VARCHAR(50)              NOT NULL,                              -- 로케이션 코드`
- **Model**: `N/A`
- **Fix**: Remove column location_code from SQL or add to model

---

**84. Table: `wms.warehouse_locations`**

- **Issue**: Column 'height_cm' exists in SQL but not in model
- **SQL**: `height_cm           NUMERIC(8,2),                                                   -- 세로 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column height_cm from SQL or add to model

---

**85. Table: `wms.warehouse_locations`**

- **Issue**: Column 'capacity_units' exists in SQL but not in model
- **SQL**: `capacity_units      INTEGER,                                                        -- 단위 용량 (개수)`
- **Model**: `N/A`
- **Fix**: Remove column capacity_units from SQL or add to model

---

**86. Table: `wms.warehouse_locations`**

- **Issue**: Column 'picking_priority' exists in SQL but not in model
- **SQL**: `picking_priority    INTEGER                  DEFAULT 0,                             -- 피킹 우선순위`
- **Model**: `N/A`
- **Fix**: Remove column picking_priority from SQL or add to model

---

**87. Table: `wms.warehouse_locations`**

- **Issue**: Column 'width_cm' exists in SQL but not in model
- **SQL**: `width_cm            NUMERIC(8,2),                                                   -- 가로 (cm)`
- **Model**: `N/A`
- **Fix**: Remove column width_cm from SQL or add to model

---

**88. Table: `wms.warehouse_locations`**

- **Issue**: Column 'level_depth' exists in SQL but not in model
- **SQL**: `level_depth         INTEGER                  DEFAULT 1,                             -- 계층 깊이`
- **Model**: `N/A`
- **Fix**: Remove column level_depth from SQL or add to model

---

**89. Table: `wms.warehouse_locations`**

- **Issue**: Column 'temperature_min' exists in SQL but not in model
- **SQL**: `temperature_min     NUMERIC(5,2),                                                   -- 최저 온도 (℃)`
- **Model**: `N/A`
- **Fix**: Remove column temperature_min from SQL or add to model

---

**90. Table: `wms.warehouse_locations`**

- **Issue**: Column 'temperature_max' exists in SQL but not in model
- **SQL**: `temperature_max     NUMERIC(5,2),                                                   -- 최고 온도 (℃)`
- **Model**: `N/A`
- **Fix**: Remove column temperature_max from SQL or add to model

---

**91. Table: `wms.warehouse_employees`**

- **Issue**: Column 'notify_phone' exists in SQL but not in model
- **SQL**: `notify_phone        VARCHAR(50),                                                    -- 알림용 전화번호`
- **Model**: `N/A`
- **Fix**: Remove column notify_phone from SQL or add to model

---

**92. Table: `wms.warehouse_employees`**

- **Issue**: Column 'warehouse_id' exists in SQL but not in model
- **SQL**: `warehouse_id        UUID                     NOT NULL,                              -- 창고 식별자`
- **Model**: `N/A`
- **Fix**: Remove column warehouse_id from SQL or add to model

---

**93. Table: `wms.warehouse_employees`**

- **Issue**: Column 'role_type' exists in SQL but not in model
- **SQL**: `role_type           VARCHAR(20)              DEFAULT 'OPERATOR',                    -- 역할 유형`
- **Model**: `N/A`
- **Fix**: Remove column role_type from SQL or add to model

---

**94. Table: `wms.warehouse_employees`**

- **Issue**: Column 'access_level' exists in SQL but not in model
- **SQL**: `access_level        VARCHAR(20)              DEFAULT 'READ_write',                  -- 접근 권한`
- **Model**: `N/A`
- **Fix**: Remove column access_level from SQL or add to model

---

**95. Table: `wms.warehouse_employees`**

- **Issue**: Column 'is_primary' exists in SQL but not in model
- **SQL**: `is_primary          BOOLEAN                  DEFAULT false,                         -- 주담당자 여부`
- **Model**: `N/A`
- **Fix**: Remove column is_primary from SQL or add to model

---

**96. Table: `wms.warehouse_employees`**

- **Issue**: Column 'status' exists in SQL but not in model
- **SQL**: `status              VARCHAR(20)              DEFAULT 'ACTIVE',                      -- 상태`
- **Model**: `N/A`
- **Fix**: Remove column status from SQL or add to model

---

**97. Table: `wms.warehouse_employees`**

- **Issue**: Column 'notes' exists in SQL but not in model
- **SQL**: `notes               TEXT,                                                           -- 비고`
- **Model**: `N/A`
- **Fix**: Remove column notes from SQL or add to model

---

**98. Table: `wms.warehouse_employees`**

- **Issue**: Column 'should_notify_emergency' exists in SQL but not in model
- **SQL**: `should_notify_emergency    BOOLEAN                  DEFAULT true,                          -- 긴급상황 알림 여부`
- **Model**: `N/A`
- **Fix**: Remove column should_notify_emergency from SQL or add to model

---

**99. Table: `wms.warehouse_employees`**

- **Issue**: Column 'start_date' exists in SQL but not in model
- **SQL**: `start_date          DATE,                                                           -- 배정 시작일`
- **Model**: `N/A`
- **Fix**: Remove column start_date from SQL or add to model

---

**100. Table: `wms.warehouse_employees`**

- **Issue**: Column 'employee_id' exists in SQL but not in model
- **SQL**: `employee_id         UUID                     NOT NULL,                              -- 사원 식별자`
- **Model**: `N/A`
- **Fix**: Remove column employee_id from SQL or add to model

---

**101. Table: `wms.warehouse_employees`**

- **Issue**: Column 'is_deleted' exists in SQL but not in model
- **SQL**: `is_deleted          BOOLEAN                  DEFAULT false,                         -- 논리 삭제 플래그`
- **Model**: `N/A`
- **Fix**: Remove column is_deleted from SQL or add to model

---

**102. Table: `wms.warehouse_employees`**

- **Issue**: Column 'should_notify_receipt' exists in SQL but not in model
- **SQL**: `should_notify_receipt      BOOLEAN                  DEFAULT true,                          -- 입고 알림 여부`
- **Model**: `N/A`
- **Fix**: Remove column should_notify_receipt from SQL or add to model

---

**103. Table: `wms.warehouse_employees`**

- **Issue**: Column 'should_notify_shipment' exists in SQL but not in model
- **SQL**: `should_notify_shipment     BOOLEAN                  DEFAULT true,                          -- 출고 알림 여부`
- **Model**: `N/A`
- **Fix**: Remove column should_notify_shipment from SQL or add to model

---

**104. Table: `wms.warehouse_employees`**

- **Issue**: Column 'notify_email' exists in SQL but not in model
- **SQL**: `notify_email        VARCHAR(255),                                                   -- 알림용 이메일`
- **Model**: `N/A`
- **Fix**: Remove column notify_email from SQL or add to model

---

**105. Table: `wms.warehouse_employees`**

- **Issue**: Column 'work_shift' exists in SQL but not in model
- **SQL**: `work_shift          VARCHAR(20),                                                    -- 근무 시간대`
- **Model**: `N/A`
- **Fix**: Remove column work_shift from SQL or add to model

---

**106. Table: `wms.warehouse_employees`**

- **Issue**: Column 'should_notify_adjust' exists in SQL but not in model
- **SQL**: `should_notify_adjust       BOOLEAN                  DEFAULT false,                         -- 재고조정 알림 여부`
- **Model**: `N/A`
- **Fix**: Remove column should_notify_adjust from SQL or add to model

---

**107. Table: `wms.warehouse_employees`**

- **Issue**: Column 'notify_method' exists in SQL but not in model
- **SQL**: `notify_method       VARCHAR(20)              DEFAULT 'EMAIL',                       -- 알림 방법`
- **Model**: `N/A`
- **Fix**: Remove column notify_method from SQL or add to model

---

**108. Table: `wms.warehouse_employees`**

- **Issue**: Column 'close_date' exists in SQL but not in model
- **SQL**: `close_date          DATE,                                                           -- 배정 종료일`
- **Model**: `N/A`
- **Fix**: Remove column close_date from SQL or add to model

---

**109. Table: `wms.warehouse_employees`**

- **Issue**: Column 'REFERENCES' exists in SQL but not in model
- **SQL**: `REFERENCES wms.employees(id)`
- **Model**: `N/A`
- **Fix**: Remove column REFERENCES from SQL or add to model

---

**110. Table: `wms.warehouse_employees`**

- **Issue**: Column 'should_notify_cancel' exists in SQL but not in model
- **SQL**: `should_notify_cancel       BOOLEAN                  DEFAULT true,                          -- 취소 알림 여부`
- **Model**: `N/A`
- **Fix**: Remove column should_notify_cancel from SQL or add to model

---


## MINOR Issues (240)


### Schema: ADM (13 issues)


#### Extra SQL Column (13)

**1. Table: `adm.currencies`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `adm.currencies`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `adm.code_groups`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `adm.code_groups`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `adm.units`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `adm.units`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `adm.payment_terms`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**8. Table: `adm.exchange_rates`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID (추가)`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**9. Table: `adm.exchange_rates`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**10. Table: `adm.settings`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**11. Table: `adm.settings`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**12. Table: `adm.codes`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**13. Table: `adm.codes`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: APM (7 issues)


#### Extra SQL Column (7)

**1. Table: `apm.approval_lines`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `apm.approval_lines`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `apm.approval_histories`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**4. Table: `apm.approval_line_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**5. Table: `apm.approval_line_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**6. Table: `apm.approval_requests`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**7. Table: `apm.approval_requests`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: ASM (15 issues)


#### Extra SQL Column (15)

**1. Table: `asm.nps_surveys`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**2. Table: `asm.ticket_comments`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**3. Table: `asm.ticket_comments`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**4. Table: `asm.support_tickets`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by                UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**5. Table: `asm.support_tickets`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by                UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**6. Table: `asm.faqs`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**7. Table: `asm.faqs`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**8. Table: `asm.service_requests`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**9. Table: `asm.service_requests`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**10. Table: `asm.service_works`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**11. Table: `asm.service_works`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**12. Table: `asm.service_parts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**13. Table: `asm.service_parts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**14. Table: `asm.customer_feedback`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**15. Table: `asm.customer_feedback`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: BIM (8 issues)


#### Extra SQL Column (8)

**1. Table: `bim.kpi_targets`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `bim.kpi_targets`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `bim.purchase_analytics`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `bim.purchase_analytics`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `bim.kpi_definitions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `bim.kpi_definitions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `bim.sales_analytics`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `bim.sales_analytics`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: COM (6 issues)


#### Extra SQL Column (6)

**1. Table: `com.code_groups`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `com.code_groups`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `com.workflows`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `com.workflows`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `com.codes`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `com.codes`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: CRM (34 issues)


#### Extra SQL Column (34)

**1. Table: `crm.customer_surveys`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `crm.customer_surveys`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `crm.sales_targets`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `crm.sales_targets`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `crm.customer_segment_members`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `crm.customer_segment_members`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `crm.partner_banks`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `crm.partner_banks`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `crm.contracts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `crm.contracts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `crm.interactions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `crm.interactions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `crm.partner_managers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**14. Table: `crm.partner_managers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**15. Table: `crm.customer_segments`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**16. Table: `crm.customer_segments`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**17. Table: `crm.partners`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**18. Table: `crm.partners`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**19. Table: `crm.rfq_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**20. Table: `crm.rfq_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**21. Table: `crm.rfqs`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**22. Table: `crm.rfqs`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**23. Table: `crm.activities`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**24. Table: `crm.activities`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**25. Table: `crm.email_templates`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**26. Table: `crm.email_templates`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**27. Table: `crm.leads`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**28. Table: `crm.leads`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**29. Table: `crm.opportunities`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**30. Table: `crm.opportunities`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**31. Table: `crm.partner_contacts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by          UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**32. Table: `crm.partner_contacts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by          UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**33. Table: `crm.partner_addresses`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by          UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**34. Table: `crm.partner_addresses`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by          UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: FAM (6 issues)


#### Extra SQL Column (6)

**1. Table: `fam.fixed_assets`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `fam.fixed_assets`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `fam.asset_disposals`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `fam.asset_disposals`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `fam.asset_depreciation`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `fam.asset_depreciation`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: FIM (18 issues)


#### Extra SQL Column (18)

**1. Table: `fim.journal_entries`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `fim.journal_entries`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `fim.payment_transactions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `fim.payment_transactions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `fim.business_documents`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `fim.business_documents`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `fim.accounts_receivable`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `fim.accounts_receivable`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `fim.journal_entry_lines`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `fim.journal_entry_lines`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `fim.tax_invoice_lines`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `fim.tax_invoice_lines`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `fim.accounts_payable`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**14. Table: `fim.accounts_payable`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**15. Table: `fim.accounts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**16. Table: `fim.accounts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**17. Table: `fim.tax_invoices`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**18. Table: `fim.tax_invoices`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: HRM (17 issues)


#### Extra SQL Column (17)

**1. Table: `hrm.payroll_records`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `hrm.payroll_records`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `hrm.department_histories`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `hrm.department_histories`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `hrm.salary_structures`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `hrm.salary_structures`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `hrm.employee_histories`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `hrm.employee_histories`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `hrm.employees`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `hrm.employees`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `hrm.absences`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `hrm.absences`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `hrm.leave_policies`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**14. Table: `hrm.departments`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**15. Table: `hrm.departments`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**16. Table: `hrm.attendances`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**17. Table: `hrm.attendances`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: IVM (20 issues)


#### Extra SQL Column (20)

**1. Table: `ivm.inventory_movements`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `ivm.inventory_movements`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `ivm.inventory_lots`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `ivm.inventory_lots`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `ivm.inventory_counts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `ivm.inventory_counts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `ivm.inventory_cycle_counts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `ivm.inventory_transfers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `ivm.inventory_transfers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `ivm.inventory_count_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `ivm.inventory_count_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `ivm.inventory_adjustments`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**14. Table: `ivm.inventory_adjustments`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**15. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**16. Table: `ivm.inventory_serial_numbers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**17. Table: `ivm.inventory_reservations`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**18. Table: `ivm.inventory_reservations`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**19. Table: `ivm.inventory_balances`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**20. Table: `ivm.inventory_balances`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: LWM (6 issues)


#### Extra SQL Column (6)

**1. Table: `lwm.steps`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `lwm.steps`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `lwm.tasks`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `lwm.tasks`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `lwm.workflows`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `lwm.workflows`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: PIM (32 issues)


#### Extra SQL Column (32)

**1. Table: `pim.categories`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `pim.categories`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `pim.product_option_values`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `pim.product_option_values`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `pim.product_units`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `pim.product_units`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `pim.category_managers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `pim.category_managers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `pim.product_suppliers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `pim.product_suppliers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `pim.product_relations`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `pim.product_relations`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `pim.product_tags`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**14. Table: `pim.product_tags`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**15. Table: `pim.product_price_history`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**16. Table: `pim.product_price_history`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**17. Table: `pim.product_options`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**18. Table: `pim.product_options`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**19. Table: `pim.product_images`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**20. Table: `pim.product_images`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**21. Table: `pim.brands`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**22. Table: `pim.brands`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**23. Table: `pim.product_unit_conversions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**24. Table: `pim.product_unit_conversions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**25. Table: `pim.product_managers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**26. Table: `pim.product_managers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**27. Table: `pim.makers`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**28. Table: `pim.makers`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**29. Table: `pim.products`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**30. Table: `pim.products`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**31. Table: `pim.product_variants`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**32. Table: `pim.product_variants`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: PSM (19 issues)


#### Extra SQL Column (19)

**1. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `psm.purchase_order_receipt_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `psm.purchase_order_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `psm.purchase_order_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `psm.purchase_requisition_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `psm.purchase_requisition_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `psm.purchase_quotations`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `psm.purchase_quotations`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `psm.purchase_price_agreements`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `psm.purchase_price_agreements`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `psm.purchase_order_pr_links`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**12. Table: `psm.purchase_order_receipts`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**13. Table: `psm.purchase_order_receipts`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**14. Table: `psm.purchase_quotation_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**15. Table: `psm.purchase_quotation_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**16. Table: `psm.purchase_orders`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**17. Table: `psm.purchase_orders`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**18. Table: `psm.purchase_requisitions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**19. Table: `psm.purchase_requisitions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: SRM (21 issues)


#### Extra SQL Column (21)

**1. Table: `srm.sales_returns`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `srm.sales_returns`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `srm.sales_delivery_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `srm.sales_delivery_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `srm.sales_deliveries`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `srm.sales_deliveries`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `srm.sales_invoice_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `srm.sales_invoice_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `srm.sales_return_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `srm.sales_return_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**11. Table: `srm.quotation_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**12. Table: `srm.quotation_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**13. Table: `srm.promotions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**14. Table: `srm.promotions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**15. Table: `srm.quotations`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**16. Table: `srm.quotations`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**17. Table: `srm.sales_order_items`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**18. Table: `srm.sales_order_items`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**19. Table: `srm.sales_orders`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**20. Table: `srm.sales_orders`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**21. Table: `srm.promotion_usage`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: SYS (10 issues)


#### Extra SQL Column (10)

**1. Table: `sys.role_permissions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `sys.role_permissions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `sys.users`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `sys.users`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `sys.code_rules`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `sys.code_rules`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `sys.roles`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `sys.roles`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**9. Table: `sys.permissions`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                                        -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**10. Table: `sys.permissions`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                                        -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---


### Schema: WMS (8 issues)


#### Extra SQL Column (8)

**1. Table: `wms.warehouses`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                           -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**2. Table: `wms.warehouses`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                           -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**3. Table: `wms.inventory`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by              UUID,                                                            -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**4. Table: `wms.inventory`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by              UUID,                                                            -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**5. Table: `wms.warehouse_locations`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by          UUID,                                                           -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**6. Table: `wms.warehouse_locations`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by          UUID,                                                           -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

**7. Table: `wms.warehouse_employees`**

- **Issue**: Audit field 'updated_by' exists in SQL but not in model (may be optional)
- **SQL**: `updated_by          UUID,                                                           -- 수정자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column updated_by from SQL or add to model

---

**8. Table: `wms.warehouse_employees`**

- **Issue**: Audit field 'created_by' exists in SQL but not in model (may be optional)
- **SQL**: `created_by          UUID,                                                           -- 등록자 UUID`
- **Model**: `N/A`
- **Fix**: Remove column created_by from SQL or add to model

---

