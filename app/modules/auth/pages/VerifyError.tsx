import { AuthWrapper } from "../components/AuthWrapper";
import { Link, useSearchParams } from "react-router";
import { AuthHeader } from "../components/AuthHeader";

const ERROR_CONFIG = {
  verification_not_found: {
    message: "No se encontró la verificación.",
    action: "login",
  },
  verification_expired: {
    message: "Este enlace de verificación expiró.",
    action: "resend",
  },
  email_already_verified: {
    message: "Esta cuenta ya ha sido verificada.",
    action: "login",
  },
  verification_locked: {
    message: "Esta verificación fue bloqueada temporalmente.",
    action: "wait",
  },
  unknown: {
    message: "Ha ocurrido un error desconocido.",
    action: "login",
  },
} as const;

export default function VerifyError() {
  const [searchParams] = useSearchParams();

  const reason = searchParams.get("reason") ?? "unknown";
  const key = reason && reason in ERROR_CONFIG ? reason : "unknown";
  const config = ERROR_CONFIG[key as keyof typeof ERROR_CONFIG];

  return (
    <AuthWrapper>
      <AuthHeader
        title="Error al verificar tu cuenta"
        subtitle={config.message}
      />
      {config.action === "login" && (
        <div className="mx-auto flex justify-center mt-4">
          <Link
            to="/login"
            className="text-gray-900 font-bold cursor-pointer hover:underline underline-offset-2"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
      {config.action === "resend" && (
        <div className="mx-auto flex justify-center mt-4">
          <button
            type="button"
            className="text-gray-900 font-bold cursor-pointer hover:underline underline-offset-2"
          >
            Reenviar enlace de verificación
          </button>
        </div>
      )}
    </AuthWrapper>
  );
}
