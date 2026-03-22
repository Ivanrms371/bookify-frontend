import { useModalStore } from "@/shared/store/useModalStore";
import { ServiceCreateModal } from "@/modules/services/components/ServiceCreateModal";
import { ServiceUpdateModal } from "@/modules/services/components/ServiceUpdateModal";
import { AvailabilityModal } from "@/modules/availability/components/AvailabilityModal";
import { BusinessImagesModal } from "@/modules/business/components/modals/BusinessImagesModal";
import { AddressModal } from "@/modules/business/components/modals/AddressModal";
import { InviteTeamModal } from "@/modules/staff/components/modals/InviteTeamModal";
import { PublishBusinessModal } from "@/modules/business/components/modals/PublishBusinessModal";

const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  serviceCreate: ServiceCreateModal,
  serviceUpdate: ServiceUpdateModal,
  availability: AvailabilityModal,
  businessImages: BusinessImagesModal,
  address: AddressModal,
  inviteTeam: InviteTeamModal,
  publishBusiness: PublishBusinessModal,
};

export const GlobalModalProvider = () => {
  const { type, isOpen, isVisible, modalProps } = useModalStore();

  const show = (isOpen || isVisible) && type;

  if (!show) return null;

  const SpecificModal = MODAL_COMPONENTS[type];

  return <SpecificModal {...modalProps} />;
};
