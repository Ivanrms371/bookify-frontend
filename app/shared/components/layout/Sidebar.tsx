import { TurnifyLogo } from "../_ui/TurnifyLogo";
import { Button } from "../form/Button";
import { SidebarMainNav } from "./SidebarMainNav";
import { SidebarSecondaryNav } from "./SidebarSecondaryNav";
import { SubscriptionPromptCard } from "@/modules/dashboard/components/SubscriptionPromptCard";

export const Sidebar = () => {
  return (
    <div className="sticky h-[calc(100vh-2rem)] hidden xl:flex p-4 top-4 w-72 bg-white dark:bg-mist-900/50 rounded-4xl flex-col justify-between">
      <TurnifyLogo className="w-18 mb-6" />
      <SidebarMainNav />
      <div className="flex-1"></div>
      <SubscriptionPromptCard />
   
      <SidebarSecondaryNav />
    </div>
  );
};
