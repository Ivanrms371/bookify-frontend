import { useAuthStore } from '@/core/auth/useAuthStore';
import { NotificationToggle } from '@/features/notifications';
import { Input } from '@/shared/components/form/input';
import { Button } from '@/shared/components/ui';
import { Bars2Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Props {
  onOpenSidebar: () => void;
}

export const TopBar = ({ onOpenSidebar }: Props) => {
  return (
    <>
      <header className="sticky top-0 z-0 h-15 flex items-center gap-4 bg-gray-50 py-4 mb-4">
        <div className="flex justify-end items-center w-full">
          <div className="flex gap-4">
            <NotificationToggle />
            <Button variant="ghost" type="button" size="icon" onClick={onOpenSidebar} className="xl:hidden">
              <Bars2Icon className="size-5 text-gray-700" />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};
