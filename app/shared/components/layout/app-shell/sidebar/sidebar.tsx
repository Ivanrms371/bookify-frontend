import { Button } from '@/shared/components/ui';
import { SidebarMainNav } from './sidebar-main-nav';
import { SidebarSecondaryNav } from './sidebar-secondary-nav';
import { Heading } from '@/shared/components/typography';

import { cn } from '@/shared/utils/cn';
import { useParams } from 'react-router';
import { SidebarTrialCard } from '@/features/billing';

interface Props {
  open: boolean;
  onClose: () => void;
}
export const Sidebar = ({ open, onClose }: Props) => {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-xs',
          'transition-opacity duration-300 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          // Base
          'z-50 flex h-dvh w-72 flex-col bg-white p-4',

          // Mobile drawer
          'fixed inset-y-0 left-0',
          'transition-transform duration-300 ease-in-out',

          open ? 'translate-x-0' : '-translate-x-full',

          // Desktop: Grid item
          'lg:static lg:z-auto lg:translate-x-0',
          'lg:transition-none',
        )}
      >
        <Heading className="ml-4 mb-4 mt-2 text-4xl font-semibold tracking-tighter">
          Book<span className="font-bold text-indigo-600">ify</span>
        </Heading>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarMainNav />
        </div>

        <SidebarTrialCard />
        <SidebarSecondaryNav />
      </aside>
    </>
  );
};
