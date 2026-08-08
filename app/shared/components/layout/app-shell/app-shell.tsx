import { Outlet } from 'react-router';
import { TopBar } from './top-bar';
import { Sidebar } from './sidebar/sidebar';
import { useState } from 'react';

export const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex min-h-0 flex-1 flex-col px-2 sm:px-4 md:px-10">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
