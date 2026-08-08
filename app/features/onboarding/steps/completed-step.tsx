import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/core/auth/useAuthStore';
import { useLoadingScreen } from '@/shared/store/use-loading-screen';

export const CompletedStep = () => {
  const navigate = useNavigate();
  const { refetch, isRefetching, session } = useAuthStore();
  const { show, hide } = useLoadingScreen();

  const slug = session?.activeTenant?.slug;

  useEffect(() => {
    if (!slug) {
      show('Preparando tu panel...');
    }
    return () => hide();
  }, [slug, show, hide]);

  useEffect(() => {
    if (slug) {
      navigate(`/${slug}`, { replace: true });
    }
  }, [slug, navigate]);

  useEffect(() => {
    if (slug || isRefetching) return;

    const executeRefetch = async () => {
      try {
        await refetch();
      } catch (error) {
        console.error('Error al sincronizar sesión en onboarding:', error);
      }
    };

    void executeRefetch();
  }, [slug, isRefetching, refetch]);

  return null;
};
