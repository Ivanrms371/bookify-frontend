import { AuthWrapper } from '@/features/auth';
import { Outlet } from 'react-router';

export const AuthShell = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    </div>
  );
};
