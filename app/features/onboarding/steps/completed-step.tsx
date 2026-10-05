import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/core/auth/use-auth-store';
import { authApi } from '@/features/auth/api/auth-api';
import { Button } from '@/shared/components/ui';
import { useQueryClient } from '@tanstack/react-query';

export const CompletedStep = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setError(false);
    void authApi
      .getMe()
      .then((session) => {
        if (cancelled) return;
        if (session.activeTenant?.onboardingStatus !== 'COMPLETED' || !session.activeTenant.slug) {
          setError(true);
          return;
        }
        useAuthStore.getState().setAuth(session);
        void queryClient.invalidateQueries({ queryKey: ['professionals'] });
        navigate(`/${session.activeTenant.slug}`, { replace: true });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, navigate, queryClient]);
  return (
    <div className="py-12 text-center space-y-4" role="status">
      <p>{error ? 'Tu negocio está listo, pero no pudimos abrir el panel.' : 'Preparando tu panel...'}</p>
      {error && (
        <Button variant="primary" onClick={() => setAttempt((value) => value + 1)}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
