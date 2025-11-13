/**
 * Partner Contacts Feature - Index
 * 거래처 담당자/연락처 관리 기능의 공개 API
 */

// Hooks
export {
  usePartnerContacts,
  usePartnerContact,
  useCreatePartnerContact,
  useUpdatePartnerContact,
  useDeletePartnerContact,
} from './hooks/use-partner-contacts';

// Services
export { partnerContactService } from './services/partner-contacts.service';

// Components
export { PartnerContactsTable } from './components/partner-contacts-table';
export { PartnerContactForm } from './components/partner-contact-form';

// Types
export type {
  PartnerContact,
  CreatePartnerContactRequest,
  UpdatePartnerContactRequest,
  PartnerContactListResponse,
  PartnerContactQueryParams,
  EnvelopeResponse,
} from '../';
