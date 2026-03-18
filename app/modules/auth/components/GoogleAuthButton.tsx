import { useLogin } from "../hooks/useLogin";

export const GoogleAuthButton = () => {
  const { onGoogleLogin } = useLogin();
  return (
    <section className="flex items-center justify-center">
      <button className="button-secondary w-full" onClick={onGoogleLogin}>
        <img src="/google.png" alt="Google" className="size-5" />
        <span>Continuar con Google</span>
      </button>
    </section>
  );
};
