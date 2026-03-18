import { useModalStore } from "@/shared/store/useModalStore";
import { ServiceCreateModal } from "@/modules/services/components/ServiceCreateModal";
import { ServiceUpdateModal } from "@/modules/services/components/ServiceUpdateModal";
import { AvailabilityModal } from "@/modules/availability/components/AvailabilityModal";
import { BusinessImagesModal } from "@/modules/dashboard/components/checklist/BusinessImagesModal";
import { AddressModal } from "@/modules/dashboard/components/checklist/AddressModal";
import { InviteTeamModal } from "@/modules/dashboard/components/checklist/InviteTeamModal";
import { PublishBusinessModal } from "@/modules/dashboard/components/checklist/PublishBusinessModal";

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
