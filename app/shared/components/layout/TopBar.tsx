import { Input } from "../form/Input";
import { AvatarButton } from "../_ui/AvatarButton";
import { DarkModeToggle } from "../_ui/DarkModeToggle";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { NotificationsBell } from "@/modules/notifications/components/NotificationsBell";

export const TopBar = () => {
  const { session } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-mist-100 dark:bg-mist-950 flex justify-between items-center w-full py-4">
      <Input type="text" placeholder="Buscar aquí..." className="w-80" />

      <div className="flex gap-4 items-center">
        {/* <CheckListButton
          currentSteps={1}
          totalSteps={5}
          businessName={session?.businesses[0].name ?? ""}
        /> */}
        {/** Dark mode */}
        <DarkModeToggle />
        {/** Notifications bell */}
        <NotificationsBell />

        <AvatarButton
          name={session?.name}
          src={session?.avatarUrl ?? undefined}
          onClick={() => {}}
        />
      </div>
    </header>
  );
};
