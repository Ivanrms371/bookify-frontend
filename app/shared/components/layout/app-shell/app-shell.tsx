import { Outlet } from 'react-router';
import { useState } from 'react';

import { TopBar } from './top-bar';
import { Sidebar } from './sidebar/sidebar';

export const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid h-dvh min-h-0 grid-cols-1 lg:grid-cols-[18rem_1fr] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col min-h-0 min-w-0 overflow-y-auto bg-gray-50">
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex min-h-0 flex-1 flex-col px-2 sm:px-4 md:px-10">
          <div className="flex flex-1 flex-col pb-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
