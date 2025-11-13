export type ReportType = 
  | 'GDPR' 
  | 'SOX' 
  | 'HIPAA' 
  | 'ISO27001' 
  | 'PCI_DSS' 
  | 'CCPA' 
  | 'CUSTOM';

export type ComplianceStatus = 
  | 'COMPLIANT' 
  | 'NON_COMPLIANT' 
  | 'PARTIAL' 
  | 'PENDING';

export type ReportScope = 
  | 'ALL_TENANTS' 
  | 'SPECIFIC_TENANT' 
  | 'SYSTEM_WIDE';

export type FileType = 
  | 'PDF' 
  | 'EXCEL' 
  | 'JSON' 
  | 'HTML' 
  | 'CSV';

export type ReportStatus = 
  | 'DRAFT' 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'PUBLISHED';

export interface Compliance {
  id: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
  updated_by?: string;
  
  report_type: ReportType;
  report_name: string;
  start_date: string;
  close_date: string;
  
  generated_at: string;
  generated_by?: string;
  
  scope: ReportScope;
  tenant_ids?: string[];
  
  compliance_status: ComplianceStatus;
  findings_count: number;
  critical_count: number;
  
  file_path?: string;
  file_size?: number;
  file_type: FileType;
  
  approved_at?: string;
  approved_by?: string;
  
  status: ReportStatus;
  deleted: boolean;
}

export interface ComplianceListResponse {
  items: Compliance[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ComplianceQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  report_type?: ReportType;
  compliance_status?: ComplianceStatus;
  status?: ReportStatus;
  scope?: ReportScope;
  start_date?: string;
  end_date?: string;
}

export interface CreateComplianceRequest {
  report_type: ReportType;
  report_name: string;
  start_date: string;
  close_date: string;
  scope: ReportScope;
  tenant_ids?: string[];
  file_type?: FileType;
}

export interface UpdateComplianceRequest {
  report_name?: string;
  compliance_status?: ComplianceStatus;
  findings_count?: number;
  critical_count?: number;
  status?: ReportStatus;
  approved_by?: string;
}
