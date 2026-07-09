import { Outlet } from 'react-router';
import { TopBar } from './top-bar';
import { Sidebar } from './sidebar/sidebar';

export const AppShell = () => {
  return (
    <div className="flex h-dvh min-h-0 p-2">
      <Sidebar />
      <div className="relative flex min-h-0 flex-1 flex-col sm:px-4 md:px-6">
        <TopBar />
        <div className="flex min-h-0 flex-1 flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
