import { useState } from 'react';

export const useGoogleLogin = () => {
  const [isPending, setIsPending] = useState(false);

  const handleGoogleLogin = () => {
    setIsPending(true);
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return { handleGoogleLogin, isPending };
};
