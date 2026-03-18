import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="flex min-h-screen p-2">
      <Sidebar />
      <div className="flex-1 px-6 relative">
        <TopBar />
        {children}
      </div>
    </div>
  );
};
