// overlay-registry.ts
import { CancelAppointmentModal } from '../../../features/appointments/components/overlays/cancel-appointment-modal';
import { RescheduleAppointmentDrawer } from '@/features/appointments/components/overlays/reschedule-appointment-drawer';
import { CreateAppointmentDrawer } from '@/features/appointments/components/overlays/create-appointment-drawer';
import { UpdateCustomerModal } from '@/features/customers/components/overlays/update-customer-modal';
import { DeleteCustomerModal } from '@/features/customers/components/overlays/delete-customer-modal';
import { BlockCustomerModal } from '@/features/customers/components/overlays/block-customer-modal';
import { UnblockCustomerModal } from '@/features/customers/components/overlays/unblock-customer-modal';
import { CreateServiceModal } from '@/features/services/components/overlays/create-service-modal';
import { UpdateServiceModal } from '@/features/services/components/overlays/update-service-modal';
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
import { CreateCustomerModal } from '@/features/customers/components/overlays/create-customer-modal';
import { CreateProfessionalModal } from '@/features/professionals/components/overlays/create-professional-modal';

export const overlayRegistry = {
  'create-appointment-drawer': CreateAppointmentDrawer,
  'reschedule-appointment-drawer': RescheduleAppointmentDrawer,
  'cancel-appointment-modal': CancelAppointmentModal,

  // Services
  'create-service-modal': CreateServiceModal,
  'update-service-modal': UpdateServiceModal,
  'toggle-service-status-modal': ToggleServiceStatusModal,
  'delete-service-modal': DeleteServiceModal,

  // Customers
  'create-customer-modal': CreateCustomerModal,
  'update-customer-modal': UpdateCustomerModal,
  'view-customer-drawer': ViewCustomerDrawer,
  'block-customer-modal': BlockCustomerModal,
  'unblock-customer-modal': UnblockCustomerModal,
  'delete-customer-modal': DeleteCustomerModal,

  // Invitations
  'create-invitation-drawer': CreateInvitationDrawer,
  'update-invitation-drawer': UpdateInvitationDrawer,
  'cancel-invitation-modal': CancelInvitationModal,

  // Professionals
  'create-professional-modal': CreateProfessionalModal,
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
