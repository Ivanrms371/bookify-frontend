import { useBusinessStore } from "@/modules/business/store/business.store";
import { useGetChecklist } from "@/modules/onboarding/hooks/useGetChecklist";
import { UpgradePlanCard } from "@/modules/billing/components/UpgradePlanCard";
import { ConnectMPCard } from "@/modules/mercadopago/components/ConnectMPCard";

const PLAN_FREE = "FREE";

export const SubscriptionPromptCard = () => {
  const currentBusiness = useBusinessStore((s) => s.currentBusiness);
  const { data: checklistData } = useGetChecklist(currentBusiness?.id);

  if (!checklistData) return null;

  const plan = checklistData.plan?.toUpperCase() ?? PLAN_FREE;
  const paymentProvider = checklistData.paymentProvider?.trim() || null;
  const isFreePlan = plan === PLAN_FREE;
  const needsPaymentProvider = !isFreePlan && !paymentProvider;

  if (isFreePlan) return <UpgradePlanCard />;
  if (needsPaymentProvider) return <ConnectMPCard />;

  return null;
};
