import { AuthWrapper } from "../components/AuthWrapper";
import { AuthHeader } from "../components/AuthHeader";

export default function VerifyEmail() {
  return (
    <AuthWrapper>
      <AuthHeader
        title="Confirma tu email"
        subtitle="Hemos enviado un correo de verificación a tu email, por favor
          verifícalo para poder empezar a usar Turnify."
      />
    </AuthWrapper>
  );
}
