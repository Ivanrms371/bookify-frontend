import { Link } from "react-router";
import { AuthWrapper } from "../components/AuthWrapper";
import { SignupForm } from "../components/SignupForm";
import { GoogleAuthButton } from "../components/GoogleAuthButton";
import { AuthDivider } from "../components/AuthDivider";
import { AuthHeader } from "../components/AuthHeader";

export default function SignupPage() {
  return (
    <AuthWrapper>
      <AuthHeader title="Crea tu cuenta" />
      <div className="flex flex-col gap-6">
        <GoogleAuthButton />

        <AuthDivider />

        <SignupForm />

        <p className="text-center text-mist-500 dark:text-mist-400 text-sm font-medium">
          ¿Ya tienes una cuenta?
          <Link
            to="/login"
            className="ml-1 text-mist-900 dark:text-mist-200 font-bold cursor-pointer hover:underline underline-offset-2"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
