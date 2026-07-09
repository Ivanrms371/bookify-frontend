import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router';
import type { Route } from './+types/root';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/query/queryClient';
import { AuthProvider } from '@/core/auth/AuthProvider';
import { ErrorBoundary as CustomErrorBoundary } from '@/core/error/ErrorBoundary';
import '@/styles.css';
import { useThemeStore } from './shared/store/useThemeStore';
import { LoadingScreen } from './shared/components/ui';
import { ModalRenderer } from './shared/components/modal';
import { useLoadingScreen } from './shared/store/use-loading-screen';

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400,300&f[]=cabinet-grotesk@800,700,500&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { theme } = useThemeStore();
  const { isLoading, message } = useLoadingScreen();

  return (
    <CustomErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {isLoading && <LoadingScreen message={message || 'Cargando...'} fullScreen={true} className="rounded-3xl" />}

          <Outlet />
          <ModalRenderer />
          <Toaster position="top-center" expand visibleToasts={5} richColors theme={theme} />
        </AuthProvider>
      </QueryClientProvider>
    </CustomErrorBoundary>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
