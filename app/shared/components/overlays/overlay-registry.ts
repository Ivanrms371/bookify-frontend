// overlay-registry.ts
import { AppointmentWizardModal } from '@/features/appointments/components/appointment-wizard/appointment-wizard-modal';
import { CreateCustomerDrawer } from '@/features/customers/components/overlays/create-customer-drawer';
import { UpdateCustomerModal } from '@/features/customers/components/overlays/update-customer-drawer';
import { DeleteCustomerModal } from '@/features/customers/components/overlays/delete-customer-modal';
import { BlockCustomerModal } from '@/features/customers/components/overlays/block-customer-modal';
import { UnblockCustomerModal } from '@/features/customers/components/overlays/unblock-customer-modal';
import { CreateServiceDrawer } from '@/features/services/components/overlays/create-service-drawer';
import { UpdateServiceDrawer } from '@/features/services/components/overlays/update-service-drawer';
import { ToggleServiceStatusModal } from '@/features/services/components/overlays/toggle-service-status-modal';
import { DeleteServiceModal } from '@/features/services/components/overlays/delete-service-modal';
import { ViewCustomerDrawer } from '@/features/customers/components/overlays/view-customer-drawer';
import { UpdateProfessionalDrawer } from '@/features/professionals/components/overlays/update-professional-drawer';
import { DeleteProfessionalModal } from '@/features/professionals/components/overlays/delete-professional-modal';
import type { ComponentProps } from 'react';
import { CreateInvitationDrawer } from '@/features/invitations/components/overlays/create-invitation-drawer';
import { UpdateInvitationDrawer } from '@/features/invitations/components/overlays/update-invitation-drawer';
import { CancelInvitationModal } from '@/features/invitations/components/overlays/cancel-invitation-modal';
import { AddExceptionModal } from '@/features/schedule/components/exceptions/add-exception-modal';
import { UpdateExceptionModal } from '@/features/schedule/components/exceptions/update-exception-modal';
import { DeleteExceptionModal } from '@/features/schedule/components/exceptions/delete-exception-modal';

export const overlayRegistry = {
  'new-appointment-modal': AppointmentWizardModal,

  // Services
  'create-service-drawer': CreateServiceDrawer,
  'update-service-drawer': UpdateServiceDrawer,
  'toggle-service-status-modal': ToggleServiceStatusModal,
  'delete-service-modal': DeleteServiceModal,

  // Customers
  'create-customer-drawer': CreateCustomerDrawer,
  'update-customer-drawer': UpdateCustomerModal,
  'view-customer-drawer': ViewCustomerDrawer,
  'block-customer-modal': BlockCustomerModal,
  'unblock-customer-modal': UnblockCustomerModal,
  'delete-customer-modal': DeleteCustomerModal,

  // Invitations
  'create-invitation-drawer': CreateInvitationDrawer,
  'update-invitation-drawer': UpdateInvitationDrawer,
  'cancel-invitation-modal': CancelInvitationModal,

  // Professionals
  'update-professional-drawer': UpdateProfessionalDrawer,
  'delete-professional-modal': DeleteProfessionalModal,

  // Exceptions
  'add-exception-modal': AddExceptionModal,
  'update-exception-modal': UpdateExceptionModal,
  'delete-exception-modal': DeleteExceptionModal,
};

export type OverlayKey = keyof typeof overlayRegistry;

export type OverlayPropsMap = {
  [K in OverlayKey]: ComponentProps<(typeof overlayRegistry)[K]>;
};
