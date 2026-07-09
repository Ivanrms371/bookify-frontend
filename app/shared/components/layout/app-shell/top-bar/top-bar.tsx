import { useAuthStore } from '@/core/auth/useAuthStore';
import { NotificationToggle } from '@/features/notifications';
import { Bars2Icon } from '@heroicons/react/24/outline';

export const TopBar = () => {
  const { user } = useAuthStore();
  return (
    <>
      <header className="sticky top-0 z-40 h-15 flex items-center gap-4 bg-mist-50 py-4 mb-4">
        <div className="flex justify-between items-center w-full">
          <div></div>
          <div className="flex gap-4">
            <NotificationToggle />
            <button
              type="button"
              className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-mist-200 transition-colors hover:bg-mist-300"
            >
              <Bars2Icon className="size-5 text-mist-700" />
            </button>
          </div>
        </div>
        {/* <div className="ml-auto flex items-center gap-3">
          <NotificationToggle />
          <AvatarButton name={user?.name} src={user?.avatarUrl ?? undefined} onClick={() => {}} />
        </div> */}
      </header>
    </>
  );
};
