import { useLogin } from "../hooks/useLogin";

export const GoogleAuthButton = () => {
  const { onGoogleLogin } = useLogin();
  return (
    <section className="flex items-center justify-center">
      <button
        className="button-secondary py-2.5 h-10 w-full"
        onClick={onGoogleLogin}
      >
        <img src="/google.png" alt="Google" className="size-4" />
        <span>Continuar con Google</span>
      </button>
    </section>
  );
};
