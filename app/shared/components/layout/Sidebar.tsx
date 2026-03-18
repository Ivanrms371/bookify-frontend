import { UpgradePlanCard } from "@/modules/billing/components/UpgradePlanCard";
import { TurnifyLogo } from "../_ui/TurnifyLogo";
import { SidebarMainNav } from "./SidebarMainNav";
import { ConnectMPCard } from "@/modules/mercadopago/components/ConnectMPCard";
import { SidebarSecondaryNav } from "./SidebarSecondaryNav";

export const Sidebar = () => {
  return (
    <div className="sticky top-0 w-72 bg-white dark:bg-gray-900/50 rounded-4xl flex flex-col justify-between p-4">
      <TurnifyLogo className="w-18 mb-6" />
      <SidebarMainNav />
      <div className="flex-1"></div>
      <UpgradePlanCard />
      {/* <ConnectMPCard /> */}
      <SidebarSecondaryNav />
    </div>
  );
};
