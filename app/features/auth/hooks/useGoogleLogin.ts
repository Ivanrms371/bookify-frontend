import { useRef, useState } from 'react';
import { httpClient } from '@/core/http/httpClient';
import { toast } from 'sonner';
export const useGoogleLogin = (invitationToken?: string) => {
  const starting = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const handleGoogleLogin = async () => {
    if (starting.current) return;
    starting.current = true;
    setIsPending(true);
    try {
      const token = invitationToken || new URLSearchParams(window.location.search).get('invitationToken');
      const { url } = await httpClient.get<{ url: string }>('/auth/google', {
        params: token ? { invitationToken: token } : undefined,
        skipAuthRetry: true,
      });
      window.location.assign(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo iniciar Google.');
      setIsPending(false);
      starting.current = false;
    }
  };
  return { handleGoogleLogin, isPending };
};
